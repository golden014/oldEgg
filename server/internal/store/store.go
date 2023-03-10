package store

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Store struct {
	StoreId             uint    `gorm:"primary_key;auto_increment" json:"store_id"`
	StoreName           string  `json:"store_name" db:"store_name"`
	StorePassword       string  `json:"store_passowrd" db:"store_password"`
	StoreBanner         string  `json:"store_banner" db:"store_banner"`
	StoreStatus         string  `json:"store_status" db:"store_status"`
	StoreEmail          string  `json:"store_email" db:"store_email"`
	ProductAccuracy     float32 `json:"product_accuracy" db:"product_accuracy"`
	DeliveryStatistic   float32 `json:"delivery_statistic" db:"delivery_statistic"`
	ServiceSatisfaction float32 `json:"service_satisfaction" db:"service_satisfaction"`
	NumberOfSales       int     `json:"number_of_sales" db:"number_of_sales"`
	SellerID            int     `json:"seller_id" db:"seller_id"`
	StoreDescription    string  `json:"store_description" db:"store_description"`
}

type Category struct {
	CategoryId   uint   `gorm:"primary_key;auto_increment" json:"category_id"`
	CategoryName string `json:"category_name" db:"category_name"`
}

type CreateStoreReq struct {
	StoreName           string  `json:"store_name" db:"store_name"`
	StorePassword       string  `json:"store_password" db:"store_password"`
	StoreBanner         string  `json:"store_banner" db:"store_banner"`
	StoreStatus         string  `json:"store_status" db:"store_status"`
	StoreEmail          string  `json:"store_email" db:"store_email"`
	ProductAccuracy     float32 `json:"product_accuracy" db:"product_accuracy"`
	DeliveryStatistic   float32 `json:"delivery_statistic" db:"delivery_statistic"`
	ServiceSatisfaction float32 `json:"service_satisfaction" db:"service_satisfaction"`
	NumberOfSales       int     `json:"number_of_sales" db:"number_of_sales"`
	SellerID            int     `json:"seller_id" db:"seller_id"`
}

type User struct {
	ID          int64  `json:"id" db:"id"`
	FirstName   string `json:"firstname" db:"firstname"`
	LastName    string `json:"lastname" db:"lastname"`
	Email       string `json:"email" db:"email"`
	MobilePhone string `json:"mobilephone" db:"mobilephone"`
	Password    string `json:"password" db:"password"`
	IsSubscribe string `json:"issubscribe" db:"issubscribe"`
	Role        string `json:"role" db:"role"`
	Status      string `json:"status" db:"status"`
	Balance     int    `json:"balance" db:"balance"`
}

type GetStoreReq struct {
	SellerID string `json:"seller_id" db:"seller_id"`
}

type GetStoreByIdReq struct {
	StoreId int `json:"store_id" db:"store_id"`
}

type UpdateStoreReq struct {
	Column       string `json:"column"`
	NewAttribute string `json:"new_attribute"`
	StoreID      string `json:"store_id"`
}

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{
		db: db,
	}
}

func (h *Handler) AddStore(c *gin.Context) {
	var r CreateStoreReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	// seller_id := r.SellerID

	// user := User{}
	// if err := h.db.Where("id = ?", seller_id).Where("role = ?", "Seller").First(&user).Error; err != nil {
	// 	if errors.Is(err, gorm.ErrRecordNotFound) {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "seller not found"})
	// 		return
	// 	}
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }

	// validateSeller(seller_id)
	store := Store{
		StoreName:         r.StoreName,
		StorePassword:     r.StorePassword,
		StoreBanner:       r.StoreBanner,
		StoreStatus:       r.StoreStatus,
		StoreEmail:        r.StoreEmail,
		ProductAccuracy:   r.ProductAccuracy,
		DeliveryStatistic: r.DeliveryStatistic,
		NumberOfSales:     r.NumberOfSales,
		SellerID:          r.SellerID,
	}

	if err := h.db.Create(&store).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create store"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": store})

}

// func (h *Handler) GetAllUsers(c *gin.Context) {
// 	users, err := h.Service.GetAllUsers(c.Request.Context())
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	} else {
// 		c.JSON(http.StatusOK, users)
// 	}
// }

// get all category in store
func (h *Handler) GetCategoryInStore(c *gin.Context) {

}

func (h *Handler) GetAllStores(c *gin.Context) {
	//buat nampung
	stores := []Store{}

	if err := h.db.Find(&stores).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stores)
}

func (h *Handler) GetStoreBySellerID(c *gin.Context) {

	var r GetStoreReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	seller_id := r.SellerID

	store := Store{}

	if err := h.db.Where("seller_id = ?", seller_id).First(&store).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "store not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, store)
}

func (h *Handler) GetStoreByID(c *gin.Context) {

	var r GetStoreByIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	store_id := r.StoreId

	store := Store{}

	if err := h.db.Where("store_id = ?", store_id).First(&store).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "store not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, store)
}

func (h *Handler) UpdateStoreInfo(c *gin.Context) {
	var r UpdateStoreReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	//tampung store dengan id x
	store := Store{}

	if err := h.db.Where("store_id = ?", r.StoreID).First(&store).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "store not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	switch r.Column {
	case "store_name":
		store.StoreName = r.NewAttribute
	case "store_password":
		store.StorePassword = r.NewAttribute
	case "store_email":
		store.StoreEmail = r.NewAttribute
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid column"})
		return
	}

	if err := h.db.Save(&store).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update store"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "okeoce aman mantap"})

}
