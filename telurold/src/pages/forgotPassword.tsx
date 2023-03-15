import Image from "next/image";
import { useRouter } from "next/router";
import style from "../styles/style.module.scss"
import logo from "../../assets/newegg-logo.png"
import { useState } from "react"
import SignUpFooter from "./components/signupFooter";

const ForgotPassword = () => {
    const router = useRouter()

    function logoClicked() {
        router.push("/")
    }
    const [email, setEmail] = useState("")

    const submitHandler = () => {

    }

    return (  
        <div className={style.signUpContainer}>
            <Image
                    src={logo}
                    alt="logo"
                    width={130}
                    height={70}
                    onClick={logoClicked}
                    style={{cursor: "pointer"}}
                />

                <h2>Forgot Password</h2>

                <div className={style.signUpFormContainer}>
                    <form className={style.formForm}>
                        <input type="email" required placeholder="Email Address" className={style.formComponent} onChange={(e :any) =>setEmail(e.target.value)}/>
                    
                        <button
                        type="submit"
                        onClick={submitHandler}
                        >Send forgot password email</button>
                    </form>

                </div>
                <SignUpFooter/>
        </div>
    );
}
 
export default ForgotPassword;