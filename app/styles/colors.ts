import Color from "color";

function createPallette(color: string) {
  return {
    100: Color(color).desaturate(0.2).lighten(0.85).hex(),
    200: Color(color).desaturate(0.2).lighten(0.65).hex(),
    300: Color(color).desaturate(0.2).lighten(0.45).hex(),
    400: Color(color).desaturate(0.2).lighten(0.25).hex(),
    500: color,
    600: Color(color).darken(0.15).hex(),
    700: Color(color).darken(0.3).hex(),
    800: Color(color).darken(0.5).hex(),
    900: Color(color).darken(0.7).hex(),
    DEFAULT: color,
  };
}

//Brand Colors
const OCEAN = "#0092bc";
const OCEAN_SUBDUED = "#E7F9FE";
const NAVY = "#004f71";
const NAVY_SUBDUED = "#DAEAF1";
const COTTON_CANDY = "#6bcaba";

//Accent Colors
//const COCONUT = "#d0d0ce"
const APPLE = "#cb2c30";
const TANGERINE = "#ff8f1c";
const PEACH = "#e8927c";
const LEMON = "#fcd757";

//System Colors
const SUCCESS = "#1EC27F";
//const SUCCESS_LIGHT = "#ecfdf3"
const ERROR = "#b42318";
//const ERROR_LIGHT = "#fef3f2"
const WARNING = "#E09541";

//Neutral Colors
const WHITE = "#ffffff";
const BLACK = "#000000";
const WHITE_SMOKE = "#f6f6f6";

//Text Colors
const TEXT_PRIMARY = "#222222";
const TEXT_SECONDARY = "#666666";

//Background Colors
const BACKGROUND_PRIMARY = "#FFFFFF";
const BG_SECONDARY = "#FAFAFC";

//Link Colors
const LINK_SECONDARY = "#666666";

//Campaign Colors
const H4H_RED_2024 = "#E63E51";

// Article Colors
const NEWSLETTER_FROM = "#1C3647";
const NEWSLETTER_TO = "#004f71";
const BACKGROUND_TO = "#EEEEEE";

const colors = {
  primary: createPallette(OCEAN),
  primary_subdued: OCEAN_SUBDUED,
  secondary: createPallette(NAVY),
  secondary_subdued: NAVY_SUBDUED,
  tertiary: createPallette(COTTON_CANDY),

  neutrals: {
    100: WHITE_SMOKE,
    200: "#e7e7e7",
    300: "#cecece",
    400: "#b4b4b4",
    500: "#9b9b9b",
    600: "#818181",
    700: "#686868",
    800: "#4e4e4e",
    900: "#353535",
  },

  hues: {
    blue: OCEAN,
    green: SUCCESS,
    mint: COTTON_CANDY,
    orange: TANGERINE,
    peach: PEACH,
    red: APPLE,
    yellow: LEMON,
  },

  alert: ERROR,
  warning: WARNING,
  success: SUCCESS,
  live: ERROR,
  wordOfChrist: NAVY,

  screen: NAVY,
  paper: WHITE,

  black: BLACK,
  white: WHITE,

  text_primary: TEXT_PRIMARY,
  text_secondary: TEXT_SECONDARY,

  background_primary: BACKGROUND_PRIMARY,
  background_secondary: BG_SECONDARY,

  link_secondary: LINK_SECONDARY,

  newsletter_from: NEWSLETTER_FROM,
  newsletter_to: NEWSLETTER_TO,
  background_to: BACKGROUND_TO,

  h4h: {
    red: H4H_RED_2024,
  },
};

export default colors;
