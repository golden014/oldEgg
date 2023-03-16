package router

import (
	"server/internal/ban"
	"server/internal/carousel"
	"server/internal/email"
	"server/internal/product"
	"server/internal/review"
	"server/internal/store"
	"server/internal/user"
	"server/internal/voucher"
	"server/internal/websocket"
	"server/internal/ws"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func InitRouter(userHandler *user.Handler,
	wsHandler *ws.Handler,
	crHandler *carousel.Handler,
	vcHandler *voucher.Handler,
	bnHandler *ban.Handler,
	stHandler *store.Handler,
	prHandler *product.Handler,
	wsNewHandler *websocket.Handler,
	rvHandler *review.Handler,
	emHandler *email.Handler,
) {

	r = gin.Default()

	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}

	r.Use(cors.New(config))

	r.POST("/sendEmails", emHandler.SendMessage)
	r.POST("/createCode", emHandler.CreateCode)
	r.POST("/validateCode", emHandler.ValidateCode)

	r.POST("/getReviewByProductId", rvHandler.GetReviewByProductId)
	r.POST("/getReviewByStoreId", rvHandler.GetReviewByStoreId)
	r.POST("/updateCountsProduct", rvHandler.UpdateCountsProduct)
	r.POST("/getReviewStatsByStoreId", rvHandler.GetReviewStatsByStoreId)

	r.POST("/addProduct", prHandler.AddProduct)
	r.POST("/getProductById", prHandler.GetProductById)
	r.GET("/getAllCategory", prHandler.GetAllCategory)
	r.GET("/getAllSubCategory", prHandler.GetAllSubCategory)
	r.POST("/getAllProductByCategory", prHandler.GetAllProductByCategory)
	r.POST("/paginateProduct", prHandler.PaginateProduct)
	r.POST("/paginateProductByStoreId", prHandler.PaginateProductByStoreId)
	r.POST("/getProductCountById", prHandler.GetProductCounts)
	r.POST("/getRecommendedProducts", prHandler.GetRecommendedProduct)
	r.POST("/updateProductById", prHandler.UpdateProductById)
	r.GET("/api/products", prHandler.GetProducts)

	r.POST("/addNewStore", stHandler.AddStore)
	r.GET("/getAllStores", stHandler.GetAllStores)
	r.POST("/getStoreBySeller", stHandler.GetStoreBySellerID)
	r.POST("/updateStoreInfo", stHandler.UpdateStoreInfo)
	r.POST("/getStoreById", stHandler.GetStoreByID)
	r.POST("/getCategoryInStore", stHandler.GetCategoryInStore)
	r.GET("/getTopStore", stHandler.GetTopStore)

	r.POST("/banUser", bnHandler.BanUser)
	r.POST("/unbanUser", bnHandler.UnbanUser)
	r.POST("/banStore", bnHandler.BanStore)
	r.POST("/unbanStore", bnHandler.UnbanStore)

	r.POST("/addVoucher", vcHandler.AddVoucher)
	r.POST("/validateVoucher", vcHandler.ValidateVoucher)

	r.POST("/addCarousel", crHandler.AddCarousel)
	r.GET("/getCarousel", crHandler.GetCarousels)
	r.POST("/removeCarousel", crHandler.RemoveCarousel)

	r.POST("/signup", userHandler.CreateUser)
	r.POST("/login", userHandler.Login)
	r.GET("/logout", userHandler.Logout)
	r.GET("/getAllUsers", userHandler.GetAllUsers)
	r.POST("/getUserById", userHandler.GetUserById)

	r.POST("/ws/createRoom", wsHandler.CreateRoom)
	r.GET("/ws/joinRoom/:roomId", wsHandler.JoinRoom)

	r.GET("/ws/getRooms", wsHandler.GetRooms)
	r.GET("/ws/getClients/:roomId", wsHandler.GetClients)

	r.GET("/ws/sendMessage", wsNewHandler.SendingMessage)

	r.Run("localhost:1234")
}

// func Start(addr string) error {
// 	return r.Run(addr)
// }
