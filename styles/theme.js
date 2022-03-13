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
  .fc-button {
    background-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-300)"
        : "var(--chakra-colors-red-300)"};
    border-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-300)"
        : "var(--chakra-colors-red-300)"};
  }
  .fc-next-button:hover {
    background-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-200)"
        : "var(--chakra-colors-red-200)"};
    border-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-200)"
        : "var(--chakra-colors-red-200)"};
  }
  .fc-button-primary:not(:disabled):active {
    background-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-400)"
        : "var(--chakra-colors-red-400)"};
    border-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-400)"
        : "var(--chakra-colors-red-400)"};
    color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-400)"
        : "var(--chakra-colors-red-400)"};
  }
  .fc-icon-chevron-right:active {
    background-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-400)"
        : "var(--chakra-colors-red-400)"};
    border-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-400)"
        : "var(--chakra-colors-red-400)"};
    color: #ffffff;
  }
  .fc-icon-chevron-left:active {
    background-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-400)"
        : "var(--chakra-colors-red-400)"};
    border-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-400)"
        : "var(--chakra-colors-red-400)"};
    color: #ffffff;
  }
  .fc-prev-button:hover {
    background-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-200)"
        : "var(--chakra-colors-red-200)"};
    border-color: ${(props) =>
      props.colorMode === "dark"
        ? "var(--chakra-colors-red-200)"
        : "var(--chakra-colors-red-200)"};
  }
`;

// 3. extend the theme
const theme = extendTheme({ config });

export default theme;
