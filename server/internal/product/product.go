package product

import (
	"errors"
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
	SubCategoryId      int    `json:"sub_category_id" db:"sub_category_id"`
	Price              int    `json:"price" db:"price"`
}

type Category struct {
	CategoryId   uint   `gorm:"primary_key;auto_increment" json:"category_id"`
	CategoryName string `json:"category_name" db:"category_name"`
}

type SubCategory struct {
	SubCategoryId   uint   `gorm:"primary_key;auto_increment" json:"sub_category_id"`
	SubCategoryName string `json:"sub_category_name" db:"sub_category_name"`
	CategoryId      uint   `json:"category_id" db:"category_id"`
}

type CreateProductRequest struct {
	StoreId            int    `json:"store_id" db:"store_id"`
	ProductName        string `json:"product_name" db:"product_name"`
	Stock              int    `json:"stock" db:"stock"`
	ProductDescription string `json:"product_description" db:"product_description"`
	CategoryId         int    `json:"category_id" db:"category_id"`
	ProductImage       string `json:"product_image" db:"product_image"`
	SubCategoryId      int    `json:"sub_category_id" db:"sub_category_id"`
	Price              int    `json:"price" db:"price"`
}

type PaginateProductRequest struct {
	Page int `json:"page"`
}

type GetProductRequest struct {
	ProductId string `json:"product_id" db:"product_id"`
}

type GetSubCategoryRequest struct {
	CategoryId uint `json:"category_id" db:"category_id"`
}

type GetProductByCategory struct {
	CategoryId  uint `json:"category_id" db:"category_id"`
	CurrProduct uint `json:"curr_prod_id"`
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
		SubCategoryId:      r.SubCategoryId,
		Price:              r.Price,
	}

	if err := h.db.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product})

}

func (h *Handler) GetProductById(c *gin.Context) {
	var r GetProductRequest

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	product_id := r.ProductId

	prod := Product{}

	if err := h.db.Where("product_id = ?", product_id).First(&prod).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, prod)
}

func (h *Handler) GetAllCategory(c *gin.Context) {
	var cat []Category

	if err := h.db.Find(&cat).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "category not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cat)
}

func (h *Handler) GetAllSubCategoryByCategory(c *gin.Context) {
	var subcat []SubCategory

	var r GetSubCategoryRequest

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	category_id := r.CategoryId

	if err := h.db.Where("category_id = ?", category_id).Find(&subcat).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "subcat not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, subcat)
}

func (h *Handler) GetAllProductByCategory(c *gin.Context) {
	var prods []Product
	var r GetProductByCategory

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	category_id := r.CategoryId
	currProd_id := r.CurrProduct

	if err := h.db.Where("category_id = ?", category_id).Where("product_id != ?", currProd_id).Find(&prods).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "subcat not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, prods)
}

func (h *Handler) GetAllSubCategory(c *gin.Context) {
	var subcat []SubCategory

	if err := h.db.Find(&subcat).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "subcat not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, subcat)
}

func (h *Handler) PaginateProduct(c *gin.Context) {
	var r PaginateProductRequest
	var prods []Product

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	page := r.Page
	pageSize := 2
	offset := (page - 1) * pageSize

	if err := h.db.Offset(offset).Limit(pageSize).Find(&prods).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, prods)

}
