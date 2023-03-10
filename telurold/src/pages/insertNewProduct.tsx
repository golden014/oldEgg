import Theme from "./components/theme";
import { useState, useEffect } from "react"
import style from "../styles/style.module.scss"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebaseconfig";
import { Category, SubCategory } from "modules/authProvider";


const InsertNewProduct = () => {
    // const [storeId, setStoreId] = useState("")
    const [productName, setProductName] = useState("")
    const [stock, setStock] = useState(0)
    const [productDescription, setproductDescription] = useState("")
    const [categoryId, setCategoryId] = useState(0)
    const [subCategoryId, setSubCategoryId] = useState(0)
    const [price, setPrice] = useState(0)

    var store_id:any
    if (typeof window !== 'undefined' && window.localStorage) {

        store_id = localStorage.getItem("store_id")
        store_id = parseInt(store_id)
    }
    
    //utk file image nya
    const [tempImage, setTempImage] = useState<File | null>(null)

    //utk firebase
    const [productImage, setProductImage] = useState("")

    //saat temp image berubah, upload ke firebase
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

    const [categories, setCategories] = useState<Category[]>([])
    const [subCategories, setSubCategories] = useState<SubCategory[]>([])

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

    const handleFileSelect = (event:any) => {
        setTempImage(event.target.files[0]);
    }

    const handleAdd = async () => {
        try {
            const res = await fetch("http://localhost:1234/addProduct", {
                    method: "POST",
                    headers: {"Content-Type" : "application/json;;charset=utf-8"},
                    body: JSON.stringify({ 
                        store_id: store_id,
                        product_name: productName,
                        stock: stock,
                        product_description: productDescription,
                        category_id: categoryId,
                        product_image: productImage,
                        sub_category_id: subCategoryId,
                        price:price,
                    })
                })
            if (res.ok) {
                alert("Insert Success !")
            } else {
                alert("Error")
                console.log(res);
            }
        } catch (error) {
            console.log(error);
            alert("error")
        }
    }

    console.log(categories);
    console.log(subCategories);
    
    
    return (  
        <Theme>
            <div className={style.voucher_balance_container}>
                <div className={style.voucher_balance_input}>
                    <p>Set Product Name</p>
                    <input type="text" placeholder="Product Name" onChange={(e) => setProductName(e.target.value)}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Set Product Description</p>
                    <input type="text" placeholder="Product Description" onChange={(e) => setproductDescription(e.target.value)}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Set Initial Stock</p>
                    <input type="number" placeholder="Initial Stock" onChange={(e) => setStock(parseInt(e.target.value))}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Set Price per Item ($)</p>
                    <input type="number" placeholder="Price" onChange={(e) => setPrice(parseInt(e.target.value))}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Insert image</p>
                    <input type="file" onChange={handleFileSelect} style={{
                        borderStyle: 'none'
                    }}/>

                </div>


           
                <div className={style.voucher_balance_input}>
                    <p>Category</p>
                    <select onChange={(e) => setCategoryId(parseInt(e.target.value))}>
                        {categories.map((category) =>(
                            <option value={category.category_id}>{category.category_name}</option>
                        ))}
                    </select>
                </div>


                <div className={style.voucher_balance_input}>
                    <p>SubCategory</p>
                    <select onChange={(e) => setSubCategoryId(parseInt(e.target.value))}>
                        {subCategories.map((subcategory) => (
                            <option value={subcategory.sub_category_id}>{subcategory.sub_category_name}</option>
                        ))}
                    </select>
                </div>

                <button onClick={handleAdd}>Insert New Product</button>
            </div>
        </Theme>
    );
}
 
export default InsertNewProduct;