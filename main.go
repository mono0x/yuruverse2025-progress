package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/jszwec/csvutil"
	"github.com/mono0x/yurugp2020-progress/yurugp"
	"github.com/pkg/errors"
)

var (
	entryNumberRe = regexp.MustCompile(`エントリーNo.(\d+)`)
	countryRe     = regexp.MustCompile(`\((.+)\)`)
	pointRe       = regexp.MustCompile(`(\d+)PT`)
)

func fetch() error {
	baseURL, err := url.Parse("https://www.yurugp.jp/jp/vote/")
	if err != nil {
		return errors.WithStack(err)
	}

	date := time.Now().Add(-12 * time.Hour)
	dateString := date.Format(yurugp.DateFormat)

	currentURL := baseURL
	var items []*yurugp.RawItem
	for {
		resp, err := http.Get(currentURL.String())
		if err != nil {
			return errors.WithStack(err)
		}
		defer resp.Body.Close()

		doc, err := goquery.NewDocumentFromReader(resp.Body)
		if err != nil {
			return errors.WithStack(err)
		}

		var err2 error
		doc.Find("ul.chararank li").EachWithBreak(func(i int, s *goquery.Selection) bool {
			href, ok := s.Find("li > a").Attr("href")
			if !ok {
				err2 = errors.New("Cound not find an element")
				return false
			}
			url, err := currentURL.Parse(href)
			if err != nil {
				err2 = errors.WithStack(err)
				return false
			}
			id := url.Query().Get("id")

			var kind yurugp.CharacterKind
			if s.Find(".charakind .kind").HasClass("campany") { // campany is NOT a typo
				kind = yurugp.Company
			} else {
				kind = yurugp.Local
			}

			entryNumberText := s.Find(".charakind .entryno").Text()
			entryNumberSubmatches := entryNumberRe.FindStringSubmatch(entryNumberText)
			if len(entryNumberSubmatches) == 0 {
				err2 = errors.New("Cound not find entry number")
				return false
			}
			entryNumber, err := strconv.Atoi(entryNumberSubmatches[1])
			if err != nil {
				err2 = errors.WithStack(err)
				return false
			}

			name := s.Find(".character .name h4").Text()

			countryText := s.Find(".character .name .country").Text()
			countrySubmatches := countryRe.FindStringSubmatch(countryText)
			if len(countrySubmatches) == 0 {
				err2 = errors.New("Cound not find country")
				return false
			}
			country := countrySubmatches[1]

			biko := s.Find(".character .name .biko").Text()

			rank, err := strconv.Atoi(s.Find(".rankdetail .rank > strong").Text())
			if err != nil {
				err2 = errors.WithStack(err)
				return false
			}

			pointText := s.Find(".rankdetail .point").Text()
			pointSubmatches := pointRe.FindStringSubmatch(pointText)
			if len(pointSubmatches) == 0 {
				err2 = errors.New("Cound not find point")
				return false
			}
			point, err := strconv.Atoi(pointSubmatches[1])
			if err != nil {
				err2 = errors.WithStack(err)
				return false
			}

			imageURLSrc, ok := s.Find(".character .img img").Attr("src")
			if !ok {
				err2 = errors.New("Cound not find image URL")
				return false
			}
			imageURL, err := currentURL.Parse(imageURLSrc)
			if err != nil {
				err2 = errors.WithStack(err)
				return false
			}

			items = append(items, &yurugp.RawItem{
				Date:        dateString,
				ID:          id,
				Kind:        kind,
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
		if err2 != nil {
			return err2
		}

		href, ok := doc.Find(".paging ul li a:contains('次の')").Attr("href")
		if !ok {
			break
		}
		nextURL, err := currentURL.Parse(href)
		if err != nil {
			return errors.WithStack(err)
		}
		currentURL = nextURL

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
	if err := ioutil.WriteFile(fileName, result, 0644); err != nil {
		return err
	}

	return nil
}

func merge() error {
	paths, err := filepath.Glob("result/*.csv")
	if err != nil {
		return errors.WithStack(err)
	}

	var items []*yurugp.RawItem
	for _, path := range paths {
		bytes, err := ioutil.ReadFile(path)
		if err != nil {
			return errors.WithStack(err)
		}

		var tmp []*yurugp.RawItem
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

		if err := ioutil.WriteFile("data/all.csv", data, 0644); err != nil {
			return errors.WithStack(err)
		}
	}

	{
		entryNumberToCharacter := make(map[int]*yurugp.Character)
		for i := range items {
			item := items[len(items)-1-i]
			if _, ok := entryNumberToCharacter[item.EntryNumber]; ok {
				continue
			}
			entryNumberToCharacter[item.EntryNumber] = &yurugp.Character{
				ID:          item.ID,
				Kind:        item.Kind,
				EntryNumber: item.EntryNumber,
				Name:        item.Name,
				Country:     item.Country,
				Biko:        item.Biko,
				ImageURL:    item.ImageURL,
			}
		}
		entryNumberToRecords := make(map[int][]*yurugp.Record)
		for _, item := range items {
			entryNumberToRecords[item.EntryNumber] = append(
				entryNumberToRecords[item.EntryNumber],
				&yurugp.Record{
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

		var structuredItems []*yurugp.StructuredItem
		for _, entryNumber := range entryNumbers {
			structuredItems = append(structuredItems, &yurugp.StructuredItem{
				Character: entryNumberToCharacter[entryNumber],
				Records:   entryNumberToRecords[entryNumber],
			})
		}

		data, err := json.MarshalIndent(&structuredItems, "", "  ")
		if err != nil {
			return errors.WithStack(err)
		}

		if err := ioutil.WriteFile("data/all.json", data, 0644); err != nil {
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
