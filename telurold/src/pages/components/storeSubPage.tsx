import { Product, Store } from "modules/authProvider"
import { useEffect, useState } from "react"
import style from "../../styles/style.module.scss"
import ProductCard from "./productCard"
import ReviewHeader from "./reviewsHeader"
import ReviewsStore from "./reviewsStore"

const StoreSubPage = (props: {threeOption: string, store_id: any}) => {

    const store_id = props.store_id
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(0)
    const [productCount, setProductCount] = useState(0)
    const [instock, setInStock] = useState(true)
    const [filtered, setFiltered] = useState<Product[]>([])
    const [search, setSearch] = useState("")
    const [sortByPrice, setSortByPrice] = useState(true)

    const [filterReview, setFilterReview] = useState("")
    const [store, setStore] = useState<Store>()

    useEffect(() => {
        const getStore = async () => {
            try {
                const res = await fetch("http://localhost:1234/getStoreById", {
                    method: "POST",
                    headers: { "Content-Type": "application/json;charset=utf-8" },
                    body: JSON.stringify({
                        store_id: store_id
                    }),
                });
    
                if (res.ok) {
                    const data = await res.json();
                    setStore(data)
                 
                } else {
                    console.log("res not ok");
                }
                console.log(res);
            } catch (error) {
                
            }
        }
        getStore()
    }, [])

    const nextPage = () => {
        setPage(page + 1)
    }

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1)
        } else {

        }
    }

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
                        store_id: store_id
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
                        store_id: store_id
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

    if (props.threeOption == "Products") {
        return (
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
        )
    } else if (props.threeOption == "Reviews") {
        return (
            <div className={style.review_by_store_container}>
                <h1>Reviews</h1>
                <br />
                <div className={style.reviews_header}>
                    <ReviewHeader store_id={store_id} filter={filterReview}/>
                </div>
                <div className={style.all_reviews}>
                    <ReviewsStore store_id={store_id} />
                </div>
            </div>

        )
    } 
    
   

    else if (props.threeOption == "AboutUs") {
        return (
            <div className={style.review_by_store_container}>
                <h1>About Us</h1>
                <br />
                <h3>Established in 2020, Store bukan josua are happy to serve you</h3>
                <br />
                <br /><br />
                <h3>Total sales: {store?.number_of_sales}</h3>
                <br />
                <div className={style.reviews_header}>
                    <ReviewHeader store_id={store_id} filter={filterReview}/>
                </div>
                <div className={style.all_reviews}>
                    <ReviewsStore store_id={store_id} />
                </div>
            </div>
        )
    } else {
        return (  
            <div></div>
        );
    }
}
 
export default StoreSubPage;