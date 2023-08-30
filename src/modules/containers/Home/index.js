import { useEffect } from "react";
import api from "@modules/api";

const Home = () => {
    useEffect(() => {
        api.get('').then(({status}) => {
            console.log(status);
        });
    }, []);
    return <>
        Home page
    </>
}

export default Home;