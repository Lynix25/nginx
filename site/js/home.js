import { APIGet } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { logout } from "./main.js";
import { UNIXtimeConverter, addCustomEventListener, createElementFromString, forEach, getUserID, goTo, isOwner, isOwnerOrAdmin, isUnderOneWeek, numberWithThousandsSeparators, statusToString } from "./utils.js";

if (isOwnerOrAdmin()) {
    document.querySelector(".summary").setAttribute("hidden", "");
    document.querySelector(".menu-tenant").setAttribute("hidden", "");

    document.querySelector(".taskOrRequest-label").innerHTML = "Yuk, segera selesaikan pekerjaan berikut!";

    let taskCanvas = document.querySelector(".task-chart");
    let taskChart = new Chart(taskCanvas, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{ label: 'Pengajuan Layanan', data: [] }],
            borderWidth: 1
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Frekuensi Pengajuan Layanan Bulanan'
                }
            },
            aspectRatio: 2 / 1
        }
    });

    let processedCanvas = document.querySelector(".processed-chart");
    let processedChart = new Chart(processedCanvas, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{ data: [] }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Performa Pengerjaan Layanan Bulanan'
                },
                colors: {
                    forceOverride: true
                }
            },
            aspectRatio: 2 / 1
        }
    });

    APIGet(ServiceURL.Task.getAll("", "all")).then(res => {
        let data = res.data.data;
        console.log(res);

        if (isOwner()) {
            document.querySelector("#announcement-content").setAttribute("hidden", "");
            let tasks = [];
            forEach(data, v => {
                tasks.push(v.task);
            })

            let filteredTasks = tasks.filter(task => UNIXtimeConverter(task.taskDate, "MM") === UNIXtimeConverter(Date.now(), "MM"))

            let chartData = {}
            forEach(filteredTasks, v => {
                if (!(v.service.serviceName in chartData)) {
                    chartData[v.service.serviceName] = 0;
                }
                chartData[v.service.serviceName]++;
            })

            taskChart.data.labels.push(...Object.keys(chartData))
            taskChart.data.datasets.forEach((dataset) => {
                dataset.data.push(...Object.values(chartData));
            })
            taskChart.update();

            let processedData = {}
            forEach(filteredTasks, v => {
                if (!(v.status in processedData)) {
                    processedData[v.status] = 0;
                }
                processedData[v.status]++;
            })

            processedChart.data.labels.push(...Object.keys(processedData))
            processedChart.data.datasets.forEach((dataset) => {
                dataset.data.push(...Object.values(processedData));
            })
            processedChart.update();
        }
        else {
            taskCanvas.parentElement.setAttribute("hidden", "")
            processedCanvas.parentElement.setAttribute("hidden", "")
        }
    });
} else {
    document.querySelector(".menu-admin").setAttribute("hidden", "");
    document.querySelector(".chart").setAttribute("hidden", "");
    document.querySelector(".processed-chart").setAttribute("hidden", "");
    document.querySelector(".task-chart").setAttribute("hidden", "");

    document.querySelector(".taskOrRequest-label").innerHTML = "Ini daftar layanan terbaru yang kamu ajukan";

    APIGet(ServiceURL.Transaction.unpaid(getCookie("id"))).then(res => {
        let data = res.data;

        document.querySelector(".unpaid-total").innerHTML = numberWithThousandsSeparators(data.unpaidTotal);

        document.querySelector(".due-date").innerHTML = data.maxDueDate > 0 ? `Bayar sebelum: <span class="${isUnderOneWeek(data.maxDueDate) ? "" : "text-danger"} fw-bold">${UNIXtimeConverter(data.maxDueDate, "DD MMMM YYYY")}</span>` : "";
        if (data.maxDueDate < 0) document.querySelector(".payment-label-2").innerHTML = "Belum ada tagihan";
    }).catch(err => {
        console.log(err);
        document.querySelector(".unpaid-total").innerHTML = numberWithThousandsSeparators(0);
    });
}

APIGet(ServiceURL.User.getById(getCookie("id"))).then(res => {
    let data = res.data.data;

    if (isOwnerOrAdmin()) {
        document.querySelector(".greetings2").innerHTML = `<b class="text-muted fs-5">Halo, ${data.user.role.name.toLowerCase()} ${data.user.name.split(" ")[0]}!</b> Yuk kelola kosanmu`;
    } else {
        document.querySelector(".greetings1").innerHTML = `Halo, ${data.user.name}!`;
        document.querySelector(".room-name").innerHTML = data.room?.name;
    }
}).catch(err => {
    Toast(Constant.httpStatus.ERROR, "Data login tidak valid");
    setTimeout(() => logout(), Event.timeout);
});

APIGet(ServiceURL.MasterData.getIndekos).then(res => {
    let data = res.data;
    if (isOwnerOrAdmin()) {
        document.querySelector(".greetings1").classList.add("d-flex", "align-items-end");
        document.querySelector(".greetings1").innerHTML = `${data.name}`;
    } else {
        document.querySelector(".greetings2").innerHTML = `Selamat bergabung di <b class="text-muted fs-5">"${data.name}"</b>`;
    }
});

APIGet(ServiceURL.Announcement.getAll).then(res => {
    let announcements = res.data.data;

    document.querySelector("#carousel-offline").setAttribute("hidden", "");
    document.querySelector("#carousel").removeAttribute("hidden");

    if (announcements.length == 0) {
        let announcementCarousel = document.createElement("div");
        announcementCarousel.classList.add("carousel-indicators", "align-items-end");
        announcementCarousel.innerHTML = `
            <button type="button" data-bs-target="#carousel" data-bs-slide-to="0" class="active"
                aria-current="true" aria-label="Slide 1"></button>`;
        document.querySelector("#carousel").appendChild(announcementCarousel);

        let announcement = document.createElement("div");
        announcement.classList.add("carousel-inner");
        announcement.innerHTML = `
            <div class="carousel-item active">
                <img class="img-no-text" src="asset/no_announcement.png" alt="Belum ada pengumuman">
            </div>`;
        document.querySelector("#carousel").appendChild(announcement);
    } else {
        let announcementCarousel = document.createElement("div");
        announcementCarousel.classList.add("carousel-indicators", "align-items-end");
        announcementCarousel.setAttribute("id", "carousel-indicators")
        for (let i = 0; i < announcements.length; i++) {
            if (i == 0) {
                announcementCarousel.innerHTML += `
                    <button type="button" data-bs-target="#carousel" data-bs-slide-to=${i} class="active"
                        aria-current="true" aria-label="Slide ${i + 1}"></button>`;
            } else {
                announcementCarousel.innerHTML += `
                    <button type="button" data-bs-target="#carousel" data-bs-slide-to=${i} 
                        aria-label="Slide ${i + 1}"></button>`;
            }
        }
        document.querySelector("#announcement-list").appendChild(announcementCarousel);

        let count = 0;
        announcements.forEach(data => {

            let announcement = document.createElement("div");
            let src;
            let image = data.image;
            if (image == null || image.trim() === "") src = "asset/no_image.png"
            else src = `data:image/png;base64,${image}`;

            if (count == 0) {
                announcement.classList.add("carousel-item", "active");
                announcement.innerHTML = `
                    <figcaption>${data.title}</figcaption>
                    <img src="${src}" alt="${data.title}">
                `;
            } else {
                announcement.classList.add("carousel-item");
                announcement.innerHTML += `
                <figcaption>${data.title}</figcaption>
                <img src="${src}" alt="${data.title}">
            `;
            }
            count++;

            announcement.addEventListener("click", e => {
                goTo("./announcementdetail.html?id=" + data.id);
            });
            document.querySelector("#announcement-list").appendChild(announcement);
        });
        if (count > 1) {
            let carouselButton = document.createElement("div");
            carouselButton.innerHTML = `
                <button class="carousel-control-prev ml-2" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon rounded-circle" aria-hidden="true"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon rounded-circle" aria-hidden="true"></span>
                </button>
            `;
            document.querySelector("#carousel").appendChild(carouselButton);
        }
    }
});

let paramGetTask = "";
if (!isOwnerOrAdmin()) paramGetTask = getUserID();

APIGet(ServiceURL.Task.getAll(paramGetTask, "")).then(res => {
    let taskList = res.data.data;

    if (taskList.length > 0) {
        document.querySelector("#no-taskOrRequest").setAttribute("hidden", "");
        document.querySelector("#list-taskOrRequest").removeAttribute("hidden");

        let count = 0;
        taskList.forEach(item => {
            if (count > 0 && item.status != "Diterima")
                document.querySelector("#list-taskOrRequest").appendChild(document.createElement("hr"));

            if (item.status != "Diterima") addRequest(item.room.name, item.task, "#list-taskOrRequest");
            count++;
        });

        addCustomEventListener("task-detail", e => {
            let taskId = e.detail.target.getAttribute("data-id");
            goTo(PAGE.TASKDETAIL(taskId));
        })
    }
});

function addRequest(room, task, elementId) {
    let requestList = document.querySelector(elementId);

    let [color, status] = statusToString(task.status);

    let taskElement = `
        <li data-id="${task.id}" type="task-detail" class="row d-flex align-items-center", style="cursor: pointer">
            <div class="col p-0 d-flex align-items-center">
                <div class="pe-2">
                    <i class="fa fa-solid fa-bullseye-arrow fs-4"></i>
                </div>
                <div>    
                    <div>${task.service.serviceName}: ${task.service.variant}</div>
                    <div class="small">Target: ${UNIXtimeConverter(task.taskDate, "DD MMMM YYYY hh:mm")}</div>
                </div>
            </div>
            <div class="col-sm-6 p-2 pe-0 text-end">
                <div><span class="${color} p-1 small fw-bold rounded" style="font-size: x-small;">${status}</span></div>
                <div><span class="p-1 small fw-bold rounded" style="font-size: x-small;">${room}</span></div>
            </div>
        </li>`;

    requestList.appendChild(createElementFromString(taskElement));
}

document.querySelector(".pay").addEventListener("click", e => {
    goTo(PAGE.PAYMENT);
})