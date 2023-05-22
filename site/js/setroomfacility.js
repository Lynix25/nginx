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
export const showModalFormFacility = (type, facilityAction, roomId, category, detail, title, actionBtnLabel = 'Simpan') => {
    
    let currName = "";
    let currDescription = ""
    if(facilityAction === "Update") {
        currName = detail.name;
        currDescription = detail.description;
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
                                <span class="input-group-text" id="basic-addon2">Nama</span>
                                    <input id="name" name="name" type="text" class="form-control" placeholder="Nama fasilitas/ spesifikasi kamar"
                                        aria-label="Nama Fasilitas/ Spesifikasi" aria-describedby="basic-addon2" value="${currName}" required>
                                </div>
                                <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon2">Deskripsi</span>
                                    <input id="description" name="description" type="text" class="form-control" aria-label="Deskripsi Singkat" value="${currDescription}" maxlength=25 placeholder="Keterangan fasilitas/ spesifikasi" required>
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
        data['category'] = category;

        if(data.name == null || data.name === "") {
            Toast(Constant.httpStatus.ERROR, "Kolom nama harus diisi");
        }
        else {
            if(facilityAction === "Add") {
                APIPost(ServiceURL.Room.addDetail(roomId), data, {
                    "requesterId": getUserID()
                }).then(response => {
                    Toast(Constant.httpStatus.SUCCESS, response.data.message);
                    setTimeout(function() { goTo(PAGE.ROOMDETAIL + roomId) }, Event.timeout);
                }).catch(err => {
                    if (err.data == undefined) Toast(Constant.httpStatus.UNKNOWN, err?.message);
                    else Toast(Constant.httpStatus.ERROR, err.data.message);
                });
            } else {
                APIPut(ServiceURL.Room.editDetail(roomId) + detail.id, data, {
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