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
	SellerID            int     `json:"seller_id" db:"selelr_id"`
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
	StoreId     int    `json:"store_id" db:"store_id"`
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

	seller_id := r.SellerID

	user := User{}
	if err := h.db.Where("id = ?", seller_id).Where("role = ?", "Seller").First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "seller not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
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
	}

	if err := h.db.Create(&store).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create store"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": store})

}
