import Navbar from "./components/navbar";
import Theme from "./components/theme";

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
            <div className="container">
                <h1>aaaaaaaaaaaaaa</h1>
                <button onClick={submitHandler}>Logout</button>
            </div>
        </Theme>

     );
}
 
export default Home;