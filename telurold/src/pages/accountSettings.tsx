import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "modules/authProvider";

const AccountSettings = () => {
    const { user } = useContext(AuthContext)
    const [email, setEmail] = useState(user.email)
    const [phoneNum, setPhoneNum] = useState(user.mobilephone)
    const [currPassword, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const handleUpdate = async(column: string, columnValue: any) => {
        if (user) {
            try {
                const res = await fetch("http://localhost:1234/updateAccount", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        id: parseInt(user.id),
                        column: column,
                        new_value: columnValue
                    }),
                });
    
                if (res.ok) {
                    alert("Update" + column + " Success !")
                } else {
                    console.log("smth went wrong retreiving reviews");
                }
    
            } catch (error){
                console.log(error);                
            }
        }
    }

    const handlePassword = async() => {
        
    }

    if (user) {
        return (  
            <Theme>
                <div className={style.review_detail_container}>
                    <div className={style.title}>
                        <h1>Account Settings</h1>
                    </div>
                    <div className={style.mid}>
                        <div className={style.header}>
                            <h2>Hello, {user.firstname + " " + user.lastname}</h2>
                        </div>
                        
                        <div className={style.details}>
                            <div className={style.details_block}>
                                <p>Is Subscribed: {user.issubscribe}</p>
                            </div>
                            <div className={style.details_block}>
                                <p>Email: </p>
                                <input type="text" placeholder={user.email} onChange={(e) => setEmail(e.target.value)}/>
                                <button onClick={(e) => handleUpdate("email", email)}>Update</button>
                            </div>
                            <div className={style.details_block}>
                                <p>Phone Number: </p>
                                <input type="text" placeholder={user.mobilephone} onChange={(e) => setPhoneNum(e.target.value)}/>
                                <button onClick={(e) => handleUpdate("mobile_phone", phoneNum)}>Update</button>
                            </div>
                            <div className={style.details_block}>
                                <p>Curr Password: </p>
                                <input type="text" placeholder="input curr password"/>
                                <div style={{width: "73px"}}></div>
                            </div>
                            <div className={style.details_block}>
                                <p>New Password: </p>
                                <input type="text" placeholder="input new password"/>
                                <button>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Theme>
        );
    }
    else {
        return (
            <Theme>
                <h1>Loading...</h1>
            </Theme>
        )
    }
}
 
export default AccountSettings;