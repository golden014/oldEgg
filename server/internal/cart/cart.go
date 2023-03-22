package cart

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

	if err := h.db.Create(&newProd).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	prod := Product{}
	if err := h.db.Where("product_id = ?", r.ProductId).First(&prod).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	currCart := Cart{}
	if err := h.db.Where("cart_id = ?", r.CartId).First(&currCart).Error; err != nil {
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

type GetCartByUserIdReq struct {
	UserId uint `json:"user_id" db:"user_id"`
}

func (h *Handler) GetCartByUserId(c *gin.Context) {
	var r GetCartByUserIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	user_id := r.UserId

	cart := Cart{}
	if err := h.db.Where("user_id = ?", user_id).First(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cart)
}

type GetCartProductReq struct {
	CartId uint `json:"cart_id" db:"cart_id"`
}

func (h *Handler) GetCartProduct(c *gin.Context) {
	var r GetCartProductReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	cart_id := r.CartId

	cartProds := []CartProduct{}
	if err := h.db.Where("cart_id = ?", cart_id).Find(&cartProds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cartProds)
}

type UpdateCartProductReq struct {
	CartId    uint `json:"cart_id" db:"cart_id"`
	ProductId uint `json:"product_id" db:"product_id"`
	Quantity  uint `json:"quantity" db:"quantity"`
}

func (h *Handler) UpdateCartProduct(c *gin.Context) {
	var r UpdateCartProductReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	// cartProds := CartProduct{}

	if r.Quantity <= 0 {
		if err := h.db.Where("cart_id = ?", r.CartId).Where("product_id = ?", r.ProductId).Delete(&CartProduct{}).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	if err := h.db.Table("cart_products").Where("cart_id = ?", r.CartId).Where("product_id = ?", r.ProductId).Update("quantity", r.Quantity).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// cartProds.Quantity = r.Quantity

	// if err := h.db.Save(&cartProds).Error; err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }

	//ambil smua cart products, ambil total price * quantity, terus totalin
	cartProds := []CartProduct{}
	if err := h.db.Where("cart_id = ?", r.CartId).Find(&cartProds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newTotal := 0

	for i := 0; i < len(cartProds); i++ {
		tempProd := Product{}
		if err := h.db.Where("product_id = ?", cartProds[i].ProductId).First(&tempProd).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		newTotal += (int(cartProds[i].Quantity) * tempProd.Price)
	}

	cart := Cart{}
	if err := h.db.Where("cart_id = ?", r.CartId).Find(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	cart.Total = uint(newTotal)

	if err := h.db.Save(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddAllItemToCartReq struct {
	WishlistId uint `json:"wishlist_id" db:"wishlist_id"`
	UserId     uint `json:"user_id" db:"user_id"`
}

func (h *Handler) AddAllItemToCart(c *gin.Context) {
	var r AddAllItemToCartReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	cart := Cart{}
	if err := h.db.Where("user_id = ?", r.UserId).First(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	wishlistDetails := []WishlistDetail{}

	if err := h.db.Where("wishlist_id = ?", r.WishlistId).Find(&wishlistDetails).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	for i := 0; i < len(wishlistDetails); i++ {
		newProd := CartProduct{
			ProductId: wishlistDetails[i].ProductId,
			CartId:    cart.CartId,
			Quantity:  wishlistDetails[i].Quantity,
		}

		if err := h.db.Create(&newProd).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

}
