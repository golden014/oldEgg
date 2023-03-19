package main

import (
	"log"
	"server/db"
	"server/internal/address"
	"server/internal/ban"
	"server/internal/carousel"
	"server/internal/cart"
	"server/internal/email"
	"server/internal/order"
	"server/internal/product"
	"server/internal/review"
	"server/internal/router"
	"server/internal/store"
	"server/internal/user"
	"server/internal/voucher"
	"server/internal/websocket"
	"server/internal/ws"
)

func main() {
	dbConn, err := db.NewDatabase()

	if err != nil {
		log.Fatalf("couldnt init ", err)
	}

	userRep := user.NewRepository(dbConn)
	userSvc := user.NewService(userRep)
	userHandler := user.NewHandler(userSvc)

	hub := ws.NewHub()
	wsHandler := ws.NewHandler(hub)
	go hub.Run()

	crHandler := carousel.NewHandler(dbConn)
	vcHandler := voucher.NewHandler(dbConn)
	bnHandler := ban.NewHandler(dbConn)
	stHandler := store.NewHandler(dbConn)
	prHandler := product.NewHandler(dbConn)
	wsNewHandler := websocket.NewHandler(dbConn)
	rvHandler := review.NewHandler(dbConn)
	emHandler := email.NewHandler(dbConn)
	ctHandler := cart.NewHandler(dbConn)
	adHandler := address.NewHandler(dbConn)
	orHandler := order.NewHandler(dbConn)

	router.InitRouter(
		userHandler,
		wsHandler,
		crHandler,
		vcHandler,
		bnHandler,
		stHandler,
		prHandler,
		wsNewHandler,
		rvHandler,
		emHandler,
		ctHandler,
		adHandler,
		orHandler,
	)
	// router.Start("localhost:1234")
}
