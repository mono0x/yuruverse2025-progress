package yurugp

type CharacterKind string

const (
	Company = CharacterKind("COMPANY")
	Local   = CharacterKind("LOCAL")
)

const DateFormat = "2006-01-02"

type RawItem struct {
	Date        string        `csv:"date"`
	ID          string        `csv:"id"`
	Kind        CharacterKind `csv:"kind"`
	EntryNumber int           `csv:"entry_number"`
	Name        string        `csv:"name"`
	Country     string        `csv:"country"`
	Biko        string        `csv:"biko"`
	ImageURL    string        `csv:"image_url"`
	Rank        int           `csv:"rank"`
	Point       int           `csv:"point"`
}

type Character struct {
	ID          string        `json:"id"`
	Kind        CharacterKind `json:"kind"`
	EntryNumber int           `json:"entry_number"`
	Name        string        `json:"name"`
	Country     string        `json:"country"`
	Biko        string        `json:"biko"`
	ImageURL    string        `json:"image_url"`
}

type Record struct {
	Date  string `json:"date"`
	Rank  int    `json:"rank"`
	Point int    `json:"point"`
}

type StructuredItem struct {
	Character *Character `json:"character"`
	Records   []*Record  `json:"records"`
}
