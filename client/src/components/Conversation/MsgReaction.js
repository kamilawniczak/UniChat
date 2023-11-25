import { Grid } from "@mui/material";
import { Smiley } from "@phosphor-icons/react";
import React from "react";

const MsgReaction = () => {
  const smileys = Array.from({ length: 2 }).map((_, index) => (
    <Smiley key={index} />
  ));
  return (
    <Grid container spacing={0.1}>
      {smileys.map((smiley, index) => (
        <Grid item key={index}>
          {smiley}
        </Grid>
      ))}
    </Grid>
  );
};

export default MsgReaction;
