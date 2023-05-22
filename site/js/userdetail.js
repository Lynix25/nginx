import { APIGet } from "./api.js";
import { PAGE, ServiceURL } from "./config.js";
import { UNIXtimeConverter, addCustomEventListener, getParamOnURL, goTo } from "./utils.js";

APIGet(ServiceURL.User.getById(getParamOnURL("id"))).then(res => {
    let user = res.data.data.user;
    let room = res.data.data.room;

    document.querySelector(".name").innerHTML = user.name;
    document.querySelector(".alias").innerHTML = user.alias;
    document.querySelector(".email").innerHTML = user.email;
    document.querySelector(".gender").innerHTML = user.gender;
    document.querySelector(".roomName").innerHTML = room ? room.name : "-";
    document.querySelector(".joinDate").innerHTML = UNIXtimeConverter(user.joinedOn,  "DD MMMM YYYY");
    document.querySelector(".username").innerHTML = user.account.username;
})

addCustomEventListener("edit-user", e => {
    goTo(PAGE.EDITUSER(getParamOnURL("id")))
})