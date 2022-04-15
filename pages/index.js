import {
  Container,
  Heading,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  HStack,
  useDisclosure,
  Flex,
  useColorMode,
  useColorModeValue,
  Spinner,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Select,
} from "@chakra-ui/react";
import { Select as MultiSelect } from "chakra-react-select";
import { ColorModeSwitcher } from "../src/components/ColorModeSwitcher";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { StyleWrapper } from "../styles/theme";
import axios from "axios";
import { uniqBy } from "lodash";
import { orderBy } from "natural-orderby";

const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionSpinner = motion(Spinner);

const regions = require("../src/extras/outlook.json");

function MyApp() {
  console.log("rendering...");
  const [region, setRegion] = useState("");
  const selectInputRef = useRef();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [urlState, setURLState] = useState();
  const [customFetch, setCustomFetch] = useState({
    isLoading: false,
    results: [],
  });
  const [selectValues, setSelectValues] = useState();
  const calendarRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const myEvent = useRef({
    title: "",
    location: "",
    start: "",
    end: "",
    allDay: false,
  });
  const [calendarState, setCalendarState] = useState();
  const [fullCalData, setFullCalData] = useState();

  const handleChange = (e) => {
    console.log(e);
    const selectionList = [];
    const toAdd = [];
    calendarState.map((x) => {
      toAdd.push(x);
    });
    e.map((x) => {
      const keyValue = x.value;
      selectionList.push(keyValue);
      console.log(fullCalData[keyValue]);
      if (Array.isArray(fullCalData[keyValue])) {
        fullCalData[keyValue].map((x) => {
          toAdd.push(x);
        });
      } else {
        toAdd.push(fullCalData[keyValue]);
      }
    });
    const nonDup = uniqBy(toAdd, "uid");
    const api = calendarRef.current.getApi();
    api.removeAllEvents();
    nonDup.map((x) => api.addEvent(x));
    if (e.length === 0) {
      setURLState("");
    } else {
      setURLState(
        `https://med.ezzah.dev/api/ics?region=${Buffer.from(
          region.toString()
        ).toString("base64")}&selection=${Buffer.from(
          selectionList.toString()
        ).toString("base64")}
          `
      );
    }
  };

  const handleClick = (res) => {
    try {
      myEvent.current = {
        title: res.event.title,
        location:
          res.event.extendedProps.location === "" ||
          res.event.extendedProps.location == undefined
            ? "N/A"
            : res.event.extendedProps.location.toString(),
        start: res.event.start.toString(),
        end: res.event.end == undefined ? "N/A" : res.event.end.toString(),
        allDay: res.event.allDay,
      };
      onOpen();
    } catch (err) {
      console.log(err);
    }
  };

  const icsURL = (res) => {
    setURLState(res.target.value);
  };

  const goNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
  };
  const goPrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
  };
  const goToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  };

  const goWeek = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView("timeGridWeek");
  };
  const goDay = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView("timeGridDay");
  };
  const goMonth = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView("dayGridMonth");
  };

  const customEvents = async (region) => {
    const api = calendarRef.current.getApi();
    api.removeAllEvents();
    setSelectValues(null);
    setURLState("");
    if (region === "") {
      return;
    }
    setCustomFetch({ ...customFetch, isLoading: true });
    setRegion(region);
    const response = await axios.get(`/api/objectFilter?region=${region}`);
    setCustomFetch({ isLoading: false, results: response.data });
    setFullCalData(response.data);
    setCalendarState(response.data["Rest"]);
    const selectList = [];
    Object.keys(response.data).map((k) => {
      if (k !== "Rest") {
        selectList.push({ label: k, value: k });
      }
    });
    const res = orderBy(selectList, "label", "asc");
    // const res = orderBy(selectList);
    setSelectValues(res);
    selectInputRef.current.clearValue(); // clear the multiselect
  };

  useEffect(() => {
    // getEventData();
    // customEvents();
  }, []);

  return (
    <>
      <Head>
        <title>Griffith 2nd Year Med Calendar</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <MotionContainer
        maxW="100%"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <Flex
          flexDirection={{ base: "column", sm: "column", md: "row" }}
          justifyContent={{
            base: "center",
            sm: "center",
            md: "space-between",
          }}
          alignItems="center"
          alignContent="center"
          m={10}
          maxW="100%"
        >
          <Box sx={{ visibility: "hidden" }} w="48px" />
          <HStack>
            <Heading>Griffith 2nd Year Med Calendar</Heading>
            {customFetch.isLoading && (
              <MotionSpinner
                color="red.500"
                size="lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            )}
          </HStack>
          <ColorModeSwitcher />
        </Flex>
      </MotionContainer>

      <Container maxW="5xl">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
        >
          <>
            <MotionBox
              w="100%"
              mb={5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Select
                mb={3}
                placeholder="Select campus..."
                onChange={(e) => customEvents(e.target.value)}
              >
                {Object.keys(regions).map((x) => {
                  return (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  );
                })}
              </Select>
              <MultiSelect
                isMulti
                ref={selectInputRef}
                options={selectValues}
                onChange={handleChange}
                placeholder="Select your pathways/groups..."
                closeMenuOnSelect={false}
                selectedOptionStyle="check"
                hideSelectedOptions={false}
                menuPortalTarget={
                  typeof window !== "undefined" && document.body
                }
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPosition={"fixed"}
                isDisabled={selectValues !== null ? false : true}
              />
              <InputGroup mt={3}>
                <Input
                  variant="filled"
                  placeholder="Calendar URL"
                  onChange={icsURL}
                  value={urlState}
                  isDisabled={selectValues !== null ? false : true}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    menuPortalTarget={
                      typeof window !== "undefined" && document.body
                    }
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9998 }),
                    }}
                    h="1.75rem"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(urlState);
                      toast({
                        title: "Success",
                        description: "Copied to clipboard!",
                        status: "success",
                        position: "top-left",
                        duration: 2000,
                        isClosable: true,
                      });
                    }}
                  >
                    Copy
                  </Button>
                </InputRightElement>
              </InputGroup>
            </MotionBox>
            <MotionBox
              w="100%"
              borderRadius="xl"
              boxShadow="2xl"
              borderWidth={2}
              p={6}
              initial={{ y: "5vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeIn", duration: 0.8 }}
            >
              <StyleWrapper colorMode={colorMode}>
                <FullCalendar
                  plugins={[timeGridPlugin, dayGridPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay,dayGridMonth",
                  }}
                  weekends={false}
                  // events={calendarFetchResults.results}
                  events={calendarState}
                  eventClick={handleClick}
                  dayMaxEvents={true}
                  ref={calendarRef}
                  views={{
                    dayGridMonth: {
                      dayHeaderFormat: {
                        weekday: "short",
                      },
                    },
                    dayGrid: {
                      dayHeaderFormat: {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        omitCommas: true,
                      },
                    },
                    timeGrid: {
                      dayHeaderFormat: {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        omitCommas: true,
                      },
                    },
                  }}
                />
              </StyleWrapper>
            </MotionBox>
          </>

          <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            scrollBehavior="inside"
            size="xl"
          >
            <ModalOverlay />
            <ModalContent top="10rem">
              <ModalHeader>Event Details</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {Object.entries(myEvent.current).map(([key, value]) => {
                  return (
                    <>
                      <HStack>
                        <Text
                          as="b"
                          minW="70px"
                          sx={{ "text-transform": "capitalize" }}
                        >
                          {key}
                        </Text>
                        <Text>{value.toString().replace(/_/g, " ")}</Text>
                      </HStack>
                    </>
                  );
                })}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Container>
    </>
  );
}

export default MyApp;
