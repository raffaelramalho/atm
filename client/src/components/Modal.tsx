import React, { useState } from "react";
import "./modal.css";
import { FaQuestion } from "react-icons/fa";

const Modal = ({ handleClose, show, children }) => {

  const [shown, setShown] = useState('false')

  return (
    <div>
      <section className="modal-main">
        {children}
        <button type="button" onClick={handleClose} className="custom-modal-button">
        <FaQuestion />
        </button>
        <div className={shown ? "hidden-modal" : "show-modal"}>
            dadasdsadsadasd
        </div>
      </section>
    </div>
  );
};

export default Modal;
