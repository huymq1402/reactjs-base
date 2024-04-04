import Home from "@containers/Home";
import List from "src/modules/containers/List";
import Login from "@containers/Login";

const publicRoutes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/list",
        component: List,
    },
    {
        path: "/login",
        component: Login,
    },
];

export default publicRoutes;
