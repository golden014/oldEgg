import { Product } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Theme from "../components/theme";
import style from "../../styles/style.module.scss"
import Image from "next/image";


const ProductPage = () => {

    const router = useRouter()
    const productId = router.query.productId
    
    const [product, setProduct] = useState<Product>()
    useEffect(() => {
        //ambil data product id berdasarkan id nya
        const getProduct = async () => {
            console.log("PROD ID: " + productId);
            
            try {
                const res = await fetch("http://localhost:1234/getProductById", {
                    method: "POST",
                    headers: { "Content-Type": "application/json;charset=utf-8" },
                    body: JSON.stringify({
                        product_id: productId
                    }),
                });
    
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data)
                    // product.category_id = data.category_id
                    // product.product_description = data.product_description
                    // product.product_id = data.product_id
                    // product.product_image = data.product_image
                    // product.product_name = data.product_name
                    // product.stock = data.stock
                    // product.store_id = data.store_id

                    console.log("success");
                    console.log(data);
                    
                } else {
                    console.log("smth went wrong");        
                }
    
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        }

        getProduct()
    }, [productId])

    if(productId) {
    
    
        return (  
            <Theme>
                <h1>{product?.product_name}</h1>
                <div className={style.product_page_top}>
                    <img src={product?.product_image} alt="Carousel" style={{
                        width: "250px", 
                        height: "250px",
                        objectFit: "cover"
                        }}/>
                </div>
            </Theme>
        );
    } else {
        console.log(product);
        console.log(productId);
        
        
        return (
            <h1>Loading...</h1>
        )
    }
}
 
export default ProductPage;