import { APIGet } from "./api.js";
import { PAGE, ServiceURL } from "./config.js";
import { UNIXtimeConverter, addCustomEventListener, getInvoiceNumber, getUserID, goBack, goTo, isOwner, isOwnerOrAdmin, map, numberWithThousandsSeparators, paymentStatusToString } from "./utils.js";

let paramGetTransaction = "";
if (!isOwnerOrAdmin()) paramGetTransaction = getUserID();

APIGet(ServiceURL.Transaction.getAll(paramGetTransaction)).then(res => {
    let transactions = res.data.data;
    console.log(transactions);

    document.querySelector("#paid-list").innerHTML =
        map(transactions, transaction => {
            let [color, status] = paymentStatusToString(transaction.payment.status);
            return `<li type="transaction-detail" data-id="${transaction.id}" class="border rounded px-3 py-1 mb-2">
                        <div class="d-flex justify-content-between">
                            <div class="fw-bold">${getInvoiceNumber(transaction.id, transaction.createdDate)}</div>
                            <div class="badge ${color}">${status}</div>
                        </div>
                        <div class="d-flex flex-column justify-content-between flex-lg-row align-items-lg-center">
                            <div>
                                <div class="d-flex justify-content-between">
                                    <div class="me-3">Tagihan dibuat pada</div>
                                    <div>${UNIXtimeConverter(transaction.createdDate, "DD MMMM YYYY hh:mm")}</div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <div class="me-3">Tagihan dibayar pada</div>
                                    <div>${UNIXtimeConverter(transaction.lastModifiedDate, "DD MMMM YYYY hh:mm")}</div>
                                </div>
                            </div>
                            <div class="text-center">
                                ${transaction.totalItem > 1 ? `${transaction.totalItem - 1} Layanan lainnya` : ""}
                            </div>
                        </div>
                        <hr style="margin: .5rem 0px;">
                        <div class="d-flex justify-content-between">
                            <div>Total</div>
                            <div>Rp ${numberWithThousandsSeparators(transaction.totalPrice)}</div>
                        </div>
                    </li>`})

    addCustomEventListener("transaction-detail", e => {
        let transactionId = e.detail.target.getAttribute("data-id");
        goTo(PAGE.PAYMENTDETAIL(transactionId));
    })
})

document.querySelector("#back").addEventListener("click", e => {
    goBack();
});