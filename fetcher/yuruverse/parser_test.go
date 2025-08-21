package yuruverse

import (
	"net/url"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/jszwec/csvutil"
	"github.com/stretchr/testify/assert"
)

func TestParseRankingPage(t *testing.T) {
	assert := assert.New(t)

	html, err := os.ReadFile("testdata/input.html")
	if err != nil {
		t.Fatal(err)
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(string(html)))
	if err != nil {
		t.Fatal(err)
	}

	baseURL, err := url.Parse("https://www.yurugp.jp/vote/2025")
	if err != nil {
		t.Fatal(err)
	}

	actual, err := ParseRankingPage(doc, baseURL, time.Date(2025, 8, 4, 0, 0, 0, 0, time.UTC))
	if err != nil {
		t.Fatal(err)
	}

	csv, err := os.ReadFile("testdata/expected.csv")
	if err != nil {
		// If expected file doesn't exist, create it with current results for manual review
		// csv, err := csvutil.Marshal(result)
		// if err != nil {
		// 	t.Fatal(err)
		// }
		// if err := os.WriteFile("testdata/expected.csv", csv, 0644); err != nil {
		// 	t.Fatal(err)
		// }
		// t.Skip("Expected file created, please review and rerun test")
		t.Fatal(err)
	}

	var expected []*RawItem
	if err := csvutil.Unmarshal(csv, &expected); err != nil {
		t.Fatal(err)
	}

	assert.Equal(expected, actual)
}
