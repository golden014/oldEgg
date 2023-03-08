import { Product } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Theme from "../components/theme";


const ProductPage = () => {

    const router = useRouter()
    const productId = router.query.productId
    const [product, setProduct] = useState<Product>()

    if(productId) {
        // useEffect(() => {
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
                        console.log("success");
                        console.log(res);
                        
                    } else {
                        console.log("smth went wrong");        
                    }
        
                    console.log(res);
                } catch (error) {
                    console.log(error);
                }
            }
    
            getProduct()
        // }, [])
    
    
        return (  
            <Theme>
                <h1>INI ADALAH PRODUCT PAGE DENGAN ID {productId}</h1>
            </Theme>
        );
    } else {
        return (
            <h1>Loading...</h1>
        )
    }
}
 
export default ProductPage;