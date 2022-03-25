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
