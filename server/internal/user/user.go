package user

import (
	"context"
	"errors"
)

type User struct {
	ID          int64  `json:"id" db:"id"`
	FirstName   string `json:"firstname" db:"firstname"`
	LastName    string `json:"lastname" db:"lastname"`
	Email       string `json:"email" db:"email"`
	MobilePhone string `json:"mobilephone" db:"mobilephone"`
	Password    string `json:"password" db:"password"`
	IsSubscribe string `json:"issubscribe" db:"issubscribe"`
	Role        string `json:"role" db:"role"`
	Status      string `json:"status" db:"status"`
	Balance     int    `json:"balance" db:"balance"`
	StoreId     int    `json:"store_id" db:"store_id"`
}

type CreateUserReq struct {
	FirstName   string `json:"firstname" db:"firstname"`
	LastName    string `json:"lastname" db:"lastname"`
	Email       string `json:"email" db:"email"`
	MobilePhone string `json:"mobilephone" db:"mobilephone"`
	Password    string `json:"password" db:"password"`
	IsSubscribe string `json:"issubscribe" db:"issubscribe"`
	Role        string `json:"role" db:"role"`
	Status      string `json:"status" db:"status"`
	StoreId     int    `json:"store_id" db:"store_id"`
}

type CreateUserRes struct {
	ID    string `json:"id" db:"id"`
	Email string `json:"email" db:"email"`
}

type LoginUserReq struct {
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type LoginUserRes struct {
	//access token utk pass dari service layer ke handler layer
	AccessToken string `json:"token" db:"token"`
	ID          string `json:"id" db:"id"`
	FirstName   string `json:"firstname" db:"firstname"`
	LastName    string `json:"lastname" db:"lastname"`
	Email       string `json:"email" db:"email"`
	MobilePhone string `json:"mobilephone" db:"mobilephone"`
	IsSubscribe string `json:"issubscribe" db:"issubscribe"`
	Role        string `json:"role" db:"role"`
	Status      string `json:"status" db:"status"`
	Balance     int    `json:"balance" db:"balance"`
	StoreId     int    `json:"storeid" db:"storeid"`
}

type Repository interface {
	CreateUser(ctx context.Context, use *User) (*User, error)
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	EmailUnique(ctx context.Context, email string) bool
	GetAllUsers(c context.Context) ([]User, error)
}

type Service interface {
	CreateUser(c context.Context, req *CreateUserReq) (*CreateUserRes, error)
	Login(c context.Context, req *LoginUserReq) (*LoginUserRes, error)
	GetAllUsers(c context.Context) ([]User, error)
}

// validate backend
func (u User) Validate() error {

	//validate not null

	if u.FirstName == "" {
		return errors.New("firstName field is required")
	}
	if u.LastName == "" {
		return errors.New("lastName field is required")
	}
	if u.Email == "" {
		return errors.New("email field is required")
	}
	if u.MobilePhone == "" {
		return errors.New("mobilephone field is required")
	}
	if u.Password == "" {
		return errors.New("password field is required")
	}

	//validasi sisanya
	if !isValidEmail(u.Email) {
		return errors.New("email field is not in valid format")
	}

	if !isValidMobilePhone(u.MobilePhone) {
		return errors.New("mobilephone field must only consist of numbers")
	}

	// if !isValidPassword(u.Password) {
	// 	return errors.New("password field must contain capital letters, lower-case letters, numbers, and special symbols, and be 8-30 characters long")
	// }

	return nil
}
