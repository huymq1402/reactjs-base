import axios from "axios";
import Config from "@config";
// import { removeToken, storeToken } from "@utils/auth";
// import history from "src/history";
// import { createValidItems, findFirstValidItem, findValidItemFromUrl } from "./mock/items";

const params = { locale: localStorage.getItem("locale") };
if (!Config.BROWSER) {
    params.mobile = true;
}
let normalAxios = axios.create({
    baseURL: Config.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    params,
});

const defaultGetParams = {};

export const setDefaultGetParameter = (name, value) => {
    if (value) {
        defaultGetParams[name] = value;
    } else {
        delete defaultGetParams[name];
    }
};

// Interceptor request
normalAxios.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        if (config.method === "get") {
            config.params = Object.assign({ ...defaultGetParams }, config.params || {});
        }
        // config.headers["X-Referrer"] = window.location.href;

        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Interceptor response
normalAxios.interceptors.response.use(
    (response) => {
        // Do something with response data
        return response.data;
    },
    (error) => {
        if (error?.response?.status === 401) {
            removeToken();
            sessionStorage.setItem("__redirectUrl", window.location.pathname);
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        } else if (error?.response?.status === 403) {
            if (error?.response?.data.message === "Role Invalid") {
                const validItems = createValidItems();
                let valid_url = window.localStorage.getItem("authed_url") || "/home";
                valid_url === "/" && (valid_url = "/home");
                let validItem = findValidItemFromUrl(validItems, valid_url);
                if (!validItem) {
                    validItem = findFirstValidItem(validItems);
                }
                if (validItem && validItem.url !== window.location.pathname) {
                    window.localStorage.setItem("authed_url", validItem.url);
                    // history.push(validItem.url);
                }
            } else if (error.response.data.message === "Token Expired") {
                if (localStorage.getItem("rem") === "true") {
                    axios.post(Config.API_URL + "/user/refresh").then(function (res) {
                        storeToken(res.data.token).then(function () {
                            error.config.headers.Authorization = "Bearer " + res.data.token;
                            return axios(error.config);
                        });
                    });
                } else {
                    removeToken();
                    if (window.location.pathname !== "/login") {
                        window.location.href = "/login";
                    }
                }
            }
        } else if (error?.response?.status === 503) {
            // System maintenance
            window.location.href = "/maintenance";
        }

        return Promise.reject(error);
    }
);

const api = normalAxios;

export default api;
