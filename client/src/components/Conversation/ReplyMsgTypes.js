import { useTheme } from "@emotion/react";

import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  getFileNameFromUrl,
  handleDownload,
  splitMessage,
} from "../../utils/formatMsg";
import { Download, DownloadSimple, Image } from "@phosphor-icons/react";
import ImgModal from "./ImgModal";
import { useState } from "react";

export const ReplyTextMsg = ({ created_at, from, text, type }) => {
  const theme = useTheme();
  const { textBeforeLink, textAfterLink, link } = splitMessage(text);
  return (
    <Stack direction="row">
      <Stack>
        <Box
          p={1.5}
          sx={{
            backgroundColor: theme.palette.grey[600],
            borderRadius: 1.5,
          }}
        >
          <Typography variant="body2" color={"#fff"}>
            {link ? (
              <>
                {textBeforeLink}{" "}
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#fff",
                  }}
                >
                  {link}
                </a>{" "}
                {textAfterLink}
              </>
            ) : (
              text
            )}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};
export const ReplyImgMsg = ({
  created_at,
  from,
  text,
  type,
  file,
  isLoading,
}) => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { textBeforeLink, textAfterLink, link } = splitMessage(text);

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };
  const handleDownloadClick = (event, img) => {
    event.stopPropagation();
    handleDownload(img);
  };
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <>
      <Stack direction="row">
        <Stack>
          <Box
            p={1.5}
            sx={{
              backgroundColor: theme.palette.grey[600],
              borderRadius: 1.5,
            }}
          >
            <Stack spacing={2}>
              {isLoading ? (
                <CircularProgress size={104} color="inherit" />
              ) : (
                <>
                  {file.map((element, index) => (
                    <div
                      key={index}
                      style={{ position: "relative", display: "inline-block" }}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={element}
                        alt={getFileNameFromUrl(element) || element}
                        style={{
                          maxHeight: "210px",
                          borderRadius: "10px",
                        }}
                        onClick={() => handleImageClick(element)}
                      />
                      {hoveredIndex === index && (
                        <IconButton
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                          }}
                          onClick={(event) =>
                            handleDownloadClick(event, element)
                          }
                        >
                          <Download />
                        </IconButton>
                      )}
                    </div>
                  ))}
                </>
              )}
              {text && (
                <Typography variant="body2" color={"#fff"}>
                  {link ? (
                    <>
                      {textBeforeLink}{" "}
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#fff",
                        }}
                      >
                        {link}
                      </a>{" "}
                      {textAfterLink}
                    </>
                  ) : (
                    text
                  )}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Stack>

      <ImgModal img={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
};
export const ReplyDocMsg = ({
  created_at,
  from,
  text,
  type,
  file,
  isLoading,
}) => {
  const theme = useTheme();

  const [selectedImage, setSelectedImage] = useState(null);

  const { textBeforeLink, textAfterLink, link } = splitMessage(text);

  return (
    <>
      <Stack direction="row">
        <Stack>
          <Box
            p={1.5}
            sx={{
              backgroundColor: theme.palette.grey[600],
              borderRadius: 1.5,
            }}
          >
            <Stack spacing={2}>
              {isLoading ? (
                <CircularProgress size={104} color="inherit" />
              ) : (
                <>
                  {file.map((element, index) => (
                    <Stack
                      p={2}
                      direction="row"
                      spacing={3}
                      alignItems="center"
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 1,
                      }}
                      key={index}
                    >
                      <Image size={48} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#FFF",
                        }}
                      >
                        {getFileNameFromUrl(element)}
                      </Typography>
                      <IconButton onClick={() => handleDownload(element)}>
                        <DownloadSimple />
                      </IconButton>
                    </Stack>
                  ))}
                </>
              )}

              {text && (
                <Typography variant="body2" sx={{ color: "#FFF" }}>
                  {link ? (
                    <>
                      {textBeforeLink}{" "}
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#fff",
                        }}
                      >
                        {link}
                      </a>{" "}
                      {textAfterLink}
                    </>
                  ) : (
                    text
                  )}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Stack>

      <ImgModal img={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
};
