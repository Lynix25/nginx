import { APIGet, APIPut } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { getParamOnURL, goBack, handleFormSubmited, goTo, getUserID, getFormValueV2 } from "./utils.js";

document.querySelector(".image").innerHTML = `Unggah Gambar untuk Pengumuman (Max ${Constant.image.maxSize}MB)`;

let announcementData;
APIGet(ServiceURL.Announcement.getById(getParamOnURL('id'))).then(res => {
    announcementData = res.data.data;
    reloadData(announcementData)
})

function reloadData(announcement){
    let titleInput = document.querySelector("#title");
    titleInput.setAttribute("value", announcement.title);

    let periodInput = document.querySelector("#period");
    periodInput.setAttribute("value", announcement.period);

    let descriptionInput = document.querySelector("#description");
    descriptionInput.setAttribute("value", announcement.description);
    descriptionInput.innerHTML = announcement.description;

    let addressInput = document.querySelector("#currImage");
    let image = announcement.image;
    if(image === "" || image == null) addressInput.setAttribute("hidden", "");
    else addressInput.setAttribute("src", `data:image/png;base64,${image}`);
}

let countChanges = 0;
document.addEventListener("change", e => {
    e.target.setAttribute("changed", "");
    countChanges++;
});

handleFormSubmited(e => {
    let data = getFormValueV2(e.target);
    
    if(data.image != undefined && data.image != null && data.image.size/Constant.image.dividersImageSizeByteToMB > Constant.image.maxSize) {
        Toast(Constant.httpStatus.ERROR, `Ukuran file lebih besar dari ${Constant.image.maxSize}MB`);
    } else {
        APIPut(ServiceURL.Announcement.update(getParamOnURL('id')), data, { 
            "requesterId" : getUserID(), 
            "Content-Type" : "multipart/form-data"
        }).then(response => {
            reloadData(response.data.data);
            Toast(Constant.httpStatus.SUCCESS, response.data.message);
            setTimeout(function () { goTo(PAGE.ANNOUNCEMENTDETAIL + getParamOnURL('id')) }, Event.timeout);
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
        document.querySelector("#currImage").removeAttribute("hidden");
        document.querySelector(".fa-spin").setAttribute("hidden", "")
        event.target?.parentElement.querySelector("img").setAttribute("src", reader.result);
    });

    reader.addEventListener("loadstart", e => {
        document.querySelector(".fa-spin").removeAttribute("hidden")
    });

    if (file) {
        reader.readAsDataURL(file);
    }
});

document.querySelector("#back").addEventListener("click", e => {
    goBack();
});