// Filter by "Pathways or pathways" and "Tweed/Logan Group A" and "Groups 1-6" Groups TBA, "Groups Tweed D & Logan A,B,C,D"
// Pathways 3&4, 9&1, Groups TBA

// ^(P|p)athway[s]?\s\d+(,\d+)*\s&\s\d+ matches P|pathways 1,2,11 & 12
// ^(P|p)athway[s]?\s\d+(,\d+)* matches Pathways 7,8,9,10,11,12
// ^(P|p)athway[s]?\s\d+(\d+)*-(\d+)* matches Pathways 5-8
// ^(P|p)athway[s]?\s\d+(\d+)\s&\s(\d+)* matches Pathways 11 & 12
// ^(G|g)roup[s]?\s\d+(\d+)*-(\d+)* matches Groups 1-6
// ^(P|p)athway[s]?\s\d&\d matches Pathway 7&8

// Object structure:
// { Pathway 1: {} contains only events that are specific to this pathway
//   Pathway 2: {}
//   Tweed: { Group A : {} }
//   Logan: { Group A: {} }
//   ...
//   }
import axios from "axios";

export default async function handler(req, res) {
  const fullSet = await axios.get("http://localhost:3000/api/getCal");
  objectFilter(fullSet.data);
  res.status(200).json();
}

async function objectFilter(fullSet) {
  // Loop getCal return list of objects
  // get 'summary' field and filter by above regex
  // if found add object to structure depending on regex that hits like above
  // then on the front-end we need to get that object, depending on the select drop-down used of pathways/locations, we join all the child objects into a list + global events, feed to FullCallendar to display
  // subscriptable ICS will be sent req body with pathway and groups, ICS will be dynammically generated with this filter

  const listOfRegex = [
    /(P|p)athway[s]?\s\d$/gm, // Pathway 1
    /(P|p)athway[s]?s\s\d+(,\d+).* & \d+$/gm, // P|pathways 1,2,11 & 12
    /(?:P|p)athway[s]?\s\d+(?:,\d+)+&\d+$/gm, // pathways 1,2,3&4
    /(?:P|p)athway[s]?\s\d+(?:,\d+)+$/gm, // Pathways 7,8,9,10,11,12
    /(P|p)athway[s]?\s\d+(\d+)*-\d+/gm, // Pathways 5-8
    /(P|p)athway[s]?\s\d+(\d+)(\s)*&(\s)*(\d+)*$/gm, // Pathways 11 & 12
    /(G|g)roup[s]?\s\d+(\d+)*-\d+/gm, // Groups 1-6
    /(P|p)athway[s]?\s\d&\d/gm, // Pathway 7&8
    /(G|g)roup[s]?\sTweed (\w)$/gm, // Groups Tweed D
    /(L|l)ogan Group[s]? \w$/gm, // Logan Groups A
    /(G|g)roup[s]?\sTBA/gm, // Groups TBA
    /(?:G|g)roup[s]?\sTweed \w(,\w+).*$/gm, // Groups Tweed A,B,C
    /Tweed\s(G|g)roup[s]?\s(\w)$/gm, // Tweed Group C
  ];

  fullSet.map((eventObj) => {
    if (eventObj["summary"] !== undefined) {
      // if the summary or title key exists then we can continue
      // then we loop through our list of regex for each event obj
      listOfRegex.map((reg) => {
        const intialiseReg = new RegExp(reg);
        const splitterino = eventObj["summary"].split("_");
        splitterino.map((splitted) => {
          const found = splitted.match(intialiseReg);
          if (found !== null && reg === listOfRegex[0]) {
            // ["Pathways", "1"]
            const spaceSplit = found[0].split(" ")[1];
            console.log(spaceSplit);
          }
          if (found !== null && reg === listOfRegex[1]) {
            // ["Pathways", "1,2,3", "&", "4"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.shift();
            spaceSplit.splice(spaceSplit.indexOf("&"), 1);
            const poggers = spaceSplit[0].split(",");
            poggers.push(spaceSplit[1]);
            console.log(poggers);
          }
          if (found !== null && reg === listOfRegex[2]) {
          }
          if (found !== null && reg === listOfRegex[3]) {
          }
          if (found !== null && reg === listOfRegex[4]) {
          }
          if (found !== null && reg === listOfRegex[5]) {
          }
          if (found !== null && reg === listOfRegex[6]) {
          }
          if (found !== null && reg === listOfRegex[7]) {
          }
          if (found !== null && reg === listOfRegex[8]) {
          }
          if (found !== null && reg === listOfRegex[9]) {
          }
          if (found !== null && reg === listOfRegex[10]) {
          }
          if (found !== null && reg === listOfRegex[11]) {
          }
        });
      });
    }
  });
}
