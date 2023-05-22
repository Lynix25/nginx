const PWA = false;

if (PWA && "serviceWorker" in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceworker.js').then(registration => {
            if (registration.waiting)
                console.log("waiting")
            if (registration.installing)
                console.log("installing")
            if (registration.active)
                console.log('active')
            if (registration.installing) {
                console.log("Regis Servisworker Succesfull, scope : ", registration.scope);
            }
            // registration.showNotification("Hello World!!", {body:"This body hello world!!"});
            // console.log(registration)
        }, (error => {
            console.log("Regis failed ", error);
        })
        )
    })
}