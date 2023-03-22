package follow

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

type Wishlist struct {
	WishlistId   uint   `gorm:"primary_key;auto_increment" json:"wishlist_id"`
	WishlistName string `json:"wishlist_name" db:"wishlist_name"`
	UserId       uint   `json:"user_id" db:"user_id"`
	Status       string `json:"status" db:"status"`
}

type Follow struct {
	FollowId   uint `gorm:"primary_key;auto_increment" json:"follow_id"`
	WishlistId uint `json:"wishlist_id" db:"wishlist_id"`
	UserId     uint `json:"user_id" db:"user_id"`
}

type CreateNewFollowReq struct {
	WishlistId uint `json:"wishlist_id" db:"wishlist_id"`
	UserId     uint `json:"user_id" db:"user_id"`
}

func (h *Handler) CreateNewFollow(c *gin.Context) {
	var r CreateNewFollowReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	follow := Follow{
		WishlistId: r.WishlistId,
		UserId:     r.UserId,
	}

	if err := h.db.Create(&follow).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}