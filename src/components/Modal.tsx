import { useNavigate } from "react-router-dom";

function Modal(route: string) {
  const navigate = useNavigate();
  return (
    <>
      Please confirm
      <button type="button" onClick={() => navigate(route)}>
        Confirm
      </button>
      <button type="button" onClick={close}>
        Confirm
      </button>
    </>
  );
}

export default Modal;
