package email

import (
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"net/smtp"
	"time"

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

type SendMessageReq struct {
	Message string   `json:"message"`
	Emails  []string `json:"emails"`
}

type OneTimeCode struct {
	gorm.Model
	Email string `json:"email" db:"email"`
	Code  string `json:"code" db:"code"`
}

type OneTimeCodeReq struct {
	Email string `json:"email" db:"email"`
}

type ValidateCodeReq struct {
	Email string `json:"email" db:"email"`
	Code  string `json:"code" db:"code"`
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

func (h *Handler) CreateCode(c *gin.Context) {
	var r OneTimeCodeReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	// Generate a 4-digit random code
	rand.Seed(time.Now().UnixNano())
	code := fmt.Sprintf("%04d", rand.Intn(10000))

	// Create a new OneTimeCode object
	codeObj := OneTimeCode{
		Email: r.Email,
		Code:  code,
	}

	// Insert the new row into the one_time_codes table
	if err := h.db.Create(&codeObj).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (h *Handler) ValidateCode(c *gin.Context) {
	var r ValidateCodeReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	oneTimeCode := OneTimeCode{}

	if err := h.db.Where("email = ?", r.Email).Where("code = ?", r.Code).First(&oneTimeCode).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "wrong code"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//delete the one time code from the table
	if err := h.db.Unscoped().Delete(&oneTimeCode).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "succes"})

}
