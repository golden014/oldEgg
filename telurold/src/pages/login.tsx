
import LoginForm from "./components/loginForm"
import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import SignUpFooter from "./components/signupFooter";
import logo from "./../../assets/newegg-logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react"
import { AuthContext } from "modules/authProvider";

export default function Login() {

    const { setAuthenticated } = useContext(AuthContext)
    
    useEffect(() => {
        setAuthenticated(false)
    }, [])

    const router = useRouter()

    function handleClick() {
        router.push("/signup")
    }

    function logoClicked() {
        router.push("/")
    }

    return (
        // <Theme>
        //     <div className="container">
        //         <LoginForm/>
        //     </div>
        // </Theme>
        <div className={style.signUpContainer}>
            <Image
                    src={logo}
                    alt="logo"
                    width={130}
                    height={70}
                    onClick={logoClicked}
                    style={{cursor: "pointer"}}
                />

            <h2>Login</h2>

            <LoginForm/>
            <p>Don't have an account? <span onClick={handleClick}>Sign Up</span></p>

            <SignUpFooter/>
        </div>
    )
}