import { APIPut, pendingRequest } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, SERVICE_WORKER, ServiceURL } from "./config.js";
import { deleteCookie, getCookie } from "./cookiemanagement.js";
import { convertImage64ToFile, goTo } from "./utils.js";

const activePage = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-link').forEach(link => {
    if (link.href.includes(`${activePage}`)) {
        link.classList.add('active');
    }
})

checkPendingTask();

function checkPendingTask() {
    if (navigator.onLine) {
        let index = 0;
        let key = localStorage.key(index);
        while (key != null) {
            let config = JSON.parse(localStorage.getItem(key));
            if (config.data.identityCardImage) config.data.identityCardImage = convertImage64ToFile(config.data.identityCardImage);
            pendingRequest(config).then(res => {
                console.log("SUCCESS ", res);
            }).catch(err => {
                console.log("ERROR", err);
            })
            localStorage.removeItem(key);
            index++;
            key = localStorage.key(index);
        };
    }
}

export function logout() {
    APIPut(ServiceURL.User.logout(getCookie('id'))).then(res => {
        let deletedCache = res.data.data.deletedCache;
        deleteCookie(...deletedCache);
        Toast(Constant.httpStatus.SUCCESS, res.data.message);
        setTimeout(() => goTo(PAGE.LOGIN), Event.timeout);
    }).catch(err => {
        if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    })
}

export function logoutWithoutToast() {
    APIPut(ServiceURL.User.logout(getCookie('id'))).then(res => {
        let deletedCache = res.data.data.deletedCache;
        deleteCookie(...deletedCache);
    }).catch(err => {
        if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
        else Toast(Constant.httpStatus.ERROR, err.data.message);
    });
}

registerServiceWorker()

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(SERVICE_WORKER).then(registration => {
            console.log("Service worker registration successful with scope : ", registration.scope);
            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }
        }).catch(err => {
            console.log("Service worker registration failed: ", err);
        });
    } else {
        console.log('Service workers aren\'t supported in this browser.');
    }
}

// Notification.requestPermission().then(result => {
//     if (result === "granted") {
//         console.log("granted");
//         navigator.serviceWorker.ready.then((registration) => {
//             console.log('gift user notif')
//             registration.showNotification("Hello World!!", { body: "This body hello world!!" });
            //   registration.showNotification("Vibration Sample", {
            //     body: "Buzz! Buzz!",
            //     icon: "../images/touch/chrome-touch-icon-192x192.png",
            //     vibrate: [200, 100, 200, 100, 200, 100, 200],
            //     tag: "vibration-sample",
            //   });
//         });
//     }
// })