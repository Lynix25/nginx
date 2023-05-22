import { APIGet, APIPut } from "./api.js";
import { ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { UNIXtimeConverter, createElementFromString, goBack, goTo, timeElapsed } from "./utils.js";

APIGet(ServiceURL.Notification.getAll(getCookie("id"))).then(res => {
    let notifications = res.data.data;

    if (notifications.length > 0) document.querySelector(".notificationList").innerHTML = "";

    notifications.forEach(notification => {
        let notificationElement = `
        <li class="border rounded d-flex p-2 mb-2 ${notification.readed ? "" : "notif-readed"}">
            <div class="d-flex justify-content-center align-items-center" style="margin-left: 2%; margin-right: 2%;">
                <i class="fad fa-bullhorn fs-3"></i>
            </div>
            <div style="overflow: auto; width: 100%;">
                <div class="d-flex justify-content-between" style="font-size: 0.8rem;">
                    <div>
                        ${notification.category}
                    </div>
                    <div>
                        ${timeElapsed(notification.createdDate)}
                    </div>
                </div>
                <div>
                    <div class="title fs-5">
                        ${notification.title}
                    </div>
                    <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        ${notification.body}
                    </div>
                </div>
            </div>
        </li>`
        
        notificationElement = createElementFromString(notificationElement);
        notificationElement.addEventListener("click", e => {
            APIPut(ServiceURL.Notification.read(notification.id),{});
            goTo(notification.redirect);
        })

        document.querySelector(".notificationList").appendChild(notificationElement);
    });

})

document.querySelector("#back").addEventListener("click", e => {
    goBack();
});
