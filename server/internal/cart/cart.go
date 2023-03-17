package cart

import "gorm.io/gorm"

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
