import { APIDelete, APIGet } from "./api.js";
import { showModalConfirmation } from "./component/modal.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { addCustomEventListener } from "./utils.js";
import { createElementFromString, getUserID, goTo, isOwnerOrAdmin } from "./utils.js";

if(!isOwnerOrAdmin())
    document.querySelector("#add-room-toggle").setAttribute("hidden", "");

APIGet(ServiceURL.Room.getAll).then(res => {
    let roomList = res.data.data;
    console.log(roomList);
    roomList.forEach(room => {

        let data = room.room;
        let roomItem = document.createElement("li");
        roomItem.classList.add("card-as-container", "flex-column", "d-flex", "justify-content-center", "align-items-center");
        roomItem.setAttribute("style", "aspect-ratio: 1/1; width: 180px; cursor: pointer");
        roomItem.innerHTML = `
            <div class="hover-text">
                <span class="tooltip-text tooltip-top-toggle">${room.status} (${room.totalTenants}/${data.quota})</span>
                <span><a href="${PAGE.ROOMDETAIL + data.id}"><i class="fad fa-door-closed ${room.totalTenants >= data.quota ? "fa-door-closed" : "fa-door-open"} my-auto fs-1"></i></span></a>
            </div>
            <div class="text-center my-2">
                <div>${data.name}</div>
                <div class="small">${data.allotment}</div>
            </div>
        `;

        
        if(isOwnerOrAdmin()) {
            let roomActionContainer = document.createElement("div");
            roomActionContainer.classList.add("d-flex");

            let editToggle = document.createElement("div");
            editToggle.classList.add("hover-text");
            editToggle.innerHTML = `
                <span class="tooltip-text tooltip-bottom">Ubah Data</span>
                <span><button type="edit" class="btn p-0 px-1"><i class="fad fa-edit"></i></button></span>
            `;
            editToggle.addEventListener("click", e => {
                goTo(PAGE.ROOMDETAIL + data.id);
            });
            roomActionContainer.appendChild(editToggle)
    
            let deleteToggle = document.createElement("div");
            deleteToggle.classList.add("hover-text");
            deleteToggle.innerHTML = `
                <span class="tooltip-text tooltip-bottom">Hapus Data</span>
                <span><button type="delete" class="btn p-0 px-1" data-bs-toggle="modal" data-bs-target="#confirmation"><i class="fad fa-trash"></i></button></span>
            `;
            deleteToggle.addEventListener("click", e => {
                showModalConfirmation(
                    Constant.modalType.DELETECONFIRMATION, 
                    'Hapus Data Kamar', 
                    'Anda yakin ingin menghapus data kamar ini?', 
                    'Hapus', 'Batal', () => {
                        APIDelete(ServiceURL.Room.delete(data.id, getUserID())).then(response => {
                            Toast(Constant.httpStatus.SUCCESS, response.data.message);
                            setTimeout(function() { goTo(PAGE.ROOMLIST)}, Event.timeout);
                        }).catch(err => {
                            if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                            else Toast(Constant.httpStatus.ERROR, err.data.message);
                        });
                    }
                );
            });
            roomActionContainer.appendChild(deleteToggle);
            roomItem.appendChild(roomActionContainer);
        }

        const roomElement = roomItem;//createElementFromString(room);
        addCustomEventListener("click", e => {
            goTo(PAGE.ROOMDETAIL + data.id);
        }, roomElement)

        // addCustomEventListener("edit", e => {
        //     goTo(PAGE.EDITROOM + data.id);
        // }, roomElement);

        // addCustomEventListener("delete", e => {
        //     document.querySelector("#room-name").innerHTML = data.name;
        //     setAttributes(document.querySelector("[type='confirm-delete']"), { "data": data.id, "data-room-name": data.name });
        // }, roomElement, ...Array(3), true);
        document.querySelector("#room-list").appendChild(roomItem);
    });
}).catch(e => {
    console.log(e);
});

// const toastTrigger = document.getElementById('liveToastBtn')

// if (toastTrigger) {
//     toastTrigger.addEventListener('click', () => {
//         const toast = new bootstrap.Toast(toastLiveExample)
//         toast.show()
//     })
// }

// addCustomEventListener("confirm-delete", e => {
//     console.log("Delete asd");
//     const toastLiveExample = document.getElementById('liveToast');
//     const toast = new bootstrap.Toast(toastLiveExample);
//     toast.show();
// })