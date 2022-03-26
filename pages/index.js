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
  FormLabel,
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

const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionSpinner = motion(Spinner);

function MyApp() {
  console.log("rendering...");
  const { colorMode, toggleColorMode } = useColorMode();
  const [calendarFetchResults, setCalendarFetchResults] = useState({
    isLoading: true,
    results: [],
  });
  const calendarRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const myEvent = useRef({
    title: "",
    location: "",
    start: "",
    end: "",
    allDay: false,
  });

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
    // return response.data;
  };

  useEffect(() => {
    getEventData();
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
          {calendarFetchResults.isLoading ? (
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
                  {/* <FormLabel>Select:</FormLabel> */}
                  <MultiSelect
                    isMulti
                    options={[{ label: "test", value: "test" }]}
                    placeholder="Select your pathways/groups..."
                    closeMenuOnSelect={false}
                    selectedOptionStyle="check"
                    hideSelectedOptions={false}
                  />
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
                    events={calendarFetchResults.results}
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
