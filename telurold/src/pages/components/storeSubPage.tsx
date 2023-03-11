import style from "../../styles/style.module.scss"

const StoreSubPage = (props: {threeOption: string}) => {




    if (props.threeOption == "Products") {
        return (
            <div className={style.store_products_container}>
                <div className={style.left}>
                    left
                </div>

                <div className={style.right}>
                    right
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