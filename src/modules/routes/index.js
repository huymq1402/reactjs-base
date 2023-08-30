import Home from "../containers/Home";
import S3Storage from "../containers/S3Storage";

const publicRoutes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/s3",
        component: S3Storage,
    },
];

export default publicRoutes;
