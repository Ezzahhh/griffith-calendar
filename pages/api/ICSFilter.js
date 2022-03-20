import axios from "axios";
import { merge } from "lodash";

export default async function handler(req, res) {
  const fullSet = await axios.get("http://localhost:3000/api/getCal");
  const uniqueTitles = new Set();
  fullSet.data.forEach((element) => {
    uniqueTitles.add(element.title);
  });
  const convertArray = [...uniqueTitles];
  const splitter = [];
  convertArray.map((eventObj) => {
    // take title split by undercore and append to array
    if (eventObj !== "") {
      const underScoreSplit = eventObj.split("_");
      splitter.push(underScoreSplit);
    }
  });
  const mergedObj = {};
  splitter.map((arrayObj) => {
    const wow = arrayObj.reduceRight((all, item) => ({ [item]: all }), {}); // convert array into obj
    merge(mergedObj, wow); // use lodash to deep nested merge of objs
  });

  res.status(200).json(mergedObj);
}

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
