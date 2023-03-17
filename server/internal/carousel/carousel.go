package carousel

import (
	"net/http"
	"net/smtp"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Carousel struct {
	ID  uint   `gorm:"primary_key;auto_increment" json:"ID"`
	URL string `json:"url" db:"url"`
}

type AddCarouselReq struct {
	URL string `json:"url" db:"url"`
}

type RemoveCarouselReq struct {
	ID uint `json:"ID" db:"ID"`
}

type SavedQuery struct {
	UserId int    `json:"user_id" db:"user_id"`
	Query  string `json:"query" db:"query"`
}

type AddSavedQueryReq struct {
	UserId int    `json:"user_id" db:"user_id"`
	Query  string `json:"query" db:"query"`
}

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{
		db: db,
	}
}

func (h *Handler) AddCarousel(c *gin.Context) {

	var r AddCarouselReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	carousel := Carousel{
		URL: r.URL,
	}

	if err := h.db.Create(&carousel).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create carousel item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": carousel})

}

func (h *Handler) AddSavedQuery(c *gin.Context) {
	var r AddSavedQueryReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	new := SavedQuery{
		UserId: r.UserId,
		Query:  r.Query,
	}

	var count int64
	if err := h.db.Model(&SavedQuery{}).Where("user_id = ?", r.UserId).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if count >= 10 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user already has 10 saved queries"})
		return
	}

	if err := h.db.Create(&new).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "mantep"})

}

func (h *Handler) GetCarousels(c *gin.Context) {
	var carousels []Carousel

	if err := h.db.Find(&carousels).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve carousel items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": carousels})
}

func (h *Handler) RemoveCarousel(c *gin.Context) {
	var r RemoveCarouselReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	var ID = r.ID

	if err := h.db.Delete(&Carousel{}, ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete carousel item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Carousel item deleted successfully"})

}

type SendMessageReq struct {
	Message string   `json:"message"`
	Emails  []string `json:"emails"`
}

// qmrlhcyexmamkfkl
func (h *Handler) SendMessage(c *gin.Context) {

	var r SendMessageReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	broadcaster := smtp.PlainAuth(
		"",
		"josuagoldendummy@gmail.com",
		"qmrlhcyexmamkfkl",
		"smtp.gmail.com")
	err := smtp.SendMail("smtp.gmail.com:587", broadcaster, "josuagoldendummy@gmail.com", r.Emails, []byte(r.Message))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"eror": err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

//------------------------------------------------------------------------random--------------------------------------------]

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

type PaginateReq struct {
	Page int `json:"page"`
}

func (h *Handler) PaginateUser(c *gin.Context) {
	var r PaginateReq
	var users []User

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	page := r.Page
	pageSize := 4
	offset := (page - 1) * pageSize

	if err := h.db.Offset(offset).Limit(pageSize).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)

}

func (h *Handler) PaginateStore(c *gin.Context) {
	var r PaginateReq
	var stores []Store

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	page := r.Page
	pageSize := 2
	offset := (page - 1) * pageSize

	if err := h.db.Offset(offset).Limit(pageSize).Find(&stores).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stores)

}

// misalnya filter yg ke banned
// column: status
// columnValue: "banned"
type PaginateFilteredReq struct {
	Page        int    `json:"page"`
	Column      string `json:"column"`
	ColumnValue string `json:"column_value"`
}

func (h *Handler) PaginateStoreFiltered(c *gin.Context) {
	var r PaginateFilteredReq
	var stores []Store

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	page := r.Page
	pageSize := 2
	offset := (page - 1) * pageSize

	if err := h.db.Where(r.Column+" = ?", r.ColumnValue).Offset(offset).Limit(pageSize).Find(&stores).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stores)

}
