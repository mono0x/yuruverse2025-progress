package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"sort"
	"strconv"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/pkg/errors"
)

type CharacterKind string

const (
	Company = CharacterKind("COMPANY")
	Local   = CharacterKind("LOCAL")
)

type CharacterItem struct {
	ID          string        `json:"id"`
	Kind        CharacterKind `json:"kind"`
	EntryNumber int           `json:"entry_number"`
	Name        string        `json:"name"`
	Country     string        `json:"country"`
	Biko        string        `json:"biko"`
	ImageURL    string        `json:"image_url"`
	Rank        int           `json:"rank"`
	Point       int           `json:"point"`
}

var (
	entryNumberRe = regexp.MustCompile(`エントリーNo.(\d+)`)
	countryRe     = regexp.MustCompile(`\((.+)\)`)
	pointRe       = regexp.MustCompile(`(\d+)PT`)
)

func run() error {
	baseURL, err := url.Parse("https://www.yurugp.jp/jp/vote/")
	if err != nil {
		return errors.WithStack(err)
	}

	currentURL := baseURL
	var items []*CharacterItem
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

			var kind CharacterKind
			if s.Find(".charakind .kind").HasClass("company") {
				kind = Company
			} else {
				kind = Local
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

			items = append(items, &CharacterItem{
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

	result, err := json.MarshalIndent(&items, "", "  ")
	if err != nil {
		return errors.WithStack(err)
	}

	fileName := "result/" + time.Now().Format("20060102") + ".json"
	if err := ioutil.WriteFile(fileName, result, 0644); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}
