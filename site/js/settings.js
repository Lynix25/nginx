import { APIDelete, APIGet, APIPost, APIPut } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, ServiceURL, WEB_CACHE } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { addCustomEventListener, getFormValueV2, isOwnerOrAdmin, urlB64ToUint8Array } from "./utils.js";

APIGet(ServiceURL.User.getUserSetting(getCookie("id"))).then(res => {
    let userSettings = res.data.data;

    let privateRoomSwitchEl = document.getElementById("privateRoomSwitch");
    privateRoomSwitchEl.checked = userSettings.shareRoom;
    changeSwitchLabel(privateRoomSwitchEl.parentElement);

    let enableNotificationEl = document.getElementById("notificationSwitch");
    enableNotificationEl.checked = userSettings.enableNotification;
    changeSwitchLabel(enableNotificationEl.parentElement);

    enableNotificationEl.addEventListener("change", e => {
        if (e.target.checked) {
            Notification.requestPermission().then(function (status) {
                console.log(status);
                if (status === 'denied') {
                    console.log('[Notification.requestPermission] Notification permission denied.');
                } else if (status === 'granted') {
                    console.log('[Notification.requestPermission] Notification permission granted.');
                    subscribe(e.target.parentElement);
                }
                else {
                    console.log('[Notification.requestPermission] Notification default.');
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            unsubscribe(e.target.parentElement);
        }
    })

    if (isOwnerOrAdmin()) {
        document.querySelector("#room-settings").setAttribute("hidden", "");
    }
})

addCustomEventListener("remove-serviceworker", e => {
    unregisterServiceWorker();
    cleanCache();
})

function unregisterServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations()
            .then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
    }

    unsubscribe();
    location.reload();
}

function cleanCache() {
    WEB_CACHE.forEach(cacheName => {
        caches.delete(cacheName);
    })
}

document.querySelector("form").addEventListener("change", e => {
    let data = getFormValueV2(e.currentTarget);

    APIPut(ServiceURL.User.updateUserSetting(getCookie('id')), data).then(response => {
        Toast(Constant.httpStatus.SUCCESS, response.data.message);
    }).catch(err => {
        Toast(Constant.httpStatus.ERROR, err?.message);
    })
    changeSwitchLabel(e.target.parentElement);
})

function changeSwitchLabel(parentElement) {
    let isChecked = parentElement.children[0].checked;
    if (isChecked) {
        parentElement.children[1].innerText = "ON";
    }
    else {
        parentElement.children[1].innerText = "OFF";
    }
}

function subscribe(element) {
    navigator.serviceWorker.ready.then(function (reg) {
        APIGet(ServiceURL.Notification.getKey).then(res => {
            let subscribeParams = { userVisibleOnly: true };
            let applicationServerKey = urlB64ToUint8Array(res.data.data);

            subscribeParams.applicationServerKey = applicationServerKey;

            reg.pushManager.subscribe(subscribeParams).then(subscription => {
                let endpoint = subscription.endpoint;
                let key = subscription.getKey('p256dh');
                let auth = subscription.getKey('auth');
                sendSubscriptionToServer(endpoint, key, auth, element);
            }).catch(function (e) {
                console.log('Unable to subscribe to push.', e);
            });
        })
    });
}

function sendSubscriptionToServer(endpoint, key, auth, element) {
    var encodedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
    var encodedAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));

    APIPost(ServiceURL.Notification.subs, {
        publicKey: encodedKey, auth: encodedAuth, endPoint: endpoint
    }).then(res => {
        console.log('Subscribed successfully! ' + JSON.stringify(res));
        changeSwitchLabel(element);
    });
}

function unsubscribe() {
    var endpoint = null;
    navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(function (subscription) {
            if (subscription) {
                endpoint = subscription.endpoint;
                return subscription.unsubscribe();
            }
        }).catch(function (error) {
            console.log('Error unsubscribing', error);
        }).then(function () {
            removeSubscriptionFromServer();
        });
    })
}

function removeSubscriptionFromServer() {
    APIDelete(ServiceURL.Notification.unsub(getCookie('id'))).then(res => {
        console.log(res);
    });
}
