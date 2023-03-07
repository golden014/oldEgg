package product

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Product struct {
	ProductId          uint   `gorm:"primary_key;auto_increment" json:"product_id"`
	StoreId            int    `json:"store_id" db:"store_id"`
	ProductName        string `json:"product_name" db:"product_name"`
	Stock              int    `json:"stock" db:"stock"`
	ProductDescription string `json:"product_description" db:"product_description"`
	CategoryId         int    `json:"category_id" db:"category_id"`
	ProductImage       string `json:"product_image" db:"product_image"`
}

type CreateProductRequest struct {
	StoreId            int    `json:"store_id" db:"store_id"`
	ProductName        string `json:"product_name" db:"product_name"`
	Stock              int    `json:"stock" db:"stock"`
	ProductDescription string `json:"product_description" db:"product_description"`
	CategoryId         int    `json:"category_id" db:"category_id"`
	ProductImage       string `json:"product_image" db:"product_image"`
}

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{
		db: db,
	}
}

func (h *Handler) AddProduct(c *gin.Context) {
	var r CreateProductRequest

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	product := Product{
		StoreId:            r.StoreId,
		ProductName:        r.ProductName,
		Stock:              r.Stock,
		ProductDescription: r.ProductDescription,
		CategoryId:         r.CategoryId,
		ProductImage:       r.ProductImage,
	}

	if err := h.db.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product})

}
