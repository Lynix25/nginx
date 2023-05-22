import { APIGet, APIPut } from "./api.js";
import { ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { getUpdateFormValue, getParamOnURL, handleFormSubmited, isOwnerOrAdmin, getFormValueV2 } from "./utils.js";

APIGet(ServiceURL.User.getById(getParamOnURL("id")) ).then(res => {
    reloadData(res.data)
})

function reloadData(res){
    let user = res.data.user;
    let room = res.data.room;

    let nameInput = document.querySelector("#name");
    nameInput.setAttribute("value", user.name);

    let aliasInput = document.querySelector("#alias");
    aliasInput.setAttribute("value", user.alias);

    let roomInput = document.querySelector("#room");    
    if(user.role.name === "Tenant"){
        roomInput.setAttribute("value", room.name);
    }else{
        roomInput.parentElement.setAttribute("hidden", "");
    }

    let emailInput = document.querySelector("#email");
    emailInput.setAttribute("value", user.email);

    let jobInput = document.querySelector("#job");
    jobInput.setAttribute("value", user.job);

    let phoneInput = document.querySelector("#phone");
    phoneInput.setAttribute("value", user.phone);

    let genderInput = document.querySelector("#gender");
    genderInput.setAttribute("value", user.gender == "Male" ? "Laki - laki" : "Perempuan");

}

handleFormSubmited(e => {
    let data = getFormValueV2(e.target);
    APIPut(ServiceURL.User.update(getParamOnURL("id")), data,  {"Requester-ID" : getCookie("id"), "Content-Type": "multipart/form-data"}).then(res => {
        reloadData(res.data);
    })
}, undefined, true)

document.addEventListener("change", e => {
    e.target.setAttribute("changed", "");
})