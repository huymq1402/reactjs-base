import { useEffect } from "react";
import api from "@modules/api";

const Test = () => {
    useEffect(() => {
        api.get('').then(({status}) => {
            console.log(status);
        });
    }, []);
    return <>
        Test page
    </>
}

export default Test;