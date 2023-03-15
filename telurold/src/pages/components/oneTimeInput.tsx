import Cookies from "js-cookie"
import { AuthContext, UserInfo } from "modules/authProvider"
import { useRouter } from "next/router"
import { useState, useContext } from "react"
import style from "../../styles/style.module.scss"

const OneTimeInput = (props: {email: string, show: boolean}) => {
    const [code, setCode] = useState("")
    const { authenticated } = useContext(AuthContext)
    const { setAuthenticated } = useContext(AuthContext)
    const router = useRouter()

    const handleVerify = async() => {

        try {
             const res = await fetch("http://localhost:1234/validateCode", {
                method: "POST",
                headers: { "Content-Type" : "application/json;charset=utf-8"},
                body: JSON.stringify({
                    email: props.email,
                    code: code
                }),
            })

            if (res.ok) {
                const data = await res.json()
                console.log(data);
                const user: UserInfo = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    mobilephone: data.mobilephone,
                    issubscribe: data.issubscribe,
                    role: data.role,
                    id: data.id,
                    status: data.status,
                    balance: data.balance,
                    accesstoken: ""
                }

                localStorage.setItem("user_info", JSON.stringify(user))
                console.log(localStorage.getItem("user_info"))
                const jwt = user.accesstoken;

                // Set the cookie in the browser using Cookies.set
                Cookies.set('jwt', jwt, {
                expires: 30, // Expires in 30 days
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                });
                setAuthenticated(true)
                alert("success !")
                return router.push("/")


            }
        } catch (error) {
            
        }
    }

    if (props.show) {
        return (  
            <div className={style.formForm}>
                <input type="text" required placeholder="Input code" onChange={(e) => setCode(e.target.value)}/>
                <button onClick={handleVerify}>Verify Code</button>
            </div>
        );
    } else {
        return (
            <div>

            </div>
        )
    }
}
 
export default OneTimeInput;