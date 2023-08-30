import Header from "../Header";
import Siderbar from "./Siderbar";
import classNames from 'classnames/bind';
import styles from "./DefaultLayout.module.scss";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Siderbar />
            <div className={cx('container')}>
                <Header />
                <div className={cx('content')}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;