import { APIPost, APIPut } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { getFormValue, getUserID, goTo } from "./utils.js";

var modalWrap = null;
/**
 * 
 * @param {string} title
 * @param {string} actionBtnLabel label of Yes button
 */
export const showModalFormPrice = (type, priceAction, roomId, detail, title, actionBtnLabel = 'Simpan') => {
    
    let currPrice = "";
    let currCapacity = ""
    if(priceAction === "Update") {
        currPrice = detail.price;
        currCapacity = detail.capacity;
    }

    if (modalWrap !== null) {
        modalWrap.remove();
    }

    let buttonAction = "btn-danger";
    switch (type) {
        case Constant.modalType.FORM:
            buttonAction = "btn-primary";
            break;

        default:
            break;
    }

  modalWrap = document.createElement('div');
  modalWrap.innerHTML = `
        <div class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-light">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form method="post" action="">
                            <div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text">Rp</span>
                                    <input id="price" name="price" type="number" class="form-control" aria-label="Harga" value="${currPrice}" placeholder="Harga kamar per orang" required>
                                </div>
                                <div class="input-group mb-1">
                                    <input id="capacity" name="capacity" type="number" class="form-control" placeholder="Kapasitas"
                                        aria-label="Kapasitas" aria-describedby="basic-addon2" value="${currCapacity}" required>
                                    <span class="input-group-text" id="basic-addon2">Orang</span>
                                    </div>
                                    <div class="mb-3">
                                        <small class="text-danger"><span class="fw-bold fs- text-danger">* Catatan: </span> Untuk pasutri dihitung 1 keluarga</small>
                                    </div>
                                </div>
                            <div class="modal-footer bg-light">
                                <button type="button" class="btn ${buttonAction} modal-action-btn" data-bs-dismiss="modal">${actionBtnLabel}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalWrap.querySelector('.modal-action-btn').addEventListener('click', e => {
        let form = document.querySelector("form");
        let data = getFormValue(form);

        if(data.capacity == null || data.price == null) {
            Toast(Constant.httpStatus.ERROR, "Semua kolom harus diisi");
        }
        else {
            if(priceAction === "Add") {
                APIPost(ServiceURL.Room.addPrice(roomId), data, {
                    "requesterId": getUserID()
                }).then(response => {
                    Toast(Constant.httpStatus.SUCCESS, response.data.message);
                    setTimeout(function() { goTo(PAGE.ROOMDETAIL + roomId) }, Event.timeout);
                }).catch(err => {
                    if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                    else Toast(Constant.httpStatus.ERROR, err.data.message);
                });
            } else {
                APIPut(ServiceURL.Room.editPrice(roomId) + detail.id, data, {
                    "requesterId": getUserID()
                }).then(response => {
                    Toast(Constant.httpStatus.SUCCESS, response.data.message);
                    setTimeout(function() { goTo(PAGE.ROOMDETAIL + roomId) }, Event.timeout);
                }).catch(err => {
                    if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                    else Toast(Constant.httpStatus.ERROR, err.data.message);
                });
            }
        }
        form.reset();
        e.preventDefault();
    })
    document.body.append(modalWrap);

    var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();
}