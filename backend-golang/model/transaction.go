package model

import "time"

type Transaction struct {
	Id            string
	Amount        float32
	effectiveDate time.Time
}
