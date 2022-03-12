import {
  ChakraProvider,
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
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../src/components/ColorModeSwitcher";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import ical from "node-ical";
import { useState, useRef } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { theme, StyleWrapper } from "../styles/theme";

const MotionHeading = motion(Heading);
const MotionBox = motion(Box);
const MotionContainer = motion(Container);

function MyApp({ toJSON }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const calendarRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const myEvent = useRef({
    title: "",
    location: "",
    start: "",
    end: "",
    allDay: false,
  });

  const hackBack = JSON.parse(toJSON);
  console.log(hackBack);

  const handleClick = (res) => {
    try {
      myEvent.current = {
        title: res.event.title,
        start: res.event.start.toString(),
        end: res.event.end == undefined ? "N/A" : res.event.end.toString(),
        allDay: res.event.allDay,
        location:
          res.event.extendedProps.location === "" ||
          res.event.extendedProps.location == undefined
            ? "N/A"
            : res.event.extendedProps.location.toString(),
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
      <Container maxW="7xl">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
          minW="100%"
          minH="100%"
        >
          <MotionBox
            w="100%"
            borderRadius="xl"
            boxShadow="2xl"
            borderWidth={2}
            p={6}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <StyleWrapper>
              <FullCalendar
                plugins={[timeGridPlugin, dayGridPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "timeGridWeek,timeGridDay,dayGridMonth",
                }}
                weekends={false}
                events={hackBack}
                eventClick={handleClick}
                dayMaxEvents={false}
                ref={calendarRef}
              />
            </StyleWrapper>
          </MotionBox>
          <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            scrollBehavior="inside"
            size="xl"
          >
            <ModalOverlay />
            <ModalContent>
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

export async function getServerSideProps() {
  const url =
    "https://outlook.office365.com/owa/calendar/95a5e9a1a2f74f208b8a4b2f7777400b@griffith.edu.au/9d59cd2171d4448da3d24ff30c5ed5923258360342090266040/calendar.ics";

  const webEvents = await ical.async.fromURL(url);
  const tempConvert = JSON.parse(JSON.stringify(webEvents));
  const eventsArray = [];
  const removalArray = [
    "type",
    "params",
    "priority",
    "transparency",
    "status",
    "sequence",
    "MICROSOFT-CDO-APPT-SEQUENCE",
    "MICROSOFT-CDO-BUSYSTATUS",
    "MICROSOFT-CDO-INTENDEDSTATUS",
    "MICROSOFT-CDO-IMPORTANCE",
    "MICROSOFT-CDO-INSTTYPE",
    "MICROSOFT-DONOTFORWARDMEETING",
    "MICROSOFT-DISALLOW-COUNTER",
    "method",
  ];
  Object.entries(tempConvert).map(([key, value]) => {
    const newObject = {};
    removalArray.map((z) => delete value[z]);
    if (value["MICROSOFT-CDO-ALLDAYEVENT"] === "TRUE") {
      Object.assign(newObject, (value["allDay"] = true));
    } else if (value["MICROSOFT-CDO-ALLDAYEVENT"] === "FALSE") {
      if (
        value["summary"].split(" ").includes("Week") ||
        value["summary"].split(" ").includes("PUBLIC")
      ) {
        Object.assign(newObject, (value["allDay"] = true));
      } else {
        Object.assign(newObject, (value["allDay"] = false));
      }
    }
    if (value["summary"] !== undefined) {
      Object.assign(newObject, value, {
        ["title"]: value["summary"].toString(), //.replace(/_/g, " ") consider that we will have more trouble filtering then on client if we do this on server and pass it down
      });
    } else {
      Object.assign(newObject, value, {
        ["title"]: "",
      });
    }
    eventsArray.push(newObject);
  });
  console.log(eventsArray);

  const toJSON = JSON.stringify(eventsArray);

  return {
    props: { toJSON }, // will be passed to the page component as props
  };
}
