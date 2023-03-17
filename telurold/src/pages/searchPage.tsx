import { AuthContext, Product } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import style from "../styles/style.module.scss"
import ProductCard from "./components/productCard";
import Theme from "./components/theme";

const SearchPage = () => {

    const router = useRouter();
    const { products, keyword } = router.query;
    const [page, setPage] = useState(0)
    const [sortByPrice, setSortByPrice] = useState(false)
    const [filtered, setFiltered] = useState<Product[]>([])
    const [instock, setInStock] = useState(false)
    const [search, setSearch] = useState("")
    const [productss, setProducts] = useState<Product[]>([])

    // let productsArray: Product[] = [];

    useEffect(() => {
        if (typeof products === 'string') {
            setProducts(JSON.parse(products));
            setFiltered(JSON.parse(products));
        }
    }, [products])
    

   
    const nextPage = () => {
        console.log("page saat next page: " + page);
        setPage(page + 4)
        console.log("page saat setelah next page: " + page);
    }

    const prevPage = () => {
        //kalau bukan di page pertama 
        console.log("page saat prev page: " + page);
        
        if (page > 3) {
            setPage(page - 4)
        } else {

        }
        console.log("page setelah prev page: " + page);
    }

    useEffect(() => {

        if (sortByPrice) {
            console.log("sort by price true");
            setFiltered(productss.sort((a, b) => a.price - b.price))
        } 
        else if (!sortByPrice){
            console.log("sort by price false");
            
            setFiltered(productss)
        }

    }, [sortByPrice])

    useEffect(() => {
        if (instock) {
            setFiltered(productss.filter((prod) => prod.stock <= 0))
        } else if (!instock) {
            setFiltered(productss.filter((prod) => prod.stock > 0))
        }
    }, [instock])

    useEffect(() => {
        setFiltered(productss.filter((prod) => (prod.product_name).includes(search)))
    }, [search])

    const { user } = useContext(AuthContext)


    const saveSearch = async() => {
        try {
            const res = await fetch("http://localhost:1234/addSavedQuery", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                   user_id: user.user_id,
                   query: keyword
                }),
            });

            if (res.ok) {
                alert("Save search result success !")
            } else {
                alert("You can only save 10 queries !")
            }

        } catch (error){
            console.log(error);                
        }
    }

    return (  
        <Theme>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>

                <div className={style.search_page_container}>
                    <br /><br />
                    <div className={style.search_header}>
                        <h1>Search: "{keyword}"</h1>
                        <button onClick={saveSearch}>save search</button>
                    </div>

                    <div className={style.store_products_container} style={{
                
                    }}>
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
                                    <p>Total Products Count: {productss.length}</p>
                                    <button onClick={prevPage}>Prev</button>
                                    <button onClick={nextPage}>Next</button>
                                </div>
                            </div>
                            <div className={style.right_bot}>
                                    {filtered.slice(page, page+4).map((prod) => (
                                    <ProductCard product={prod} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Theme>
    );
}
 
export default SearchPage;