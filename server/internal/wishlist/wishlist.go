package wishlist

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

type Wishlist struct {
	WishlistId   uint   `gorm:"primary_key;auto_increment" json:"wishlist_id"`
	WishlistName string `json:"wishlist_name" db:"wishlist_name"`
	UserId       uint   `json:"user_id" db:"user_id"`
	Status       string `json:"status" db:"status"`
}

type CreateNewWishlistReq struct {
	WishlistName string `json:"wishlist_name" db:"wishlist_name"`
	UserId       uint   `json:"user_id" db:"user_id"`
	Status       string `json:"status" db:"status"`
}

func (h *Handler) CreateNewWishlist(c *gin.Context) {
	var r CreateNewWishlistReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	//buat wish list baru
	wishlist := Wishlist{
		WishlistName: r.WishlistName,
		UserId:       r.UserId,
		Status:       r.Status,
	}

	if err := h.db.Create(&wishlist).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "add wishlist success"})
}

type GetWishlistByUserIdReq struct {
	UserId uint `json:"user_id" db:"user_id"`
}

func (h *Handler) GetWishlistByUserId(c *gin.Context) {
	var r GetWishlistByUserIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	user_id := r.UserId

	wishlists := []Wishlist{}

	if err := h.db.Where("user_id = ?", user_id).Find(&wishlists).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, wishlists)

}

type UpdateWishlistByIdReq struct {
	WishlistId uint   `json:"wishlist_id" db:"wishlist_id"`
	UserId     int    `json:"user_id" db:"user_id"`
	Column     string `json:"column"`
	NewValue   string `json:"new_value"`
}

func (h *Handler) UpdateWishlistById(c *gin.Context) {
	var r UpdateWishlistByIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	if err := h.db.Table("wishlists").Where("wishlist_id = ?", r.WishlistId).Where("user_id = ?", r.UserId).Update(r.Column, r.NewValue).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type PaginateWishlistReq struct {
	Page     int `json:"page"`
	PageSize int `json:"page_size"`
}

func (h *Handler) PaginateWishlist(c *gin.Context) {
	var r PaginateWishlistReq
	var wishlists []Wishlist

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	page := r.Page
	pageSize := r.PageSize
	offset := (page - 1) * pageSize

	if err := h.db.Where("status = ?", "public").Offset(offset).Limit(pageSize).Find(&wishlists).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, wishlists)

}
