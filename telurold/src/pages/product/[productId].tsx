import { AuthContext, Cart, Product, Store } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Theme from "../components/theme";
import style from "../../styles/style.module.scss"
import Image from "next/image";
import SimilarProducts from "../components/similarProduct";
import Reviews from "../components/reviews";


const ProductPage = () => {

    const router = useRouter()
    const productId = router.query.productId
    
    const [product, setProduct] = useState<Product>()
    const [store, setStore] = useState<Store>()

    const { user } = useContext(AuthContext)
    //cek apakah store nya banned or not
    useEffect(() => {
        //ambil store by storeid
        if (product) {
            const getStore = async () => {
                try {
                    const res = await fetch("http://localhost:1234/getStoreById", {
                        method: "POST",
                        headers: { "Content-Type": "application/json;charset=utf-8" },
                        body: JSON.stringify({
                            store_id: product.store_id
                        }),
                    });
        
                    if (res.ok) {
                        const data = await res.json();
                        setStore(data)
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

            getStore()
        } else {

        }

    }, [product])

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

    const [cart, setCart] = useState<Cart>()
    useEffect(() => {
        //ambil info cart berdasarkan user id
        const getReviewsByProductId = async () => {
            
            try {
                const res = await fetch("http://localhost:1234/getCartByUserId", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        user_id: parseInt(user.id)
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setCart(data)
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }

        getReviewsByProductId()
    }, [user])

    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        if (product) {
            if (count >= product?.stock) {
                alert("Can't add more, stock isn't enough")
            } else {
                setCount(count + 1);
            }
        }
    };

    const handleDecrement = () => {
        if (count <= 0) {

        } else  {
            setCount(count - 1);
        }
    };

    const handleAddCart = async() => {
        if (count <= 0) {
            alert("Please add at least one quantity before adding it to your cart !")
        } else {
            try {
                const res = await fetch("http://localhost:1234/addItemToCart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json;charset=utf-8" },
                    body: JSON.stringify({
                        product_id: product?.product_id,
                        cart_id: cart?.cart_id,
                        quantity: count
                    }),
                });
    
                if (res.ok) {
                    const data = await res.json();
                    alert("Add to cart success !")
                    window.location = window.location
                } else {
                    alert("A problem occurred...")     
                }
    
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        }
    }

    if(productId) {
    
        if (product) {
            if (store) {
                if (store.store_status == "Banned") {
                    return (
                        <Theme>
                            <h1 style={{
                                color: "#8b8b8b"
                            }}>The store is banned</h1>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

                        </Theme>
                    )
                } else if (user.role == "Seller") {
                    return (  
                        <Theme>
                            <div className={style.product_detail_container}>
                                
                                <div className={style.product_page_top}>
                                    <img src={product?.product_image} alt="Carousel" style={{
                                        width: "30vw", 
                                        height: "auto",
                                        objectFit: "cover"
                                        }}/>
            
                                    <div className={style.prod_detail}>
                                        <div className={style.left}>
                                            <h1>{product?.product_name}</h1>
                                            <p>{product?.product_description}</p>
                                            <br /><br />
                                            {product.stock == 0 &&
                                                <p style={{color: "red"}}>Out of Stock !</p>
                                            }
                                            {product.stock != 0 &&
                                                <p>Stock: {product.stock}</p>
                                            }

                                            <p className={style.visit_store} onClick={(e) => router.push("/store/" + store.store_id)}>Visit {store.store_name} Store</p>
                                            <p className={style.visit_store} onClick={(e) => router.push("/editproduct/" + productId)}>Edit Product</p>
                                        </div>
                                    </div>
                                </div>
                                <br /><br /><br />
                                
                                <h1>Similar Products</h1>
                                <br />
                                <SimilarProducts categoryId={product?.category_id} currProdId={productId}/>
                            
                                <h1>Reviews</h1>
                                <br />
                                <Reviews product_id={product.product_id} />
                            </div>
                        </Theme>
                    );
                }
                
                else {
                    return (  
                        <Theme>
                            <div className={style.product_detail_container}>
                                
                                <div className={style.product_page_top}>
                                    <img src={product?.product_image} alt="Carousel" style={{
                                        width: "30vw", 
                                        height: "auto",
                                        objectFit: "cover"
                                        }}/>
            
                                    <div className={style.prod_detail}>
                                        <div className={style.left}>
                                            <h1>{product?.product_name}</h1>
                                            <p>{product?.product_description}</p>
                                            <br /><br />
                                            
                                            {product.stock == 0 &&
                                                <p style={{color: "red"}}>Out of Stock !</p>
                                            }
                                            {product.stock != 0 &&
                                                <p>Stock: {product.stock}</p>
                                            }

                                            <p className={style.visit_store} onClick={(e) => router.push("/store/" + store.store_id)}>Visit {store.store_name} Store</p>

                                        </div>

                                        <div className={style.right}>
                                            <br />
                                            <h1>${product.price}</h1>
                                            <div className={style.add_to_cart}>

                                            </div>
                                            <div className={style.spinner}>
                                                <button onClick={handleDecrement}>-</button>
                                                <p>{count}</p>
                                                <button onClick={handleIncrement}>+</button>
                                                <button className={style.add_cart_button} onClick={handleAddCart}>
                                                    Add To Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br /><br /><br />
                                
                                <h1>Similar Products</h1>
                                <br />
                                <SimilarProducts categoryId={product?.category_id} currProdId={productId}/>
                            
                                <h1>Reviews</h1>
                                <br />
                                <Reviews product_id={product.product_id} />
                            </div>
                        </Theme>
                    );
                }
            } else {
                return(
                    <Theme>
                        <h1>...</h1>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </Theme>
                )
            }
        }
    } else {
        console.log(product);
        console.log(productId);
        
        
        return (
            <h1>Loading...</h1>
        )
    }
}
 
export default ProductPage;