import { APIDelete, APIGet } from "./api.js";
import { showModalConfirmation } from "./component/modal.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { addCustomEventListener, getUserID, goTo, isOwner } from "./utils.js";

APIGet(ServiceURL.User.getAll('')).then(res => {
    let users = res.data.data;
    let countTenant = 0, countAdmin = 0;
    users.forEach(data => {
        let user = document.createElement("li");
        user.classList.add("item", "d-flex", "justify-content-between", "align-items-center", "m-0");
        
        let role = data.user.role.name;

        let userDetail = document.createElement("div");
        userDetail.classList.add("d-flex");
        userDetail.setAttribute("style", "cursor: pointer")
        userDetail.innerHTML =
            `<div class="d-flex">
                <i class="fad fa-user me-3 my-auto"></i>
                <div>
                    <div>${data.user.name}</div>
                    <div>${role}</div>
                </div>
            </div>`;
        userDetail.addEventListener("click", e => {
            if(role === getCookie('role')) goTo(PAGE.PROFILE);
            else goTo(PAGE.USERDETAIL + data.user.id);
        });
        user.appendChild(userDetail);
        
        if(role === Constant.role.OWNER) {
            document.querySelector("#owner-list").appendChild(user);
        } else {

            if(isOwner()) {

                let buttonContainer = document.createElement("div");
            
                let editButton = document.createElement("button");
                editButton.classList.add("text-end", "pe-0");
                editButton.innerHTML = `
                    <div class="hover-text">
                        <span class="tooltip-text tooltip-top-toggle">Ubah</span>
                        <i class="fad fa-edit text-end"></i>
                    </div>
                `;
                editButton.classList.add("btn");
                editButton.addEventListener("click", e => {
                    goTo(PAGE.EDITUSER(data.user.id))
                });
                buttonContainer.appendChild(editButton);
        
                let deleteButton = document.createElement("button");
                deleteButton.classList.add("text-end", "pe-0");
                deleteButton.innerHTML = `
                    <div class="hover-text">
                        <span class="tooltip-text tooltip-top-toggle">Hapus</span>
                        <i class="fad fa-trash text-end"></i>
                    </div>
                `;
                deleteButton.classList.add("btn");
                deleteButton.addEventListener("click", e => {
                    showModalConfirmation(
                        Constant.modalType.DELETECONFIRMATION, 
                        'Hapus Data User', 
                        'Anda yakin ingin menghapus data user ini?', 
                        'Hapus', 'Batal', () => {
                            APIDelete(ServiceURL.User.delete(data.user.id, getUserID())).then(response => {
                                Toast(Constant.httpStatus.SUCCESS, response.data.message);
                                setTimeout(function() { goTo(PAGE.ROOMLIST)}, Event.timeout);
                            }).catch(err => {
                                if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                                else Toast(Constant.httpStatus.ERROR, err.data.message);
                            });
                        }
                    );
                });
                buttonContainer.appendChild(deleteButton);
                user.appendChild(buttonContainer);
            }

            if(role === Constant.role.ADMIN) {
                document.querySelector("#admin-list").appendChild(user);
                countAdmin++;
            } else {
                document.querySelector("#tenant-list").appendChild(user);
                countTenant++;
            }
        }
    });
    if(countAdmin == 0) document.querySelector("#separator1").setAttribute("hidden", "");
    if(countTenant == 0) document.querySelector("#separator2").setAttribute("hidden", "");
});