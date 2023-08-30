const Header = ({ title, controller }) => {
    return (
        <div className="file-manager-header">
            <div className="file-manager-header-title">{title}</div>
            <div className="file-manager-header-actions">
                <span
                    className="fm-header-action-item fm-header-action-close"
                    onClick={() => controller.call("close")}
                />
            </div>
        </div>
    );
};

export default Header;
