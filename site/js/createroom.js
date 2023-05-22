import { APIPost } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { addCustomEventListener, forEach, getFormValue, getFormValueV2, getTempID, getUserID, goBack, goTo, handleFormSubmited, numberWithThousandsSeparators } from "./utils.js";

handleFormSubmited(e => {
    let data = getFormValue(e.target);
    APIPost(ServiceURL.Room.create, data, {
        "requesterId" : getUserID()
    }).then(response => {
        Toast(Constant.httpStatus.SUCCESS, response.data.message);
        setTimeout(function () { goTo(PAGE.ROOMDETAIL + response.data.data.room.id)}, Event.timeout);
    }).catch(err => {
        if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    });
})

document.querySelector("#back").addEventListener("click", e => {
    goBack();
});

/*
handleFormSubmited(e => {
    let data = getFormValue(e.target);
    let identifier = e.target.getAttribute("data");
    let row = document.querySelector(`table tbody [identifier="${identifier}"]`)
    row.querySelector(`[name='capacity']`).innerHTML = data.capacity + " Orang";
    row.querySelector(`[name='capacity']`).setAttribute("value", data.capacity);
    row.querySelector(`[name='price']`).innerHTML = data.price;
    row.querySelector(`[name='price']`).setAttribute("value", data.price);

}, "#updateRoomPrice")

document.querySelector("#addRoomPrice #price").addEventListener('input', e => {
    e.target.value = numberWithThousandsSeparators(e.target.value)
})

document.querySelector("#updateRoomPrice #price").addEventListener('input', e => {
    e.target.value = numberWithThousandsSeparators(e.target.value)
})

addCustomEventListener("add-price-detail", e => {
    const targetForm = document.querySelector(e.target.getAttribute("data-bs-target"));
    const data = document.querySelector("table tbody").rows.length;
    // targetForm.querySelector("#capacity").value = data+1;
})

handleFormSubmited(e => {
    let data = getFormValue(e.target);
    if (data == null) return;

    let table = document.querySelector("table tbody");
    let newRow = table.insertRow();
    let identifier = getTempID();

    newRow.setAttribute("identifier", identifier);
    newRow.innerHTML =
        `<td>
            <div input name="capacity" value=${data.capacity}>${data.capacity} Orang</div>
        </td>
        <td>
            <div input name="price" value="${data.price.replaceAll(".", "")}">${data.price}</div>
        </td>
        `;

    let editDetail = document.createElement("button");
    editDetail.classList.add("btn")
    editDetail.setAttribute("data-bs-toggle", "modal");
    editDetail.setAttribute("data-bs-target", "#updateRoomPrice");
    editDetail.setAttribute("data", identifier);
    editDetail.innerHTML = `<i class="fa fa-edit"></i>`;

    let cell = newRow.insertCell();
    cell.appendChild(editDetail);
    addCustomEventListener("edit", e => {
        let form = document.querySelector(e.target.getAttribute("data-bs-target"));
        let identifier = e.target.getAttribute("data")
        let row = document.querySelector(`table tbody [identifier="${identifier}"]`)
        form.querySelector("#capacity").value = row.querySelector(`[name='capacity']`).getAttribute("value");
        form.querySelector("#price").value = row.querySelector(`[name='price']`).getAttribute("value");
        form.setAttribute("data", identifier);
    }, editDetail)

    let deleteDetail = document.createElement("button");
    deleteDetail.classList.add("btn")
    deleteDetail.setAttribute("data", identifier)
    deleteDetail.innerHTML = `<i class="fa fa-trash">`;

    cell = newRow.insertCell();
    cell.appendChild(deleteDetail);
    addCustomEventListener("delete", e => {
        let target = e.target.getAttribute("data");
        forEach(table.rows, (ro, e) => {
            let identifier = e.getAttribute("identifier");
            if (identifier === target) {
                table.deleteRow(ro);
            }
        })
    }, deleteDetail);
}, "#addRoomPrice")
*/

// function* countGenerator() {
//     let count = 1;

//     while (true) {
//         yield count;
//         count++;
//     }
// }

// const facilitiesCount = countGenerator();

// handleFormSubmited(e => {
//     let data = getFormValue(e.target);
//     if (data?.facility == "") return;

//     let facilities = document.querySelector('.facilities');
//     let facility = document.createElement('li');
//     facility.setAttribute("input", "");
//     facility.setAttribute("name", "facility_" + facilitiesCount.next().value);
//     facility.innerHTML = data?.facility;
//     facilities.append(facility);
// }, "#addFacility")