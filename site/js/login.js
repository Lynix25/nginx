import { APIGet, APIPost } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL, TOKENS } from "./config.js";
import { addCustomEventListener, forEach, getFormValue, goBack, goTo, handleFormSubmited, urlB64ToUint8Array } from "./utils.js";
import { getCookie, setCookie } from "./cookiemanagement.js";

document.querySelector("#password-show-hide").addEventListener("click", e => {
    passwordShowHide("#password", ".fa-eye", ".fa-eye-slash")
})

if (getCookie(TOKENS.REMEMBERME)) {
    let data = {
        username: "rememberme",
        password: "rememberme",
        token: getCookie(TOKENS.REMEMBERME)
    }
    APIPost(ServiceURL.User.login, data).then(response => {
        if (response.status == 200) {
            let cachedItem = response.data.data.cached;
            forEach(cachedItem, (k, v) => {
                setCookie(k, v, k === TOKENS.REMEMBERME ? 24 * 365 : undefined);
            });

            Toast(Constant.httpStatus.SUCCESS, response.data.message);
            setTimeout(function () { goTo(PAGE.HOME) }, Event.timeout);
        }
    }).catch(err => {
        if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    });
}

handleFormSubmited(login);

function passwordShowHide(inputTarget, showIcon, hideIcon) {
    let inputBox = document.querySelector(inputTarget);
    let showEye = document.querySelector(showIcon);
    let hideEye = document.querySelector(hideIcon);
    hideEye.classList.remove('d-none');
    if (inputBox.type === "password") {
        inputBox.type = "text";
        showEye.style.display = "none";
        hideEye.style.display = "block";
    } else {
        inputBox.type = "password";
        showEye.style.display = "block";
        hideEye.style.display = "none";
    }
}

function login(e) {
    let data = getFormValue(e.target);
    APIPost(ServiceURL.User.login, data).then(response => {
        if (response.status == 200) {
            let cachedItem = response.data.data.cached;
            if(getCookie('id') === cachedItem.id) {
                Toast(Constant.httpStatus.WARNING, "User sudah login");
                setTimeout(function () { goTo(PAGE.HOME) }, Event.timeout);
            } else {
                forEach(cachedItem, (k, v) => {
                    setCookie(k, v, k === TOKENS.REMEMBERME ? 24 * 365 : undefined);
                });

                Toast(Constant.httpStatus.SUCCESS, response.data.message);
                setTimeout(function () { goTo(PAGE.HOME) }, Event.timeout);
            }
        }
    }).catch(err => {
        if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    });
}