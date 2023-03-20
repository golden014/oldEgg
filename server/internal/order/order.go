package order

import (
	"net/http"
	"strconv"
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

type Order struct {
	OrderId     uint   `gorm:"primary_key;auto_increment" json:"order_id"`
	UserId      uint   `json:"user_id" db:"user_id"`
	StoreId     uint   `json:"store_id" db:"store_id"`
	DateOrdered string `json:"date_ordered" db:"date_ordered"`
	InvoiceCode string `json:"invoice_code" db:"invoice_code"`
	Status      string `json:"status" db:"status"`
}

type OrderDetail struct {
	OrderId   uint `json:"order_id" db:"order_id"`
	ProductId uint `json:"product_id" db:"product_id"`
	Quantity  uint `json:"quantity" db:"quantity"`
}

type Cart struct {
	CartId uint `gorm:"primary_key;auto_increment" json:"cart_id"`
	UserId uint `json:"user_id" db:"user_id"`
	Total  uint `json:"total" db:"total"`
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

type CreateOrderReq struct {
	CartId      uint   `json:"cart_id" db:"cart_id"`
	UserId      uint   `json:"user_id" db:"user_id"`
	DateOrdered string `json:"date_ordered" db:"date_ordered"`
	InvoiceCode string `json:"invoice_code" db:"invoice_code"`
	Payment     string `json:"payment" db:"payment"`
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

func (h *Handler) CreateOrder(c *gin.Context) {
	//mau masukin semua cartProduct dari certain cart id smuanya ke order details

	var r CreateOrderReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	//ambil user
	user := User{}
	if err := h.db.Where("id = ?", r.UserId).First(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//ambil cart
	cart := Cart{}
	if err := h.db.Where("cart_id = ?", r.CartId).Find(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//kalau dibayar dengan oldegg balance, cek balance user
	if r.Payment == "oldEgg" {
		if user.Balance < int(cart.Total) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Your oldEgg balance is not enough to checkout"})
			return
		}
	}

	//ambil smua cart prods dulu
	cartProds := []CartProduct{}
	if err := h.db.Where("cart_id = ?", r.CartId).Find(&cartProds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	prodTemp := Product{}
	if err := h.db.Where("product_id = ?", cartProds[0].ProductId).First(&prodTemp).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//buat order dulu
	order := Order{
		UserId:      r.UserId,
		StoreId:     uint(prodTemp.StoreId),
		DateOrdered: r.DateOrdered,
		InvoiceCode: r.InvoiceCode,
		Status:      "On Process",
	}

	if err := h.db.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//iterate tiap cart prods nya trus buat order detail berdasarkan itu
	for i := 0; i < len(cartProds); i++ {
		orderDetail := OrderDetail{
			OrderId:   order.OrderId,
			ProductId: cartProds[i].ProductId,
			Quantity:  cartProds[i].Quantity,
		}

		if err := h.db.Create(&orderDetail).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		//delete cart prods yg udah dimasukin ke order supaya cart nya kosong
		if err := h.db.Where("cart_id = ?", r.CartId).Where("product_id = ?", cartProds[i].ProductId).Delete(cartProds[i]).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	//kurangin balance
	if r.Payment == "oldEgg" {
		user.Balance -= (int(cart.Total) + 10)

		if err := h.db.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	cart.Total = uint(0)

	if err := h.db.Save(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Success !"})

}

type GetOrderByUserIdReq struct {
	UserId int `json:"user_id" db:"user_id"`
}

func (h *Handler) GetOrderByUserId(c *gin.Context) {
	var r GetOrderByUserIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	orders := []Order{}

	if err := h.db.Where("user_id = ?", r.UserId).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

type GetUserOrderByKeywordReq struct {
	UserId  int    `json:"user_id" db:"user_id"`
	Keyword string `json:"keyword" db:"keyword"`
}

func (h *Handler) GetUserOrderByKeyword(c *gin.Context) {
	var r GetUserOrderByKeywordReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	keyword := r.Keyword
	user_id := r.UserId

	orders := []Order{}

	// if err := h.db.Where("user_id = ?", user_id).Where("order_id LIKE ?", "%"+keyword+"%").Or("invoice_code LIKE ?", "%"+keyword+"%").Find(&orders).Error; err != nil {
	// 	//nnti hapus
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }

	temp, err := strconv.Atoi(keyword)

	if err != nil {

	}

	// if err := h.db.Where("user_id = ?", user_id).Where("order_id = ?", temp).Or("invoice_code LIKE ?", "%"+keyword+"%").Find(&orders).Error; err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }

	if err := h.db.Where("user_id = ? AND order_id = ?", user_id, temp).Or("user_id = ? AND invoice_code LIKE ?", user_id, "%"+keyword+"%").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

type GetUserOrdersByDatesReq struct {
	UserId int `json:"user_id" db:"user_id"`
	Days   int `json:"days"`
}

func (h *Handler) GetUserOrdersByDates(c *gin.Context) {
	var r GetUserOrdersByDatesReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	orders := []Order{}

	//kurangin dengan days yg diminta
	temp := time.Now().AddDate(0, 0, -(r.Days))

	if err := h.db.Where("user_id = ?", r.UserId).Where("date_ordered > ?", temp.Format("1/2/2003")).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

type GetUserOrdersByFilterReq struct {
	UserId int    `json:"user_id" db:"user_id"`
	Filter string `json:"filter"`
}

func (h *Handler) GetUserOrdersByFilter(c *gin.Context) {
	var r GetUserOrdersByFilterReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	orders := []Order{}

	if err := h.db.Where("user_id = ?", r.UserId).Where("status = ?", r.Filter).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

type GetOrderByStoreIdReq struct {
	StoreId int `json:"store_id" db:"store_id"`
}

func (h *Handler) GetOrderByStoreId(c *gin.Context) {
	var r GetOrderByStoreIdReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	orders := []Order{}

	if err := h.db.Where("store_id = ?", r.StoreId).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

type GetStoreOrdersByFilterReq struct {
	StoreId int    `json:"store_id" db:"store_id"`
	Filter  string `json:"filter"`
}

func (h *Handler) GetStoreOrdersByFilter(c *gin.Context) {
	var r GetStoreOrdersByFilterReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	orders := []Order{}

	if err := h.db.Where("store_id = ?", r.StoreId).Where("status = ?", r.Filter).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

type UpdateOrderStatusReq struct {
	OrderId uint `json:"order_id" db:"order_id"`
}

func (h *Handler) UpdateOrderStatus(c *gin.Context) {
	var r UpdateOrderStatusReq

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	order := Order{}
	if err := h.db.Where("order_id = ?", r.OrderId).First(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	order.Status = "Done"

	if err := h.db.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "update success"})
}
