
import LoginForm from "./components/loginForm"
import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import SignUpFooter from "./components/signupFooter";
import logo from "./../../assets/newegg-logo.png";
import Image from "next/image";



export default function Login() {
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
                />

            <LoginForm/>
            <SignUpFooter/>
        </div>
    )
}