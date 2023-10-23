import { alpha } from "@mui/material";
import styled from "@emotion/styled";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.background.paper, 1),

  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}));

export default Search;
