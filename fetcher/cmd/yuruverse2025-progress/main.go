package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/jszwec/csvutil"
	"github.com/mono0x/yuruverse2025-progress/fetcher/yuruverse"
	"github.com/pkg/errors"
)

var (
	entryNumberRe = regexp.MustCompile(`エントリーNo\.(\d+)`)
)

func fetch() error {
	date := time.Now().UTC().Add(-3 * time.Hour)
	dateString := date.Format(yuruverse.DateFormat) // Date changes every noon in UTC+9

	rankRanges := []string{"", "?rank_range=51-100", "?rank_range=101-150", "?rank_range=151-200", "?rank_range=201%2B"}
	var items []*yuruverse.RawItem
	processedEntries := make(map[int]bool)

	for _, rankRange := range rankRanges {
		currentURL, err := url.Parse("https://www.yurugp.jp/vote/2025" + rankRange)
		if err != nil {
			return errors.WithStack(err)
		}
		log.Printf("Fetching: %s", currentURL.String())

		req, err := http.NewRequest("GET", currentURL.String(), nil)
		if err != nil {
			return errors.WithStack(err)
		}
		req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return errors.WithStack(err)
		}
		defer resp.Body.Close()

		doc, err := goquery.NewDocumentFromReader(resp.Body)
		if err != nil {
			return errors.WithStack(err)
		}

		entryDivs := doc.Find("div.text-xs, div.text-sm").FilterFunction(func(i int, s *goquery.Selection) bool {
			text := strings.TrimSpace(s.Text())
			return strings.HasPrefix(text, "エントリーNo.") && !strings.Contains(text, "\n")
		})
		log.Printf("Found %d entry divs", entryDivs.Length())

		var parseErr error
		entryDivs.EachWithBreak(func(i int, s *goquery.Selection) bool {
			entryNumberText := strings.TrimSpace(s.Text())
			entryNumberSubmatches := entryNumberRe.FindStringSubmatch(entryNumberText)
			if len(entryNumberSubmatches) == 0 {
				parseErr = errors.New("failed to match entry number regex: " + entryNumberText)
				return false
			}
			entryNumber, err := strconv.Atoi(entryNumberSubmatches[1])
			if err != nil {
				parseErr = errors.WithStack(err)
				return false
			}

			if processedEntries[entryNumber] {
				return true
			}
			processedEntries[entryNumber] = true

			parent := s.Parent() // flex-grow min-w-0 div
			for range 3 {
				parent = parent.Parent()
			}

			nameLink := parent.Find("h3 a[href*='/characters/']").First()
			if nameLink.Length() == 0 {
				nameLink = parent.Find("a[href*='/characters/']").First()
			}
			if nameLink.Length() == 0 {
				parseErr = errors.New("character name link not found for entry number " + strconv.Itoa(entryNumber))
				return false
			}

			href, ok := nameLink.Attr("href")
			if !ok {
				parseErr = errors.New("failed to get href attribute from character link for entry number " + strconv.Itoa(entryNumber))
				return false
			}

			// Extract ID from href (e.g. "https://www.yurugp.jp/vote/2025/characters/3852")
			parts := strings.Split(href, "/")
			if len(parts) < 3 || parts[1] != "characters" {
				parseErr = errors.New("failed to extract character ID from href: " + href + " for entry number " + strconv.Itoa(entryNumber))
				return false
			}
			id := parts[2]

			name := strings.TrimSpace(nameLink.Text())
			if name == "" {
				parseErr = errors.New("character name is empty for entry number " + strconv.Itoa(entryNumber))
				return false
			}

			var country, biko string
			flexGrowDiv := s.Parent() // flex-grow min-w-0 div
			regionSpans := flexGrowDiv.Find("span")
			if regionSpans.Length() >= 3 {
				// 0: prefecture
				// 1: "|"
				// 2: organization name
				country = strings.TrimSpace(regionSpans.Eq(0).Text())
				biko = strings.TrimSpace(regionSpans.Eq(2).Text())
			}

			point := 0
			pointElem := parent.Find("div.text-3xl.font-bold").FilterFunction(func(i int, s *goquery.Selection) bool {
				class, exists := s.Attr("class")
				return exists && strings.Contains(class, "text-[#3493CE]")
			}).First()
			if pointElem.Length() > 0 {
				pointText := strings.TrimSpace(pointElem.Text())
				pointText = strings.ReplaceAll(pointText, ",", "")
				if p, err := strconv.Atoi(pointText); err == nil {
					point = p
				}
			}

			rank := 0
			// Get rank from alt attribute of top 3 special images
			rankImg := parent.Find("img").FilterFunction(func(i int, s *goquery.Selection) bool {
				alt, exists := s.Attr("alt")
				return exists && regexp.MustCompile(`^\d+位$`).MatchString(alt)
			}).First()
			if rankImg.Length() > 0 {
				alt, _ := rankImg.Attr("alt")
				rankText := strings.TrimSuffix(alt, "位")
				if r, err := strconv.Atoi(rankText); err == nil {
					rank = r
				}
			} else {
				rankDiv := parent.Find("div.text-gray-500.font-bold").FilterFunction(func(i int, s *goquery.Selection) bool {
					text := strings.TrimSpace(s.Text())
					return regexp.MustCompile(`^\d+位$`).MatchString(text)
				}).First()
				if rankDiv.Length() > 0 {
					rankText := strings.TrimSpace(rankDiv.Text())
					rankText = strings.TrimSuffix(rankText, "位")
					if r, err := strconv.Atoi(rankText); err == nil {
						rank = r
					}
				}
			}

			img := parent.Find("img").First()
			imageURLSrc, ok := img.Attr("src")
			if !ok {
				parseErr = errors.New("failed to get src attribute from character image for entry number " + strconv.Itoa(entryNumber))
				return false
			}
			imageURL, err := currentURL.Parse(imageURLSrc)
			if err != nil {
				parseErr = errors.New("failed to parse image URL: " + imageURLSrc + " for entry number " + strconv.Itoa(entryNumber))
				return false
			}

			items = append(items, &yuruverse.RawItem{
				Date:        dateString,
				ID:          id,
				EntryNumber: entryNumber,
				Name:        name,
				Country:     country,
				Biko:        biko,
				ImageURL:    imageURL.String(),
				Rank:        rank,
				Point:       point,
			})

			return true
		})

		if parseErr != nil {
			return errors.WithStack(parseErr)
		}

		time.Sleep(500 * time.Millisecond)
	}

	sort.Slice(items, func(i, j int) bool {
		return items[i].EntryNumber < items[j].EntryNumber
	})

	result, err := csvutil.Marshal(&items)
	if err != nil {
		return errors.WithStack(err)
	}

	fileName := "result/" + date.Format("20060102") + ".csv"
	if err := os.WriteFile(fileName, result, 0644); err != nil {
		return err
	}

	return nil
}

func merge() error {
	paths, err := filepath.Glob("result/*.csv")
	if err != nil {
		return errors.WithStack(err)
	}

	var items []*yuruverse.RawItem
	for _, path := range paths {
		bytes, err := os.ReadFile(path)
		if err != nil {
			return errors.WithStack(err)
		}

		var tmp []*yuruverse.RawItem
		if err := csvutil.Unmarshal(bytes, &tmp); err != nil {
			return errors.WithStack(err)
		}

		items = append(items, tmp...)
	}

	sort.Slice(items, func(i, j int) bool {
		if items[i].Date != items[j].Date {
			return items[i].Date < items[j].Date
		}
		return items[i].EntryNumber < items[j].EntryNumber
	})

	{
		data, err := csvutil.Marshal(&items)
		if err != nil {
			return errors.WithStack(err)
		}

		if err := os.WriteFile("public/all.csv", data, 0644); err != nil {
			return errors.WithStack(err)
		}
	}

	{
		entryNumberToCharacter := make(map[int]*yuruverse.Character)
		for i := range items {
			item := items[len(items)-1-i]
			if _, ok := entryNumberToCharacter[item.EntryNumber]; ok {
				continue
			}
			entryNumberToCharacter[item.EntryNumber] = &yuruverse.Character{
				ID:          item.ID,
				EntryNumber: item.EntryNumber,
				Name:        item.Name,
				Country:     item.Country,
				Biko:        item.Biko,
				ImageURL:    item.ImageURL,
			}
		}
		entryNumberToRecords := make(map[int][]*yuruverse.Record)
		for _, item := range items {
			entryNumberToRecords[item.EntryNumber] = append(
				entryNumberToRecords[item.EntryNumber],
				&yuruverse.Record{
					Date:  item.Date,
					Rank:  item.Rank,
					Point: item.Point,
				},
			)
		}

		var entryNumbers []int
		for entryNumber := range entryNumberToCharacter {
			entryNumbers = append(entryNumbers, entryNumber)
		}
		sort.Ints(entryNumbers)

		var structuredItems []*yuruverse.StructuredItem
		for _, entryNumber := range entryNumbers {
			structuredItems = append(structuredItems, &yuruverse.StructuredItem{
				Character: entryNumberToCharacter[entryNumber],
				Records:   entryNumberToRecords[entryNumber],
			})
		}

		data, err := json.MarshalIndent(&structuredItems, "", "  ")
		if err != nil {
			return errors.WithStack(err)
		}

		if err := os.WriteFile("public/all.json", data, 0644); err != nil {
			return errors.WithStack(err)
		}
	}

	return nil
}

func run() error {
	if err := fetch(); err != nil {
		return err
	}
	if err := merge(); err != nil {
		return err
	}
	return nil
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}
