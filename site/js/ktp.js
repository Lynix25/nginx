import { APIGet, APIPut } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { addCustomEventListener, convertImage64ToSrc, getFormValueV2, handleFormSubmited } from "./utils.js";

APIGet(ServiceURL.User.getById(getCookie('id'))).then(res => {
    let user = res.data.data.user;

    document.querySelector("#identity-image").setAttribute("src", convertImage64ToSrc(user.identityCardImage));
});

handleFormSubmited(e => {
    let data = getFormValueV2(e.target);
    
    APIPut(ServiceURL.User.update(getCookie("id")), data, {"Content-Type": "multipart/form-data"}).then(res => {
        Toast(Constant.httpStatus.SUCCESS, res.data.message);
    }).catch(err => {
        Toast(Constant.httpStatus.ERROR, err.message);
    })
})

document.querySelector("#identityCardImage").addEventListener("change", event => {
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.addEventListener("loadend", e => {
        // document.querySelector(".fa-spin").setAttribute("hidden", "")
        document.querySelector("#identity-image").setAttribute("src", reader.result);
    })

    reader.addEventListener("loadstart", e => {
        // document.querySelector(".fa-spin").removeAttribute("hidden")
    })

    if (file) {
        reader.readAsDataURL(file);
    }
})

addCustomEventListener("open-update", e => {
    document.querySelector("form").removeAttribute("hidden");
    e.detail.target.setAttribute("hidden", "");
})