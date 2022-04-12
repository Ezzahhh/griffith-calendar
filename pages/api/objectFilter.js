import axios from "axios";
import { range } from "lodash";

export default async function handler(req, res) {
  const fullSet = await axios.get("http://localhost:3000/api/getCal");
  const filtered = await objectFilter(fullSet.data);
  res.status(200).json(filtered);
}

let add = (obj, key, val) => {
  if (key in obj) obj[key] = [].concat(obj[key], val);
  else obj[key] = val;
};

async function objectFilter(fullSet) {
  // Loop getCal return list of objects
  // get 'summary' field and filter by above regex
  // if found add object to structure depending on regex that hits like above
  // then on the front-end we need to get that object, depending on the select drop-down used of pathways/locations, we join all the child objects into a list + global events, feed to FullCallendar to display
  // subscriptable ICS will be sent req body with pathway and groups, ICS will be dynamically generated with this filter
  const returnObj = {};
  let boolAddAll = false;
  const forAll = [];

  const listOfRegex = [
    /(?:P|p)athway[s]?\s(?:\d)*$/gm, // Pathway 1
    /(?:P|p)athway[s]?\s\d+(,\d+).* & \d+$/gm, // P|pathways 1,2,11 & 12
    /(?:P|p)athway[s]?\s\d+(?:,\d+)+&\d+$/gm, // pathways 1,2,3&4
    /(?:P|p)athway[s]?\s\d+(?:,\d+)+$/gm, // Pathways 7,8,9,10,11,12
    /(?:P|p)athway[s]?\s\d+(\d+)*-\d+/gm, // Pathways 5-8
    /(?:P|p)athway[s]?\s(\d+)(\s)*&(\s)*(\d+)*$/gm, // Pathways 11 & 12
    /(?:G|g)roup[s]?\s\d+(\d+)*-\d+/gm, // Groups 1-6
    /(?:P|p)athway[s]?\s\d&\d/gm, // Pathway 7&8
    /(?:G|g)roup[s]?\sTweed (\w)/gm, // Groups Tweed D
    /(?:L|l)ogan Group[s]? \w$/gm, // Logan Groups A
    /(?:G|g)roup[s]?\sTBA/gm, // Groups TBA
    /(?:G|g)roup[s]?\sTweed \w(,\w+).*$/gm, // Groups Tweed A,B,C
    /Tweed\s(?:G|g)roup[s]?\s(\w)$/gm, // Tweed Group C
    /Logan [\w](,[\w]).*/m, //Logan A,B,C,D
    /Group GCUH [\w]/m, // Group GCUH A
    /^Group [\w]$/m, // Group A (GCUH)
    // Pathways 1-6 + SCUH pathways 4,5,6
  ];

  fullSet.map((eventObj) => {
    if (eventObj["summary"] !== undefined) {
      // if the summary or title key exists then we can continue
      // then we loop through our list of regex for each event obj
      // compare all events with the final result; those that don't appear in the final result will be added to "Rest"
      boolAddAll = false;
      listOfRegex.map((reg) => {
        const intialiseReg = new RegExp(reg);
        const splitterino = eventObj["summary"].split("_");
        splitterino.map((splitted) => {
          const found = splitted.match(intialiseReg);
          if (found !== null && reg === listOfRegex[0]) {
            // ["Pathways", "1"]
            const spaceSplit = found[0].split(" ")[1];
            add(returnObj, "Pathway " + spaceSplit, eventObj);
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[1]) {
            // ["Pathways", "1,2,3", "&", "4"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.shift();
            spaceSplit.splice(spaceSplit.indexOf("&"), 1);
            const poggers = spaceSplit[0].split(",");
            poggers.push(spaceSplit[1]);
            poggers.map((pathway) => {
              add(returnObj, "Pathway " + pathway, eventObj);
            });
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[2]) {
            // ["Pathways", "1,2,3&4"]
            if (
              splitterino[splitterino.indexOf(splitted) + 1].split(" ")[0] !==
              "GCUH"
            ) {
              const spaceSplit = found[0].split(" ")[1].split("&");
              const poggers = spaceSplit[0].split(",");
              poggers.push(spaceSplit[1]);
              poggers.map((pathway) => {
                add(returnObj, "Pathway " + pathway, eventObj);
              });
              boolAddAll = true;
            }
          }
          if (found !== null && reg === listOfRegex[3]) {
            // ["Pathways", "1,2,3,4"]
            const spaceSplit = found[0].split(" ")[1].split(",");
            spaceSplit.map((pathway) => {
              add(returnObj, "Pathway " + pathway, eventObj);
            });
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[4]) {
            // ["Pathways", "5-8"]
            const spaceSplit = found[0].split(" ")[1].split("-");
            const res = range(spaceSplit[0], parseInt(spaceSplit[1]) + 1);
            res.map((pathway) => {
              add(returnObj, "Pathway " + pathway, eventObj);
            });
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[5]) {
            // ["Pathways", "11", "&", "12"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.shift();
            spaceSplit.splice(spaceSplit.indexOf("&"), 1);
            spaceSplit.map((pathway) => {
              add(returnObj, "Pathway " + pathway, eventObj);
            });
            boolAddAll = true;
          }
          // if (found !== null && reg === listOfRegex[6]) {
          //   // ["Groups", "1-6"]
          //   const spaceSplit = found[0].split(" ")[1].split("-");
          //   const res = range(spaceSplit[0], parseInt(spaceSplit[1]) + 1);
          //   res.map((group) => {
          //     add(returnObj, "Group " + group, eventObj);
          //   });
          //   boolAddAll = true;
          // }
          if (found !== null && reg === listOfRegex[7]) {
            // ["Pathways", "11&12"]
            const spaceSplit = found[0].split(" ")[1].split("&");
            spaceSplit.map((pathway) => {
              add(returnObj, "Pathway " + pathway, eventObj);
            });
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[8]) {
            // ["Groups", "Tweed", "D"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.shift();
            add(
              returnObj,
              spaceSplit[0] + " " + "Group" + " " + spaceSplit[1],
              eventObj
            );
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[9]) {
            // ["Logan", "Groups", "A"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.splice(spaceSplit.indexOf("Group"), 1);
            add(
              returnObj,
              spaceSplit[0] + " " + "Group" + " " + spaceSplit[1],
              eventObj
            );
            boolAddAll = true;
          }
          // if (found !== null && reg === listOfRegex[10]) {
          //   // ["Groups", "TBA"]
          //   const spaceSplit = found[0].split(" ")[1];
          //   returnObj["Group TBA"] = eventObj;
          //   boolAddAll = true;
          // }
          if (found !== null && reg === listOfRegex[11]) {
            // ["Groups", "Tweed", "A,B,C"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.shift();
            spaceSplit.splice(spaceSplit.indexOf("Group"), 1);
            const res = spaceSplit[1].split(",");
            res.map((group) => {
              add(returnObj, "Tweed " + "Group " + group, eventObj);
            });
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[12]) {
            // ["Tweed", "Group", "C"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.splice(spaceSplit.indexOf("Group"), 1);
            add(
              returnObj,
              spaceSplit[0] + " " + "Group" + " " + spaceSplit[1],
              eventObj
            );
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[13]) {
            // Logan A,B,C,D ["Logan", "A,B,C,D"]
            const spaceSplit = found[0].split(" ");
            const split1 = spaceSplit[1].split(",");
            split1.map((x) => {
              add(returnObj, spaceSplit[0] + " " + "Group" + " " + x, eventObj);
            });
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[14]) {
            // Group GCUH A ["Group", "GCUH", "A"]
            const spaceSplit = found[0].split(" ");
            add(
              returnObj,
              spaceSplit[1] + " " + "Group" + " " + spaceSplit[2],
              eventObj
            );

            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[15]) {
            // Group A ["Group", "A"]
            const spaceSplit = found[0].split(" ");
            add(
              returnObj,
              "GCUH" + " " + "Group" + " " + spaceSplit[1],
              eventObj
            );

            boolAddAll = true;
          }
        });
      });
      if (boolAddAll === false) {
        forAll.push(eventObj);
      }
    }
  });
  const newSet = [...new Set(forAll)];
  // console.log(newSet);
  returnObj["Rest"] = newSet;
  return returnObj;
}
