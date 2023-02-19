import Navbar from "./components/navbar";

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
        <div className="container">
            <Navbar/>
            <h1>aaaaaaaaaaaaaa</h1>
            <button onClick={submitHandler}>Logout</button>
        </div>

     );
}
 
export default Home;