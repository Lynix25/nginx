import { APIGet, APIPost } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { getFormValue, goTo, handleFormSubmited, numberWithThousandsSeparators } from "./utils.js";

document.querySelector("#serviceName").addEventListener("change", e => {
    let selected = e.target.value;
    if(selected !== Constant.serviceCategory.LAUNDRY) {
        document.querySelector(".quantity").setAttribute("hidden", "");
        document.querySelector(".units").setAttribute("hidden", "");
    } else {
        document.querySelector(".quantity").setAttribute("required", "");
        document.querySelector(".units").setAttribute("required", "");
    }
})

handleFormSubmited((e) => {
    let data = getFormValue(e.target);
    if(data.variant !== Constant.serviceCategory.LAUNDRY) {
        document.querySelector(".quantity").removeAttribute("hidden");
        document.querySelector(".units").removeAttribute("hidden");
    }
    APIPost(ServiceURL.Service.getAll, data).then(response => {
        Toast(Constant.httpStatus.SUCCESS, response.data.message);
        setTimeout(function() { goTo(PAGE.SERVICE) }, Event.timeout);
    }).catch(err => {
        Toast(Constant.httpStatus.ERROR, err?.message);
    });
})

APIGet(ServiceURL.Service.getAll).then(res => {
    
    APIGet(ServiceURL.MasterData.getServiceCategory).then(resService => {
        let data = resService.data.data;
        for(let i=0; i < data.length; i++) {
            let option = document.createElement("option");
            option.innerHTML = data[i].name;
            document.querySelector("#serviceName").appendChild(option);
            document.querySelector(`#category${i+1}`).innerHTML = data[i].name.toUpperCase();
        }
    }).catch(errService => {
        console.log(errService)
    });

    let services = res.data.data;
    console.log(services);
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    services.forEach(service => {
        if(service.serviceName === Constant.serviceCategory.LAUNDRY) {
            count1++;
            let categoryItem = document.createElement("tr");
            categoryItem.innerHTML = `
                <td class="text-truncate">${service.variant}</td>
                <td class="text-center" style="width: 24px">${service.quantity}</td>
                <td class="text-truncate" style="width: 24px">${service.units}</td>
                <td style="width: 120px">Rp ${numberWithThousandsSeparators(service.price)}</td>
            `;
            document.querySelector("#service-list-category1").appendChild(categoryItem);
        }
        else if(service.serviceName === Constant.serviceCategory.PEMBERSIHAN_KAMAR) {
            count2++;
            let categoryItem = document.createElement("tr");
            categoryItem.innerHTML = `
                <td class="text-truncate">${service.variant}</td>
                <td style="width: 120px">Rp ${numberWithThousandsSeparators(service.price)}</td>
            `;
            document.querySelector("#service-list-category2").appendChild(categoryItem);
        }
        else if(service.serviceName === Constant.serviceCategory.PERBAIKAN_FASILITAS) {
            count3++;
            let categoryItem = document.createElement("tr");
            categoryItem.innerHTML = `
                <td class="text-truncate">${service.variant}</td>
                <td style="width: 120px">Rp ${numberWithThousandsSeparators(service.price)}</td>
            `;
            document.querySelector("#service-list-category3").appendChild(categoryItem);
        }
        else {
            count4++;
            let categoryItem = document.createElement("tr");
            categoryItem.innerHTML = `
                <td class="text-truncate">${service.variant}</td>
                <td style="width: 120px">Rp ${numberWithThousandsSeparators(service.price)}</td>
            `;
            document.querySelector("#service-list-category4").appendChild(categoryItem);
        }
    });

    if(count1 == 0) document.querySelector("#table1").setAttribute("hidden", "");
    if(count2 == 0) document.querySelector("#table2").setAttribute("hidden", "");
    if(count3 == 0) document.querySelector("#table3").setAttribute("hidden", "");
    if(count4 == 0) document.querySelector("#table4").setAttribute("hidden", "");
});