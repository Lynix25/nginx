import { APIPost } from "./api.js";
import { Toast } from "./component/toast.js";
import { ServiceURL, Constant, Event, PAGE } from "./config.js";
import { getFormValue, handleFormSubmited, getUserID, goTo, goBack } from "./utils.js";

document.querySelector(".image").innerHTML = `Unggah Gambar untuk Pengumuman (Max ${Constant.image.maxSize}MB)`;

handleFormSubmited(e => {
    let data = getFormValue(e?.target);
    if(data.image != undefined && data.image != null && data.image.size/Constant.image.dividersImageSizeByteToMB > Constant.image.maxSize) {
        Toast(Constant.httpStatus.ERROR, `Ukuran file lebih besar dari ${Constant.image.maxSize}MB`);
    } else {
        APIPost(ServiceURL.Announcement.create, data, { 
            "requesterId" : getUserID(), 
            "Content-Type" : "multipart/form-data"
        }).then(response => {
            Toast(Constant.httpStatus.SUCCESS, response.data.message);
            setTimeout(function() { goTo(PAGE.ANNOUNCEMENTMENU) }, Event.timeout);
        }).catch(err => {
            if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
            else Toast(Constant.httpStatus.ERROR, err.data.message);
        });
    }
});

document.querySelector("#image").addEventListener("change", event => {
    
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
});

document.getElementById("back").addEventListener("click", e => {
    goBack();
});