import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { UserInfo } from "modules/authProvider";
import { useEffect, useState } from "react";
import AllUsers from "./components/allUsers";

const ViewAllUsers = () => {
    const [users, setUsers] = useState<UserInfo[]>([])

    useEffect(() => {
        fetch('http://localhost:1234/getAllUsers')
        .then((response) => response.json())
        .then((data) => {
            setUsers(data)
            console.log("tessssss");
            console.log(data.data);
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [])
    
    return (  
        <Theme>
            <div className={style.view_all_users_container}>
                <AllUsers users={users} />
            </div>
        </Theme>
    );
}
 
export default ViewAllUsers;