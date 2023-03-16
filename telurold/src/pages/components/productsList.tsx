import { Product } from 'modules/authProvider';
import { useState, useEffect } from 'react';
import ProductCard from './productCard';
import style from "../../styles/style.module.scss"

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     fetch(`http://localhost:1234/api/products?offset=${products.length}&limit=10`)
//       .then(response => response.json())
//       .then(data => {
//         console.log(data);
//         setProducts(prevProducts => [...prevProducts, ...data.products]);
//         setLoading(false);
//       })
//       .catch(error => console.log(error));
//   }, []);

//   const handleScroll = async(event:any) => {
//     const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
//     if (scrollHeight - scrollTop === clientHeight) {
//         console.log("infinite scrolling triggered");
        
//       setLoading(true);
//       const response = await fetch(`http://localhost:1234/api/products?offset=${products.length}&limit=10`);
//       const data = await response.json();
//       setProducts(prevProducts => [...prevProducts, ...data.products]);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
useEffect(() => {
    const handleScroll = async () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  
      if (scrollHeight - scrollTop === clientHeight) {
        console.log("infinite scrolling triggered");
  
        setLoading(true);
  
        const response = await fetch(`http://localhost:1234/api/products?offset=${products.length}&limit=10`);
        const data = await response.json();
        setProducts(prevProducts => [...prevProducts, ...data.products]);
  
        setLoading(false);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [products.length]);

  return (
    <div className={style.infinite_scrolling}>
        {products.map((product) => (
            <ProductCard product={product}/>
        ))}
      {/* {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))} */}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default ProductList;