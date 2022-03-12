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
import { extendTheme } from "@chakra-ui/react";
import ical from "node-ical";
import { useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

export const StyleWrapper = styled.div`
  .fc-event {
    cursor: pointer;
  }
`;

function MyApp({ toJSON }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mySelectedEvent, setMySelectedEvent] = useState({
    title: "",
    start: "",
    end: "",
    allDay: false,
    location: "",
  });

  const hackBack = JSON.parse(toJSON);
  console.log(hackBack);

  const handleClick = (res) => {
    onOpen();
    const arrayOfEvents = [
      "title",
      "start",
      "end",
      "allDay",
      "location",
      "allDay",
    ];
    try {
      setMySelectedEvent({
        title: res.event.title,
        start: res.event.start.toString(),
        end: res.event.end == undefined ? "N/A" : res.event.end.toString(),
        allDay: res.event.allDay,
        location:
          res.event.extendedProps.location === "" ||
          res.event.extendedProps.location == undefined
            ? "N/A"
            : res.event.extendedProps.location.toString(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ChakraProvider>
      <Flex justifyContent="flex-end" m={5}>
        <ColorModeSwitcher />
      </Flex>
      <Container maxW={{ base: "md", md: "6xl" }}>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
          minW="100%"
          minH="100%"
        >
          <Heading>Griffith Med Calendar</Heading>
          <Box w="100%">
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
              />
            </StyleWrapper>
          </Box>
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
                <HStack>
                  <Text as="b" minW="70px">
                    Title
                  </Text>
                  <Text>{mySelectedEvent.title}</Text>
                </HStack>
                <HStack>
                  <Text as="b" minW="70px">
                    Location
                  </Text>
                  <Text>
                    {mySelectedEvent.location == undefined
                      ? "Undefined"
                      : mySelectedEvent.location.toString()}
                  </Text>
                </HStack>
                <HStack>
                  <Text as="b" minW="70px">
                    Start
                  </Text>
                  <Text>{mySelectedEvent.start}</Text>
                </HStack>
                <HStack>
                  <Text as="b" minW="70px">
                    End
                  </Text>
                  <Text>{mySelectedEvent.end}</Text>
                </HStack>
                <HStack>
                  <Text as="b" minW="70px">
                    All Day
                  </Text>
                  <Text>
                    {mySelectedEvent.allDay == false ? "False" : "True"}
                  </Text>
                </HStack>
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
    </ChakraProvider>
  );
}

export default MyApp;

export async function getServerSideProps() {
  const url =
    "https://outlook.office365.com/owa/calendar/95a5e9a1a2f74f208b8a4b2f7777400b@griffith.edu.au/9d59cd2171d4448da3d24ff30c5ed5923258360342090266040/calendar.ics";
  // const res = await axios({
  //   method: "get",
  //   url: url,
  //   responseType: "arraybuffer",
  // }).then((response) => Buffer.from(response.data, "UTF-8").toString());
  // console.log(res);

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
    Object.assign(newObject, value, { ["title"]: value["summary"] })["summary"];
    eventsArray.push(newObject);
  });
  console.log(eventsArray);

  const toJSON = JSON.stringify(eventsArray);

  return {
    props: { toJSON }, // will be passed to the page component as props
  };
}
