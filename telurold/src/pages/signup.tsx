import Image from "next/image";
import SignUpFooter from "./components/signupFooter";
import SignUpForm from "./components/signupForm";
import logo from "./../../assets/newegg-logo.png";
import style from "../styles/style.module.scss"
import { useRouter } from "next/router";


const SignUp = () => {
    const router = useRouter()
    
    function handleClick() {
        router.push("/login")
    }

    return (
        
        <div className={style.signUpContainer}>
            <Image
                    src={logo}
                    alt="logo"
                    width={130}
                    height={70}
                />

            <h2>Create Account</h2>

            <SignUpForm/>
            <p>Have an account? <span onClick={handleClick}>Sign In</span></p>

            <SignUpFooter/>
        </div>
    );
}
 
export default SignUp;