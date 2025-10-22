import { icons } from "../app/lib/icons";

const iconNames = Object.keys(icons);

const iconNamesString = iconNames.join(",");

//eslint-disable-next-line no-console
console.log(
  "List of all current icon names:\n\n",
  JSON.stringify(iconNamesString)
);
