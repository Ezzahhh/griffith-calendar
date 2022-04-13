import icalgen from "ical-generator";
import axios from "axios";
import { Blob } from "blob-polyfill";
import { uniqBy } from "lodash";

global["Blob"] = Blob;

export default async function handler(req, res) {
  const decodeSpec = Buffer.from(req.query.selection, "base64")
    .toString()
    .split(","); // decode base64 encoding to list
  decodeSpec.push("Rest");

  const getCal = await axios.get("http://localhost:3000/api/objectFilter"); // eventually we will call getICS with filters passed in req.query params
  const calendar = icalgen();
  const myEvents = [];

  decodeSpec.map((x) => {
    getCal.data[x].map((y) => {
      myEvents.push(y);
    });
  });

  const createUniq = uniqBy(myEvents, "uid");

  createUniq.map((event) => {
    if (event.start !== undefined) {
      calendar.createEvent({
        start: event.start,
        end: event.end,
        summary: event.summary,
        location: event.location,
        allDay: event.allDay,
      });
    }
  });

  calendar.serve(res, "mycalendar.ics");
}
