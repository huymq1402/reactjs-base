import { Button, Checkbox, Form, Input, notification } from 'antd';
import "./index.scss";
import api from 'src/modules/api';
import { useNavigate } from 'react-router-dom';
import { storeToken } from '@utils/auth';
const Login = () => {
    const navigate = useNavigate();
    const onFinish = (fromValues) => {
        api.post("/login", fromValues).then(({ status, token, user_data , message }) => {
            if (status) {
                storeToken(token, fromValues.remember);
                navigate("/");
            } else {
                notification.error({
                    message: "Error",
                    description: message || "Hệ thống đang gặp trục trặc",
                });
            }
        }).catch((e) => {
            notification.error({
                message: "Error",
                description: "Hệ thống đang gặp trục trặc",
            });
        });
    };

    return (
        <>
            <div className="login">
                <div className="inner">
                    <h1 className="title">Login</h1>
                    <Form
                        name="basic"
                        className="login-form"
                        layout="vertical"
                        // labelCol={{
                        //     span: 8,
                        // }}
                        // wrapperCol={{
                        //     span: 16,
                        // }}
                        style={{
                            width: "100%",
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div >
        </>
    );
}
export default Login;