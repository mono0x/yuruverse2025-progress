package yuruverse

import (
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/pkg/errors"
)

var (
	entryNumberRe = regexp.MustCompile(`エントリーNo\.(\d+)`)
)

// ParseRankingPage parses HTML content and returns RawItems
func ParseRankingPage(doc *goquery.Document, baseURL *url.URL, date time.Time) ([]*RawItem, error) {
	var items []*RawItem
	processedEntries := make(map[int]bool)

	entryDivs := doc.Find("div.text-xs, div.text-sm").FilterFunction(func(i int, s *goquery.Selection) bool {
		text := strings.TrimSpace(s.Text())
		return strings.HasPrefix(text, "エントリーNo.") && !strings.Contains(text, "\n")
	})

	dateString := date.Format(DateFormat)

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
		imageURL, err := baseURL.Parse(imageURLSrc)
		if err != nil {
			parseErr = errors.New("failed to parse image URL: " + imageURLSrc + " for entry number " + strconv.Itoa(entryNumber))
			return false
		}

		items = append(items, &RawItem{
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
		return nil, errors.WithStack(parseErr)
	}

	if items == nil {
		return nil, errors.New("no items found in ranking page")
	}

	return items, nil
}
