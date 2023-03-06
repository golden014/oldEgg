import { async } from "@firebase/util";
import { UserInfo } from "modules/authProvider";
import style from "../../styles/style.module.scss"

interface AllUsersObject {
    users: UserInfo[]
}


const AllUsers: React.FC <AllUsersObject> = ({ users }) => {

    console.log(users);

    const handleBan = async (id:any) => {
        //send ke backend, user dengan id ini, Status = "Banned"
        try {
            console.log("id nya adalahhh: " + id);
            const res = await fetch("http://localhost:1234/banUser", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify({
                    user_id: id,
                }),
            });

            if (res.ok) {
                alert("Ban, Success!")
                window.location = window.location
                
            } else {
                alert("Ban Unsuccess!")
            }
        } catch (error) {
            alert("Ban Unsuccess!")
        }
    }

    const handleUnban = async (id:any) => {
        try {
          
            
            const res = await fetch("http://localhost:1234/unbanUser", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify({
                    user_id: id,
                }),
            });

            if (res.ok) {
                alert("Unban, Success!")
                window.location = window.location
                
            } else {
                alert("Unban Unsuccess!")
            }
        } catch (error) {
            alert("Unban Unsuccess!")
        }
    }
   
    return (  
        <div className={style.all_user_container}>
           {users.map((user) => (
                <div key={user.id} className={style.user_container}>
                    <div className={style.user_title}>
                        <h1>{user.firstname} {user.lastname}</h1>
                    </div>
                    <div className={style.user_detail}>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                        <p>Status: {user.status}</p>
                        <p>MobilePhone: {user.mobilephone}</p>
                    </div>
                    <div className={style.user_ban_buttons}>
                        <button className={style.ban_buttons} onClick={(e) => handleBan(user.id)}>Ban</button>
                        <button className={style.unban_buttons} onClick={(e) => handleUnban(user.id)}>Unban</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
 
export default AllUsers;