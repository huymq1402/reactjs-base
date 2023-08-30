import Header from "./Header";
import Siderbar from "./Siderbar";
import "./index.scss";

function DefaultLayout({ children }) {
    return (
        <div className="wrapper">
            <Siderbar />
            <div className="container">
                <Header />
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;