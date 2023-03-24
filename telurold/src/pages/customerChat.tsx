import { AuthContext } from "modules/authProvider";
import { useEffect, useState, useContext } from "react";
import Space from "./components/space";
import Theme from "./components/theme";

type Message = {
    SenderID: string;
    RecipientID: string;
    Message: string;
};

const CustomerChat: React.FC = () => {
    const [inputMessage, setInputMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const {user} = useContext(AuthContext)
  
    useEffect(() => {
        // if (user) {


            const websocketUrl = 'ws://localhost:1234/ws/sendMessage';
            const senderID = "8";
            const ws = new WebSocket(websocketUrl, senderID);
        
            ws.addEventListener('open', (event) => {
              console.log('Connected to WebSocket server:', event);
            });
        
            ws.addEventListener('message', (event) => {
              console.log('Received message:', event.data);
              setMessages((prevMessages) => [
                ...prevMessages,
                JSON.parse(event.data) as Message,
              ]);
            });
        
            ws.addEventListener('close', (event) => {
              console.log('WebSocket closed:', event);
            });
        
            setSocket(ws);
        
            return () => {
              ws.close();
            };
        // }
    }, []);
  
    const sendMessage = () => {
      if (socket && inputMessage) {
        const message = {
          SenderID: "8",
          RecipientID: "1",
          message: inputMessage,
        };

        socket.send(JSON.stringify(message));
        setInputMessage('');
      }
    };

    

    return (
        <Theme>
            <br />
            <h1 style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                color: "white"
            }}>Customer Chat (Seller)</h1>
            <br /><br />
            <div style={{
                backgroundColor: "#1e1e1e",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}>
            {messages.map((message, index) => (
                <div style={{
                    backgroundColor: "#0e0e0e",
                    color: "white",
                    padding: "13px",
                    borderRadius: "20px"
                }}>
                    <p key={index}>
                    {message.SenderID == "1" ? "User": "Seller"}: {message.Message}
                    </p>
                </div>
            ))}
            <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={{
                height: "5vh",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderStyle: "solid",
                backgroundColor: "#1e1e1e",
                color: "white"
            }}
            />
            <button onClick={sendMessage}
                style={{
                    padding: "10px 15px 10px 15px",
                    backgroundColor: "#8EAFF0",
                    color: "black",
                    borderRadius: "20px",
                    border: "0",
                    cursor: "pointer",
                }}
            >Send</button>
            </div>
            <Space/>
        </Theme>
    )
}

export default CustomerChat;