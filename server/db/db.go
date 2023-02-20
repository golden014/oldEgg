package db

import (
	"log"

	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// bikin struct database
type Database struct {
	//db ngebuat DB nya ga bisa diakses diluar package db (ke encapsulate)
	db *gorm.DB
}

// nge return database pointer /error
// func NewDatabase() (*Database, error) {
// 	//connect nya
// 	db, err := sql.Open("postgres", "postgresql://root:root@localhost:5433/go-live-chat?sslmode=disable")

// 	if err != nil {
// 		return nil, err
// 	}

// 	return &Database{db: db}, nil
// }

func NewDatabase() (*gorm.DB, error) {
	dsn := "user=root password=root dbname=go-live-chat port=5433 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return db, nil
}

//	func (d *Database) Close() {
//		//karena ke encapsulate, cara close db nya harus dalam function
//		d.db.Close()
//	}
func (d *Database) Close() {
	sqlDB, err := d.db.DB()
	if err != nil {
		log.Println("Failed to get *sql.DB object:", err)
		return
	}

	if err := sqlDB.Close(); err != nil {
		log.Println("Failed to close *sql.DB object:", err)
		return
	}
}

func (d *Database) GetDB() *gorm.DB {
	return d.db
}
