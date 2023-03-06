package user

import (
	"context"
	"errors"
	"regexp"
	"server/internal/util"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

const (
	secretKey = "supersupersecretqwerty123"
)

type service struct {
	Repository
	timeout time.Duration
}

func NewService(repository Repository) Service {
	return &service{
		repository,
		time.Duration(2) * time.Second,
	}
}

func (s *service) CreateUser(c context.Context, req *CreateUserReq) (*CreateUserRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()
	//TODO: hash password
	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	u := &User{
		FirstName:   req.FirstName,
		LastName:    req.LastName,
		Email:       req.Email,
		MobilePhone: req.MobilePhone,
		Password:    hashedPassword,
		IsSubscribe: req.IsSubscribe,
		Role:        req.Role,
		Status:      req.Status,
	}

	if err := u.Validate(); err != nil {
		return nil, err
	}

	//cek email unique atau ga, kalau ga unik akan return error
	isUnique := s.Repository.EmailUnique(ctx, u.Email)
	if isUnique == false {
		return nil, errors.New(u.Email + " is not unique")
	}

	//kalau unique, akan dijalankan query insert user nya
	r, err := s.Repository.CreateUser(ctx, u)
	if err != nil {
		return nil, err
	}

	res := &CreateUserRes{
		ID:    strconv.Itoa(int(r.ID)),
		Email: r.Email,
	}

	//send back response
	return res, nil
}

type JWTClaims struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.RegisteredClaims
}

func (s *service) Login(c context.Context, req *LoginUserReq) (*LoginUserRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	//ambil user berdasarkan email lalu masukin data user tsb ke u
	u, err := s.Repository.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return &LoginUserRes{}, err
	}

	if u.Status == "Banned" {
		return nil, errors.New("your account is banned")
	}

	//ngebandingin password yg diinput user (req.password) dengan password yang didapat
	//dari database berdasarkan email yang di kasih user
	err = util.CheckPassword(req.Password, u.Password)
	if err != nil {
		return &LoginUserRes{}, err
	}

	//JSON WEB TOKEN JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, JWTClaims{
		ID:    strconv.Itoa(int(u.ID)),
		Email: u.Email,
		Role:  u.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    strconv.Itoa(int(u.ID)),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	})

	ss, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return &LoginUserRes{}, err
	}

	return &LoginUserRes{
		AccessToken: ss,
		ID:          strconv.Itoa(int(u.ID)),
		FirstName:   u.FirstName,
		LastName:    u.LastName,
		Email:       u.Email,
		MobilePhone: u.MobilePhone,
		IsSubscribe: u.IsSubscribe,
		Role:        u.Role,
		Balance:     u.Balance,
	}, nil
}

func isValidEmail(email string) bool {

	regex := regexp.MustCompile(`^[^@]+@[^@]+\.[^@]+`)
	return regex.MatchString(email) && !endsWithAtDotComs(email)
}

func endsWithAtDotComs(email string) bool {
	return email[len(email)-5:] == "@.com" || email[len(email)-6:] == "@.com."
}

func isValidMobilePhone(mobilePhone string) bool {
	regex := regexp.MustCompile(`^[0-9]+$`)
	return regex.MatchString(mobilePhone)
}

// func isValidPassword(password string) bool {
// 	regex := regexp.MustCompile(`^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+{}|:"<>?\-=[\]\\;',./]).{8,30}$`)
// 	return regex.MatchString(password)
// }
