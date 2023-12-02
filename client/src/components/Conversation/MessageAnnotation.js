import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

const MessageAnnotation = ({ type, file, text, onReset }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const renderContent = () => {
    switch (type) {
      case "text":
        return <Typography variant="body2">{text}</Typography>;
      case "img":
        return (
          <CardMedia component="img" alt="Image" height="140" image={file[0]} />
        );
      case "doc":
        return <Typography variant="body2">{`File: ${file}`}</Typography>;
      default:
        return null;
    }
  };

  return (
    <div
      style={{ position: "relative" }}
      onClick={onReset}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card style={{ filter: isHovered ? "blur(5px)" : "none" }}>
        <CardContent>{renderContent()}</CardContent>
      </Card>
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#FFF",
            fontSize: 13,
            fontWeight: "bold",
          }}
        >
          Cancel
        </div>
      )}
    </div>
  );
};

export default MessageAnnotation;
