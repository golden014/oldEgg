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
