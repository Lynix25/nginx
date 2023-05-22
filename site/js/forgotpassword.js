import { APIGet, APIPut } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, ServiceURL } from "./config.js";
import { logoutWithoutToast } from "./main.js";
import { getFormValue, goTo, handleFormSubmited } from "./utils.js";

window.addEventListener('load', e => {
    document.querySelector("#password-show-hide").addEventListener("click", e => {
        passwordShowHide("#newPassword", "#reTypeNewPassword", ".fa-eye", ".fa-eye-slash")
    })
    handleFormSubmited(resetPassword)
})

function passwordShowHide(inputTarget, inputTarget2, showIcon, hideIcon) {
    let inputBox = document.querySelector(inputTarget);
    let inputBox2 = document.querySelector(inputTarget2);
    let showEye = document.querySelector(showIcon);
    let hideEye = document.querySelector(hideIcon);
    hideEye.classList.remove('d-none');
    if (inputBox.type === "password" && inputBox2.type === "password") {
        inputBox.type = "text";
        inputBox2.type = "text";
        showEye.style.display = "none";
        hideEye.style.display = "block";
    } else {
        inputBox.type = "password";
        inputBox2.type = "password";
        showEye.style.display = "block";
        hideEye.style.display = "none";
    }
}

function resetPassword(e) {
    let data = getFormValue(e.target);
    APIPut(ServiceURL.User.forgotPassword, data).then(response => {
        if (response.status == 200) {
            Toast(Constant.httpStatus.SUCCESS, response.data.message);
            if(document.cookie.length > 0) logoutWithoutToast();
            setTimeout(function() { goTo('./login.html') }, Event.timeout);
        }
    }).catch(err => {
        if(err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    });
}