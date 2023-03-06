package voucher

import (
	"net/http"

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
