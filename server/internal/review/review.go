package review

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Review struct {
	ReviewId            uint   `gorm:"primary_key;auto_increment" json:"review_id"`
	ProductId           int    `json:"product_id" db:"product_id"`
	HelpfulCount        int    `json:"helpful_count" db:"helpful_count"`
	UnhelpfulCount      int    `json:"unhelpful_count" db:"unhelpful_count"`
	ReviewTime          string `json:"review_time" db:"review_time"`
	Rating              int    `json:"rating" db:"rating"`
	ReviewDescription   string `json:"review_description" db:"review_description"`
	StoreId             int    `json:"store_id" db:"store_id"`
	UserId              int    `json:"user_id" db:"user_id"`
	ReviewTitle         string `json:"review_title" db:"review_title"`
	OnTimeDelivery      string `json:"on_time_delivery" db:"on_time_delivery"`
	ProductAccuracy     string `json:"product_accuracy" db:"product_accuracy"`
	ServiceSatisfaction string `json:"service_satisfaction" db:"service_satisfaction"`
}

type GetReviewByProductIdReq struct {
	ProductId int `json:"product_id" db:"product_id"`
}

type GetReviewByStoreIdReq struct {
	StoreId int `json:"store_id" db:"store_id"`
}

type GetReviewStatsByStoreIdReq struct {
	StoreId int `json:"store_id" db:"store_id"`
}

type GetReviewStatsByStoreIdRes struct {
	FiveStar            int64   `json:"five_star"`
	FourStar            int64   `json:"four_star"`
	ThreeStar           int64   `json:"three_star"`
	TwoStar             int64   `json:"two_star"`
	OneStar             int64   `json:"one_star"`
	TotalReview         int64   `json:"total_review"`
	OnTimeDelivery      float64 `json:"on_time_delivery"`
	ProductAccuracy     float64 `json:"product_accuracy"`
	ServiceSatisfaction float64 `json:"service_satisfaction"`
}

type GetReviewByUserIdReq struct {
	UserId int `json:"user_id" db:"user_id"`
}

type UpdateCountsProductReq struct {
	ProductId  int    `json:"product_id" db:"product_id"`
	CountType  string `json:"count_type"`
	UpdateType string `json:"update_type"`
	ReviewId   int    `json:"review_id" db:"review_id"`
}

type Product struct {
	ProductId          uint   `gorm:"primary_key;auto_increment" json:"product_id"`
	StoreId            int    `json:"store_id" db:"store_id"`
	ProductName        string `json:"product_name" db:"product_name"`
	Stock              int    `json:"stock" db:"stock"`
	ProductDescription string `json:"product_description" db:"product_description"`
	CategoryId         int    `json:"category_id" db:"category_id"`
	ProductImage       string `json:"product_image" db:"product_image"`
	SubCategoryId      int    `json:"sub_category_id" db:"sub_category_id"`
	Price              int    `json:"price" db:"price"`
}

type Handler struct {
	db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{
		db: db,
	}
}

func (h *Handler) GetReviewByUserId(c *gin.Context) {
	var r GetReviewByUserIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	user_id := r.UserId

	reviews := []Review{}

	if err := h.db.Where("user_id = ?", user_id).Find(&reviews).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, reviews)

}

func (h *Handler) GetReviewByProductId(c *gin.Context) {
	var r GetReviewByProductIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	product_id := r.ProductId

	reviews := []Review{}

	if err := h.db.Where("product_id = ?", product_id).Find(&reviews).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, reviews)

}

func (h *Handler) GetReviewByStoreId(c *gin.Context) {
	var r GetReviewByStoreIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	store_id := r.StoreId

	reviews := []Review{}

	if err := h.db.Where("store_id = ?", store_id).Find(&reviews).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, reviews)

}

func (h *Handler) UpdateCountsProduct(c *gin.Context) {
	var r UpdateCountsProductReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	product_id := r.ProductId
	count_type := r.CountType
	update_type := r.UpdateType
	review_id := r.ReviewId

	review := Review{}

	if err := h.db.Where("review_id = ?", review_id).Where("product_id = ?", product_id).First(&review).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	switch count_type {
	case "helpful":
		if update_type == "add" {
			review.HelpfulCount = review.HelpfulCount + 1
		} else {
			review.HelpfulCount = review.HelpfulCount - 1
		}
		break
	default:
		if update_type == "add" {
			review.UnhelpfulCount = review.UnhelpfulCount + 1
		} else {
			review.UnhelpfulCount = review.UnhelpfulCount - 1
		}
		break
	}

	if err := h.db.Save(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "update " + count_type + " success"})

}

func (h *Handler) GetReviewStatsByStoreId(c *gin.Context) {
	var r GetReviewStatsByStoreIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	// filter := r.Filter
	store_id := r.StoreId

	var five_star int64
	var four_star int64
	var three_star int64
	var two_star int64
	var one_star int64
	var on_time_delivery int64
	var product_accuracy int64
	var service_satisfaction int64
	var total_reviews int64

	var on_time_delivery_percent float64
	var product_accuracy_percent float64
	var service_satisfaction_percent float64

	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Count(&total_reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 5).Count(&five_star).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 4).Count(&four_star).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 3).Count(&three_star).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 2).Count(&two_star).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 1).Count(&one_star).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 1).Count(&one_star).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("on_time_delivery = ?", "yes").Count(&on_time_delivery).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("product_accuracy = ?", "yes").Count(&product_accuracy).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("service_satisfaction = ?", "yes").Count(&service_satisfaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	on_time_delivery_percent = float64(on_time_delivery) / float64(total_reviews) * 100
	product_accuracy_percent = float64(product_accuracy) / float64(total_reviews) * 100
	service_satisfaction_percent = float64(service_satisfaction) / float64(total_reviews) * 100

	res := &GetReviewStatsByStoreIdRes{
		FiveStar:            five_star,
		FourStar:            four_star,
		ThreeStar:           three_star,
		TwoStar:             two_star,
		OneStar:             one_star,
		OnTimeDelivery:      on_time_delivery_percent,
		ProductAccuracy:     product_accuracy_percent,
		ServiceSatisfaction: service_satisfaction_percent,
		TotalReview:         total_reviews,
	}

	c.JSON(http.StatusOK, res)
}

type GetReviewByIdReq struct {
	ReviewId uint `json:"review_id" db:"review_id"`
}

func (h *Handler) GetReviewById(c *gin.Context) {
	var r GetReviewByIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	review := Review{}

	if err := h.db.Where("review_id = ?", r.ReviewId).First(&review).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, review)

}

type UpdateReviewByUserIdReq struct {
	ReviewId uint   `json:"review_id" db:"review_id"`
	UserId   int    `json:"user_id" db:"user_id"`
	Column   string `json:"column"`
	NewValue string `json:"new_value"`
}

func (h *Handler) UpdateReviewByUserId(c *gin.Context) {
	var r UpdateReviewByUserIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	if err := h.db.Table("reviews").Where("review_id = ?", r.ReviewId).Where("user_id = ?", r.UserId).Update(r.Column, r.NewValue).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type DeleteReviewReq struct {
	ReviewId uint `json:"review_id" db:"review_id"`
	UserId   uint `json:"user_id" db:"user_id"`
}

func (h *Handler) DeleteReview(c *gin.Context) {
	var r DeleteReviewReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	review_id := r.ReviewId
	user_id := r.UserId

	review := Review{}

	if err := h.db.Where("review_id = ?", review_id).First(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if review.UserId != int(user_id) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user didnt matched !"})
		return
	}

	if err := h.db.Delete(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})

}

//average reviews (totalSum reviews / total count reviews)
//number reviews (total count review)

//number of reviews by rating ->
// ambil semua reviews berdasrakan rating
// product_id, rating

type GetReview struct {
	ProductId uint `json:"product_id" db:"product_id"`
}

// func (h *Handler) GetAverageReviews(c *gin.Context) {
// 	var r GetAverageReviewsReq

// 	if err := c.ShouldBindJSON(&r); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 	}

// }

// type GetReviewStatsByProductIdReq struct {
// 	GetReviewByProductIdReq
// }

// func (h *Handler) GetReviewStatsByProductId(c *gin.Context) {
// 	var r GetReviewStatsByStoreIdReq

// 	if err := c.ShouldBindJSON(&r); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 	}
// 	// filter := r.Filter
// 	store_id := r.StoreId

// 	var five_star int64
// 	var four_star int64
// 	var three_star int64
// 	var two_star int64
// 	var one_star int64
// 	var on_time_delivery int64
// 	var product_accuracy int64
// 	var service_satisfaction int64
// 	var total_reviews int64

// 	var on_time_delivery_percent float64
// 	var product_accuracy_percent float64
// 	var service_satisfaction_percent float64

// 	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Count(&total_reviews).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 5).Count(&five_star).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 4).Count(&four_star).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 3).Count(&three_star).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 2).Count(&two_star).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 1).Count(&one_star).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("rating = ?", 1).Count(&one_star).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("on_time_delivery = ?", "yes").Count(&on_time_delivery).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("product_accuracy = ?", "yes").Count(&product_accuracy).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.db.Model(Review{}).Where("store_id = ?", store_id).Where("service_satisfaction = ?", "yes").Count(&service_satisfaction).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	on_time_delivery_percent = float64(on_time_delivery) / float64(total_reviews) * 100
// 	product_accuracy_percent = float64(product_accuracy) / float64(total_reviews) * 100
// 	service_satisfaction_percent = float64(service_satisfaction) / float64(total_reviews) * 100

// 	res := &GetReviewStatsByStoreIdRes{
// 		FiveStar:            five_star,
// 		FourStar:            four_star,
// 		ThreeStar:           three_star,
// 		TwoStar:             two_star,
// 		OneStar:             one_star,
// 		OnTimeDelivery:      on_time_delivery_percent,
// 		ProductAccuracy:     product_accuracy_percent,
// 		ServiceSatisfaction: service_satisfaction_percent,
// 		TotalReview:         total_reviews,
// 	}

// 	c.JSON(http.StatusOK, res)
// }

type GetReviewByProductIdStatRes struct {
	AverageRating int `json:"average_rating"`
	TotalReviews  int `json:"total_reviews"`
}

func (h *Handler) GetReviewByProductIdStat(c *gin.Context) {
	var r GetReviewByProductIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	product_id := r.ProductId

	reviews := []Review{}

	if err := h.db.Where("product_id = ?", product_id).Find(&reviews).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//average reviews (totalSum reviews / total count reviews)
	//number reviews (total count review)

	//number of reviews by rating ->
	// ambil semua reviews berdasrakan rating
	// product_id, rating

	//total review
	countReview := len(reviews)

	temp := 0

	for i := 0; i < countReview; i++ {
		temp = temp + reviews[i].Rating
	}

	averageRating := temp / countReview

	res := GetReviewByProductIdStatRes{
		AverageRating: averageRating,
		TotalReviews:  countReview,
	}

	c.JSON(http.StatusOK, res)

}
