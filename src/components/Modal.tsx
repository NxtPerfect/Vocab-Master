import { useBlocker } from "react-router-dom";

function Modal({ blocker }: Blocker) {
  return (
    <>
      <div className="modal-blocker">
        <div className="modal-blocker-wrapper">
          <h2>
            You are about to leave this website and loose all your data. Proceed?
          </h2>
          <div>
            <button className="modal-ok" type="button" onClick={() => blocker.proceed()}>
              Ok
            </button>
            <button className="modal-cancel" type="button" onClick={() => blocker.reset()}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
