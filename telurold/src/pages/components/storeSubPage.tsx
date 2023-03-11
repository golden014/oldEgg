import { Product } from "modules/authProvider"
import { useEffect, useState } from "react"
import style from "../../styles/style.module.scss"
import ProductCard from "./productCard"

const StoreSubPage = (props: {threeOption: string, store_id: any}) => {

    const store_id = props.store_id
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(0)

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
                    left
                </div>

                <div className={style.right}>
                    <div className={style.right_top}>
                        <button onClick={nextPage}>Next</button>
                        <button onClick={prevPage}>Prev</button>
                    </div>
                    <div className={style.right_bot}>
                        {products.map((prod) => (
                        <ProductCard product={prod} />
                    ))}
                    </div>
                </div>
            </div>
        )
    } else if (props.threeOption == "Reviews") {
        return (
            <div>
                Reviews
            </div>
        )
    } else if (props.threeOption == "AboutUs") {
        return (
            <div>
                About Us
            </div>
        )
    } else {
        return (  
            <div></div>
        );
    }
}
 
export default StoreSubPage;