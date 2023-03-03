package carousel

import (
	"net/http"

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
