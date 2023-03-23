package follow

import (
	"fmt"
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

type ViewAllFollowedReq struct {
	UserId uint `json:"user_id" db:"user_id"`
}

func (h *Handler) ViewAllFollowed(c *gin.Context) {
	var r ViewAllFollowedReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	follows := []Follow{}

	if err := h.db.Where("user_id = ?", r.UserId).Find(&follows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	wishlists := []Wishlist{}

	fmt.Println(len(follows))
	for i := 0; i < len(follows); i++ {
		var wishlist Wishlist
		if err := h.db.Where("wishlist_id = ?", follows[i].WishlistId).First(&wishlist).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		wishlists = append(wishlists, wishlist)
	}

	c.JSON(http.StatusOK, wishlists)
}

func (h *Handler) Unfollow(c *gin.Context) {
	var r CreateNewFollowReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	if err := h.db.Where("user_id = ?", r.UserId).Where("wishlist_id = ?", r.WishlistId).Delete(&Follow{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
