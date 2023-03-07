package voucher

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Voucher struct {
	VoucherID      uint   `gorm:"primary_key;auto_increment" json:"voucher_id"`
	VoucherBalance int    `json:"voucher_balance" db:"voucher_balance"`
	VoucherCode    string `json:"voucher_code" db:"voucher_code"`
	ValidUntil     string `json:"valid_until" db:"valid_until"`
}

type AddVoucherReq struct {
	VoucherBalance int    `json:"voucher_balance" db:"voucher_balance"`
	VoucherCode    string `json:"voucher_code" db:"voucher_code"`
	ValidUntil     string `json:"valid_until" db:"valid_until"`
}

type ValidateVoucherReq struct {
	VoucherCode string `json:"voucher_code" db:"voucher_code"`
	UserID      string `json:"user_id"`
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

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{
		db: db,
	}
}

func (h *Handler) AddVoucher(c *gin.Context) {
	var r AddVoucherReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	voucher := Voucher{
		VoucherBalance: r.VoucherBalance,
		VoucherCode:    r.VoucherCode,
		ValidUntil:     r.ValidUntil,
	}

	if err := h.db.Create(&voucher).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create carousel item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": voucher})

}

func (h *Handler) ValidateVoucher(c *gin.Context) {
	var r ValidateVoucherReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	voucher_code := r.VoucherCode
	user_id := r.UserID

	voucher_balance, found, err := h.ValidateCode(voucher_code)

	//kalau misalnya ada error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return

	}

	// if (found == true) {
	// 	//add  voucher balance into a user with user_id = user_id
	// }
	if found {
		user := User{}
		if err := h.db.Where("id = ?", user_id).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		//masukin balance dari voucher
		user.Balance += voucher_balance

		//save database
		if err := h.db.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": strconv.Itoa(voucher_balance)})
		return

	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "voucher not found"})
	}

}

func (h *Handler) ValidateCode(voucher_code string) (int, bool, error) {
	//utk tampung hasil nya
	v := Voucher{}
	// Get the user with the specified email using GORM
	if err := h.db.Where("voucher_code = ?", voucher_code).First(&v).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, false, nil
		}
		return 0, false, err
	}

	return v.VoucherBalance, true, nil
}
