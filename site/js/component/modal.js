import { Constant } from "../config.js";

var modalWrap = null;
/**
 * 
 * @param {string} title 
 * @param {string} description content of modal body 
 * @param {string} actionBtnLabel label of Yes button 
 * @param {string} dismissBtnLabel label of No button 
 * @param {function} callback callback function when click Yes button
 */
export const showModalConfirmation = (type, title, description, actionBtnLabel = 'Yes', dismissBtnLabel = 'Cancel', callback) => {
    if (modalWrap !== null) {
        modalWrap.remove();
    }

    let buttonAction = "btn-primary";
    switch (type) {
        case Constant.modalType.DELETECONFIRMATION:
            buttonAction = "btn-danger";
            break;

        default:
            break;
    }

  modalWrap = document.createElement('div');
  modalWrap.innerHTML = `
        <div class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-light">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${description}</p>
                    </div>
                    <div class="modal-footer bg-light">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${dismissBtnLabel}</button>
                        <button type="button" class="btn ${buttonAction} modal-action-btn" data-bs-dismiss="modal">${actionBtnLabel}</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalWrap.querySelector('.modal-action-btn').onclick = callback;
    document.body.append(modalWrap);

    var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();
}