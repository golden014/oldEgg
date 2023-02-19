import Image from "next/image";
import SignUpFooter from "./components/signupFooter";
import SignUpForm from "./components/signupForm";
import logo from "./../../assets/newegg-logo.png";
import style from "../styles/style.module.scss"


const SignUp = () => {
    return (
        
        <div className={style.signUpContainer}>
            <Image
                    src={logo}
                    alt="logo"
                    width={130}
                    height={70}
                />

            <SignUpForm/>
            <SignUpFooter/>
        </div>
    );
}
 
export default SignUp;