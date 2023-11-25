// EmojiPickerModal.js
import React from "react";
import { Box } from "@mui/material";
import Picker from "@emoji-mart/react";
import { useTheme } from "@mui/material/styles";
import data from "@emoji-mart/data";

const EmojiPickerModal = ({ open, onClose, onEmojiSelect }) => {
  const theme = useTheme();

  return (
    <Box
      style={{
        zIndex: 10,
        position: "fixed",
        display: open ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClose}
    >
      <Box
        style={{
          backgroundColor: theme.palette.background.paper,
          padding: "20px",
          borderRadius: "8px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Picker
          theme={theme.palette.mode}
          data={data}
          onEmojiSelect={onEmojiSelect}
        />
      </Box>
    </Box>
  );
};

export default EmojiPickerModal;
