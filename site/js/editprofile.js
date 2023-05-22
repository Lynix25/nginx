import { APIGet, APIPut } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { getFormValueV2, getUserID, goTo, handleFormSubmited, isOwnerOrAdmin } from "./utils.js";

document.querySelector("#identityCardImageLabel").innerHTML=`Kartu Identitas (Max ${Constant.image.maxSize}MB)`;

if(!isOwnerOrAdmin()) 
    document.querySelector(".restrictedData").setAttribute("hidden", "");
else {
    document.querySelector("#name").removeAttribute("disabled");
    document.querySelector("#gender").removeAttribute("disabled");
    document.querySelector("#married").removeAttribute("disabled");
    document.querySelector(".room-container").setAttribute("hidden", "");
}

let userData = {};
APIGet(ServiceURL.User.getById(getCookie("id"))).then(res => {
    userData = res.data.data;
    reloadData(userData);
});

function reloadData(currUserData) {
    let nameInput = document.querySelector("#name");
    nameInput.setAttribute("value", currUserData.user.name);

    let aliasInput = document.querySelector("#alias");
    aliasInput.setAttribute("value", 
    (currUserData.user.alias == null || currUserData.user.alias == "") ? "" : currUserData.user.alias);

    let phoneInput = document.querySelector("#phone");
    phoneInput.setAttribute("value", currUserData.user.phone);
    
    let emailInput = document.querySelector("#email");
    emailInput.setAttribute("value", 
    (currUserData.user.email == null || currUserData.user.email == "") ? "" : currUserData.user.email);
    
    let genderInput = document.querySelector("#gender");
    setSelected(genderInput, currUserData.user.gender);

    let statusInput = document.querySelector("#married");
    setSelectedMarried(statusInput, currUserData.user.married);

    let jobInput = document.querySelector("#job");
    jobInput.setAttribute("value", currUserData.user.job);
    
    let descriptionInput = document.querySelector("#description");
    let description = (currUserData.user.description == null || currUserData.user.description == "") ? "" : currUserData.user.description;
    descriptionInput.setAttribute("value", description);
    descriptionInput.innerHTML = description;

    let roomInput = document.querySelector("#room");
    roomInput.setAttribute("value", (currUserData.room == null) ? "" : currUserData.room.name);

    let roleInput = document.querySelector("#role");
    setSelected(roleInput, currUserData.user.role.name);

    let identityCardInput = document.querySelector("#identityCardImage");
    let identityCard = document.querySelector("#identityImage");
    let image = currUserData.user.identityCardImage;
    if(image == null || image === "") identityCard.setAttribute("hidden", "");
    else {
        if(image != undefined) {
            identityCardInput.removeAttribute("required");
            identityCard.setAttribute("src", `data:image/png;base64,${image}`);
        }
    } 
}

function setSelected(listOption, selectedValue) {
    for(let i=0; i < listOption.options.length; i++) {
        if(listOption.options[i].text === selectedValue) {
            listOption.options[i].selected = true;
        }
    }
}

function setSelectedMarried(listOption, selectedValue) {
    for(let i=0; i < listOption.options.length; i++) {
        if(selectedValue == true) {
            if(listOption.options[i].text === Constant.userAttribute.maritalStatus.MARRIED) {
                listOption.options[i].selected = true;
            }
        } else {
            if(listOption.options[i].text === Constant.userAttribute.maritalStatus.SINGLE) {
                listOption.options[i].selected = true;
            }
        }
    }
}

let countChanges = 0;
document.addEventListener("change", e => {
    e.target.setAttribute("changed","");
    countChanges++;
})

handleFormSubmited(e => {
    let data = getFormValueV2(e.target);

    Object.keys(data).forEach(function(key) {
        if(key === 'married') {
            data[key] = (data[key] === Constant.userAttribute.maritalStatus.MARRIED ? true : false);
        }
        if(data[key] === "" || data[key] == undefined) data[key] = null
    });

    if(data.image != undefined && data.image != null && data.image.size/Constant.image.dividersImageSizeByteToMB > Constant.image.maxSize) {
        Toast(Constant.httpStatus.ERROR, `Ukuran file lebih besar dari ${Constant.image.maxSize}MB`);
    } else {
        APIPut(ServiceURL.User.getById(getCookie('id')), data, { 
            "requesterId" : getUserID(), 
            "Content-Type" : "multipart/form-data"
        }).then(response => {
            reloadData(response.data.data);
            Toast(Constant.httpStatus.SUCCESS, response.data.message);
            setTimeout(function () { goTo(PAGE.PROFILE)}, Event.timeout);
        }).catch(err => {
            if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
            else Toast(Constant.httpStatus.ERROR, err.data.message);
        });
    }
});

document.querySelector("#identityCardImage").addEventListener("change", event => {
    
    let file = event.target.files[0];
    let reader = new FileReader();
    let loading = document.createElement("i");

    reader.addEventListener("loadend", e => {
        document.querySelector("#identityImage").removeAttribute("hidden");
        document.querySelector(".fa-spin").setAttribute("hidden", "");
        event.target?.parentElement.querySelector("img").setAttribute("src", reader.result);
    });

    reader.addEventListener("loadstart", e => {
        document.querySelector(".fa-spin").removeAttribute("hidden")
    });

    if (file) {
        reader.readAsDataURL(file);
    }
});