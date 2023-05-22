import { APIDelete, APIGet } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { showModalFormPrice } from "./setroomprice.js";
import { showModalFormFacility } from "./setroomfacility.js";
import { showModalConfirmation } from "./component/modal.js"
import { addCustomEventListener, getParamOnURL, getUserID, goTo, isOwnerOrAdmin, numberWithThousandsSeparators } from "./utils.js";

if(!isOwnerOrAdmin()) {
    document.querySelector("#edit").setAttribute("hidden", "");
    document.querySelector("#add-facility").setAttribute("hidden", "");
    document.querySelector("[type='add-facility-detail-1']").setAttribute("hidden", "");
    document.querySelector("[type='add-facility-detail-2']").setAttribute("hidden", "");
    document.querySelector("[type='add-facility-detail-3']").setAttribute("hidden", "");
    document.querySelector("[type='add-facility-detail-4']").setAttribute("hidden", "");
    document.querySelector("[type='add-facility-detail-5']").setAttribute("hidden", "");
    document.querySelector("[type='add-price-detail']").setAttribute("hidden", "");
    document.querySelector(".aksi").setAttribute("hidden", "");
    document.querySelector("[type='delete']").setAttribute("hidden", "");
}

APIGet(ServiceURL.Room.getById(getParamOnURL("id"))).then(res => {
    let room = res.data.data;
    document.querySelector(".name").innerHTML = room.room.name;
    document.querySelector(".allotment").innerHTML = room.room.allotment;
    document.querySelector(".floor").innerHTML = 'Lantai ' + room.room.floor;
    document.querySelector(".description").innerHTML = room.room.description;

    let roomAvailable = (room.status === Constant.roomStatus.KOSONG || room.status === Constant.roomStatus.TERSEDIA) ? true : false;
    document.querySelector(".status").classList.add(roomAvailable ? "text-success" : "text-danger");
    document.querySelector(".status").innerHTML = `Kamar ${room.status} (${room.totalTenants}/${room.room.quota})`;


    if(!isOwnerOrAdmin() && roomAvailable) {
        document.querySelector("[type='changeRoom']").removeAttribute("hidden");
    }

    // Room Details
    let details = room.room.details;
    details.forEach(detail => {
        let countLainnya = 0;
        let itemList = document.createElement("div");
        itemList.classList.add("d-flex", "col", "align-items-center");
        
        let itemContainer = document.createElement("div");
        itemContainer.classList.add("w-100");

        let itemContainerInContainer = document.createElement("div");
        itemContainerInContainer.classList.add("d-flex", "align-items-center");
        itemContainerInContainer.innerHTML = `<li class="w-100">${detail.name}</li>`;

        if(isOwnerOrAdmin()) {

            let deleteCategoryToggle = document.createElement("div");
            deleteCategoryToggle.classList.add("hover-text");
            deleteCategoryToggle.innerHTML = `
                <span class="tooltip-text tooltip-top-toggle">Hapus</span>
                <i class="fa fa-times-circle" style="cursor: pointer"></i>
            `;
    
            deleteCategoryToggle.addEventListener("click", e => {
                showModalConfirmation(
                    Constant.modalType.DELETECONFIRMATION, 
                    'Hapus Data Fasilitas', 
                    'Anda yakin ingin menghapus data fasilitas/ spesifikasi ini?', 
                    'Hapus', 'Batal', () => {
                        APIDelete(ServiceURL.Room.removeDetail(getParamOnURL('id'), detail.id, getUserID())).then(response => {
                            Toast(Constant.httpStatus.SUCCESS, response.data.message);
                            setTimeout(function() { goTo(PAGE.ROOMDETAIL + getParamOnURL('id'))}, Event.timeout);
                        }).catch(err => {
                            if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                            else Toast(Constant.httpStatus.ERROR, err.data.message);
                        });
                    }
                );
            })
            itemContainerInContainer.appendChild(deleteCategoryToggle);
        }
        itemContainer.appendChild(itemContainerInContainer);
        
        if(detail.description != null && detail.description !== "") {
            let description = document.createElement("div");
            description.classList.add("font-italic");
            description.innerHTML = detail.description;
            itemContainer.appendChild(description)
        }
        itemList.appendChild(itemContainer);

        if(detail.masterRoomDetailCategory.name === Constant.roomDetailsCategory.KAMAR_TIDUR) {
            document.querySelector("#kamar-tidur").appendChild(itemList);
        }
        else if(detail.masterRoomDetailCategory.name === Constant.roomDetailsCategory.KAMAR_MANDI) {
            document.querySelector("#kamar-mandi").appendChild(itemList);
        }
        else if(detail.masterRoomDetailCategory.name === Constant.roomDetailsCategory.FURNITURE) {
            document.querySelector("#furniture").appendChild(itemList);
        }
        else if(detail.masterRoomDetailCategory.name === Constant.roomDetailsCategory.ALAT_ELEKTRONIK) {
            document.querySelector("#alat-elektronik").appendChild(itemList);
        }
        else {
            countLainnya++;
            if(countLainnya == 1)
                document.querySelector("#no-item").setAttribute("hidden", "");

            document.querySelector("#fasilitas-lain").appendChild(itemList);
        }
    });

    let prices = room.room.prices;
    prices.forEach(price => {

        let item = document.createElement("tr");
        item.innerHTML = `
            <td>${price.capacity} orang</td>
            <td>Rp ${numberWithThousandsSeparators(price.price)}</td>
        `;

        if(isOwnerOrAdmin()) {

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
    
            toggleEdit.addEventListener("click", e => {
                showModalFormPrice(Constant.modalType.FORM, "Update", getParamOnURL('id'), price, 'Ubah Harga Kamar', 'Simpan');
            });
            item.appendChild(toggleEdit);
    
            toggleDelete.addEventListener("click", e => {
                showModalConfirmation(
                    Constant.modalType.DELETECONFIRMATION, 
                    'Hapus Data Harga', 
                    'Anda yakin ingin menghapus data harga ini?', 
                    'Hapus', 'Batal', () => {
                        APIDelete(ServiceURL.Room.removePrice(getParamOnURL('id'), price.id, getUserID())).then(response => {
                            Toast(Constant.httpStatus.SUCCESS, response.data.message);
                            setTimeout(function() { goTo(PAGE.ROOMDETAIL + getParamOnURL('id'))}, Event.timeout);
                        }).catch(err => {
                            if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                            else Toast(Constant.httpStatus.ERROR, err.data.message);
                        });
                    }
                );
            });
            item.appendChild(toggleDelete);
        }
        document.querySelector("#price-data").appendChild(item);
    });

    document.querySelector("#category1").innerHTML = Constant.roomDetailsCategory.KAMAR_TIDUR;
    document.querySelector("#category2").innerHTML = Constant.roomDetailsCategory.KAMAR_MANDI;
    document.querySelector("#category3").innerHTML = Constant.roomDetailsCategory.FURNITURE;
    document.querySelector("#category4").innerHTML = Constant.roomDetailsCategory.ALAT_ELEKTRONIK;
    document.querySelector("#category5").innerHTML = Constant.roomDetailsCategory.FASILITAS_KAMAR_LAINNYA;

    // room.details.forEach(facility => {
    //     let detail = document.createElement("li");
    //     detail.classList.add("d-flex");
    //     detail.innerHTML = `<i class="fad fa-user"></i>
    //     <div>${facility.name}</div>`
    //     if(facility.category == "Spesifikasi") document.querySelector(".specifications").appendChild(detail);
    //     // console.log(facility);
    // });
    
});

addCustomEventListener("add-price-detail", e => {
    showModalFormPrice(Constant.modalType.FORM, "Add", getParamOnURL('id'), null, 'Tambah Daftar Harga Kamar', 'Simpan');
});

addCustomEventListener("add-facility-detail-1", e => {
    showModalFormFacility(Constant.modalType.FORM, "Add", getParamOnURL('id'), Constant.roomDetailsCategory.KAMAR_TIDUR, null, 'Tambah Daftar Fasilitas Kamar', 'Simpan');
});

addCustomEventListener("add-facility-detail-2", e => {
    showModalFormFacility(Constant.modalType.FORM, "Add", getParamOnURL('id'), Constant.roomDetailsCategory.KAMAR_MANDI, null, 'Tambah Daftar Fasilitas Kamar', 'Simpan');
});

addCustomEventListener("add-facility-detail-3", e => {
    showModalFormFacility(Constant.modalType.FORM, "Add", getParamOnURL('id'), Constant.roomDetailsCategory.FURNITURE, null, 'Tambah Daftar Fasilitas Kamar', 'Simpan');
});

addCustomEventListener("add-facility-detail-4", e => {
    showModalFormFacility(Constant.modalType.FORM, "Add", getParamOnURL('id'), Constant.roomDetailsCategory.ALAT_ELEKTRONIK, null, 'Tambah Daftar Fasilitas Kamar', 'Simpan');
});

addCustomEventListener("add-facility-detail-5", e => {
    showModalFormFacility(Constant.modalType.FORM, "Add", getParamOnURL('id'), Constant.roomDetailsCategory.FASILITAS_KAMAR_LAINNYA, null, 'Tambah Daftar Fasilitas Kamar', 'Simpan');
});

document.querySelector("#edit").addEventListener("click", e => {
    goTo(PAGE.EDITROOM + getParamOnURL('id'));
});

addCustomEventListener("delete", e => {
    showModalConfirmation(
        Constant.modalType.DELETECONFIRMATION, 
        'Hapus Data Kamar', 
        'Anda yakin ingin menghapus data kamar ini?', 
        'Hapus', 'Batal', () => {
            APIDelete(ServiceURL.Room.delete(getParamOnURL('id'), getUserID())).then(response => {
                Toast(Constant.httpStatus.SUCCESS, response.data.message);
                setTimeout(function() { goTo(PAGE.ROOMLIST)}, Event.timeout);
            }).catch(err => {
                if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                else Toast(Constant.httpStatus.ERROR, err.data.message);
            });
        }
    );
});

addCustomEventListener("changeRoom", e => {
    alert('hi there')
});