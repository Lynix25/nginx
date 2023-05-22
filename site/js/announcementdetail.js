import { APIDelete, APIGet } from "./api.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { showModalConfirmation } from "./component/modal.js";
import { getParamOnURL, goBack, goTo, isOwnerOrAdmin } from "./utils.js";
import { Toast } from "./component/toast.js";

APIGet(ServiceURL.Announcement.getById(getParamOnURL("id"))).then(res => {
    let data = res.data.data;
    let image = data.image;
    let src;
    if(image == null || image.trim() === "") src = "asset/no_image.png"
    else src = `data:image/png;base64,${image}`;
    
    document.querySelector(".title").innerHTML = data.title;
    document.querySelector(".period").innerHTML = `Berlaku pada: ${data.period}`;
    document.querySelector(".description").innerHTML = data.description;
    document.querySelector(".image").setAttribute("src", src)

    if(isOwnerOrAdmin()) {
        document.querySelector(".btn-secondary").setAttribute("hidden", "");
    } else {
        document.querySelector(".btn-primary").setAttribute("hidden", "");
        document.querySelector(".btn-danger").setAttribute("hidden", "");
    }
});

document.querySelector("#editAnnouncement").addEventListener("click", e => {
    goTo(PAGE.EDITANNOUNCEMENT + getParamOnURL("id"))
});

document.querySelector("#deleteAnnouncement").addEventListener("click", e => {
    showModalConfirmation(
        Constant.modalType.DELETECONFIRMATION,
        'Hapus Pengumuman',
        'Anda yakin ingin menghapus pengumuman?',
        'Hapus', 'Batal',
        () => {
            APIDelete(ServiceURL.Announcement.delete(getParamOnURL('id'))).then(response => {
                Toast(Constant.httpStatus.SUCCESS, response.data.message);
                setTimeout(function () { goTo(PAGE.ANNOUNCEMENTMENU) }, Event.timeout);
            }).catch(err => {
                Toast(Constant.httpStatus.ERROR, err?.message);
            });
        }
    );
});

document.querySelector("#exitAnnouncement").addEventListener("click", e => {
    goTo(PAGE.ANNOUNCEMENTMENU)
});

document.querySelector("#back").addEventListener("click", e => {
    goBack();
});