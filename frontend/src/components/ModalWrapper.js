import React from "react";

const modalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
  content: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
    maxWidth: 600,
    width: "90%",
  },
};

const ModalWrapper = ({ children, onClose }) => (
  <div style={modalStyle.overlay} onClick={onClose}>
    <div style={modalStyle.content} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

export default ModalWrapper;
