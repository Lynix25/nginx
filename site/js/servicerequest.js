import { APIGet, APIPost } from "./api.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { addCustomEventListener, createElementFromString, getFormValue, getUserID, goBack, goTo, handleFormSubmited, isOwnerOrAdmin, numberWithThousandsSeparators } from "./utils.js";
import { Toast } from "./component/toast.js";

let listOfServiceId = {};
handleFormSubmited((e) => {
    let data = getFormValue(e.target);
    if(data.category === Constant.serviceCategory.LAUNDRY) {
        let totalRequested = 0;
        Object.keys(listOfServiceId).forEach(variant => {
            let quantity = 0;
            let requestedData = {};
            Object.keys(data).forEach(key => {
                if(variant === key) {
                    quantity = parseInt(data[variant]);
                }
            });
            if(quantity > 0) {
                requestedData['serviceId'] = listOfServiceId[variant][0];
                requestedData['taskDate'] = new Date(data['taskDate']).getTime();
                requestedData['summary'] = data['summary'];
                requestedData['requestedQuantity'] = quantity;
                requestedData['charge'] = listOfServiceId[variant][1] * parseInt(data[variant]);
                
                APIPost(ServiceURL.Task.create, requestedData);
                totalRequested++;
            }
        });

        if(totalRequested > 0) {
            Toast(Constant.httpStatus.SUCCESS, `Berhasil menambahkan ${totalRequested} pengajuan layanan laundry`);
            setTimeout(function() { goTo(PAGE.REQUESTHISTORY) }, Event.timeout);
        } else {
            Toast(Constant.httpStatus.INFO, `${data.category} tidak dapat diajukan. Mohon menambahkan jumlah pada item yang ingin di-${data.category.toLowerCase()}`);
        }
    } else {
        data["taskDate"] = new Date(data.taskDate).getTime();
        data["charge"] = parseInt(document.querySelector("#charge").value);
        delete data.category;

        APIPost(ServiceURL.Task.create, data).then(response => {
            Toast(Constant.httpStatus.SUCCESS, response.data.message);
            setTimeout(function() { goTo(PAGE.REQUESTHISTORY) }, Event.timeout);
        }).catch(err => {
            if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
            else Toast(Constant.httpStatus.ERROR, err.data.message);
        });
    }
});

let serviceList;
let filteredServiceList = {};

APIGet(ServiceURL.Service.getAll).then(res => {
    serviceList = res.data.data;

    serviceList.forEach(service => {
        if (service.serviceName in filteredServiceList) {
            filteredServiceList[service.serviceName].push(service);
        }
        else {
            filteredServiceList[service.serviceName] = [];
            filteredServiceList[service.serviceName].push(service);
        }
    });
    setService(filteredServiceList);
}).catch(err => {
    console.log(err);
});

document.querySelector("#category").addEventListener("change", e => {
    let selected = e.target.value;
    setVariant(filteredServiceList[selected]);

    if(selected === Constant.serviceCategory.LAUNDRY){
        let finalTotalPrice = 0;
        addCustomEventListener("min-qty", e => {
            let qtyInput = e.detail.target.parentElement.parentElement.querySelector(".quantity");
            let qty = parseInt(qtyInput.getAttribute("value"));
            qtyInput.setAttribute("value", Math.max(qty - 1, 0));

            let totalPriceOutput = e.detail.target.parentElement.parentElement.parentElement.parentElement.querySelector(".total-price");
            let totalPricetoInt = parseInt(totalPriceOutput.getAttribute("initialValue"));
            let totalPrice = totalPricetoInt * Math.max(qty - 1, 0);
            totalPriceOutput.setAttribute("value", totalPrice);
            totalPriceOutput.innerHTML = `Subtotal: Rp ${numberWithThousandsSeparators(totalPrice)}`;

            let finalTotalPriceOutput = e.detail.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".final-total");
            if (qty > 0 && finalTotalPrice > 0) finalTotalPrice -= totalPricetoInt;
            finalTotalPriceOutput.setAttribute("value", finalTotalPrice);
            finalTotalPriceOutput.innerHTML = `Total: Rp ${numberWithThousandsSeparators(finalTotalPrice)}`;
        });
        addCustomEventListener("plus-qty", e => {
            let qtyInput = e.detail.target.parentElement.parentElement.querySelector(".quantity");
            let qty = parseInt(qtyInput.getAttribute("value"));
            qtyInput.setAttribute("value", Math.min(qty + 1, 10));

            let totalPriceOutput = e.detail.target.parentElement.parentElement.parentElement.parentElement.querySelector(".total-price");
            let totalPricetoInt = parseInt(totalPriceOutput.getAttribute("initialValue"));
            let totalPrice = totalPricetoInt * Math.min(qty + 1, 10);
            totalPriceOutput.setAttribute("value", totalPrice);
            totalPriceOutput.innerHTML = `Subtotal: Rp ${numberWithThousandsSeparators(totalPrice)}`;

            let finalTotalPriceOutput = e.detail.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".final-total");
            if ((qty+1) <= 10 && totalPrice <= totalPricetoInt * 10) finalTotalPrice += totalPricetoInt;
            finalTotalPriceOutput.setAttribute("value", finalTotalPrice);
            finalTotalPriceOutput.innerHTML = `Total: Rp ${numberWithThousandsSeparators(finalTotalPrice)}`;
        });
        // if(isOwnerOrAdmin()) {
        //     document.querySelector(".charge").addEventListener("input", e => {
        //         let chargeInput = parseInt(e.target.value === "" ? 0 : e.target.value);
        //         let totalPriceOutput = e.target.parentElement.parentElement.parentElement.parentElement.querySelector(".total-price");
        //         let totalPricetoInt = parseInt(totalPriceOutput.getAttribute("value"));
                
        //         let commitChargeButton = e.target.parentElement.querySelector("button[type='fixCharge']");
        //         commitChargeButton.addEventListener("click", e => {
        //             let totalPrice = totalPricetoInt + chargeInput;
        //             totalPriceOutput.setAttribute("value", totalPrice);
        //             totalPriceOutput.innerHTML = `Subtotal: Rp ${numberWithThousandsSeparators(totalPrice)}`;
        //         });
    
        //         let finalTotalPriceOutput = e.target.parentElement.parentElement.parentElement.parentElement.querySelector(".final-total");
        //         finalTotalPrice += chargeInput;
        //         finalTotalPriceOutput.setAttribute("value", finalTotalPrice);
        //         finalTotalPriceOutput.innerHTML = `Total: Rp ${numberWithThousandsSeparators(finalTotalPrice)}`;
        //     });
        // }
    }
});

document.querySelector("#serviceId").addEventListener("change", e => {
    let selected = e.target.value;
    let selectedCategory = document.querySelector("#category").value;
    filteredServiceList[selectedCategory].forEach(service => {
        if (service.id === selected) {
            updatePrice(service.price);
        }
    });
});

function setService(objectOptions) {
    let selection = document.querySelector("#category");
    let firstCategory = undefined;
    Object.keys(objectOptions).forEach(serviceCategory => {
        if (firstCategory === undefined) firstCategory = serviceCategory;
        let option = document.createElement("option");
        option.innerHTML = serviceCategory;
        option.setAttribute('value', serviceCategory);
        selection.appendChild(option);
    });
    setVariant(objectOptions[firstCategory]);
}

function setVariant(ArrayOptions) {

    let variant = document.querySelector("#serviceId");
    let firstPrice = undefined;
    variant.innerHTML = "";

    // let chargePlaceholder = "", showSetting = "", confirmChargeToggle = "";
    // if(isOwnerOrAdmin()) {
    //     chargePlaceholder = "Rp 0";
    //     confirmChargeToggle = `<i class="fa fa-check ms-2"></i>`
    // } else {
    //     chargePlaceholder = "Diisi pihak kos";
    //     showSetting = "disabled";
    // }

    let formItems = "", isLaundry = 0;
    ArrayOptions.forEach(service => {

        if (service.serviceName === Constant.serviceCategory.LAUNDRY) {
            variant.setAttribute("hidden", "");
            document.querySelector("#laundry-form").removeAttribute("hidden");

            formItems += `
                <li class="col alert alert-info">
                    <div class="row d-flex align-items-center p-0 w-100">
                        <div class="col align-items-center p-0 small">${service.variant}</div>
                        <div class="col p-0 input-group inline-group">
                            <div class="input-group-prepend">
                                <span type="min-qty" class="btn btn-outline-secondary btn-minus btn-sm p-1">
                                    <i class="fa fa-minus"></i>
                                </span>
                            </div>
                            <div style="min-width: 32px; width: 32px;">
                                <input type="number" name="${service.variant}" class="form-control form-control-sm text-center quantity" min="0" value="0" readOnly>
                            </div>
                            <div class="input-group-append">
                                <span type="plus-qty" class="btn btn-outline-secondary btn-plus btn-sm p-1">
                                    <i class="fa fa-plus"></i>
                                </span>
                            </div>
                        </div>
                        <div class="col align-items-center p-0 small text-end">Rp ${numberWithThousandsSeparators(service.price)}/ ${service.units}</div>
                    </div>
                    <div class="d-flex align-items-center w-100 total-price-container">
                        <div class="badge-yellow px-1 total-price small" value="0" initialValue=${service.price}>Subtotal: Rp 0</div>
                    </div>
                </li>`;
            isLaundry++;
            listOfServiceId[service.variant] = [service.id, service.price];
        } else {
            variant.removeAttribute("hidden");
            document.querySelector("#laundry-form").setAttribute("hidden", "");
            if (firstPrice === undefined) firstPrice = service.price;
            let option = document.createElement("option");
            option.innerHTML = service.variant;
            option.setAttribute('value', service.id);
            variant.appendChild(option);
        }
    });
    
    if(isLaundry > 0) {
        let finalForm  = `<div id="formItems">${formItems}<hr><div class="alert alert-success w-100 m-0 text-end fw-bold final-total" value="0">Total: Rp 0</div></div>`;
        document.querySelector("#laundry-form").appendChild(createElementFromString(finalForm));
    } else {
        if(document.querySelector("#formItems") != null)
            document.querySelector("#formItems").remove();
    }
    updatePrice(firstPrice, isLaundry > 0 ? true : false);
}

function updatePrice(price, isLaundry) {
    if (price && !isLaundry) {
        document.querySelector("#price").parentNode.style.display = "block";
        document.querySelector("#price").innerHTML = "Rp " + numberWithThousandsSeparators(price);
    }
    else {
        document.querySelector("#price").parentNode.style.display = "none";
    }
    document.querySelector("#charge").setAttribute("value", price);
}

document.querySelector("#back").addEventListener("click", e => {
    goBack();
});