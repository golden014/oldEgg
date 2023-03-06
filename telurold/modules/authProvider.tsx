import { useRouter } from "next/router";

import React, { useState, createContext, useEffect } from "react";

export type UserInfo = {
    firstName: string
    lastName: string
    email: string
    mobilePhone: string
    isSubscribe: string
    role: string
    id: string
    status: string
    balance: number
    accessToken: string
}

export const AuthContext = createContext<{
    authenticated: boolean
    setAuthenticated: (auth: boolean) => void
    user: UserInfo | any
    setUser: (user: UserInfo) => void
}> ({
    authenticated: false,
    setAuthenticated: () => {},
    user: {username: '', id: ''},
    setUser: () => {}

})


const AuthContextProvider = ({children} : {children: React.ReactNode}) => {

    const [authenticated, setAuthenticated] = useState(false)
    const [user, setUser] = useState<UserInfo>()
    const router = useRouter()

    useEffect(() => {
        const userInfo = localStorage.getItem("user_info")
        if (!userInfo) {
            if (window.location.pathname == "/login") {
                router.push("/login");
            } else {
                router.push("/");
            }
            //harusnya dibatesin hanya saat mau checkout saja
            // if (window.location.pathname != "/signup") {
            //     router.push("/login")
            //     return
            // }
        } else {
            const user: UserInfo = JSON.parse(userInfo)
            if (user) {
                setUser({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    mobilePhone: user.mobilePhone,
                    isSubscribe: user.isSubscribe,
                    role: user.role,
                    id: user.id,
                    status: user.status,
                    balance: user.balance,
                    accessToken: user.accessToken
                })
            }
            setAuthenticated(true)
        }
    }, [authenticated])

    return ( 
        <AuthContext.Provider
            value={{
                authenticated: authenticated,
                setAuthenticated: setAuthenticated,
                user: user,
                setUser: setUser,
            }}
        >
        {children}
        </AuthContext.Provider>
     );
}
 
export default AuthContextProvider;