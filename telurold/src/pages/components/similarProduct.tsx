import { Product } from "modules/authProvider"
import { useEffect, useState } from "react"
import ProductCard from "./productCard"

const SimilarProducts = (props: {categoryId: any, currProdId: any}) => {

    const [prods, setProds] = useState<Product[]>([])
    // const [filtered, setFiltered] = useState(false)
    //query utk ambil semua product dengan category id = category_id
    useEffect(() => {
        // if (!filtered) {
            const getSimilar = async () => {
                //send req post ke backend utk masukin voucher ke database
    
                
                try {
                    console.log("prod id aaaaaaaaaaa");
                    console.log(props.currProdId);
                    
                    
                    const res = await fetch("http://localhost:1234/getAllProductByCategory", {
                        method: "POST",
                        headers: { "Content-Type": "application/json;charset=utf-8" },
                        body: JSON.stringify({
                            category_id: props.categoryId,
                            curr_prod_id: parseInt(props.currProdId)
                        }),
                    });
        
                    if (res.ok) {
                        const data = await res.json();
                        // console.log(res);
                        // console.log(data);
                        setProds(data)
                        // console.log(prods);
                        
                        // const updatedProds = ;
                       
                        
                    } else {
                        console.log("res not ok");
                    }
        
                    console.log(res);
                } catch (error) {
                    
                }
            }
            getSimilar()
            // console.log("curr prod id");
            // console.log(props.currProdId);
            
        //     console.log("after filtered");
        //     console.log(prods);
            
        //    if (prods) {
        //     setProds(prods.filter(prod => prod.product_name !== 'Raizen 420'));
        //    }

    }, [])

   
   
 
            // setProds(prods.filter((prod) => prod.product_id !== props.currProdId));
  
    if (!prods) {
        return (
            <h1>Loading...</h1>
        )
    } else {
        // console.log(prods);
        // console.log(props.currProdId);
        // const temp = parseInt(props.currProdId)
        
        // useEffect(() => {
        //     console.log("in useeffect");
        //     console.log(prods);
            
        //     setProds(prods.filter(prod => prod.product_name == 'Raizen 420'));
        // }, [])
        // setProds(prods.filter((prod) => prod.product_id !== props.currProdId));

        // console.log(prods);
        
        return (  
            <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(4, 25%)"
            }}>
                {prods.map((prod) => (
                    <ProductCard product={prod} />
                ))}
            </div>
        );
    }
}
 
export default SimilarProducts;