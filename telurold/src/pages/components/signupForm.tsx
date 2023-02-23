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
    //bisa tambahin function2 utk setrole jadi admin or seller
    const [role, setRole] = useState("Customer")
    const [isSubscribe, setIsSubsribe] = useState("")

    const [errorMsg, setErrorMsg] = useState("")

    const router = useRouter()

    function validateEmail(email:string) {
        const regex = /^[^@]+@[^@.]+\.[a-z]{2,}$/i;  // regular expression to match email format
        const isInvalid = /@\.com$/.test(email);  // check if email is "@.com"
        return regex.test(email) && !isInvalid;
    }

    function validatePassword(password:string) {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*\s).{8,30}$/;  // regular expression to match password format
        return regex.test(password);
    } 

    const submitHandler = async (e :React.SyntheticEvent) => {
        e.preventDefault()
        // validasi2 empty
        if (firstName === "") {
            setErrorMsg("Please fill your first name")    
            return
        } else if (lastName === "") {
            setErrorMsg("Please fill your last name")
            return
        } else if (lastName === "") {
            setErrorMsg("Please fill your last name")
            return
        } else if (email === "") {
            setErrorMsg("Please fill your email")
            return
        } //validasi format email
        else if (!validateEmail(email)) {
            setErrorMsg("Please input valid email format")
            return
        }
        else if (mobilePhone === "") {
            setErrorMsg("Please fill your phone number")
            return
        } else if (password === "") {
            setErrorMsg("Please fill your password")
            return
        }
        

        //validate format password
        if (!validatePassword(password)) {
            setErrorMsg("Password must contain capital letters, lower-case letters, numbers, and special symbols, and has a length of 8 – 30 characters")
            return
        }


        try {
            const res = await fetch("http://localhost:1234/signup", {
                method: "POST",
                headers: {"Content-Type" : "application/json;;charset=utf-8"},
                body: JSON.stringify({ firstName,
                    lastName,
                    email,
                    mobilePhone,
                    password,
                    isSubscribe,
                    role,
                })
            })

            //kalau berhasil
            const data = await res.json()
            if (res.ok) {
                alert("SignUp Success !")
                router.push("/login")
            } else {
                console.log(res);
                
            }

        } catch (error) {

            if (error instanceof Error) {
                // setErrorMsg(error.message);
                console.log(error);
            }
        }
    }


    return ( 
        <div className={style.signUpFormContainer}>
            <form className={style.formForm}>
                <input type="text" required placeholder="First Name" className={style.formComponent} onChange={(e :any) =>setFirstName(e.target.value)}/>
                <input type="text" required placeholder="Last Name" className={style.formComponent} onChange={(e :any) =>setLastName(e.target.value)}/>
                <input type="email" required placeholder="Email Address" className={style.formComponent} onChange={(e :any) =>setEmail(e.target.value)}/>
                <input type="text" required placeholder="Mobile Phone" className={style.formComponent} onChange={(e :any) =>setMobilePhone(e.target.value)}/>
                <input type="password" required placeholder="Password" className={style.formComponent} onChange={(e :any) =>setPassword(e.target.value)}/>
                <div className={style.subscribe_checkbox}>
                    <input type="checkbox" onChange={(e :any) => setIsSubsribe(e.target.value)}/>
                    <label> Subscribe for exclusive e-mail offers and discounts</label>

                </div>
                
                {/* error message saat validasi */}
                <div className={style.error_validation}>
                    <p className="error_msg">{errorMsg}</p>
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