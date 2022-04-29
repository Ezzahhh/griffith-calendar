import { space } from "@chakra-ui/react";
import axios from "axios";
import { range } from "lodash";

export default async function handler(req, res) {
  const fullSet = await axios.get(
    `http://localhost:3000/api/getCal?region=${req.query.region}`
  );
  const filtered = await objectFilter(fullSet.data, req);
  res.status(200).json(filtered);
}

let add = (obj, key, val) => {
  if (key in obj) obj[key] = [].concat(obj[key], val);
  else obj[key] = val;
};

async function objectFilter(fullSet, req) {
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
    /(?:P|p)athway[s]?\s(\d+)(\s)&(\s)(\d+)/gm, // Pathways 11 & 12
    /(?:P|p)athway[s]?\s(\d+)&(\d+)/gm, // Pathway 7&8
    /(?:G|g)roup[s]?\sTweed (\w)/gm, // Groups Tweed D
    /(?:L|l)ogan Group[s]? \w$/gm, // Logan Groups A
    /(?:G|g)roup[s]?\sTweed \w(,\w+).*$/gm, // Groups Tweed A,B,C
    /Tweed\s(?:G|g)roup[s]?\s(\w)$/gm, // Tweed Group C
    /Logan [\w](,[\w]).*/m, //Logan A,B,C,D
    /Group GCUH [\w]/m, // Group GCUH A
    /^Group [\D]$/m, // Group A (GCUH)
    /^Block \d$/gm, // Block 1
    /SCUH Pathway[s]? \d+(?:, \d+)+/gm, // SCUH Pathways 1, 2, 3
    /^Pathway[s]? \d+(?:, \d+)+ & \d+$/gm, // Pathways 1, 2, 4 & 12
    /^Pathway[s]? \d+ to \d+$/gm, // Pathway 1 to 6
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
              req.query.region === "Gold Coast" ||
              req.query.region === "null"
            ) {
              if (
                splitterino[splitterino.indexOf(splitted)].split(" ")[3] !==
                "SCUH"
              ) {
                const spaceSplit = found[0].split(" ")[1].split("&");
                const poggers = spaceSplit[0].split(",");
                poggers.push(spaceSplit[1]);
                poggers.map((pathway) => {
                  add(returnObj, "Pathway " + pathway, eventObj);
                });
                boolAddAll = true;
              }
            } else if (req.query.region === "Sunshine Coast") {
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
            if (
              req.query.region === "Gold Coast" ||
              req.query.region === "null"
            ) {
              const spaceSplit = found[0].split(" ")[1].split("-");
              const res = range(spaceSplit[0], parseInt(spaceSplit[1]) + 1);
              res.map((pathway) => {
                add(returnObj, "Pathway " + pathway, eventObj);
              });
              boolAddAll = true;
            } else if (req.query.region === "Sunshine Coast") {
              if (
                splitterino[splitterino.indexOf(splitted)].split(" ")[3] !==
                "SCUH"
              ) {
                const spaceSplit = found[0].split(" ")[1].split("-");
                const res = range(spaceSplit[0], parseInt(spaceSplit[1]) + 1);
                res.map((pathway) => {
                  add(returnObj, "Pathway " + pathway, eventObj);
                });
                boolAddAll = true;
              }
            }
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
          if (found !== null && reg === listOfRegex[6]) {
            // ["Pathways", "11&12"]
            const spaceSplit = found[0].split(" ")[1].split("&");
            spaceSplit.map((pathway) => {
              add(returnObj, "Pathway " + pathway, eventObj);
            });
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[7]) {
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
          if (found !== null && reg === listOfRegex[8]) {
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
          if (found !== null && reg === listOfRegex[9]) {
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
          if (found !== null && reg === listOfRegex[10]) {
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
          if (found !== null && reg === listOfRegex[11]) {
            // Logan A,B,C,D ["Logan", "A,B,C,D"]
            const spaceSplit = found[0].split(" ");
            const split1 = spaceSplit[1].split(",");
            split1.map((x) => {
              add(returnObj, spaceSplit[0] + " " + "Group" + " " + x, eventObj);
            });
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[12]) {
            // Group GCUH A ["Group", "GCUH", "A"]
            const spaceSplit = found[0].split(" ");
            add(
              returnObj,
              spaceSplit[1] + " " + "Group" + " " + spaceSplit[2],
              eventObj
            );

            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[13]) {
            // Group A ["Group", "A"]
            const spaceSplit = found[0].split(" ");
            add(
              returnObj,
              "GCUH" + " " + "Group" + " " + spaceSplit[1],
              eventObj
            );

            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[14]) {
            // Block 1 ["Block", "1"]
            if (req.query.region === "Sunshine Coast") {
              const spaceSplit = found[0].split(" ");
              add(returnObj, "GPLP Block " + spaceSplit[1], eventObj);
              boolAddAll = true;
            }
          }
          if (found !== null && reg === listOfRegex[15]) {
            // SCUH Pathways 1, 2, 3 ["SCUH", "Pathways", "1,", "2,", "3"]
            if (req.query.region === "Sunshine Coast") {
              const spaceSplit = found[0].split(" ");
              spaceSplit.splice(0, 2);
              spaceSplit.map((x) => {
                x = x.replace(/\D/g, "");
                add(returnObj, "Pathway " + x, eventObj);
              });
              boolAddAll = true;
            }
          }
          if (found !== null && reg === listOfRegex[16]) {
            // Pathways 1, 2, 4 & 12 ["Pathways", "1,", "2,", "4,", "&", "12"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.splice(0, 1);
            spaceSplit.map((x) => {
              x = x.replace(/\D/g, "");
              if (x !== "") add(returnObj, "Pathway " + x, eventObj);
            });
            boolAddAll = true;
          }
          if (found !== null && reg === listOfRegex[17]) {
            // Pathway 1 to 6 ["Pathway", "1", "to", "6"]
            const spaceSplit = found[0].split(" ");
            spaceSplit.shift();
            spaceSplit.splice(spaceSplit.indexOf("to"), 1);
            const res = range(spaceSplit[0], parseInt(spaceSplit[1]) + 1);
            res.map((x) => {
              add(returnObj, "Pathway " + x, eventObj);
            });
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
  returnObj["Rest"] = newSet;
  return returnObj;
}
