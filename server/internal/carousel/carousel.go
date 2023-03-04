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

type RemoveCarouselReq struct {
	ID uint `json:"ID" db:"ID"`
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
