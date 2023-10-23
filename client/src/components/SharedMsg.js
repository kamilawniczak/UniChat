import {
  Box,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";

import { CaretLeft } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { UpdateSidebarType } from "../redux/slices/app";
import { faker } from "@faker-js/faker";
import { SHARED_DOCS, SHERED_LINKS } from "../data";
import { DocMsg, LinkMsg } from "./Conversation/MsgTypes";

const SharedMsg = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelectedOption = (value) => {
    switch (value) {
      case 0:
        return (
          <Grid container spacing={2}>
            {[0, 1, 2, 3, 4, 5, 6, 6].map((e) => (
              <Grid item xs={4}>
                <img src={faker.image.avatar()} alt={faker.name.fullName()} />
              </Grid>
            ))}
          </Grid>
        );
      case 1:
        return SHERED_LINKS.map((e) => <LinkMsg data={e} />);
      case 2:
        return SHARED_DOCS.map((e) => <DocMsg data={e} />);
    }
  };

  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }} alignItems="center">
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            direction="row"
            sx={{ height: "100%" }}
            p={2}
            alignItems="center"
          >
            <IconButton onClick={() => dispatch(UpdateSidebarType("CONTACT"))}>
              <CaretLeft />
            </IconButton>
            <Typography variant="subtitle2">Shared Messages</Typography>
          </Stack>
        </Box>
        <Tabs value={value} onChange={handleChange} sx={{ px: 2, pt: 2 }}>
          <Tab label="Media" />
          <Tab label="Links" />
          <Tab label="Docs" />
        </Tabs>
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
          }}
          p={3}
          spacing={3}
        >
          {handleSelectedOption(value)}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SharedMsg;
