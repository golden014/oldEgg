import Theme from "./components/theme";
import { useState } from "react"
import style from "../styles/style.module.scss"

const InputVoucher = () => {

    const [voucherCode, setVoucherCode] = useState("")

    const redeemHandler = async () => {
        //send data ke backend dan validasi code valid

        var userInfoObject
        const userInfoString = localStorage.getItem("user_info");
        if (userInfoString) {
            userInfoObject = JSON.parse(userInfoString);
        }
        try {
            const res = await fetch("http://localhost:1234/validateVoucher", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify({
                    voucher_code: voucherCode,
                    user_id: userInfoObject.id,
                }),
            });

            if (res.ok) {
                
                alert("Success, check your balance !")
                console.log(res);
                
            } else {
                alert("Invalid code/expired !")
            }
        } catch (error) {
            alert("Invalid code/expired !")
        }
    }

    return (  
        <Theme>
            <div className={style.input_voucher_container}>
                <input type="text" placeholder="Input Voucher Code !" onChange={(e) => setVoucherCode(e.target.value)}/>

                <button onClick={redeemHandler}>Redeem</button>
            </div>
            
        </Theme>
    );
}
 
export default InputVoucher;