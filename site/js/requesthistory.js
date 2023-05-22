import { APIGet } from "./api.js";
import { PAGE, ServiceURL } from "./config.js";
import { UNIXtimeConverter, getUserID, goBack, goTo, isOwnerOrAdmin, statusToString } from "./utils.js";

let paramGetTask = "";
if (!isOwnerOrAdmin()) paramGetTask = getUserID();

APIGet(ServiceURL.Task.getAll(paramGetTask, "all")).then(res => {
    let data = res.data.data;
    console.log(data);
    if (data.length > 0) {
        document.querySelector(".no-data").setAttribute("hidden", "");
        data.forEach(taskDTO => {
            addRequest(taskDTO.task, taskDTO.room);
        });
    }
});


function addRequest(task, room) {
    let requestList = document.querySelector("#request-list");
    let taskElement = document.createElement("li");
    taskElement.setAttribute("data-id", task.id);
    taskElement.classList.add("item-card", "p-3", "item");
    taskElement.setAttribute("style", "cursor: pointer")
    let [color, status] = statusToString(task.status);

    let roomInfo = "";
    if (isOwnerOrAdmin())
        roomInfo = `<div><span class="badge-green p-1 small fw-bold rounded" style="font-size: x-small;">${room.name}</span></div>`;

    taskElement.innerHTML = `
    <div class="row d-flex justify-content-between align-items-center">
        <div class="col-sm-6 p-0">
            <div class="fw-bold mb-2">${task.service.serviceName}: ${task.service.variant}</div>
            <div class="row">
                <div class="small col-sm-6 p-0">Diajukan pada</div>
                <div class="small fw-bold col-sm-6 p-0 text-success">${UNIXtimeConverter(task.createdDate, "DD MMMM YYYY hh:mm")}</div>
            </div>
            <div class="row">
                <div class="small col-sm-6 p-0">Permintaan pengerjaan</div>
                <div class="small fw-bold col-sm-6 p-0 text-danger">${UNIXtimeConverter(task.taskDate, "DD MMMM YYYY hh:mm")}</div>
            </div>
        </div>
        <div class="col-sm-6 p-2 pe-0 text-end">
            <div><span class="${color} p-1 small fw-bold rounded" style="font-size: x-small;">${status}</span></div>
            ${roomInfo}
        </div>
    </div>
    <hr style="margin: .5rem 0px;">
    <div class="d-flex justify-content-between">
        <div class="d-flex">
            <div class="text-center">
                <i class="fa fa-list-alt" style="font-size: var(--font-style)"></i>
            </div>
            <div class="mx-2">
                <div style="font-style: italic">${task.summary}</div>
            </div>
        </div>
    </div>`

    taskElement.addEventListener("click", e => {
        let taskId = e.currentTarget.getAttribute("data-id");
        goTo(PAGE.TASKDETAIL(taskId));
    });

    requestList.appendChild(taskElement);
}

document.querySelector("#back").addEventListener("click", e => {
    goBack();
});