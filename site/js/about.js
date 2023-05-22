import { APIGet } from "./api.js";
import { Constant, ServiceURL } from "./config.js";
import { createElementFromString } from "./utils.js";

APIGet(ServiceURL.MasterData.getIndekos).then(res => {
    let data = res.data;
    document.querySelector(".kosName").innerHTML = `${data.name}`;
    document.querySelector(".address").innerHTML = `${data.address} RT.${data.rt}/ RW.${data.rw}`;
    document.querySelector(".sub-district").innerHTML = `${data.subdistrict}, ${data.district}`;
    document.querySelector(".city-province-country").innerHTML = `${data.cityOrRegency}, ${data.province}, ${data.country}`;
    document.querySelector(".postal-code").innerHTML = `Kode pos: ${data.postalCode}`;
});

APIGet(ServiceURL.User.getAll("")).then(response => {
    let datas = response.data.data;
    let countOwner = 0, countAdmin = 0;
    datas.forEach(data => {
        let user = data.user;
        let role = user.role.name;
        let listOwner = document.getElementById("ownerContact");
        let listAdmin = document.getElementById("adminContact");
        let contact = `
            <li>
                <p class="mb-1">${user.name} ${user.alias == null || user.alias == "" ? "" : `(${user.alias})`}</p>
                <p class="mb-1">${user.phone}</p>
                <p class="mb-1">${role === Constant.role.ADMIN ? "Penjaga Kos" : "Pemilik kos"}</p>
            </li>
        `;
        if(role === Constant.role.ADMIN) {
            if(countAdmin > 0) contact = `<div><hr>${contact}</div>`
            countAdmin++;
            listAdmin.appendChild(createElementFromString(contact));
        } 
        else if(role === Constant.role.OWNER) {
            if(countOwner > 0) contact = `<div><hr>${contact}</div>`
            countOwner++;
            listOwner.appendChild(createElementFromString(contact));
        }
    });
    if(countAdmin == 0)
        document.querySelector("#separatorOwnerAndAdmin").remove();
});