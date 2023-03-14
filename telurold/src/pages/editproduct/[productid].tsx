import { Product } from "modules/authProvider";
import { useRouter } from "next/router";
import { useState, useEffect } from "react"
import EditProduct from "../editProduct";

const EditProductPage = () => {

    const router = useRouter()
    const productId = router.query.productid
    const store_id = localStorage.getItem("store_id")

    const [product, setProduct] = useState<Product>()

    useEffect(() => {
        //ambil data product id berdasarkan id nya
        // if (productId) {
            const getProduct = async () => {
                console.log("PROD ID: " + productId);
                
                try {
                    const res = await fetch("http://localhost:1234/getProductById", {
                        method: "POST",
                        headers: { "Content-Type": "application/json;charset=utf-8" },
                        body: JSON.stringify({
                            product_id: String(productId)
                        }),
                    });
        
                    if (res.ok) {
                        const data = await res.json();
                        setProduct(data)
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
        // }
    }, [productId])
    

    if (productId) {
        if (product) {
            if (store_id) {
                return (  
                    <EditProduct store_id={store_id} product= {product}/>
                );
            }
        }
    } else {
        return (
            <h1>Loading...</h1>
        )
    }
}
 
export default EditProductPage;