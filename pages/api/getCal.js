import ical from "node-ical";

const regions = require("../../src/extras/outlook.json");

export default async function handler(req, res) {
  const gold_coast =
    "https://outlook.office365.com/owa/calendar/95a5e9a1a2f74f208b8a4b2f7777400b@griffith.edu.au/9d59cd2171d4448da3d24ff30c5ed5923258360342090266040/calendar.ics";

  const sunshine_coast =
    "https://outlook.office365.com/owa/calendar/fb2e290e858f4d65a657568189f87e9d@griffith.edu.au/4d333ff5e7974a4698b8e1d24c38f5782865677652951870724/calendar.ics";

  // const url = regions[req.query.region].url;
  console.log(req.query.region);
  const webEvents = await ical.async.fromURL(
    req.query.region === "null"
      ? regions["Gold Coast"].url
      : regions[req.query.region].url
  ); // if it is undefined, then we want to be backwards compatible with users specifying with gold cosat region
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

  // const toJSON = JSON.stringify();
  res.status(200).json(eventsArray);
}
