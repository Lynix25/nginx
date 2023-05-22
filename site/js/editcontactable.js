import { APIGet, APIPut } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { getFormValue, getParamOnURL, goTo, handleFormSubmited } from "./utils.js";

APIGet(ServiceURL.User.getContactable(getCookie('id')) + getParamOnURL('id')).then(res => {
    let contactablePerson = res.data.data[0];
    reloadData(contactablePerson)
})

function reloadData(contactablePerson){
    let nameInput = document.querySelector("#name");
    nameInput.setAttribute("value", contactablePerson.name);

    let relationInput = document.querySelector("#relation");
    relationInput.setAttribute("value", contactablePerson.relation);

    let phoneInput = document.querySelector("#phone");
    phoneInput.setAttribute("value", contactablePerson.phone);

    let addressInput = document.querySelector("#address");
    addressInput.setAttribute("value", contactablePerson.address);
    addressInput.innerHTML = contactablePerson.address;
}

handleFormSubmited(e => {
    let data = getFormValue(e.target);
    APIPut(ServiceURL.User.editContactable(getCookie('id')) + getParamOnURL("id"), data).then(response => {
        reloadData(response.data.data);
        Toast(Constant.httpStatus.SUCCESS, response.data.message);
        setTimeout(function () { goTo(PAGE.PROFILE)}, Event.timeout);
    }).catch(err => {
        if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    });
})

document.addEventListener("change", e => {
    e.target.setAttribute("changed", "");
});