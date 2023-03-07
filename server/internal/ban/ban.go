package ban

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

type Req struct {
	UserID int `json:"user_id"`
}

func (h *Handler) BanUser(c *gin.Context) {
	var r Req

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	// user_id, err := strconv.Atoi(r.UserID)
	// if err != nil {

	// }

	user_id := r.UserID

	user := User{}
	if err := h.db.Where("id = ?", user_id).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user.Status = "Banned"

	//save database
	if err := h.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "banned"})
}

func (h *Handler) UnbanUser(c *gin.Context) {
	var r Req

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	user_id := r.UserID

	user := User{}
	if err := h.db.Where("id = ?", user_id).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user.Status = "Active"

	//save database
	if err := h.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "unbanned"})
}

func (h *Handler) BanStore(c *gin.Context) {
	var r Req

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	// user_id, err := strconv.Atoi(r.UserID)
	// if err != nil {

	// }

	store_id := r.UserID

	store := Store{}
	if err := h.db.Where("store_id = ?", store_id).First(&store).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "store not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	store.StoreStatus = "Banned"

	//save database
	if err := h.db.Save(&store).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "banned"})
}

func (h *Handler) UnbanStore(c *gin.Context) {
	var r Req

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	// user_id, err := strconv.Atoi(r.UserID)
	// if err != nil {

	// }

	store_id := r.UserID

	store := Store{}
	if err := h.db.Where("store_id = ?", store_id).First(&store).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "store not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	store.StoreStatus = "Active"

	//save database
	if err := h.db.Save(&store).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "banned"})
}
