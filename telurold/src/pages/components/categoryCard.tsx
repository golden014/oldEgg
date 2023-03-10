import { Category } from "modules/authProvider";
import style from "../../styles/style.module.scss"

const CategoryCard = (props: {category: Category}) => {
    const category = props.category
    return (  
        <div className={style.category_card_container}>
            <button>{category.category_name}</button>
        </div>
    );
}
 
export default CategoryCard;