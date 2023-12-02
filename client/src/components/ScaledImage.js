import styled from "@emotion/styled";

export const ScaledImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  cursor: "pointer",
  position: "relative",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.2)",
  },
});
