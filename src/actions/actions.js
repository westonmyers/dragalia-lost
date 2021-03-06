import actionTypes from './actionTypes';
import limit from './limit';
import { value } from './facility';
// import * as intl from './internationlization';
import equipment from './equipment';
import { getSection } from "./selectors";
const actionCreator = (type, ...argNames) => {
  return (...args) => {
    const action = { type }
    for (const [i, value] of argNames.entries()) {
      action[value] = args[i]
    }
    return action;
  }
}

export const reducerCreator = (handler) => {
  return (state, action, ...args) => {
    if (handler.hasOwnProperty(action.type)) {
      return handler[action.type](state, action, ...args);
    }
    return state;
  }
}

export const getStatsLimit = (statsKey, rarity, unbind = 4) => {
  const section = getSection(statsKey);
  switch (section) {
    case "mana":
    case "adventurer":
      return limit[section][rarity];
    case "weapon":
    case "wyrmprint":
    case "dragon":
      return limit[section][rarity][unbind];
    default:
      return 0;
  }
}

export const getHalidomValue = (facility) => {
  let n_HP = 0, n_STR = 0;
  if (facility) {
    for (const k of facility.list) {
      const { type, level } = facility[k];
      const { HP = 0, STR = 0 } = value[type][level] || {};
      n_HP += HP;
      n_STR += STR;
    }
  }
  return { HP: n_HP, STR: n_STR };
}

// export const translate = (content, language = "en", section = "intl") => {
//   let translate;
//   try {
//     if (typeof content === "object") {
//       if (content.hasOwnProperty(language)) translate = content[language];
//       if (translate === "") translate = content["en"];
//     } else {
//       translate = intl[section][content][language];
//       if (translate === "") translate = intl[section][content]["en"];
//     }
//   } catch (err) {
//     if (content) translate = content.charAt(0).toUpperCase() + content.slice(1);
//     console.error("error! translate [ content: ", content, ", language: ", language, ", section: ", section, "]");
//   }
//   return translate;
// }

export const selectLanguage = actionCreator(actionTypes.SELECT_LANGUAGE, "language");
export const resetFilters = actionCreator(actionTypes.RESET_FILTERS);
export const setFilters = actionCreator(actionTypes.SELECT_FILTERS, "key", "value");

export const setSection = actionCreator(actionTypes.SELECT_SECTION, "section")

export const selectSection = (section) => (dispatch) => {
  dispatch(setSection(section));
  dispatch({ type: actionTypes.NARROW_DOWN_FILTERS, section });
}

const updateDetails = (section) => (dispatch) => {
  const handler = actionCreator(actionTypes.UPDATE_DETAILS, "section");
  dispatch(handler(section));
  switch (section) {
    case "adventurer":
      dispatch(handler("weapon"));
      dispatch(handler("dragon"));
      break;
    case "weapon":
      dispatch(handler("adventurer"));
      break;
    default:
      break;
  }
  if (section !== "wyrmprint" || section !== "halidom") dispatch(handler("halidom"));
  dispatch(handler("ability"));
}

export const updateHalidom = (facility, index, level) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_HALIDOM, facility, index, level });
  dispatch(updateDetails("halidom"));
}

export const defaultHalidom = () => (dispatch) => {
  dispatch({ type: actionTypes.DEFAULT_HALIDOM });
  dispatch(updateDetails("halidom"));
}

export const maxHalidom = () => (dispatch) => {
  dispatch({ type: actionTypes.MAX_HALIDOM });
  dispatch(updateDetails("halidom"));
}


export const selectStats = (section, item) => (dispatch) => {
  dispatch({ type: actionTypes.SELECT_HALIDOM, section, item });

  const setStats = actionCreator(actionTypes.SELECT_STATS, "section", "item");
  dispatch(setStats(section, item));
  dispatch(updateDetails(section));
  const { element } = item;
  if (section === "adventurer" && (element === "Flame" || element === "Water")) {
    dispatch(setStats("wyrmprint1", equipment[element]));
    dispatch(updateDetails("wyrmprint1"));
  }
}

export const updateStats = (section, key, value) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_STATS, section, key, value });
  dispatch(updateDetails(section));
}

export const resetAll = () => (dispatch) => {
  //reset stats
  dispatch({ type: actionTypes.RESET_STATS });

  //reset section, filters
  dispatch(selectSection(null));

  //reset halidom
  dispatch({ type: actionTypes.RESET_HALIDOM });

  //reset details
  dispatch({ type: actionTypes.RESET_DETAILS });
}

export const test = () => {
  const chk = {
    adventurer: ["adventurer", "weapon", "halidom"],
    weapon: ["weapon", "adventurer", "halidom"],
    wyrmprint: ["wyrmprint"],
    dragon: ["dragon"],
  }

  const arr = ["adventurer", "wyrmprint"];

  const r = [
    ...new Set(
      (function* () {
        for (const s of arr) {
          yield* chk[s];
        }
        yield "ability";
      })()
    )
  ]
  console.log(r)
}