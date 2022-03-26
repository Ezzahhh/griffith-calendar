import axios from "axios";
import { range } from "lodash";

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
  // Object structure:
  // { Pathway 1: {} contains only events that are specific to this pathway
  //   Pathway 2: {}
  //   Tweed: { Group A : {} }
  //   Logan: { Group A: {} }
  //   ...
  //   }

  const listOfRegex = [
    /(P|p)athway[s]?\s\d$/gm, // Pathway 1
    /(P|p)athway[s]?s\s\d+(,\d+).* & \d+$/gm, // P|pathways 1,2,11 & 12
    /(?:P|p)athway[s]?\s\d+(?:,\d+)+&\d+$/gm, // pathways 1,2,3&4
    /(?:P|p)athway[s]?\s\d+(?:,\d+)+$/gm, // Pathways 7,8,9,10,11,12
    /(P|p)athway[s]?\s\d+(\d+)*-\d+/gm, // Pathways 5-8
    /(P|p)athway[s]?\s\d+(\d+)(\s)*&(\s)*(\d+)*$/gm, // Pathways 11 & 12
    /(G|g)roup[s]?\s\d+(\d+)*-\d+/gm, // Groups 1-6
    /(P|p)athway[s]?\s\d&\d/gm, // Pathway 7&8
    /(G|g)roup[s]?\sTweed (\w)/gm, // Groups Tweed D
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
            // console.log(spaceSplit);
          }
          if (found !== null && reg === listOfRegex[1]) {
            // ["Pathways", "1,2,3", "&", "4"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.shift();
            spaceSplit.splice(spaceSplit.indexOf("&"), 1);
            const poggers = spaceSplit[0].split(",");
            poggers.push(spaceSplit[1]);
            // console.log(poggers);
          }
          if (found !== null && reg === listOfRegex[2]) {
            // ["Pathways", "1,2,3&4"]
            const spaceSplit = found[0].split(" ")[1].split("&");
            const poggers = spaceSplit[0].split(",");
            poggers.push(spaceSplit[1]);
            // console.log(poggers);
          }
          if (found !== null && reg === listOfRegex[3]) {
            // ["Pathways", "1,2,3,4"]
            const spaceSplit = found[0].split(" ")[1].split(",");
            // console.log(spaceSplit);
          }
          if (found !== null && reg === listOfRegex[4]) {
            // ["Pathways", "5-8"]
            const spaceSplit = found[0].split(" ")[1].split("-");
            const res = range(spaceSplit[0], spaceSplit[1]);
            // console.log(res);
          }
          if (found !== null && reg === listOfRegex[5]) {
            // ["Pathways", "11", "&", "12"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.shift();
            spaceSplit.splice(spaceSplit.indexOf("&"), 1);
            // console.log(spaceSplit);
          }
          if (found !== null && reg === listOfRegex[6]) {
            // ["Groups", "1-6"]
            const spaceSplit = found[0].split(" ")[1].split("-");
            const res = range(spaceSplit[0], spaceSplit[1]);
            // console.log(spaceSplit);
          }
          if (found !== null && reg === listOfRegex[7]) {
            // ["Pathways", "11&12"]
            const spaceSplit = found[0].split(" ")[1].split("&");
            // console.log(spaceSplit);
          }
          if (found !== null && reg === listOfRegex[8]) {
            // ["Groups", "Tweed", "D"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.shift();
            // console.log(spaceSplit);
          }
          if (found !== null && reg === listOfRegex[9]) {
            // ["Logan", "Groups", "A"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.splice(spaceSplit.indexOf("Group"), 1);
            // console.log(spaceSplit);
          }
          if (found !== null && reg === listOfRegex[10]) {
            // ["Groups", "TBA"]
            const spaceSplit = found[0].split(" ")[1];
            // console.log(spaceSplit);
          }
          if (found !== null && reg === listOfRegex[11]) {
            // ["Tweed", "Group", "C"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.shift();
            spaceSplit.splice(spaceSplit.indexOf("Group"), 1);
            spaceSplit.splice(spaceSplit.indexOf("Tweed"), 1);
            const res = spaceSplit[0].split(",");
            // console.log(res);
          }
          if (found !== null && reg === listOfRegex[12]) {
            // ["Tweed", "Group", "C"]
            const spaceSplit = found[0].split(" ");
            const popLast = spaceSplit.pop();
            // console.log(popLast);
          }
        });
      });
    }
  });
}
