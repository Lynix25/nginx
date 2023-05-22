import { APIGet, APIPut } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { getFormValue, getParamOnURL, getUpdateFormValue, getUserID, goBack, goTo, handleFormSubmited, numberWithThousandsSeparators } from "./utils.js";

APIGet(ServiceURL.Room.getById(getParamOnURL("id"))).then(res => {
    let room = res.data.data.room;
    reloadData(room);
})

function reloadData(room) {
    document.querySelector("#name").value = room.name;
    document.querySelector("#floor").value = room.floor;
    document.querySelector("#quota").value = room.quota;

    setSelected(document.querySelector("#allotment"), room.allotment);
    
    document.querySelector("#description").value = room.description;
    document.querySelector("#description").innerHTML = room.description;
}

function setSelected(listOption, selectedValue) {
    for(let i=0; i < listOption.options.length; i++) {
        if(listOption.options[i].text === selectedValue) {
            listOption.options[i].selected = true;
        }
    }
}

document.addEventListener("change", e => {
    e.target.setAttribute("changed", "");
})

handleFormSubmited(e => {
    let data = getFormValue(e.target);
    APIPut(ServiceURL.Room.update(getParamOnURL("id")), data, {
        "requesterId" : getUserID()
    }).then(response => {
        reloadData(response.data.data.room);
        Toast(Constant.httpStatus.SUCCESS, response.data.message);
        setTimeout(function () { goTo(PAGE.ROOMDETAIL + getParamOnURL('id'))}, Event.timeout);
    }).catch(err => {
        if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    });
});

document.querySelector("#back").addEventListener("click", e => {
    goBack();
});

/*
function reloadData(room) {
    document.getElementById("name").value = room.name;
    document.getElementById("floor").value = room.floor;
    document.getElementById("description").value = room.description;
    // document.getElementById("allotment").value = room.allotment;
    document.getElementById("allotment").setAttribute("value", room.allotment);

    let prices = room.prices;
    let table = document.querySelector("table tbody");

    prices.forEach(price => {
        let newRow = table.insertRow();
        newRow.setAttribute("data-id", price.id);
        newRow.innerHTML =
            `<td>
                <div input name="capacity" data-value=${price?.capacity}>${price?.capacity} Orang</div>
            </td>
            <td>
                <div input name="price" data-value="${price.price}">${numberWithThousandsSeparators(price.price)}</div>
            </td>
            <td>
                <button class="btn" type="edit" data-id="${price.id}" data-bs-toggle="modal" data-bs-target="#addRoomPrice"><i class="fa fa-edit"></i></button>
            </td>
            <td>
                <button class="btn" type="delete" data-id="${price.id}"><i class="fa fa-trash"></i></button>
            </td>
            `;
    });

    addCustomEventListenerV2("edit", e => {
        console.log(e);
    }, document.querySelector("form"), document.querySelector("button[type='edit']"));

    // let editDetail = document.createElement("button");
    // editDetail.classList.add("btn")
    // editDetail.setAttribute("data-bs-toggle", "modal");
    // editDetail.setAttribute("data-bs-target", "#addRoomPrice");
    // editDetail.setAttribute("data", table.rows.length)
    // editDetail.innerHTML = `<i class="fa fa-edit"></i>`;

    // let cell = newRow.insertCell();
    // cell.appendChild(editDetail);
    // addCustomEventListener("edit", e => {
    //     document.querySelector("#addRoomPrice button[type='update']").removeAttribute("hidden");

    //     let submitButton = document.querySelector("#addRoomPrice button[type='submit']");
    //     submitButton.setAttribute("hidden", "");

    //     let title = document.querySelector("#addRoomPriceLabel");
    //     title.innerHTML = "Update Price Detail";

    //     document.querySelector("#capacity").value = data.capacity;
    //     document.querySelector("#price").value = data.price;

    //     document.querySelector("#addRoomPrice button[type='update']").setAttribute("data", e.target.getAttribute("data"))

    // }, editDetail)

    // let deleteDetail = document.createElement("button");
    // deleteDetail.classList.add("btn")
    // deleteDetail.setAttribute("data", table.rows.length)
    // deleteDetail.innerHTML = `<i class="fa fa-trash">`;

    // cell = newRow.insertCell();
    // cell.appendChild(deleteDetail);
    // addCustomEventListener("delete", e => {
    //     let row = e.target;
    //     let table = document.querySelector("table")
    //     forEach(table.rows, (ro, e) => {
    //         if (e == row) console.log(e, row)
    //     })
    // }, deleteDetail);
}

document.addEventListener("change", e => {
    e.target.setAttribute("changed", "");
})

handleFormSubmited(e => {
    let data = getUpdateFormValue(e.target);

    APIPut("/room/" + getParamOnURL("id"), data, getCookie("tokens")).then(res => {
        console.log(res);
        reloadData(res.data);
    }).catch(err => {
        console.log(err);
    })
})
*/