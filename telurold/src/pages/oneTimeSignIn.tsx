import Image from "next/image";
import { useRouter } from "next/router";
import style from "../styles/style.module.scss"
import logo from "../../assets/newegg-logo.png"
import { useState } from "react"
import SignUpFooter from "./components/signupFooter";
import OneTimeInput from "./components/oneTimeInput";

const OneTimeSignInPage = () => {
    const router = useRouter()

    function logoClicked() {
        router.push("/")
    }
    const [email, setEmail] = useState("")

    const [showBar, setShowBar] = useState(false)

    const submitHandler = async(e:any) => {
        e.preventDefault()

        try {
            const res = await fetch("http://localhost:1234/createCode", {
               method: "POST",
               headers: { "Content-Type" : "application/json;charset=utf-8"},
               body: JSON.stringify({
                   email: email,
               }),
           })

           if (res.ok) {
                alert("code sent ! check your email")
                setShowBar(true)
           }
       } catch (error) {
           
       }
        
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

            <h2>One Time Sign In</h2>

            <div className={style.signUpFormContainer}>
                <form className={style.formForm}>
                    <input type="email" required placeholder="Email Address" className={style.formComponent} onChange={(e :any) =>setEmail(e.target.value)}/>
                    <button
                    type="submit"
                    onClick={(e) => submitHandler(e)}
                    >Send one time sign in code</button>
                </form>

                <OneTimeInput email={email} show={showBar} />

            </div>
            <SignUpFooter/>
    </div>
    );
}
 
export default OneTimeSignInPage;