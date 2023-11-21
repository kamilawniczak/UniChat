import React from "react";
import { Modal, IconButton } from "@mui/material";
import { X } from "@phosphor-icons/react";

const ImgModal = ({ img, onClose }) => {
  return (
    <Modal
      open={Boolean(img)}
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <IconButton
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "white",
          }}
          onClick={onClose}
        >
          <X size={32} />
        </IconButton>
        <img
          src={img}
          alt={img}
          style={{
            maxHeight: "100vh",
            maxWidth: "100vw",
          }}
        />
      </div>
    </Modal>
  );
};

export default ImgModal;
