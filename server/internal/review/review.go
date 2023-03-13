package review

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Review struct {
	ReviewId          uint   `gorm:"primary_key;auto_increment" json:"review_id"`
	ProductId         int    `json:"product_id" db:"product_id"`
	HelpfulCount      int    `json:"helpful_count" db:"helpful_count"`
	UnhelpfulCount    int    `json:"unhelpful_count" db:"unhelpful_count"`
	ReviewTime        string `json:"review_time" db:"review_time"`
	Rating            int    `json:"rating" db:"rating"`
	ReviewDescription string `json:"review_description" db:"review_description"`
	StoreId           int    `json:"store_id" db:"store_id"`
	UserId            int    `json:"user_id" db:"user_id"`
	ReviewTitle       string `json:"review_title" db:"review_title"`
}

type GetReviewByProductIdReq struct {
	ProductId int `json:"product_id" db:"product_id"`
}

type GetReviewByUserIdReq struct {
	UserId int `json:"user_id" db:"user_id"`
}

type UpdateCountsProductReq struct {
	ProductId  int    `json:"product_id" db:"product_id"`
	CountType  string `json:"count_type"`
	UpdateType string `json:"update_type"`
}

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{
		db: db,
	}
}

func (h *Handler) GetReviewByProductId(c *gin.Context) {
	var r GetReviewByProductIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	product_id := r.ProductId

	reviews := []Review{}

	if err := h.db.Where("product_id = ?", product_id).Find(&reviews).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, reviews)

}

func (h *Handler) UpdateCountsProduct(c *gin.Context) {
	var r UpdateCountsProductReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	product_id := r.ProductId
	count_type := r.CountType
	update_type := r.UpdateType

	review := Review{}

	if err := h.db.Where("product_id = ?", product_id).First(&review).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	switch count_type {
	case "helpful":
		if update_type == "add" {
			review.HelpfulCount = review.HelpfulCount + 1
		} else {
			review.HelpfulCount = review.HelpfulCount - 1
		}
		break
	case "unhelpful":
		if update_type == "add" {
			review.UnhelpfulCount = review.UnhelpfulCount + 1
		} else {
			review.UnhelpfulCount = review.UnhelpfulCount - 1
		}
		break
	}

	if err := h.db.Save(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "update " + count_type + " success"})

}
