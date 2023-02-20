import { API_URL } from "../../../constants";
import { useState, useEffect, useContext} from "react";
import { useRouter } from "next/router";
import { AuthContext, UserInfo } from "modules/authProvider";
import style from "../../styles/style.module.scss"



const loginForm = () => {
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { authenticated } = useContext(AuthContext)

    const router = useRouter()

    useEffect(() => {
        if (authenticated) {
            router.push("/home")
            return
        }
    })

    const submitHandler = async (e :React.SyntheticEvent) => {
        e.preventDefault()

        try {
            const res = await fetch("http://localhost:1234/login", {
                method: "POST",
                headers: { "Content-Type" : "application/json;charset=utf-8"},
                body: JSON.stringify({email, password}),
            })

            const data = await res.json()
            if (res.ok) {
                const user: UserInfo = {
                    username: data.username,
                    id: data.id,
                    accessToken: data.token,
                }
               
                localStorage.setItem("user_info", JSON.stringify(user))
                console.log(localStorage.getItem("user_info"))
                return router.push("/")
            } else {
                console.error(res);
            }
        } catch (error) {
            console.log(error)
        }

       
        
    }

    return ( 
         <div className="container">
            <form className={style.formForm}>
                <input type="email"
                 placeholder="Email"
                 value={email}
                 onChange={(e :any)=>setEmail(e.target.value)}
                  />

                <input type="password" 
                placeholder="Password"
                value={password}
                onChange={(e :any) =>setPassword(e.target.value)}
                />

                <div className={style.error_validation}>
                    <p className="error_msg">asdasd</p>
                </div>
                
                <button
                type="submit"
                onClick={submitHandler}
                >Login</button>


            </form>
         </div>
     );
}
 
export default loginForm;