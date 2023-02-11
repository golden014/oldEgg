package db

import (
	"database/sql"
	"github.com/lib/pq"
)

// bikin struct database
type Database struct {
	//db ngebuat DB nya ga bisa diakses diluar package db (ke encapsulate)
	db *sql.DB
}

// nge return database pointer /error
func NewDatabase() (*Database, error) {
	//connect nya
	db, err := sql.Open("postgres", "postgresql://root:root@localhost:5433/go-live-chat?sslmode=disable")

	if err != nil {
		return nil, err
	}

	return &Database{db: db}, nil
}

func (d *Database) Close() {
	//karena ke encapsulate, cara close db nya harus dalam function
	d.db.Close()
}

func (d *Database) GetDB() *sql.DB {
	return d.db
}
