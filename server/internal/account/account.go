package account

import (
	"errors"
	"net/http"
	"server/internal/util"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{
		db: db,
	}
}

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
}

type UpdateAccountReq struct {
	UserId   int    `json:"user_id" db:"user_id"`
	Column   string `json:"column"`
	NewValue string `json:"new_value"`
}

type UpdatePasswordReq struct {
	UserId   int    `json:"user_id" db:"user_id"`
	CurrPass string `json:"curr_pass" db:"curr_pass"`
	NewPass  string `json:"new_pass" db:"new_pass"`
}

func (h *Handler) UpdateAccount(c *gin.Context) {
	var r UpdateAccountReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	if err := h.db.Table("users").Where("id = ?", r.UserId).Update(r.Column, r.NewValue).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (h *Handler) UpdatePassword(c *gin.Context) {
	var r UpdatePasswordReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := User{}
	if err := h.db.Where("id = ?", r.UserId).First(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err := util.CheckPassword(r.CurrPass, user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "curr password dont match !"})
		return
	}

	user.Password, err = util.HashPassword(r.NewPass)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "change password success"})

}
