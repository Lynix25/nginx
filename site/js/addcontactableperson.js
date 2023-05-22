import { APIPost } from "./api.js";
import { ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { getFormValue, handleFormSubmited } from "./utils.js";

handleFormSubmited(e => {
    let data = getFormValue(e.target);
    APIPost(ServiceURL.User.addContactable(getCookie("id")), data).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
})