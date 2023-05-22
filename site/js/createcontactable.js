import { APIPost } from "./api.js";
import { Toast } from "./component/toast.js";
import { Constant, Event, PAGE, ServiceURL } from "./config.js";
import { getCookie } from "./cookiemanagement.js";
import { getFormValue, goTo } from "./utils.js";

var modalWrap = null;
/**
 * 
 * @param {string} title
 * @param {string} actionBtnLabel label of Yes button
 */
export const showModalForm = (type, title, actionBtnLabel = 'Simpan') => {
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
                            <div class="row">
                                <div class="col w-50">
                                    <div class="col p-0 pb-2">
                                        <label class="form-label" for="name">Nama</label>
                                        <input class="form-control" type="text" name="name" id="name" required>
                                    </div>
                                    <div class="col p-0 pb-2">
                                        <label class="form-label" for="relation">Relasi</label>
                                        <input class="form-control" type="text" name="relation" id="relation" required>
                                    </div>
                                    <div class="col p-0 pb-2">
                                        <label class="form-label" for="phone">No. Telepon</label>
                                        <input class="form-control" type="number" name="phone" id="phone" minlength="10" required>
                                    </div>
                                </div>
                                <div class="col">
                                    <label class="form-label" for="address">Alamat</label>
                                    <textarea class="form-control" type="text" name="address" id="address" required></textarea>
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

        if(data.name.length == 0 || data.relation.length == 0 || data.phone.length == 0 || data.address.length == 0) 
            Toast(Constant.httpStatus.ERROR, "Semua kolom harus diisi");
        else {
            APIPost(ServiceURL.User.addContactable(getCookie('id')), data).then(response => {
                Toast(Constant.httpStatus.SUCCESS, response.data.message);
                setTimeout(function() { goTo(PAGE.PROFILE) }, Event.timeout);
            }).catch(err => {
                if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                else Toast(Constant.httpStatus.ERROR, err.data.message);
            });
        }
        form.reset();
        e.preventDefault();
    })
    document.body.append(modalWrap);

    var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();
}