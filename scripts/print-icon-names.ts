import { icons } from "../app/lib/icons";

const iconNames = Object.keys(icons);

const iconNamesString = iconNames.join(",");

console.log(
  "List of all current icon names:\n\n",
  JSON.stringify(iconNamesString)
);
