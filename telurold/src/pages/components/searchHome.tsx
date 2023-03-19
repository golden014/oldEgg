import { Product } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "../../styles/style.module.scss"
import PopUpSearch from "./popUpSearch";


const SearchHome = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [keyword, setKeyword] = useState("")

    const router = useRouter()
    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") {
          //buat page utk hasil search dengan pass si products
          router.push({
            pathname: '/searchPage',
            query: { products: JSON.stringify(products), keyword: keyword },
          })
        }
      };

    useEffect(() => {

        if (keyword === "") {
            setProducts([])
        } else {
            const getProductsByKeyword = async () => {
                try {
                    const res = await fetch("http://localhost:1234/getProductsByKeyword", {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=utf-8"},
                        body: JSON.stringify({
                            keyword: keyword
                        }),
                    });
    
                    if (res.ok) {
                        const data = await res.json();
                        setProducts(data)
                        
                    } else {
                        console.log("smth went wrong");
                    }
    
                } catch (error){
                    console.log(error);                
                }
            }
    
            getProductsByKeyword()
        }
    }, [keyword])

    return (  
        <div className={style.search_bar_home}>
            <input type="text" placeholder="Search..." className="search-bar" 
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}/>
            <PopUpSearch products={products}/>
        </div>
    );
}
 
export default SearchHome;