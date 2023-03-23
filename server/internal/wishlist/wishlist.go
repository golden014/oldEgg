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

type WishlistDetail struct {
	WishlistDetailId uint `gorm:"primary_key;auto_increment" json:"wishlist_detail_id"`
	WishlistId       uint `json:"wishlist_id" db:"wishlist_id"`
	UserId           uint `json:"user_id" db:"user_id"`
	ProductId        uint `json:"product_id" db:"product_id"`
	Quantity         uint `json:"quantity" db:"quantity"`
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

type GetWishlistDetailsReq struct {
	WishlistId uint `json:"wishlist_id" db:"wishlist_id"`
}

func (h *Handler) GetWishlistDetails(c *gin.Context) {
	var r GetWishlistDetailsReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	wishlist_details := []WishlistDetail{}

	if err := h.db.Where("wishlist_id = ?", r.WishlistId).Find(&wishlist_details).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, wishlist_details)
}

type AddWishlistDetailReq struct {
	WishlistId uint `json:"wishlist_id" db:"wishlist_id"`
	ProductId  uint `json:"product_id" db:"product_id"`
	Quantity   uint `json:"quantity" db:"quantity"`
	UserId     uint `json:"user_id" db:"user_id"`
}

func (h *Handler) AddWishlistDetail(c *gin.Context) {
	var r AddWishlistDetailReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	wishlist_detail := WishlistDetail{
		WishlistId: r.WishlistId,
		ProductId:  r.ProductId,
		Quantity:   r.Quantity,
		UserId:     r.UserId,
	}

	if err := h.db.Create(&wishlist_detail).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "add wishlist detail success"})
}

type GetWishlistByIdReq struct {
	WishlistId uint `json:"wishlist_id" db:"wishlist_id"`
}

func (h *Handler) GetWishlistById(c *gin.Context) {
	var r GetWishlistByIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	wishlist_id := r.WishlistId

	wishlist := Wishlist{}

	if err := h.db.Where("wishlist_id = ?", wishlist_id).First(&wishlist).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, wishlist)

}

type UpdateWishlistDetailReq struct {
	WishlistDetailId uint `json:"wishlist_detail_id" db:"wishlsit_detail_id"`
	UserId           uint `json:"user_id" db:"user_id"`
	Quantity         uint `json:"quantity" db:"quantity"`
}

func (h *Handler) UpdateWishlistDetail(c *gin.Context) {
	var r UpdateWishlistDetailReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	wishlist_detail_id := r.WishlistDetailId

	wishlistDetail := WishlistDetail{}

	if r.Quantity <= 0 {
		if err := h.db.Where("wishlist_detail_id = ?", r.WishlistDetailId).Where("user_id = ?", r.UserId).Delete(&WishlistDetail{}).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusBadRequest, gin.H{"error": "product not found1"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "success"})
		return
	}

	if err := h.db.Where("wishlist_detail_id = ?", wishlist_detail_id).Where("user_id = ?", r.UserId).First(&wishlistDetail).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	wishlistDetail.Quantity = r.Quantity

	if err := h.db.Save(&wishlistDetail).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "update success"})

}

type DeleteWishlistDetailReq struct {
	WishlistDetailId uint `json:"wishlist_detail_id" db:"wishlsit_detail_id"`
	UserId           uint `json:"user_id" db:"user_id"`
}

func (h *Handler) DeleteWishlistDetail(c *gin.Context) {
	var r DeleteWishlistDetailReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	if err := h.db.Where("wishlist_detail_id = ?", r.WishlistDetailId).Where("user_id = ?", r.UserId).Delete(&WishlistDetail{}).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found1"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "delete success"})
}

type DuplicateWishlistReq struct {
	WishlistId uint `json:"wishlist_id" db:"wishlist_id"`
	UserId     uint `json:"user_id" db:"user_id"`
}

func (h *Handler) DuplicateWishlist(c *gin.Context) {
	var r DuplicateWishlistReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	wishlist := Wishlist{}

	if err := h.db.Where("wishlist_id = ?", r.WishlistId).First(&wishlist).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found1"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//duplicate the wishlist
	duplicated := Wishlist{
		WishlistName: (wishlist.WishlistName + " (copy)"),
		UserId:       r.UserId,
		Status:       wishlist.Status,
	}

	if err := h.db.Create(&duplicated).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//ambil wishlist details dlu
	wishlistDetails := []WishlistDetail{}
	if err := h.db.Where("wishlist_id = ?", r.WishlistId).Find(&wishlistDetails).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found1"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//duplicate details nya
	for i := 0; i < len(wishlistDetails); i++ {
		wishlist_detail := WishlistDetail{
			WishlistId: duplicated.WishlistId,
			ProductId:  wishlistDetails[i].ProductId,
			Quantity:   wishlistDetails[i].Quantity,
			UserId:     r.UserId,
		}

		if err := h.db.Create(&wishlist_detail).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
