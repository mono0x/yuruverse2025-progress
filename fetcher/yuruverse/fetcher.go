package yuruverse

import (
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/jszwec/csvutil"
	"github.com/pkg/errors"
)

func load() ([]*RawItem, error) {
	paths, err := filepath.Glob("result/*.csv")
	if err != nil {
		return nil, errors.WithStack(err)
	}

	var allItems []*RawItem
	for _, path := range paths {
		bytes, err := os.ReadFile(path)
		if err != nil {
			return nil, errors.WithStack(err)
		}

		var tmp []*RawItem
		if err := csvutil.Unmarshal(bytes, &tmp); err != nil {
			return nil, errors.WithStack(err)
		}

		allItems = append(allItems, tmp...)
	}

	sort.Slice(allItems, func(i, j int) bool {
		if allItems[i].Date != allItems[j].Date {
			return allItems[i].Date < allItems[j].Date
		}
		return allItems[i].EntryNumber < allItems[j].EntryNumber
	})

	return allItems, nil
}

func fetch(date time.Time, interval time.Duration) ([]*RawItem, error) {
	rankRanges := []string{"", "?rank_range=51-100", "?rank_range=101-150", "?rank_range=151-200", "?rank_range=201%2B"}
	var items []*RawItem
	processedEntries := make(map[int]bool)

	for _, rankRange := range rankRanges {
		currentURL, err := url.Parse("https://www.yurugp.jp/vote/2025" + rankRange)
		if err != nil {
			return nil, errors.WithStack(err)
		}

		req, err := http.NewRequest("GET", currentURL.String(), nil)
		if err != nil {
			return nil, errors.WithStack(err)
		}
		req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return nil, errors.WithStack(err)
		}
		defer resp.Body.Close()

		doc, err := goquery.NewDocumentFromReader(resp.Body)
		if err != nil {
			return nil, errors.WithStack(err)
		}

		pageItems, err := ParseRankingPage(doc, currentURL, date)
		if err != nil {
			return nil, errors.WithStack(err)
		}

		for _, item := range pageItems {
			if !processedEntries[item.EntryNumber] {
				processedEntries[item.EntryNumber] = true
				items = append(items, item)
			}
		}

		time.Sleep(interval)
	}

	sort.Slice(items, func(i, j int) bool {
		return items[i].EntryNumber < items[j].EntryNumber
	})

	return items, nil
}

func updated(newItems, existingItems []*RawItem) bool {
	if len(existingItems) == 0 {
		return true
	}

	type signature struct {
		ID    string
		Rank  int
		Point int
	}

	signatures := make(map[signature]struct{})
	{
		date := existingItems[len(existingItems)-1].Date
		for _, item := range existingItems {
			if item.Date != date {
				continue
			}
			signatures[signature{
				ID:    item.ID,
				Rank:  item.Rank,
				Point: item.Point,
			}] = struct{}{}
		}
	}

	if len(newItems) != len(signatures) {
		return true
	}

	for _, item := range newItems {
		if _, exists := signatures[signature{
			ID:    item.ID,
			Rank:  item.Rank,
			Point: item.Point,
		}]; !exists {
			return true
		}
	}

	return false
}

func merge(newItems, existingItems []*RawItem) ([]*RawItem, []*StructuredItem, error) {
	allItems := make([]*RawItem, len(existingItems))
	copy(allItems, existingItems)

	allItems = append(allItems, newItems...)
	sort.Slice(allItems, func(i, j int) bool {
		if allItems[i].Date != allItems[j].Date {
			return allItems[i].Date < allItems[j].Date
		}
		return allItems[i].EntryNumber < allItems[j].EntryNumber
	})

	entryNumberToCharacter := make(map[int]*Character)
	for i := range allItems {
		item := allItems[len(allItems)-1-i]
		if _, ok := entryNumberToCharacter[item.EntryNumber]; ok {
			continue
		}
		entryNumberToCharacter[item.EntryNumber] = &Character{
			ID:          item.ID,
			EntryNumber: item.EntryNumber,
			Name:        item.Name,
			Country:     item.Country,
			Biko:        item.Biko,
			ImageURL:    item.ImageURL,
		}
	}
	entryNumberToRecords := make(map[int][]*Record)
	for _, item := range allItems {
		entryNumberToRecords[item.EntryNumber] = append(
			entryNumberToRecords[item.EntryNumber],
			&Record{
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

	var structuredItems []*StructuredItem
	for _, entryNumber := range entryNumbers {
		structuredItems = append(structuredItems, &StructuredItem{
			Character: entryNumberToCharacter[entryNumber],
			Records:   entryNumberToRecords[entryNumber],
		})
	}

	return allItems, structuredItems, nil
}

func save(newItems, allItems []*RawItem, structuredItems []*StructuredItem, date time.Time) error {
	{
		result, err := csvutil.Marshal(&newItems)
		if err != nil {
			return errors.WithStack(err)
		}

		if err := os.WriteFile("result/"+date.Format("20060102")+".csv", result, 0644); err != nil {
			return err
		}
	}
	{
		data, err := csvutil.Marshal(&allItems)
		if err != nil {
			return errors.WithStack(err)
		}

		if err := os.WriteFile("public/all.csv", data, 0644); err != nil {
			return errors.WithStack(err)
		}
	}
	{
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

func Run() error {
	date := time.Now().UTC().Add(-3 * time.Hour)

	newItems, err := fetch(date, 500*time.Millisecond)
	if err != nil {
		return err
	}

	existingItems, err := load()
	if err != nil {
		return err
	}

	if !updated(newItems, existingItems) {
		return errors.New("No ranking data changes detected")
	}

	allItems, structuredItems, err := merge(newItems, existingItems)
	if err != nil {
		return err
	}

	return save(newItems, allItems, structuredItems, date)
}
