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
    background-color: ${(props) =>
      props.colorMode === "dark" ? "#1a202c" : "#ffffff"};
  }
  .fc-popover-body {
    background-color: ${(props) =>
      props.colorMode === "dark" ? "#1a202c" : "#ffffff"};
  }
  .fc-toolbar-title {
    font-size: 1.5em;
  }
`;

// .fc-button {
//   background-color: ${(props) =>
//     props.colorMode === "dark"
//       ? "var(--chakra-colors-purple-900)"
//       : "var(--chakra-colors-purple-900)"};
// }

// 3. extend the theme
const theme = extendTheme({ config });

export default theme;
