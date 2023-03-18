package cart

import (
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

type Cart struct {
	CartId uint `gorm:"primary_key;auto_increment" json:"cart_id"`
	UserId uint `json:"user_id" db:"user_id"`
	Total  uint `json:"total" db:"total"`
}

type CartProduct struct {
	CartId    uint `json:"cart_id" db:"cart_id"`
	ProductId uint `json:"product_id" db:"product_id"`
	Quantity  uint `json:"quantity" db:"quantity"`
}

type Product struct {
	ProductId          uint   `json:"product_id" db:"product_id"`
	StoreId            int    `json:"store_id" db:"store_id"`
	ProductName        string `json:"product_name" db:"product_name"`
	Stock              int    `json:"stock" db:"stock"`
	ProductDescription string `json:"product_description" db:"product_description"`
	CategoryId         int    `json:"category_id" db:"category_id"`
	ProductImage       string `json:"product_image" db:"product_image"`
	SubCategoryId      int    `json:"sub_category_id" db:"sub_category_id"`
	Price              int    `json:"price" db:"price"`
}

type AddItemToCartReq struct {
	ProductId uint `json:"product_id" db:"product_id"`
	CartId    uint `json:"cart_id" db:"cart_id"`
	Quantity  uint `json:"quantity" db:"quantity"`
}

func (h *Handler) AddItemToCart(c *gin.Context) {
	var r AddItemToCartReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	newProd := CartProduct{
		ProductId: r.ProductId,
		CartId:    r.CartId,
		Quantity:  r.Quantity,
	}

	prod := Product{}
	if err := h.db.Where("product_id", r.ProductId).First(&prod).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Create(&newProd).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	currCart := Cart{}
	if err := h.db.Where("cart_id", r.CartId).First(&currCart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	currCart.Total = currCart.Total + (uint(prod.Price) * r.Quantity)

	if err := h.db.Save(&currCart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "add to cart success"})
}
