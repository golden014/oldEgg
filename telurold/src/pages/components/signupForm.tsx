import SignUpFooter from "./signupFooter";
import style from "../../styles/style.module.scss"

const SignUpForm = () => {
    return ( 
        <div className={style.signUpFormContainer}>
            <form className={style.formForm}>
                <input type="text" placeholder="First Name" className={style.formComponent}/>
                <input type="text" placeholder="Last Name" className={style.formComponent}/>
                <input type="email" placeholder="Email Address" className={style.formComponent}/>
                <input type="text" placeholder="Mobile Phone" className={style.formComponent}/>
                <input type="password" placeholder="Password" className={style.formComponent}/>

                <button>Sign Up</button>
            </form>
            
        </div>

     );
}
 
export default SignUpForm;