package wishlistreview

import (
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

type WishlistReview struct {
	WishlistReviewId uint `gorm:"primary_key;auto_increment" json:"wishlist_review_id"`
	WishlistId       uint `json:"wishlist_id" db:"wishlist_id"`
	Rating           int  `json:"rating" db:"rating"`
}

func (h *Handler) CreateWishlistReview(c *gin.Context) {

}
