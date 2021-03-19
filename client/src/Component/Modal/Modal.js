import '../../../src/App.css';
import backendServer from '../../../src/WebConfig';
const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button type="button" onClick={handleClose} className="button_signUp">
          Close
        </button>
        <br/>
        <br/>
       
      </section>
    </div>
  );
};

export default Modal;