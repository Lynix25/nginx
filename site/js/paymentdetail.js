import { APIGet } from "./api.js";
import { PAGE, ServiceURL } from "./config.js";
import { createElementFromString, goTo, paymentStatusToString } from "./utils.js";
import { UNIXtimeConverter, addCustomEventListener, getInvoiceNumber, getParamOnURL, map, map2, numberWithThousandsSeparators } from "./utils.js";

APIGet(ServiceURL.Transaction.get(getParamOnURL("id"))).then(res => {
    let transaction = res.data.data;
    
    let [color, status] = paymentStatusToString(transaction.payment.status);
    let paymentDetailsElement = `
    <div>
        <div class="d-flex justify-content-between">
            <div>Status</div>
            <div class="badge ${color}">${status}</div>
        </div>
        <div class="d-flex justify-content-between">
            <div>Nomor Pembayaran</div>
            <div class="fw-bold">${getInvoiceNumber(transaction.id, transaction.createdDate)}</div>
        </div>
        <div class="d-flex justify-content-between">
            <div>Tanggal Transaksi</div>
            <div>${UNIXtimeConverter(transaction.createdDate, "D MMMM YYYY, hh:mm WIB")}</div>
        </div>
        <hr>
        <div>
            <div>Detail Pembayaran</div>
            ${map(transaction.taskItems, task =>
            `<div data-id="${task.id}" type="task-detail" class="d-flex border rounded justify-content-between mb-3 p-2">
                <div>
                    <div>${task.service.serviceName}</div>
                    <div>${task.service.variant}</div>
                </div>
                <div>
                    <div>Total Harga</div>
                    <div>Rp ${numberWithThousandsSeparators(task.charge)}</div>
                </div>
            </div>`)}
            ${map(transaction.rentItems, rent =>
            `<div class="d-flex border rounded justify-content-between mb-3 p-2">
                <div>
                    <div>Nama Service</div>
                    <div>Keterangan</div>
                </div>
                <div>
                    <div>Total Harga</div>
                    <div>Rp 2.000.000</div>
                </div>
            </div>`)}
        </div>
        <hr>
        <div>
            <div class="">Rincian Pembayaran</div>
            <div class="d-flex justify-content-between">
                <div>Metode Pembayaran</div>
                <div>${transaction.payment.type ? transaction.payment.type : "-"}</div>
            </div>
            <div class="d-flex justify-content-between">
                <div>Total Biaya</div>
                <div>Rp ${numberWithThousandsSeparators(transaction.totalPrice)}</div>
            </div>
            <div class="d-flex justify-content-between">
                <div>Total Denda</div>
                <div>Rp ${numberWithThousandsSeparators(transaction.penaltyFee)}</div>
            </div>
            <div class="d-flex justify-content-between">
                <div>Total Tagihan</div>
                <div>Rp ${numberWithThousandsSeparators(transaction.totalPrice)}</div>
            </div>
            <div class="d-flex justify-content-center">
                ${transaction.payment.httpCode === "404" ? '<button type="create-payment" class="btn btn-primary">Bayar</button>' : ""}
            </div>
        </div>
    </div>`;

    document.querySelector(".card-body").appendChild(createElementFromString(paymentDetailsElement));

    addCustomEventListener("create-payment", e => {
        window.snap.pay(transaction.token, {
            onSuccess: function (result) { alert('success'); console.log(result); },
            onPending: function (result) { alert('pending'); console.log(result); },
            onError: function (result) { alert('error'); console.log(result); },
            onClose: function () { alert('customer closed the popup without finishing the payment'); }
        });
    })

    addCustomEventListener("task-detail", e => {
        let taskId = e.detail.target.getAttribute("data-id");
        goTo(PAGE.TASKDETAIL(taskId));
    })
})