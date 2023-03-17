import { AuthContext, Category, Product, Store } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import style from "../../styles/style.module.scss"
import CategoryCard from "./categoryCard";
import ProductCard from "./productCard";
import ReviewHeader from "./reviewsHeader";
import ReviewsStore from "./reviewsStore";
import StoreSubPage from "./storeSubPage";

const StoreMainPage = (props: {store: Store}) => {
    const store = props.store
    const [threeOption, setThreeOption] = useState("");

    //bikin useeffect setiap threeoption di change ganti isi sub page nya jadi berdasarkan three option tsb

    // useEffect(() => {
        
    // }, [threeOption])
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(0)
    const [productCount, setProductCount] = useState(0)
    const [instock, setInStock] = useState(true)
    const [filtered, setFiltered] = useState<Product[]>([])
    const [search, setSearch] = useState("")
    const [sortByPrice, setSortByPrice] = useState(true)
    const nextPage = () => {
        setPage(page + 1)
    }

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1)
        } else {

        }
    }

    const router = useRouter();

    const handleEditStore = () => {
        router.push("/editStore")
    }

    const [recProducts, setRecProducts] = useState<Product[]>([])
    const currStoreId = localStorage.getItem("store_id")
    const [categories, setCategories] = useState<Category[]>([])

    const [selected, setSelected] = useState("product_name");

    const handleButtonClick = (id:any) => {
        setSelected(id);
    };

    const buttons = [
        { id: "Price", label: "Price ASC" },
        { id: "Stock", label: "Stock ASC" },
    ];

    useEffect(() => {
        const getRecProducts = async () => {
                try {
                    const res = await fetch("http://localhost:1234/getRecommendedProducts", {
                        method: "POST",
                        headers: { "Content-Type": "application/json;charset=utf-8" },
                        body: JSON.stringify({
                            store_id: parseInt(String(store.store_id)),
                            order_by: selected
                        }),
                    });
        
                    if (res.ok) {
                        const data = await res.json();
                        setRecProducts(data)
                    } else {
                        console.log("smth went wrong");        
                    }
        
                    console.log(res);
                } catch (error) {
                    console.log(error);
                }
        }
        getRecProducts()
    }, [selected])

    useEffect(() => {
        const getCategories = async () => {
                try {
                    const res = await fetch("http://localhost:1234/getCategoryInStore", {
                        method: "POST",
                        headers: { "Content-Type": "application/json;charset=utf-8" },
                        body: JSON.stringify({
                            store_id: parseInt(String(store.store_id))
                        }),
                    });
        
                    if (res.ok) {
                        const data = await res.json();
                        setCategories(data)
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
        getCategories()
    }, [])

    useEffect(() => {

        if (sortByPrice) {
            console.log("harusnya ke filter aaa");
            setFiltered(filtered.sort((a, b) => a.price - b.price))
        } 
        else if (!sortByPrice){
            setFiltered(products)
        }
    }, [sortByPrice])

    useEffect(() => {
        if (instock) {
            setFiltered(products.filter((prod) => prod.stock <= 0))
        } else if (!instock) {
            setFiltered(products.filter((prod) => prod.stock > 0))
        }
    }, [instock])

    useEffect(() => {
        setFiltered(products.filter((prod) => (prod.product_name).includes(search)))
    }, [search])

    useEffect(() => {
        const getProductCount = async () => {
            try {
                const res = await fetch("http://localhost:1234/getProductCountById", {
                    method: "POST",
                    headers: { "Content-Type": "application/json;charset=utf-8" },
                    body: JSON.stringify({
                        store_id: store.store_id
                    }),
                });
    
                if (res.ok) {
                    const data = await res.json();
                    setProductCount(data.total_count)
                 
                } else {
                    console.log("res not ok");
                }
                console.log(res);
            } catch (error) {
                
            }
        }
        getProductCount()
    }, [])

    useEffect(() => {
        const getPaginated = async () => {
            try {
                const res = await fetch("http://localhost:1234/paginateProductByStoreId", {
                    method: "POST",
                    headers: { "Content-Type": "application/json;charset=utf-8" },
                    body: JSON.stringify({
                        page: page,
                        store_id: store.store_id
                    }),
                });
    
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data)
                    setFiltered(data)
                } else {
                    console.log("res not ok");
                }

                console.log(res);
            } catch (error) {
                
            }
        }
        getPaginated()
    }, [page])

    const { user } = useContext(AuthContext)
    //SELLER-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    if (categories) {
        if (currStoreId == store.store_id && user.role == "Seller") {
            //ini adalah store nya sendiri
            if (currStoreId == store.store_id)  {
                //return yg ada tombol edit dll
                return (  
                    <div className={style.store_main_page_container}>
                        {store.store_status == "Banned" &&
                            <div style={{paddingLeft: "20px", backgroundColor: "#b7312c"}}>
                                <h2 style={{color: "white"}}>Your store is banned</h2>
                            </div>
                        }
                        <div className={style.store_main_page_top}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"/>
                            <div className={style.top_detail}>
                                <h1>{store.store_name}</h1>
                                <p>{store.store_description}</p>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <img src={store.store_banner} ></img>
                        </div>
    
                        <br />
                        <div className={style.center}>
                            <div className={style.store_main_page_bot}>
                                
                                <div className={style.top_detail} style={{gap: "px"}}>
                                    <button onClick={handleEditStore}>Edit Store Info</button>
                                    <button onClick={(e) => router.push("/insertNewProduct")}>Insert New Product</button>
                                </div>
                            </div>
                        </div>
                        <br />

                        {/* //---------------------products */}
                        <div className={style.center}>
                            <div className={style.store_products_container}>
                                <div className={style.left}>
                                    <div className={style.filter}>
                                        <h1>Filter</h1>
                                    </div>
                                    <div className={style.filter}>
                                        <input type="checkbox" onChange={(e) => setInStock(!instock)}/>
                                        <p>In Stock</p>
                                    </div>
                                    <br /><br /><br />
                                    <div className={style.filter}>
                                        <h1>Sort</h1>
                                    </div>
                                    <div className={style.filter}>
                                        <input type="checkbox" onChange={(e) => setSortByPrice(!sortByPrice)}/>
                                        <p>By Price Ascending</p>
                                    </div>
                                </div>

                                <div className={style.right}>
                                    <div className={style.right_top}>
                                        <div className={style.search_container}>
                                            <input type="text" onChange={(e) => setSearch(e.target.value)}/>
                                            <button>Search</button>
                                        </div>


                                        <div className={style.change_page_buttons}>
                                            <p>Total Products Count: {productCount}</p>
                                            <button onClick={prevPage}>Prev</button>
                                            <button onClick={nextPage}>Next</button>
                                        </div>
                                    </div>
                                    <div className={style.right_bot}>
                                            {filtered.map((prod) => (
                                            <ProductCard product={prod} />
                                        ))}
                                    </div>
                                </div>
                            </div>       

                        </div>
                        <br />
                        {/* reviews */}
                        <div className={style.center}>
                            <div className={style.review_by_store_container}>
                                <h1>Reviews</h1>
                                <br />
                                <div className={style.reviews_header}>
                                    <ReviewHeader store_id={store.store_id} filter={""}/>
                                </div>
                                <div className={style.all_reviews}>
                                    <ReviewsStore store_id={store.store_id} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        } else {
            //return yg user biasa
            if (store.store_status == "Banned") {
                return (
                    <h1>This store is banned !</h1>
                )
            } else {
    //USER BIASA-----------------------------------------------------------------------------------------------------------------------------------------------------------------

                //home store user biasa
                return (  
                    <div className={style.store_main_page_container}>
                        <div className={style.store_main_page_top}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"/>
                            <div className={style.top_detail}>
                                <h1>{store.store_name}</h1>
                                <p>{store.store_description}</p>
                            </div>
                        </div>
                        <div className={style.store_three_option}>
                            <button onClick={(e) => setThreeOption("")}>Home</button>
                            <button onClick={(e) => setThreeOption("Products")}>Products</button>
                            <button onClick={(e) => setThreeOption("Reviews")}>Reviews</button>
                            <button onClick={(e) => setThreeOption("AboutUs")}>About Us</button>   
                        </div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <img src={store.store_banner} ></img>
                        </div>

                        <div style={{display: "flex", justifyContent: "center", marginTop: "30px"}}>
                            <StoreSubPage threeOption={threeOption} store_id={store.store_id}/>
                        </div>

                        <div className={style.store_main_page_top}>
                            <h1>Shop by category</h1>
                        </div>
                        <div className={style.store_category_container}>
                            {categories.map((category) => (
                                   <CategoryCard category={category} />
                            ))}
                        </div>

                        <div className={style.store_main_page_top}>
                            <h1>Recommended Products</h1>
                            <div className={style.sort_buttons}>
                                {buttons.map((button) => (
                                    <div className={style.details}>
                                        <input
                                            type="checkbox"
                                            checked={selected === button.id}
                                            onChange={() => handleButtonClick(button.id)}
                                        />
                                        <label key={button.id}>{button.label}</label>
                                    </div>
                                    
                                ))}

                            </div>
                        </div>

                        <div className={style.store_rec_prods_container}>
                            {recProducts.map((prod) => (
                                <ProductCard product={prod}/>
                            ))}
                        </div>

                        {/* <div className={style.store_main_page_bot}>
                            <div className={style.top_detail}>
                                <button onClick={handleEditStore}>Edit Store Info</button>
                                <button onClick={(e) => router.push("/insertNewProduct")}>Insert New Product</button>
                            </div>
                        </div> */}
                    </div>
                );
            }
        }

    }

    return(
        <h1>Loading</h1>
    )

   
}
 
export default StoreMainPage;