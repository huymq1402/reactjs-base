import Home from "@containers/Home";
import Test from "@containers/Test";

const publicRoutes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/test",
        component: Test,
    },
];

export default publicRoutes;
