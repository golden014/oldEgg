import { useRouter } from "next/router";

import React, { useState, createContext, useEffect } from "react";

export type UserInfo = {
    firstname: string
    lastname: string
    email: string
    mobilephone: string
    issubscribe: string
    role: string
    id: string
    status: string
    balance: number
    accesstoken: string
}

export type Store = {
    store_id: string
    store_name: string
    store_banner: string
    store_status: string
    store_email: string
    product_accuracy: number
    delivery_statistic: number
    service_satisfaction: number
    store_description: string
    number_of_sales: number
}

export type Product = {
    product_id: string
    store_id: string
    product_name: string
    stock: number
    product_description: string
    category_id: number
    product_image: string
    price: number
    sub_category_id: number
}

export type Category = {
    category_id: number
    category_name: string
}

export type SubCategory = {
    sub_category_id: number
    sub_category_name: string
    category_id: number
}

export type Review = {
    review_id: number
    product_id: number
    helpful_count: number
    unhelpful_count: number
    review_time: string
    rating: number
    review_description: string
    store_id: number
    user_id: number
    review_title: string
    on_time_delivery: string
    product_accuracy: string
    service_satisfaction: string
}

export type Cart = {
    cart_id: number
    user_id: number
    total: number
}

export type CartProduct = {
    cart_id: number
    product_id: number
    quantity: number
}

export type Address = {
    user_id: number
    address_id: number
    address_name: string
}

export type Order = {
	order_id: number
    user_id: number
    store_id: number
    date_ordered: string
    invoice_code: string
    status: string
}

export type OrderDetail = {
    order_id: number
    product_id: number
    quantity: number
}


export const AuthContext = createContext<{
    authenticated: boolean
    setAuthenticated: (auth: boolean) => void
    user: UserInfo | any
    setUser: (user: UserInfo) => void
}> ({
    authenticated: false,
    setAuthenticated: () => {},
    user: {
        firstname: "",
        lastname: "",
        email: "",
        mobilephone: "",
        issubscribe: "",
        role: "",
        id: "",
        status: "",
        balance: 0,
        accesstoken: "",
    },
    setUser: () => {}
})


const AuthContextProvider = ({children} : {children: React.ReactNode}) => {

    const [authenticated, setAuthenticated] = useState(false)
    const [user, setUser] = useState<UserInfo>()
    const router = useRouter()

    useEffect(() => {
        const userInfo = localStorage.getItem("user_info")
        if (!userInfo) {
            // if (window.location.pathname == "/login") {
            //     router.push("/login");
            // } else {
            //     // router.push("/");
            // }
            //harusnya dibatesin hanya saat mau checkout saja
            // if (window.location.pathname != "/signup") {
            //     router.push("/login")
            //     return
            // }
        } else {
            const user: UserInfo = JSON.parse(userInfo)
            if (user) {
                setUser({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    mobilephone: user.mobilephone,
                    issubscribe: user.issubscribe,
                    role: user.role,
                    id: user.id,
                    status: user.status,
                    balance: user.balance,
                    accesstoken: user.accesstoken
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