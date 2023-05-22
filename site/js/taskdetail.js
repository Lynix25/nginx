import { APIGet, APIPut } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, ServiceURL } from "./config.js";
import { addCustomEventListener, getParamOnURL, getTicketRequest, isOwnerOrAdmin, numberWithThousandsSeparators, statusToString, UNIXtimeConverter } from "./utils.js";

APIGet(ServiceURL.Task.getById(getParamOnURL("id"))).then(res => {
    let task = res.data.data;
    console.log(task.task.id);
    reloadData(task.task, task.room);
});

function reloadData(task, room) {
    let user = task.user;
    document.querySelector(".id").innerHTML = `Kode pengajuan: ${getTicketRequest(task.id, task.createdDate)}`;

    let [color, status] = statusToString(task.status);
    document.querySelector(".status").innerHTML = `<div class="badge ${color}">${status}</div>`;

    document.querySelector(".requesterUser").innerHTML = user.name;
    document.querySelector(".roomUser").innerHTML = room.name;
    document.querySelector(".createdDate").innerHTML = UNIXtimeConverter(task.createdDate, "DD MMMM YYYY hh:mm");
    document.querySelector(".taskDate").innerHTML = UNIXtimeConverter(task.taskDate, "DD MMMM YYYY hh:mm");

    // document.querySelector(".quantity").setAttribute("value", data.additionalCharge);
    // document.querySelector(".quantity").innerHTML = data.additionalCharge;
    document.querySelector("#notes").innerHTML = task.notes ? task.notes : "";
    document.querySelector("#summary").innerHTML = task.summary;

    // APIGet(ServiceURL.Service.getById(data.service.id)).then(res => {

    let serviceName = task.service.serviceName;
    if (serviceName === Constant.serviceCategory.LAUNDRY) {
        // document.querySelector("#quantity-container").removeAttribute("hidden");
        document.querySelector(".quantity").value = task.requestedQuantity;
    }

    document.querySelector(".service").innerHTML = serviceName;
    document.querySelector(".variant").innerHTML = task.service.variant;
    document.querySelector(".price").innerHTML = `Rp ${numberWithThousandsSeparators(task.charge)}`;
    document.querySelector("#final-price").setAttribute("initialValue", numberWithThousandsSeparators(task.charge));
    document.querySelector("#final-price").innerHTML = `Rp ${numberWithThousandsSeparators(task.charge)}`;
    // });

    if (isOwnerOrAdmin()) {
        if (task.status === Constant.serviceRequestStatus.REJECTED ||
            task.status === Constant.serviceRequestStatus.COMPLETED) {
            // Hide all button. Tandanya, service request closed dan tidak bisa dilakukan update lagi
            document.querySelector(".card-footer").setAttribute("hidden", "");
            document.querySelector("#notes").setAttribute("disabled", "");
            document.querySelector("#notes").setAttribute("placeholder", "");
        }
        else if (task.status === Constant.serviceRequestStatus.SUBMITTED) {
            // Show only button update & process
            document.querySelector("[type='reject']").removeAttribute("hidden", "");
            document.querySelector("[type='process']").removeAttribute("hidden", "");
            document.querySelector("[type='update']").setAttribute("hidden", "");
            document.querySelector("[type='finish']").setAttribute("hidden", "");

            document.querySelector(".quantity").removeAttribute("disabled");
            document.querySelector("#notes").removeAttribute("disabled");
        }
        else if (task.status === Constant.serviceRequestStatus.ACCEPTED) {
            // Show only button update & finish

            document.querySelector(".quantity").removeAttribute("disabled");
            document.querySelector("#notes").removeAttribute("disabled");

            document.querySelector("[type='update']").removeAttribute("hidden", "");
            document.querySelector("[type='finish']").removeAttribute("hidden", "");
            document.querySelector("[type='reject']").setAttribute("hidden", "");
            document.querySelector("[type='process']").setAttribute("hidden", "");
        }
    } else {
        document.querySelector(".card-footer").setAttribute("hidden", "");
        if (task.notes == null || task.notes === "")
            document.querySelector("#notes").setAttribute("placeholder", "");
    }
}

document.addEventListener("change", e => {
    e.target.setAttribute("changed", "");
    e.target.setAttribute("value", e.target.value);
})

document.querySelector(".quantity").addEventListener("change", e => {
    APIPut(ServiceURL.Task.update(getParamOnURL("id")), { requestedQuantity: e.target.value }).then(e => {
        location.reload();
    })
})

addCustomEventListener("reject", e => {
    APIPut(ServiceURL.Task.update(getParamOnURL('id')), {
        "status": Constant.serviceRequestStatus.REJECTED,
        "notes": document.querySelector("#notes").value,
    }).then(response => {
        Toast(Constant.httpStatus.SUCCESS, response.data.message);
        reloadData(response.data.data.task, response.data.data.room);
    }).catch(err => {
        Toast(Constant.httpStatus.ERROR, err?.message);
    });
}, document.querySelector("[type='reject']"));

addCustomEventListener("process", e => {
    APIPut(ServiceURL.Task.update(getParamOnURL('id')), {
        "status": Constant.serviceRequestStatus.ACCEPTED,
        "notes": document.querySelector("#notes").value,
    }).then(response => {
        reloadData(response.data.data.task, response.data.data.room);
        Toast(Constant.httpStatus.SUCCESS, response.data.message);
    }).catch(err => {
        console.log(err);
        if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    });
}, document.querySelector("[type='process']"))

addCustomEventListener("update", e => {
    APIPut(ServiceURL.Task.update(getParamOnURL('id')), {
        "status": Constant.serviceRequestStatus.ACCEPTED,
        "notes": document.querySelector("#notes").value,
    }).then(response => {
        reloadData(response.data.data.task, response.data.data.room);
        Toast(Constant.httpStatus.SUCCESS, response.data.message);
    }).catch(err => {
        if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    });
}, document.querySelector("[type='update']"));

addCustomEventListener("finish", e => {
    APIPut(ServiceURL.Task.update(getParamOnURL('id')), {
        "status": Constant.serviceRequestStatus.COMPLETED,
        "notes": document.querySelector("#notes").value,
    }).then(response => {
        console.log(response);
        reloadData(response.data.data.task, response.data.data.room);
        Toast(Constant.httpStatus.SUCCESS, response.data.message);
    }).catch(err => {
        console.log(err);
        if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    });
}, document.querySelector("[type='finish']"));

