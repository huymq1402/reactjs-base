import { Button } from "antd";
import { useEffect, useState } from "react";

const Home = () => {
    const [intervalID, setIntervalID] = useState();
    const apiKeys = [
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYzMWJmZGUxNTQ3YWFjOWQ0NDBlM2FjYiIsInVzZXJuYW1lIjoiZGFpZ2lhLnNvY2tAZ21haWwuY29tIiwibmFtZSI6IlF1XHUwMGY0XHUwMzAxYyBIdXkifQ.0u6HF7n9R0nAjDq95acS8D3yQ1fJ4jcf4JMekCFGO_s',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY1ZmUzYjgyZDg1MjZkYTcxYjBlMTNkOCIsInVzZXJuYW1lIjoibmd1eWVuaGlldXUxNjExQGdtYWlsLmNvbSIsIm5hbWUiOiJOZ3V5ZW4gSGlldSJ9.srdNBNQGB8_2dmOAyyA0PLqFZ1EZPBlOyTu71ShGtsg'
    ];

    const callRequestInterval = () => {
        setIntervalID(
            setInterval(() => {
                callRequest();
            }, 1000)
        );
    }

    const stopRequestInterval = () => {
        clearInterval(intervalID);
        setIntervalID(null);
    }

    const callRequest = () => {
        apiKeys.forEach((apiKey) => {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': `application/json`
                },
                body: JSON.stringify({
                    "assignment_id": "6604f29ad12ad794d20800e8",
                    "is_rework": false,
                    "info": {}
                })

            };

            fetch('https://api.testonline.vn/api/app/record/start_time', requestOptions)
                .then(response => {
                    if (response.ok) {

                        return response.json(); // Chuyển response thành JSON
                    }
                })
                .then(data => {
                    console.log('done');
                }) // Log dữ liệu của response
                .catch(error => console.error('Error:', error)); // Xử lý lỗi nếu có
        })
    }

    return <>
        {
            intervalID ? <>
                <Button
                    onClick={stopRequestInterval}
                >
                    Stop requests interval
                </Button>
            </> : <>
                <Button
                    type="primary"
                    onClick={callRequestInterval}
                >
                    Send requests interval
                </Button>
            </>
        }
        <Button
            type="primary"
            onClick={callRequest}
        >
            Send requests
        </Button>
    </>
}

export default Home;