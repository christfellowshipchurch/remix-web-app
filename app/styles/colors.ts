// Primitive Colors
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const GRAY = "#F5F5F7";
const SOFT_WHITE = "#FAFAFC";
const NAVY = "#004F71";
const NAVY_SUBDUED = "#DAEAF1";
const OCEAN = "#0092BC";
const OCEAN_SUBDUED = "#E7F9FE";
const COTTON_CANDY = "#6BCABA";
const COCONUT = "#D0D0CE";
const APPLE = "#CB2C30";
const TANGERINE = "#FF8F1C";
const PEACH = "#E8927C";
const LEMON = "#FCD757";

// Neutral Colors
const NEUTRAL_LIGHTEST = "#EEEEEE";
const NEUTRAL_LIGHTER = "#CCCCCC";
const NEUTRAL_LIGHT = "#AAAAAA";
const NEUTRAL = "#666666";
const NEUTRAL_DARK = "#444444";
const NEUTRAL_DARKER = "#222222";
const NEUTRAL_DARKEST = "#111111";

// System Colors
const SUCCESS_GREEN = "#1EC27F";
const SUCCESS_GREEN_LIGHT = "#ECFDF3";
const ERROR_RED = "#B42318";
const ERROR_RED_LIGHT = "#FEF3F2";
const WARNING = "#E09541";

// Semantic Colors
const BACKGROUND_PRIMARY = WHITE;
const BACKGROUND_SECONDARY = "#FAFAFC";
const BACKGROUND_TERTIARY = NEUTRAL;
const BACKGROUND_ALTERNATE = BLACK;
const BACKGROUND_SUCCESS = SUCCESS_GREEN_LIGHT;
const BACKGROUND_ERROR = ERROR_RED_LIGHT;

const BORDER_PRIMARY = BLACK;
const BORDER_SECONDARY = NEUTRAL_LIGHT;
const BORDER_TERTIARY = NEUTRAL_DARK;
const BORDER_ALTERNATE = WHITE;
const BORDER_SUCCESS = SUCCESS_GREEN;
const BORDER_ERROR = ERROR_RED;

const TEXT_PRIMARY = NEUTRAL_DARKER;
const TEXT_SECONDARY = NEUTRAL_DARK;
const TEXT_ALTERNATE = WHITE;
const TEXT_SUCCESS = SUCCESS_GREEN;
const TEXT_ERROR = ERROR_RED;

const LINK_PRIMARY = BLACK;
const LINK_SECONDARY = NEUTRAL;
const LINK_ALTERNATE = WHITE;

const colors = {
  // Primitive
  black: BLACK,
  white: WHITE,
  softWhite: SOFT_WHITE,
  navy: NAVY,
  navySubdued: NAVY_SUBDUED,
  ocean: OCEAN,
  oceanSubdued: OCEAN_SUBDUED,
  cottonCandy: COTTON_CANDY,
  coconut: COCONUT,
  apple: APPLE,
  tangerine: TANGERINE,
  peach: PEACH,
  lemon: LEMON,

  //System Colors
  alert: ERROR_RED,
  alertLight: ERROR_RED_LIGHT,
  success: SUCCESS_GREEN,
  successLight: SUCCESS_GREEN_LIGHT,
  warning: WARNING,

  // Neutral
  neutral: {
    lightest: NEUTRAL_LIGHTEST,
    lighter: NEUTRAL_LIGHTER,
    light: NEUTRAL_LIGHT,
    default: NEUTRAL,
    dark: NEUTRAL_DARK,
    darker: NEUTRAL_DARKER,
    darkest: NEUTRAL_DARKEST,
  },

  // Semantic
  background: {
    primary: BACKGROUND_PRIMARY,
    secondary: BACKGROUND_SECONDARY,
    tertiary: BACKGROUND_TERTIARY,
    alternate: BACKGROUND_ALTERNATE,
    success: BACKGROUND_SUCCESS,
    error: BACKGROUND_ERROR,
  },
  border: {
    primary: BORDER_PRIMARY,
    secondary: BORDER_SECONDARY,
    tertiary: BORDER_TERTIARY,
    alternate: BORDER_ALTERNATE,
    success: BORDER_SUCCESS,
    error: BORDER_ERROR,
    DEFAULT: BORDER_PRIMARY,
  },
  text: {
    primary: TEXT_PRIMARY,
    secondary: TEXT_SECONDARY,
    alternate: TEXT_ALTERNATE,
    success: TEXT_SUCCESS,
    error: TEXT_ERROR,
    DEFAULT: TEXT_PRIMARY,
  },
  link: {
    primary: LINK_PRIMARY,
    secondary: LINK_SECONDARY,
    alternate: LINK_ALTERNATE,
  },
};

export default colors;
