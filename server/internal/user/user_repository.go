//bottom most layer, yg interact sama database, run queries

package user

import (
	"context"
	"database/sql"
)

// ada case kita mau pass transaction instead of db object, jadi pakai interface
type DBTX interface {
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	PrepareContext(context.Context, string) (*sql.Stmt, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}

type repository struct {
	db DBTX
}

// pass interface DBTX
func NewRepository(db DBTX) Repository {
	return &repository{db: db}
}

// create user method
func (r *repository) CreateUser(ctx context.Context, user *User) (*User, error) {

	var lastInsertId int
	query := "INSERT INTO users(username, password, email) VALUES ($1, $2, $3) returning id"
	err := r.db.QueryRowContext(ctx, query, user.Username, user.Password, user.Email).Scan(&lastInsertId)
	if err != nil {
		return &User{}, err
	}

	user.ID = int64(lastInsertId)
	return user, nil
}

// ambil user by email
func (r *repository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	//utk tampung hasil nya
	u := User{}

	query := "SELECT id, email, username, password FROM users WHERE email = $1"

	//masukin ke u, hasilnya
	err := r.db.QueryRowContext(ctx, query, email).Scan(&u.ID, &u.Email, &u.Username, &u.Password)

	//kalau error return user kosong
	if err != nil {
		return &User{}, nil
	}

	return &u, nil
}
