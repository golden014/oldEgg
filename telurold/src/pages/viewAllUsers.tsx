import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { UserInfo } from "modules/authProvider";
import { useEffect, useState } from "react";
import AllUsers from "./components/allUsers";

const ViewAllUsers = () => {
    const [users, setUsers] = useState<UserInfo[]>([])
    const [page, setPage] = useState(0)

    const nextPage = () => {
        setPage(page + 1)
    }

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1)
        } else {

        }
    }

    useEffect(() => {
        const getPagintedUsers = async () => {
            try {
                const res = await fetch("http://localhost:1234/paginatedUsers", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        page: page
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setUsers(data)
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }

        getPagintedUsers()

    }, [page])
    
    return (  
        <Theme>
            <div className={style.view_all_users_container}>
                <div className={style.buttons}>
                    <button onClick={prevPage}>Prev</button>
                    <button onClick={nextPage}>Next</button>
                </div>
                <AllUsers users={users} />
            </div>
        </Theme>
    );
}
 
export default ViewAllUsers;