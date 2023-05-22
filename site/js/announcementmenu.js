import { APIDelete, APIGet } from "./api.js";
import { showModalConfirmation } from "./component/modal.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { addCustomEventListener, goBack, goTo, isOwnerOrAdmin } from "./utils.js";

if(!isOwnerOrAdmin())
    document.querySelector("#add-announcement-toggle").setAttribute("hidden", "");
    

const searchBox = document.getElementById("search");
let announcementList = []

let showNotFound;
searchBox.addEventListener("input", e => {
    var found = 0;
    const search = e.target.value.toLowerCase();
    for(let i=0; i < announcementList.length; i++) {
        const isVisible = announcementList[i].title.toLowerCase().includes(search);

        if(isVisible) {
            found++;
            announcementList[i].element.style.display = "";
        }
        else announcementList[i].element.style.display = "none";
    }
    showNotFound = found ? false : true;
    if(showNotFound){
        document.querySelector(".no-data").removeAttribute("hidden");
    } else {
        document.querySelector(".no-data").setAttribute("hidden", "");
    }
});

APIGet(ServiceURL.Announcement.getAll).then(res => {
    let announcements = res.data.data;
    if(announcements.length == 0) {
        let announcement = document.createElement("div");
        announcement.classList.add("text-center", "w-100", "p-2");
        announcement.innerHTML = `
            <img src="./asset/no_data.png" alt="Tidak ada data" height="100px" style="opacity: 50%;">
            <p>Tidak ada pengumuman</p>
        `;
        document.querySelector("#list-announcement").appendChild(announcement);
    } else {
        announcementList = announcements.map(data => {
            let src;
            let image = data.image;
            if(image == null || image.trim() === "") src = "asset/no_image.png"
            else src = `data:image/png;base64,${image}`;
            
            let title = data.title;
            let content = data.description;
            let announcement = document.createElement("div");
            announcement.classList.add("card");

            let announcementContent = document.createElement("div");
            announcementContent.innerHTML = `
                <div class="card-image-container">
                    <img src=${src} >
                </div>
                <div class="card-body content">
                    <div class="card-title m-0"><b>${title}</b></div>
                    <div class="card-text mb-1 content">${content}</div>
                </div>
            `;

            announcementContent.addEventListener("click", e => {
                goTo(PAGE.ANNOUNCEMENTDETAIL + data.id);
            });
            announcement.appendChild(announcementContent);
            
            let announcementFooter = document.createElement("div");
            announcementFooter.classList.add("card-footer", "p-0", "pt-2");
            announcementFooter.innerHTML = `
                <p class="small text-center pb-2">Berlaku pada: ${data.period}</p>
            `;
            announcement.appendChild(announcementFooter);

            if(isOwnerOrAdmin()) {
                let editButton = document.createElement("div");
                editButton.classList.add("hover-text", "pe-2", "w-50", "badge-yellow");
                editButton.innerHTML = `
                    <span class="tooltip-text tooltip-top-toggle2">Ubah</span>
                    <i class="fa fa-pencil small" style="cursor: pointer"></i>
                `;
                
                editButton.addEventListener("click", e => {
                    goTo(PAGE.EDITANNOUNCEMENT + data.id);
                });
                announcementFooter.appendChild(editButton);
    
                let deleteButton = document.createElement("div");
                deleteButton.classList.add("hover-text", "w-50", "badge-red");
                deleteButton.innerHTML = `
                    <span class="tooltip-text tooltip-top-toggle2">Hapus</span>
                    <i class="fa fa-trash small" style="cursor: pointer"></i>
                `;
                
                deleteButton.addEventListener("click", e => {
                    showModalConfirmation(
                        Constant.modalType.DELETECONFIRMATION,
                        'Hapus Pengumuman',
                        'Anda yakin ingin menghapus pengumuman?',
                        'Hapus', 'Batal',
                        () => {
                            APIDelete(ServiceURL.Announcement.delete(data.id)).then(response => {
                                Toast(Constant.httpStatus.SUCCESS, response.data.message);
                                setTimeout(function () { goTo(PAGE.ANNOUNCEMENTMENU) }, Event.timeout);
                            }).catch(err => {
                                if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                                else Toast(Constant.httpStatus.ERROR, err.data.message);
                            });
                        }
                    );
                });
                announcementFooter.appendChild(deleteButton);
            }
            
            document.querySelector("#list-announcement").appendChild(announcement);
            return { title: title, element: announcement};
        });
    }
});

document.getElementById("add-new").addEventListener("click", e => {
    goTo(PAGE.CREATEANNOUNCEMENT);
});

document.getElementById("back").addEventListener("click", e => {
    goBack();
});