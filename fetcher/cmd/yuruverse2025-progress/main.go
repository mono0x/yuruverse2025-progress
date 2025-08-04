package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/jszwec/csvutil"
	"github.com/mono0x/yuruverse2025-progress/fetcher/yuruverse"
	"github.com/pkg/errors"
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

		pageItems, err := yuruverse.ParseRankingPage(doc, currentURL, dateString)
		if err != nil {
			return errors.WithStack(err)
		}

		for _, item := range pageItems {
			if !processedEntries[item.EntryNumber] {
				processedEntries[item.EntryNumber] = true
				items = append(items, item)
			}
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
