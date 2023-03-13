const Rating = (props: {rating:number}) => {
    switch (props.rating) {
        case 1:
            return (
                <h2>⭐</h2>
            )
        case 2:
            return (
                <h2>⭐⭐</h2>
            )
        case 3:
            return (
                <h2>⭐⭐⭐</h2>
            )
        case 4:
            return (
                <h2>⭐⭐⭐⭐</h2>
            )
        default:
            return(
                <h2>⭐⭐⭐⭐⭐</h2>
            )
    }
}
export default Rating;