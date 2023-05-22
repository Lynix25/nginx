import { APIDelete, APIGet } from "./api.js";
import { showModalConfirmation } from "./component/modal.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { showModalForm } from "./createcontactable.js";
import { logout } from "./main.js";
import { UNIXtimeConverter, addCustomEventListener, goTo, isOwnerOrAdmin, numberWithThousandsSeparators } from "./utils.js";

if(isOwnerOrAdmin()) {
    document.querySelector(".user-info").innerHTML = "<b>Biodata</b>";
    document.querySelector(".roomOrAddress-info").innerHTML = "<b>Info Kos</b>";
    document.querySelector(".about").setAttribute("hidden", "");
    document.querySelector("#contactable-information").setAttribute("hidden", "");

    APIGet(ServiceURL.MasterData.getIndekos).then(res => {
        let data = res.data;
        document.querySelector(".kosName").innerHTML = `${data.name}`;
        document.querySelector(".address").innerHTML = `${data.address} RT.${data.rt}/ RW.${data.rw}`;
        document.querySelector(".sub-district").innerHTML = `${data.subdistrict}, ${data.district}`;
        document.querySelector(".city-province-country").innerHTML = `${data.cityOrRegency}, ${data.province}, ${data.country}`;
        document.querySelector(".postal-code").innerHTML = `Kode pos: ${data.postalCode}`;
    });
} else {
    document.querySelector(".user-info").innerHTML = "<b>Biodata</b>";
    document.querySelector(".roomOrAddress-info").innerHTML = "<b>Info Kamar</b>";
    document.querySelector("#room-info").removeAttribute("hidden");
    document.querySelector("#address-info").setAttribute("hidden", "");
    document.querySelector(".title").innerHTML = "Data Kamar";
}

APIGet(ServiceURL.User.getById(getCookie('id'))).then(res => {
    let user = res.data.data.user;
    let room = res.data.data.room;

    document.querySelector("#name").innerText = user.name;
    document.querySelector("#alias").innerText = (user.alias == null || user.alias === "") ? "" : `(${user.alias})`;
    document.querySelector("#email").innerText = (user.email == null || user.email === "") ? "-" : user.email;
    document.querySelector("#phone").innerText = user.phone;
    document.querySelector("#job").innerText = user.job;
    document.querySelector("#gender").innerText = user.gender;
    document.querySelector("#status").innerText = user.married ? Constant.userAttribute.maritalStatus.MARRIED : Constant.userAttribute.maritalStatus.SINGLE;
    document.querySelector("#joinedOn").innerText = UNIXtimeConverter(user.joinedOn, 'DD MMMM YYYY');
    document.querySelector("#description").innerText = (user.description == null || user.description === "") ? "-" : user.description;

    // let identityImage = document.createElement("div");
    // let src = (user.identityCardImage == null || user.identityCardImage === "") ?
    //             "./asset/no_image.png" : `data:image/png;base64,${user.identityCardImage}`;
    // identityImage.innerHTML = `
    //     <a href="#" onclick="openImageInNewWindow(this)">
    //         <img src="${src}" alt="KTP">
    //     </a>
    // `;
    // document.querySelector("#identity-image").appendChild(identityImage);

    let contactables = user.contactAblePersons;
    if(contactables.length == 0) {
        document.querySelector("#list-not-empty").setAttribute("hidden", "");
    } else {
        document.querySelector("#list-empty").setAttribute("hidden", "");

        let count = 0;
        contactables.forEach(data => {
            if(!data.deleted) {
                count++;

                let toggleEdit = document.createElement("td");
                toggleEdit.classList.add("text-center", "hover");
                toggleEdit.innerHTML = `
                    <div class="hover-text">
                        <span class="tooltip-text tooltip-top-toggle">Ubah</span>
                        <span><i class="fa-solid fa-pencil"></i></span>
                    </div>`;
                    
                let toggleDelete = document.createElement("td");
                toggleDelete.classList.add("text-center", "hover");
                toggleDelete.innerHTML = `
                    <div class="hover-text">
                        <span class="tooltip-text tooltip-top-toggle">Hapus</span>
                        <span><i class="fa-solid fa-trash"></i></span>
                    </div>`;
                
                let item = document.createElement("tr");
                item.innerHTML = `
                    <th scope="row">${count}</th>
                    <td class="contactable-table-data text-truncate">
                        <a href="${PAGE.EDITCONTACTABLE + data.id}">
                            ${data.name}
                        </a>
                    </td>
                    <td class="contactable-table-data text-truncate">
                        <a href="${PAGE.EDITCONTACTABLE + data.id}">
                            ${data.relation}
                        </a>
                    </td>
                    <td class="text-truncate" style="max-width: 8rem; min-width: 8rem;">
                        <a href="${PAGE.EDITCONTACTABLE + data.id}">
                            ${data.phone}
                        </a>
                    </td>
                    <td class="text-truncate" style="max-width: 18rem; min-width: 8rem;">
                        <a href="${PAGE.EDITCONTACTABLE + data.id}">
                            ${data.address}
                        </a>
                    </td>
                `;

                toggleEdit.addEventListener("click", e => {
                    goTo(PAGE.EDITCONTACTABLE + data.id);
                });
                item.appendChild(toggleEdit);

                toggleDelete.addEventListener("click", e => {
                    showModalConfirmation(
                        Constant.modalType.DELETECONFIRMATION, 
                        'Hapus Kontak Alternatif', 
                        'Anda yakin ingin menghapus kontak alternatif?', 
                        'Hapus', 'Batal', () => {
                            APIDelete(ServiceURL.User.deleteContactable(getCookie('id')) + data.id).then(response => {
                                Toast(Constant.httpStatus.SUCCESS, response.data.message);
                                setTimeout(function() { goTo(PAGE.PROFILE) }, Event.timeout);
                            }).catch(err => {
                                if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                                else Toast(Constant.httpStatus.ERROR, err.data.message);
                            });
                        }
                    );
                });
                item.appendChild(toggleDelete);

                document.querySelector("#list-data").appendChild(item);
            }
        });    
    }
    if(!isOwnerOrAdmin()) getRoomData(room.id);
});

addCustomEventListener("show-roomOrAddress-info", e => {
    document.getElementById("tenant-information").setAttribute("hidden", "");
    document.getElementById("roomOrAddress-information").removeAttribute("hidden");
});

addCustomEventListener("show-tenant-info", e => {
    document.getElementById("roomOrAddress-information").setAttribute("hidden", "");
    document.getElementById("tenant-information").removeAttribute("hidden");
});

addCustomEventListener("add-alternatif-contact", e => {
    showModalForm(Constant.modalType.FORM, 'Tambah Kontak Alternatif', 'Simpan');
});

function getRoomData(roomId) {
    APIGet(ServiceURL.Room.getById(roomId)).then(res => {
        let room = res.data.data.room;
        let roomP = res.data.data;
        document.querySelector(".name").innerHTML = room.name;
        document.querySelector(".floor").innerHTML = `Lantai ${room.floor}`;

        document.querySelector(".status").classList.add((roomP.status === Constant.roomStatus.KOSONG || roomP.status === Constant.roomStatus.TERSEDIA) ? "text-success" : "text-danger");
        document.querySelector(".status").innerHTML = `Kamar ${roomP.status} (${roomP.totalTenants}/${room.quota})`;

        let prices = room.prices;
        document.querySelector(".price").innerHTML = `Rp${numberWithThousandsSeparators(prices[0].price)}`;
        prices.forEach(price => {
            if(roomP.totalTenants == price.capacity) {
                document.querySelector(".price").innerHTML = `Rp${numberWithThousandsSeparators(price.price)}`;
            }
        });

        // Room Details
        let details = room.details;
        details.forEach(detail => {
            let countLainnya = 0;
            if (detail.masterRoomDetailCategory.name === Constant.roomDetailsCategory.KAMAR_TIDUR) {
                let itemList = document.createElement("div");
                itemList.classList.add("d-flex", "col", "align-items-center")

                let description = "";
                if(detail.description != null && detail.description !== "")
                    description = `<div class="font-italic">${detail.description}</div>`;

                itemList.innerHTML = `
                    <div>
                        <div class="d-flex align-items-center">
                            <li class="fw-semibold">${detail.name}</li>
                        </div>
                        ${description}
                    </div>
                `;
                document.querySelector("#kamar-tidur").appendChild(itemList);
            }
            else if (detail.masterRoomDetailCategory.name === Constant.roomDetailsCategory.KAMAR_MANDI) {
                let itemList = document.createElement("div");
                itemList.classList.add("d-flex", "col", "align-items-center")

                let description = "";
                if(detail.description != null && detail.description !== "")
                    description = `<div class="font-italic">${detail.description}</div>`;

                itemList.innerHTML = `
                    <div>
                        <div class="d-flex align-items-center">
                            <li class="fw-semibold">${detail.name}</li>
                        </div>
                        ${description}
                    </div>
                `;
                document.querySelector("#kamar-mandi").appendChild(itemList);
            }
            else if (detail.masterRoomDetailCategory.name === Constant.roomDetailsCategory.FURNITURE) {
                let itemList = document.createElement("div");
                itemList.classList.add("d-flex", "col", "align-items-center")

                let description = "";
                if(detail.description != null && detail.description !== "")
                    description = `<div class="font-italic">${detail.description}</div>`;

                itemList.innerHTML = `
                    <div>
                        <div class="d-flex align-items-center">
                            <li class="fw-semibold">${detail.name}</li>
                        </div>
                        ${description}
                    </div>
                `;
                document.querySelector("#furniture").appendChild(itemList);
            }
            else if (detail.masterRoomDetailCategory.name === Constant.roomDetailsCategory.ALAT_ELEKTRONIK) {
                let itemList = document.createElement("div");
                itemList.classList.add("d-flex", "col", "align-items-center")

                let description = "";
                if(detail.description != null && detail.description !== "")
                    description = `<div class="font-italic">${detail.description}</div>`;

                itemList.innerHTML = `
                    <div>
                        <div class="d-flex align-items-center">
                            <li class="fw-semibold">${detail.name}</li>
                        </div>
                        ${description}
                    </div>
                `;
                document.querySelector("#alat-elektronik").appendChild(itemList);
            }
            else {
                countLainnya++;
                if(countLainnya == 1)
                    document.querySelector("#no-item").setAttribute("hidden", "");

                let itemList = document.createElement("div");
                itemList.classList.add("d-flex", "col", "align-items-center")

                let description = "";
                if(detail.description != null && detail.description !== "")
                    description = `<div class="font-italic">${detail.description}</div>`;

                itemList.innerHTML = `
                    <div>
                        <div class="d-flex align-items-center">
                            <li class="fw-semibold">${detail.name}</li>
                        </div>
                        ${description}
                    </div>
                `;
                document.querySelector("#fasilitas-lain").appendChild(itemList);
            }
        });

        // let prices = room.prices;
        // prices.forEach(price => {
        //     let item = document.createElement("tr");
        //     item.innerHTML = `
        //         <td>${price.capacity} orang</td>
        //         <td>Rp ${price.price},-</td>
        //     `
        //     document.querySelector("#price-data").appendChild(item);
        // });

        document.querySelector("#category1").innerHTML = Constant.roomDetailsCategory.KAMAR_TIDUR;
        document.querySelector("#category2").innerHTML = Constant.roomDetailsCategory.KAMAR_MANDI;
        document.querySelector("#category3").innerHTML = Constant.roomDetailsCategory.FURNITURE;
        document.querySelector("#category4").innerHTML = Constant.roomDetailsCategory.ALAT_ELEKTRONIK;
        document.querySelector("#category5").innerHTML = Constant.roomDetailsCategory.FASILITAS_KAMAR_LAINNYA;
    });
}

addCustomEventListener("logout", e => {
    logout();
});

let js = document.createElement("script");
js.innerHTML = `
function openImageInNewWindow(e) {
    var newTab = window.open();
    setTimeout(function() {
        newTab.document.body.innerHTML = e.innerHTML;
    }, 500);
    return false;
}
function requestChangeRoom() {
    window.location.href = "/servicerequest.html"
}
`;
document.body.appendChild(js);
