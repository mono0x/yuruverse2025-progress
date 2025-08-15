package main

import (
	"log"

	"github.com/mono0x/yuruverse2025-progress/fetcher/yuruverse"
)

func main() {
	if err := yuruverse.Run(); err != nil {
		log.Fatal(err)
	}
}
