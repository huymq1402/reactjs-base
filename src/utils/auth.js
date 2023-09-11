import axios from "@api";

export function storeToken(token, remember = false) {
    return new Promise((resolve) => {
        if (remember) {
            localStorage.setItem('accessToken', token);
        } else {
            sessionStorage.setItem('accessToken', token);
        }
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return resolve(true);
    });
}

export function removeToken() {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
}

export function getToken() {
    let token = null;
    if (window.localStorage) { 
        token = localStorage.getItem('accessToken');
    }
    if (!token) {
        token = sessionStorage.getItem('accessToken');
    } 
    return token;
}