import { extendTheme } from "@chakra-ui/react";
import styled from "@emotion/styled";

// 2. Add your color mode config
const config = {
  initialColorMode: "system",
  // useSystemColorMode: true,
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
  .fc-list-day-cushion {
    background-color: ${(props) =>
      props.colorMode === "dark" ? "var(--chakra-colors-blue-800)" : "#ffffff"};
  }
  .fc .fc-list-event:hover td {
    background-color: ${(props) =>
      props.colorMode === "dark" ? "#1a202c" : "#ffffff"};
  }
  @media screen and (max-width: 655px) {
    .fc-toolbar.fc-header-toolbar {
      font-size: 90%;
    }
  }
  @media screen and (max-width: 620px) {
    .fc {
      font-size: 80%;
    }
  }
  @media screen and (max-width: 520px) {
    .fc {
      font-size: 75%;
    }
  }
  @media screen and (max-width: 500px) {
    .fc-toolbar.fc-header-toolbar {
      font-size: 70%;
    }
    .fc {
      font-size: 70%;
    }
  }
  @media screen and (max-width: 440px) {
    .fc-toolbar.fc-header-toolbar {
      font-size: 60%;
    }
    .fc {
      font-size: 60%;
    }
  }
  @media screen and (max-width: 395px) {
    .fc-toolbar.fc-header-toolbar {
      font-size: 53%;
    }
    .fc {
      font-size: 53%;
    }
  }
`;

// .fc-button {
//     background-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-300)"
//         : "var(--chakra-colors-red-300)"};
//     border-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-300)"
//         : "var(--chakra-colors-red-300)"};
//   }
//   .fc-next-button:hover {
//     background-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-200)"
//         : "var(--chakra-colors-red-200)"};
//     border-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-200)"
//         : "var(--chakra-colors-red-200)"};
//   }
//   .fc-button-primary:not(:disabled):active {
//     background-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-400)"
//         : "var(--chakra-colors-red-400)"};
//     border-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-400)"
//         : "var(--chakra-colors-red-400)"};
//   }
//   .fc-icon-chevron-right:active {
//     color: #ffffff;
//   }
//   .fc-icon-chevron-left:active {
//     color: #ffffff;
//   }
//   .fc-prev-button:hover {
//     background-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-200)"
//         : "var(--chakra-colors-red-200)"};
//     border-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-200)"
//         : "var(--chakra-colors-red-200)"};
//   }
//   .fc-button-primary:hover {
//     background-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-200)"
//         : "var(--chakra-colors-red-200)"};
//     border-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-200)"
//         : "var(--chakra-colors-red-200)"};
//   }
//   .fc-button-primary:disabled {
//     background-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-200)"
//         : "var(--chakra-colors-red-200)"};
//     border-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-200)"
//         : "var(--chakra-colors-red-200)"};
//   }
//   .fc-button-primary:not(:disabled).fc-button-active {
//     background-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-900)"
//         : "var(--chakra-colors-red-900)"};
//     border-color: ${(props) =>
//       props.colorMode === "dark"
//         ? "var(--chakra-colors-red-900)"
//         : "var(--chakra-colors-red-900)"};
//   }

// 3. extend the theme
const theme = extendTheme({ config });

export default theme;
