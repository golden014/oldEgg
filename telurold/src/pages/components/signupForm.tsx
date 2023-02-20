import SignUpFooter from "./signupFooter";
import style from "../../styles/style.module.scss"
import { useRouter } from "next/router";

const SignUpForm = () => {   

    return ( 
        <div className={style.signUpFormContainer}>
            <form className={style.formForm}>
                <input type="text" placeholder="First Name" className={style.formComponent}/>
                <input type="text" placeholder="Last Name" className={style.formComponent}/>
                <input type="email" placeholder="Email Address" className={style.formComponent}/>
                <input type="text" placeholder="Mobile Phone" className={style.formComponent}/>
                <input type="password" placeholder="Password" className={style.formComponent}/>
                <div className={style.subscribe_checkbox}>
                    <input type="checkbox" />
                    <label> Subscribe for exclusive e-mail offers and discounts</label>

                </div>
                
                {/* error message saat validasi */}
                <div className={style.error_validation}>
                    <p className="error_msg">asddsa</p>
                </div>
                <button>Sign Up</button>

                
            </form>
            
        </div>

     );
}
 
export default SignUpForm;