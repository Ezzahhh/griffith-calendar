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
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
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
import { orderBy, uniqBy } from "lodash";

const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionSpinner = motion(Spinner);

function MyApp() {
  console.log("rendering...");
  const { colorMode, toggleColorMode } = useColorMode();
  const [urlState, setURLState] = useState();
  const [calendarFetchResults, setCalendarFetchResults] = useState({
    isLoading: true,
    results: [],
  });
  const [customFetch, setCustomFetch] = useState({
    isLoading: true,
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

  function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const handleChange = (e) => {
    console.log(e);
    const toAdd = [];
    calendarState.map((x) => {
      toAdd.push(x);
    });
    e.map((x) => {
      const keyValue = x.value;
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
    console.log(nonDup);
    const api = calendarRef.current.getApi();
    api.removeAllEvents();
    nonDup.map((x) => {
      api.addEvent(x);
    });
    // add all above into an array, not adding event yet, then we use uniq to remove duplicates and then loop through that result by calling addEvent
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

  const getEventData = async () => {
    const response = await axios.get("/api/getCal");
    setCalendarFetchResults({ isLoading: false, results: response.data });
  };

  const customEvents = async () => {
    const response = await axios.get("/api/objectFilter");
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
    setSelectValues(res);
  };

  useEffect(() => {
    // getEventData();
    customEvents();
  }, []);

  return (
    <>
      <Head>
        <title>Griffith Med Calendar</title>
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
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
          m={10}
          maxW="100%"
        >
          <Box sx={{ visibility: "hidden" }} w="48px" />
          <Heading>Griffith Med Calendar</Heading>
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
          {customFetch.isLoading ? (
            <MotionSpinner
              color="red.500"
              size="xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          ) : (
            <>
              <MotionBox w="100%">
                <FormControl mb={5}>
                  <MultiSelect
                    isMulti
                    options={selectValues}
                    onChange={handleChange}
                    placeholder="Select your pathways/groups..."
                    closeMenuOnSelect={false}
                    selectedOptionStyle="check"
                    hideSelectedOptions={false}
                  />
                  <InputGroup mt={3}>
                    <Input
                      variant="filled"
                      placeholder="Calendar URL"
                      onChange={icsURL}
                      value={urlState}
                      isDisabled
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(urlState);
                        }}
                      >
                        Copy
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
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
          )}
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
