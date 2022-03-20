import icalgen from "ical-generator";
import axios from "axios";
import { Blob } from "blob-polyfill";

global["Blob"] = Blob;

export default async function handler(req, res) {
  const getCal = await axios.get("http://localhost:3000/api/getCal"); // eventually we will call getICS with filters passed in req.query params
  const calendar = icalgen();

  getCal.data.map((event) => {
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
  console.log(req.query.test);

  calendar.serve(res, "mycalendar.ics");
}
