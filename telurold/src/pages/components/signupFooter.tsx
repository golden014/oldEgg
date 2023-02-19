import style from "../../styles/style.module.scss"
import {useEffect, useState} from "react"

const SignUpFooter = () => {
    
    return ( 
        <div className={style.signUpFooterContainer}>
            <div className={style.signUpFooterTop}>
                <a href="">Terms & Conditions</a>
                <p> | </p>
                <a href="">Privacy Policy</a>
            </div>
            <div className={style.signUpFooterBot}>
                <p>© 2000-2023 Oldegg Inc. All rights reserved.</p>
            </div>
        </div>
     );
}
 
export default SignUpFooter;