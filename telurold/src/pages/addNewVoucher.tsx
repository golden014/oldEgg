import { useState } from "react";
import Theme from "./components/theme";
import style from "../styles/style.module.scss"

const AddNewVoucher = () => {

    const [voucherBalance, setVoucherBalance] = useState(0)
    const [voucherCode, setVoucherCode] = useState("")
    const [validUntil, setValidUntil] = useState("")

    const handleAdd = async () => {
        //send req post ke backend utk masukin voucher ke database
        console.log("-----------=-=-=-=-=-==-------------");
        
        console.log(voucherBalance);
        console.log(voucherCode);
        console.log(validUntil);
        try {
            // const res = await fetch("http://localhost:1234/addVoucher", {
            //     method: "POST",
            //     headers: {"Content-Type": "application/json;;charset=utf-8"},
            //     body: JSON.stringify({
            //         voucher_balance: voucherBalance,
            //         voucher_code: voucherCode,
            //         valid_until: validUntil,
            //     })
            // }) 

            const res = await fetch("http://localhost:1234/addVoucher", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify({
                    voucher_balance: voucherBalance,
                    voucher_code: voucherCode,
                    valid_until: validUntil,
                }),
            });

            if (res.ok) {
                console.log("res ok");
                alert("Success !")
            } else {
                console.log("res not ok");
            }

            console.log(res);
        } catch (error) {
            
        }
    }

    return (  
        <Theme>
            <div className={style.voucher_balance_container}>
                <div className={style.voucher_balance_input}>
                    <p>Set Voucher Balance</p>
                    <input type="number" placeholder="set voucher balance (USD)" onChange={(e) => setVoucherBalance(parseFloat(e.target.value))}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Set Voucher Code</p>
                    <input type="text" placeholder="set voucher code" onChange={(e) => setVoucherCode(e.target.value)}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Set Valid Until</p>
                    <input type="date" placeholder="valid until" onChange={(e) => setValidUntil(e.target.value)}/>
                </div>

                <button onClick={handleAdd}>add</button>
            </div>
        </Theme>
    );
}
 
export default AddNewVoucher;