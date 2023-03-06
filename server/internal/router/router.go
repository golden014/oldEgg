package router

import (
	"server/internal/carousel"
	"server/internal/user"
	"server/internal/voucher"
	"server/internal/ws"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func InitRouter(userHandler *user.Handler, wsHandler *ws.Handler, crHandler *carousel.Handler, vcHandler *voucher.Handler) {
	r = gin.Default()

	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}

	r.Use(cors.New(config))

	r.POST("/addVoucher", vcHandler.AddVoucher)
	r.POST("/validateVoucher", vcHandler.ValidateVoucher)

	r.POST("/addCarousel", crHandler.AddCarousel)
	r.GET("/getCarousel", crHandler.GetCarousels)
	r.POST("/removeCarousel", crHandler.RemoveCarousel)

	r.POST("/signup", userHandler.CreateUser)
	r.POST("/login", userHandler.Login)
	r.GET("/logout", userHandler.Logout)

	r.POST("/ws/createRoom", wsHandler.CreateRoom)
	r.GET("/ws/joinRoom/:roomId", wsHandler.JoinRoom)

	r.GET("/ws/getRooms", wsHandler.GetRooms)
	r.GET("/ws/getClients/:roomId", wsHandler.GetClients)

	r.Run("localhost:1234")
}

// func Start(addr string) error {
// 	return r.Run(addr)
// }
