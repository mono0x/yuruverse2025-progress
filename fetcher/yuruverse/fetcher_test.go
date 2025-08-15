package yuruverse

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUpdated(t *testing.T) {
	t.Run("returns true when existing data is empty", func(t *testing.T) {
		newItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-01", Rank: 1, Point: 100},
		}
		result := updated(newItems, []*RawItem{})
		assert.True(t, result)
	})

	t.Run("returns false when new data matches latest existing data", func(t *testing.T) {
		existingItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-01", Rank: 1, Point: 100},
			{ID: "hero2", Date: "2025-01-01", Rank: 2, Point: 90},
			{ID: "hero1", Date: "2025-01-02", Rank: 1, Point: 110},
			{ID: "hero2", Date: "2025-01-02", Rank: 2, Point: 95},
		}
		newItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-03", Rank: 1, Point: 110},
			{ID: "hero2", Date: "2025-01-03", Rank: 2, Point: 95},
		}
		result := updated(newItems, existingItems)
		assert.False(t, result)
	})

	t.Run("returns true when ranks change", func(t *testing.T) {
		existingItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-01", Rank: 1, Point: 100},
			{ID: "hero2", Date: "2025-01-01", Rank: 2, Point: 90},
		}
		newItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-02", Rank: 2, Point: 100},
			{ID: "hero2", Date: "2025-01-02", Rank: 1, Point: 90},
		}
		result := updated(newItems, existingItems)
		assert.True(t, result)
	})

	t.Run("returns true when points change", func(t *testing.T) {
		existingItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-01", Rank: 1, Point: 100},
			{ID: "hero2", Date: "2025-01-01", Rank: 2, Point: 90},
		}
		newItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-02", Rank: 1, Point: 110},
			{ID: "hero2", Date: "2025-01-02", Rank: 2, Point: 90},
		}
		result := updated(newItems, existingItems)
		assert.True(t, result)
	})

	t.Run("returns true when character count changes", func(t *testing.T) {
		existingItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-01", Rank: 1, Point: 100},
			{ID: "hero2", Date: "2025-01-01", Rank: 2, Point: 90},
		}
		newItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-02", Rank: 1, Point: 100},
			{ID: "hero2", Date: "2025-01-02", Rank: 2, Point: 90},
			{ID: "hero3", Date: "2025-01-02", Rank: 3, Point: 80},
		}
		result := updated(newItems, existingItems)
		assert.True(t, result)
	})

	t.Run("returns true when character IDs change", func(t *testing.T) {
		existingItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-01", Rank: 1, Point: 100},
			{ID: "hero2", Date: "2025-01-01", Rank: 2, Point: 90},
		}
		newItems := []*RawItem{
			{ID: "hero1", Date: "2025-01-02", Rank: 1, Point: 100},
			{ID: "hero3", Date: "2025-01-02", Rank: 2, Point: 90},
		}
		result := updated(newItems, existingItems)
		assert.True(t, result)
	})
}

func TestMerge(t *testing.T) {
	t.Run("merges new data with existing data and structures it", func(t *testing.T) {
		existingItems := []*RawItem{
			{
				Date: "2025-01-01", ID: "hero1", EntryNumber: 1, Name: "Hero One",
				Country: "Prefecture A", Biko: "Note A", ImageURL: "image1.jpg", Rank: 1, Point: 100,
			},
		}
		newItems := []*RawItem{
			{
				Date: "2025-01-02", ID: "hero1", EntryNumber: 1, Name: "Hero One",
				Country: "Prefecture A", Biko: "Note A", ImageURL: "image1.jpg", Rank: 1, Point: 110,
			},
			{
				Date: "2025-01-02", ID: "hero2", EntryNumber: 2, Name: "Hero Two",
				Country: "Prefecture B", Biko: "Note B", ImageURL: "image2.jpg", Rank: 2, Point: 95,
			},
		}

		allItems, structuredItems, err := merge(newItems, existingItems)
		assert.NoError(t, err)
		assert.Len(t, allItems, 3)
		assert.Len(t, structuredItems, 2)

		hero1 := structuredItems[0]
		assert.Equal(t, "hero1", hero1.Character.ID)
		assert.Len(t, hero1.Records, 2)
	})

	t.Run("uses latest character information", func(t *testing.T) {
		existingItems := []*RawItem{
			{
				Date: "2025-01-01", ID: "hero1", EntryNumber: 1, Name: "Old Hero",
				Country: "Old Prefecture", Biko: "Old Note", ImageURL: "old.jpg", Rank: 1, Point: 100,
			},
		}
		newItems := []*RawItem{
			{
				Date: "2025-01-02", ID: "hero1", EntryNumber: 1, Name: "New Hero",
				Country: "New Prefecture", Biko: "New Note", ImageURL: "new.jpg", Rank: 1, Point: 110,
			},
		}

		allItems, structuredItems, err := merge(newItems, existingItems)
		assert.NoError(t, err)
		assert.Len(t, allItems, 2)
		assert.Len(t, structuredItems, 1)

		hero := structuredItems[0]
		assert.Equal(t, "New Hero", hero.Character.Name)
		assert.Equal(t, "New Prefecture", hero.Character.Country)
		assert.Len(t, hero.Records, 2)
	})

	t.Run("sorts characters by entry number", func(t *testing.T) {
		newItems := []*RawItem{
			{
				Date: "2025-01-01", ID: "hero3", EntryNumber: 3, Name: "Hero Three",
				Country: "Prefecture C", Biko: "Note C", ImageURL: "image3.jpg", Rank: 3, Point: 80,
			},
			{
				Date: "2025-01-01", ID: "hero1", EntryNumber: 1, Name: "Hero One",
				Country: "Prefecture A", Biko: "Note A", ImageURL: "image1.jpg", Rank: 1, Point: 100,
			},
			{
				Date: "2025-01-01", ID: "hero2", EntryNumber: 2, Name: "Hero Two",
				Country: "Prefecture B", Biko: "Note B", ImageURL: "image2.jpg", Rank: 2, Point: 90,
			},
		}

		allItems, structuredItems, err := merge(newItems, []*RawItem{})
		assert.NoError(t, err)
		assert.Len(t, allItems, 3)
		assert.Len(t, structuredItems, 3)

		expectedEntryNumbers := []int{1, 2, 3}
		for i, expected := range expectedEntryNumbers {
			assert.Equal(t, expected, structuredItems[i].Character.EntryNumber)
		}
	})

	t.Run("sorts all items by date and entry number", func(t *testing.T) {
		newItems := []*RawItem{
			{
				Date: "2025-01-02", ID: "hero1", EntryNumber: 1, Name: "Hero One",
				Country: "Prefecture A", Biko: "Note A", ImageURL: "image1.jpg", Rank: 2, Point: 105,
			},
			{
				Date: "2025-01-01", ID: "hero2", EntryNumber: 2, Name: "Hero Two",
				Country: "Prefecture B", Biko: "Note B", ImageURL: "image2.jpg", Rank: 2, Point: 90,
			},
			{
				Date: "2025-01-01", ID: "hero1", EntryNumber: 1, Name: "Hero One",
				Country: "Prefecture A", Biko: "Note A", ImageURL: "image1.jpg", Rank: 1, Point: 100,
			},
		}

		allItems, _, err := merge(newItems, []*RawItem{})
		assert.NoError(t, err)
		assert.Len(t, allItems, 3)

		expectedOrder := []struct {
			date  string
			entry int
		}{
			{"2025-01-01", 1},
			{"2025-01-01", 2},
			{"2025-01-02", 1},
		}

		for i, expected := range expectedOrder {
			assert.Equal(t, expected.date, allItems[i].Date)
			assert.Equal(t, expected.entry, allItems[i].EntryNumber)
		}
	})
}
