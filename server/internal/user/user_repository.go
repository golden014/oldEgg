//bottom most layer, yg interact sama database, run queries

package user

import (
	"context"
	"errors"

	"gorm.io/gorm"
)

// ada case kita mau pass transaction instead of db object, jadi pakai interface
// type DBTX interface {
// 	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
// 	PrepareContext(context.Context, string) (*sql.Stmt, error)
// 	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
// 	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
// }

type repository struct {
	// db DBTX
	db *gorm.DB
}

// pass interface DBTX
func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

type Cart struct {
	CartId uint  `gorm:"primary_key;auto_increment" json:"cart_id"`
	UserId int64 `json:"user_id" db:"user_id"`
}

// create user method
func (r *repository) CreateUser(ctx context.Context, user *User) (*User, error) {

	// var lastInsertId int
	// query := "INSERT INTO users(username, password, email) VALUES ($1, $2, $3) returning id"
	// err := r.db.QueryRowContext(ctx, query, user.Username, user.Password, user.Email).Scan(&lastInsertId)
	// if err != nil {
	// 	return &User{}, err
	// }

	// user.ID = int64(lastInsertId)
	// return user, nil
	if err := r.db.WithContext(ctx).Create(user).Error; err != nil {
		return nil, err
	}

	cart := &Cart{
		UserId: user.ID,
	}

	if err := r.db.Create(cart).Error; err != nil {
		return nil, err
	}

	return user, nil
}

// ambil user by email
// func (r *repository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
// 	//utk tampung hasil nya
// 	u := User{}

// 	query := "SELECT id, email, username, password FROM users WHERE email = $1"

// 	//masukin ke u, hasilnya
// 	err := r.db.QueryRowContext(ctx, query, email).Scan(&u.ID, &u.Email, &u.Username, &u.Password)

// 	//kalau error return user kosong
// 	if err != nil {
// 		return &User{}, nil
// 	}

// 	return &u, nil
// }

func (r *repository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	//utk tampung hasil nya
	u := User{}

	// Get the user with the specified email using GORM
	if err := r.db.Where("email = ?", email).First(&u).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &User{}, nil
		}
		return nil, err
	}

	return &u, nil
}

func (r *repository) GetUserById(ctx context.Context, user_id int) (*User, error) {
	u := User{}

	if err := r.db.Where("id = ?", user_id).First(&u).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &User{}, nil
		}
		return nil, err
	}

	return &u, nil
}

// func (r *repository) EmailUnique(ctx context.Context, email string) bool {
// 	//utk tampung hasil nya
// 	u := User{}

// 	query := "SELECT email FROM users WHERE email = $1"

// 	//masukin ke u, hasilnya
// 	err := r.db.QueryRowContext(ctx, query, email).Scan(&u.Email)

// 	//kalau error/gaada yg user dgn email tsb  return true (email nya unique)
// 	if err != nil {
// 		return true
// 	}

// 	//kalau sudah ada, maka akan return false
// 	return false
// }

func (r *repository) EmailUnique(ctx context.Context, email string) bool {
	var count int64
	r.db.Model(&User{}).Where("email = ?", email).Count(&count)

	return count == 0
}

// blm di paginate
func (r *repository) GetAllUsers(ctx context.Context) ([]User, error) {
	//buat nampung
	users := []User{}

	if err := r.db.Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}
