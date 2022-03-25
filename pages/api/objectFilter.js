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
  // const fullSet = await axios.get("http://localhost:3000/api/getCal");
  objectFilter();
  res.status(200).json();
}

async function objectFilter(getCal) {
  // Loop getCal return list of objects
  // get 'summary' fieldand filter by above regex
  // if found add object to structure depending on regex that hits like above
  // then on the front-end we need to get that object, depending on the select drop-down used of pathways/locations, we join all the child objects into a list + global events, feed to FullCallendar to display

  const listOfRegex = [
    /^(P|p)athway[s]? \d$/gm, // Pathway 1
    /^(P|p)athway[s]?s \d+(,\d+)* & \d+/gm, // P|pathways 1,2,11 & 12
    /^(P|p)athway[s]?\s\d+(,\d+).*/gm, // Pathways 7,8,9,10,11,12
    /^(P|p)athway[s]? \d+(\d+)*-\d+/gm, // Pathways 5-8
    /^(P|p)athway[s]?\s\d+(\d+)\s&\s(\d+)*/gm, // Pathways 11 & 12
    /^(G|g)roup[s]?\s\d+(\d+)*-\d+/gm, // Groups 1-6
    /^(P|p)athway[s]?\s\d&\d/gm, // Pathway 7&8
    /(G|g)roup[s]? Tweed \w/gm, // Groups Tweed D
    /Logan Group[s]? \w/gm, // Logan Groups A
    /(G|g)roup[s]? TBA/gm, // Groups TBA
    /(G|g)roup[s]? Tweed \w(,\w+)*/gm, // Groups Tweed A,B,C
  ];

  const testString = "Groups Tweed A,B,C ";

  listOfRegex.map((reg) => {
    const intialiseReg = new RegExp(reg);
    const found = testString.match(intialiseReg);
    console.log(found, intialiseReg);
  });
}
