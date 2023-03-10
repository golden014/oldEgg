import { Product } from "modules/authProvider"
import { useState, useEffect } from "react"
import style from "../../styles/style.module.scss"

const QuickView = (props: {prod_id: any}) => {

    const [product, setProduct] = useState<Product>()
    useEffect(() => {
        //ambil data product id berdasarkan id nya
        const getProduct = async () => {            
            try {
                const res = await fetch("http://localhost:1234/getProductById", {
                    method: "POST",
                    headers: { "Content-Type": "application/json;charset=utf-8" },
                    body: JSON.stringify({
                        product_id: String(props.prod_id)
                    }),
                });
    
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data)
                } else {
                    console.log("smth went wrong");        
                }

                console.log(res);
            } catch (error) {
                console.log(error);
            }
        }

        getProduct()
    }, [])

    return (  
        <div className={style.quick_view_container}>
            <div className={style.quick_view_left}>
                <img src={product?.product_image} style={{
                    width: "400px",
                    height: "400px"
                }} />
            </div>
            <div className={style.quick_view_right}>
                <h1>{product?.product_name}</h1>
                <p>{product?.product_description}</p>
                <h2>${product?.price}</h2>
            </div>
        </div>
    );
}
 
export default QuickView;