import { useState } from "react";
import Theme from "./components/theme";
import style from "../styles/style.module.scss"

const SendNewsletters = () => {
    const [message, setMessage] = useState("")


    const sendNewslettersHandler = async() => {
        try {
            const res = await fetch("http://localhost:1234/sendNewsletters", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify({
                    message: message
                }),
            });

            if (res.ok) {
                alert("Send newsletters success!")
                
            } else {
                alert("a problem occurred !")
            }
        } catch (error) {
            alert("a problem occurred !")
        }
        
    }

    return (  
        <Theme>
            <div className={style.input_voucher_container}>
                <textarea placeholder="Input message here" onChange={(e) => setMessage(e.target.value)}/>

                <button onClick={sendNewslettersHandler}>Send</button>
            </div>
        </Theme>
    );
}
 
export default SendNewsletters;