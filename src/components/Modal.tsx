import { useBlocker } from "react-router-dom";

function Modal({ blocker }: Blocker) {
  return (
    <>
      <div>
        <h2>
          You are about to leave this website and loose all your data. Proceed?
        </h2>
        <div>
          <button type="button" onClick={() => blocker.proceed()}>
            Ok
          </button>
          <button type="button" onClick={() => blocker.reset()}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default Modal;
