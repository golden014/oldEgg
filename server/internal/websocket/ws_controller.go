package websocket

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
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

type Message struct {
	SenderID    string
	RecipientID string
	Message     string
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
var conns = map[string]*websocket.Conn{}

func (h *Handler) SendingMessage(c *gin.Context) {
	var ReqFrom string
	hdr := http.Header{}
	fmt.Println("connected")
	fmt.Println(hdr)
	for _, sub := range websocket.Subprotocols(c.Request) {
		hdr.Set("Sec-Websocket-Protocol", sub)
		fmt.Println(sub)
		ReqFrom = sub
		fmt.Println(sub)
	}
	ws, err := upgrader.Upgrade(c.Writer, c.Request, hdr)
	if err != nil {
		fmt.Println(err)
	}

	conns[ReqFrom] = ws
	for {
		var req Message
		err = ws.ReadJSON(&req)
		if req.SenderID != "" {
			h.db.Create(&req)
		}

		//ambil sender id
		// lalu tulis
		conns[req.SenderID] = ws
		if con, ok := conns[req.RecipientID]; ok {
			err = con.WriteJSON(&req)
			if err != nil {
				fmt.Println(err)
			}
		}
		if con, ok := conns[req.SenderID]; ok {
			err = con.WriteJSON(&req)
			if err != nil {
				fmt.Println(err)
			}
		}

	}
}
