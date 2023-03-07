import { useEffect } from "react"

// const StoreChangeInfo = (props: {column: string, newAttribute: string, store_id: string}) => {
    
//     const column = props.column
//     const newAttribute = props.newAttribute
//     const store_id = props.store_id

//     console.log(column, newAttribute, store_id);

    

//     return (  
//         <div>
//         </div>
//     );
// }
 
// export default StoreChangeInfo;

export const storeChangeInfo = async (column: string, newAttribute: string, store_id: string) => {
    //dari table stores, ganti column column dari store dengan id store_id
    //dengan value baru yaitu value newAttribute

    try {
        // const res = await fetch("http://localhost:1234/addVoucher", {
        //     method: "POST",
        //     headers: {"Content-Type": "application/json;;charset=utf-8"},
        //     body: JSON.stringify({
        //         voucher_balance: voucherBalance,
        //         voucher_code: voucherCode,
        //         valid_until: validUntil,
        //     })
        // }) 

        const res = await fetch("http://localhost:1234/updateStoreInfo", {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify({
                column: column,
                new_attribute: newAttribute,
                store_id: store_id
            }),
        });

        if (res.ok) {
            console.log("res ok");
            alert("Change Success !")
        } else {
            console.log("res not ok");
        }

        console.log(res);
    } catch (error) {
        
    }
}