import SignUpFooter from "./signupFooter";
import style from "../../styles/style.module.scss"
import { useRouter } from "next/router";
import { useState } from "react";

const SignUpForm = () => {   
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [mobilePhone, setMobilePhone] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    const router = useRouter()

    const submitHandler = async (e :React.SyntheticEvent) => {
        e.preventDefault()

        try {
            const res = await fetch("http://localhost:1234/signup", {
                method: "POST",
                headers: {"Content-Type" : "application/json;;charset=utf-8"},
                body: JSON.stringify({username, email, password})
            })

            //kalau berhasil
            const data = await res.json()
            if (res.ok) {
                alert("SignUp Success !")
                router.push("/login")
            } else {
                console.error(res)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return ( 
        <div className={style.signUpFormContainer}>
            <form className={style.formForm}>
                <input type="text" placeholder="First Name" className={style.formComponent} onChange={(e :any) =>setFirstName(e.target.value)}/>
                <input type="text" placeholder="Last Name" className={style.formComponent} onChange={(e :any) =>setLastName(e.target.value)}/>
                <input type="email" placeholder="Email Address" className={style.formComponent} onChange={(e :any) =>setEmail(e.target.value)}/>
                <input type="text" placeholder="Mobile Phone" className={style.formComponent} onChange={(e :any) =>setMobilePhone(e.target.value)}/>
                <input type="password" placeholder="Password" className={style.formComponent} onChange={(e :any) =>setPassword(e.target.value)}/>
                <div className={style.subscribe_checkbox}>
                    <input type="checkbox" />
                    <label> Subscribe for exclusive e-mail offers and discounts</label>

                </div>
                
                {/* error message saat validasi */}
                <div className={style.error_validation}>
                    <p className="error_msg">asddsa</p>
                </div>
                <button
                type="submit"
                onClick={submitHandler}
                >Sign Up</button>

                
            </form>
            
        </div>

     );
}
 
export default SignUpForm;