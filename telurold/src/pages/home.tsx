import Navbar from "./components/navbar";
import Theme from "./components/theme";
import style from "../styles/style.module.scss"

const submitHandler =async (e:any) => {
    e.preventDefault()

    try {
        const res = await fetch("http://localhost:1234/logout", {
            method: "GET"
        })

        if (res.ok) {
            localStorage.setItem("user_info", "");
        }
    } catch (error) {
        console.log(error)
    }
}

const Home = () => {
    return ( 
        <Theme>
            <div className={style.home_container}>
                <h1>aaaaaaaaaaaaaa</h1>
                <button onClick={submitHandler}>Logout</button>
            </div>
        </Theme>

     );
}
 
export default Home;