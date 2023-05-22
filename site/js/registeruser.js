import { APIGet, APIPost } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, PAGE, ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { getFormValueV2, goBack, goTo, handleFormSubmited } from "./utils.js";

handleFormSubmited(e => {
    let data = getFormValueV2(e.target);
    
    APIPost(ServiceURL.User.register, data, { "Requester-ID": getCookie("id"), "Content-Type": "multipart/form-data" }).then(res => {
        Toast(Constant.httpStatus.SUCCESS, res.data.message);
        goTo(PAGE.USERLIST);
    }).catch(err => {
        console.log(err);
    })

})

APIGet(ServiceURL.Room.getAll).then(res => {
    addOptions("#room", res.data.data, "name");
})

function addOptions(selector, arrayOfObjectOptions, innerHTMLKey, valueKey = "id") {
    let selection = document.querySelector(selector);
    arrayOfObjectOptions.forEach(roomDTO => {
        let option = document.createElement("option");
        option.innerHTML = roomDTO.room.name;
        option.setAttribute('value', roomDTO.room.id);
        selection.appendChild(option);
    });
}

document.querySelector("#identityCardImage").addEventListener("change", event => {
    let file = event.target.files[0];
    let reader = new FileReader();
    let loading = document.createElement("i");

    reader.addEventListener("loadend", e => {
        document.querySelector(".fa-spin").setAttribute("hidden", "")
        event.target?.parentElement.querySelector("img").setAttribute("src", reader.result);
    })

    reader.addEventListener("loadstart", e => {
        document.querySelector(".fa-spin").removeAttribute("hidden")
    })

    if (file) {
        reader.readAsDataURL(file);
    }
})

document.getElementById("back").addEventListener("click", e => {
    goBack();
});