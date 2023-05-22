import { END_POINT, ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";

export function APIPut(resource, body, headers) {
    if (body != null || body != undefined) body.requesterId = getCookie("id");
    return request("put", resource, body, undefined, headers);
}

export function APIPost(resource, body, headers) {
    if (body != null || body != undefined) body.requesterId = getCookie("id");
    return request("post", resource, body, undefined, headers);
}

export function APIGet(resource, params) {
    return request("get", resource, undefined, params);
}

export function APIDelete(resource, params) {
    return request("delete", resource, undefined, params);
}

/**
 * 
 * @requires AXIOS
 * @param {String} method
 * @param {*} resource 
 * @param {JSON} body 
 * @param {JSON} params 
 * @param {JSON} headers 
 * @returns 
 */

function request(method = 'get', resource, body, params, headers) {
    let config = {
        method: method,
        url: END_POINT + resource,
        headers: {
            "ngrok-skip-browser-warning": true,
            "Access-Control-Allow-Origin": "https://6a7e-2001-448a-20a0-462-1125-e80f-a788-1cbd.ngrok-free.app",
        }
    };

    if (method != 'get' || body) config.data = body;
    if (params) config.params = params;
    if (headers) {
        config.headers = Object.assign(config.headers, headers);
    }

    if (!navigator.onLine && method != "get") {
        return new Promise((resolve, reject) => {
            if (resource == ServiceURL.User.register) {
                var file = body["identityCardImage"];
                var reader = new FileReader()

                reader.addEventListener("loadend", e => {
                    console.log(reader.result);
                    body["identityCardImage"] = reader.result;
                    config.data = body;
                    localStorage.setItem((+new Date()).toString(), JSON.stringify(config));
                })

                if (file) {
                    reader.readAsDataURL(file);
                }
                else{
                    console.log("Not Raed URL");
                }
            } else {
                localStorage.setItem((+new Date()).toString(), JSON.stringify(config));
                console.log(config);
            }
            resolve({
                data: {
                    message: "Permintaan akan di eksekusi saat anda kembali Daring"
                }
            });
        })
    }

    return new Promise((resolve, reject) => {
        let intervalId = setInterval(() => {
            if (axios) {
                clearInterval(intervalId);
                axios(config).then(result => resolve(result)).catch(err => reject(err));
            }
        }, 50);
    })
}

export function pendingRequest(config) {
    // console.log(">>>", config);
    return new Promise((resolve, reject) => {
        let intervalId = setInterval(() => {
            if (axios) {
                clearInterval(intervalId);
                axios(config).then(result => resolve(result)).catch(err => reject(err));
            }
        }, 50);
    })
}