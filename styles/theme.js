import { extendTheme } from "@chakra-ui/react";
import styled from "@emotion/styled";

// 2. Add your color mode config
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const StyleWrapper = styled.div`
  .fc-event {
    cursor: pointer;
  }
  .fc-popover-header {
    background-color: #1a202c;
  }
  .fc-popover-body {
    background-color: #1a202c;
  }
  .fc-toolbar-title {
    font-size: 1.5em;
  }
`;

// 3. extend the theme
const theme = extendTheme({ config });

export default theme;
