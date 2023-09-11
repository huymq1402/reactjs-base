import Home from "@containers/Home";
import Test from "@containers/Test";
import Login from "@containers/Login";

const publicRoutes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/test",
        component: Test,
    },
    {
        path: "/login",
        component: Login,
    },
];

export default publicRoutes;
