import { storage } from "@/firebaseconfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Category, Product, SubCategory } from "modules/authProvider";
import { useState, useEffect } from "react"
import style from "../styles/style.module.scss"
import Theme from "./components/theme";

const EditProduct = (props: {product: Product, store_id: string}) => {
    const product = props.product
    const [productName, setProductName] = useState(product.product_name)
    const [stock, setStock] = useState(product.stock)
    const [productDescription, setproductDescription] = useState(product.product_description)
    const [categoryId, setCategoryId] = useState(product.category_id)
    const [subCategoryId, setSubCategoryId] = useState(product.sub_category_id)
    const [price, setPrice] = useState(product.price)
    const [categories, setCategories] = useState<Category[]>([])
    const [subCategories, setSubCategories] = useState<SubCategory[]>([])

     //utk file image nya
     const [tempImage, setTempImage] = useState<File | null>(null)

     //utk firebase
     const [productImage, setProductImage] = useState(product.product_image)

     useEffect( () => {
        if (!tempImage) {
            return
        }

        const uploadFirebase = async () => {
            const storageRef = ref(storage, `products/${tempImage.name}`);
            const snapshot = await uploadBytesResumable(storageRef, tempImage);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setProductImage(downloadURL)
        }

        uploadFirebase()
        console.log("upload done !");
    }, [tempImage])

    const handleFileSelect = (event:any) => {
        setTempImage(event.target.files[0]);
    }

    useEffect(() => {
        fetch('http://localhost:1234/getAllCategory')
        .then((response) => response.json())
        .then((data) => {
            setCategories(data);
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });

        fetch('http://localhost:1234/getAllSubCategory')
        .then((response) => response.json())
        .then((data) => {
            setSubCategories(data);
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    const updateProduct = async () => {
        try {
            const res = await fetch("http://localhost:1234/updateProductById", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    product_id: parseInt(product.product_id),
                    store_id: parseInt(props.store_id),
                    product_name: productName,
                    stock: stock,
                    product_description: productDescription,
                    category_id: categoryId,
                    product_image: productImage,
                    sub_category_id: subCategoryId,
                    price: price
                }),
            });

            const data = await res.json()

            if (res.ok) {
                alert("Success !")
                
                
            } else {
                alert(data.error)
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    }

    return (  
        <Theme>
            <div className={style.voucher_balance_container}>
                <div className={style.voucher_balance_input}>
                    <p>Update Product Name</p>
                    <input type="text" placeholder={product.product_name} onChange={(e) => setProductName(e.target.value)}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Update Product Description</p>
                    <input type="text" placeholder={product.product_description} onChange={(e) => setproductDescription(e.target.value)}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Update Stock</p>
                    <input type="number" value={product.stock} onChange={(e) => setStock(parseInt(e.target.value))}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Update Price per Item ($)</p>
                    <input type="number" value={product.price} onChange={(e) => setPrice(parseInt(e.target.value))}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Update image</p>
                    <input type="file" onChange={handleFileSelect} style={{
                        borderStyle: 'none'
                    }}/>

                </div>

                <div className={style.voucher_balance_input}>
                    <p>Category</p>
                    <select onChange={(e) => setCategoryId(parseInt(e.target.value))}>
                    <option value={product.category_id}></option>
                        {categories.map((category) =>(
                            <option value={category.category_id}>{category.category_name}</option>
                        ))}
                    </select>
                </div>


                <div className={style.voucher_balance_input}>
                    <p>SubCategory</p>
                    <select onChange={(e) => setSubCategoryId(parseInt(e.target.value))}>
                        <option value={product.sub_category_id}></option>
                        {subCategories.map((subcategory) => (
                            <option value={subcategory.sub_category_id}>{subcategory.sub_category_name}</option>
                        ))}
                    </select>
                </div>

            <button onClick={updateProduct}>Update Product</button>
        </div>
    </Theme>
    );
}
 
export default EditProduct;