package address

import (
	"errors"
	"net/http"

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

type Address struct {
	AddressId   uint   `gorm:"primary_key;auto_increment" json:"address_id"`
	UserId      int    `json:"user_id" db:"user_id"`
	AddressName string `json:"address_name" db:"address_name"`
}

type CreateNewAddressReq struct {
	UserId      int    `json:"user_id" db:"user_id"`
	AddressName string `json:"address_name" db:"address_name"`
}

type GetAllAddressByUserIdReq struct {
	UserId int `json:"user_id" db:"user_id"`
}

type RemoveAddressReq struct {
	AddressId int `json:"address_id" db:"address_id"`
}

func (h *Handler) AddAddress(c *gin.Context) {
	var r CreateNewAddressReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	address := Address{
		UserId:      r.UserId,
		AddressName: r.AddressName,
	}

	if err := h.db.Create(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add address"})
		return
	}
}

func (h *Handler) GetAllAddressByUserId(c *gin.Context) {
	var r GetAllAddressByUserIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	addresses := []Address{}

	if err := h.db.Where("user_id = ?", r.UserId).Find(&addresses).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusOK, addresses)
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, addresses)

}

func (h *Handler) RemoveAddress(c *gin.Context) {
	var r RemoveAddressReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	if err := h.db.Where("address_id = ?", r.AddressId).Delete(&Address{}).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})

}
