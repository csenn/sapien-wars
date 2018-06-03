
const initialState = {
  models: {},
  warGroups: {},
  metaCounts: {},

  warsEarliestTime: null,
  warsLatestTime: null,

  filterEarliestTime: null,
  filterLatestTime: null,
  filterWarGroup: null,

  selectedWiki: null
}

export default function mapViewReducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_DATA': {
      return {
        ...state,
        models: action.payload.models,
        warGroups: action.payload.warGroups,
        metaCounts: action.payload.metaCounts
        // warsEarliestTime: action.payload.warsEarliestTime,
        // warsLatestTime: action.payload.warsLatestTime,
        // Set these the same as start initially
        // filterEarliestTime: action.payload.warsEarliestTime,
        // filterLatestTime: action.payload.warsLatestTime
      }
    }
    case 'SET_TIME_RANGE': {
      return {
        ...state,
        warsEarliestTime: action.payload.earliestTime,
        warsLatestTime: action.payload.latestTime
      }
    }
    case 'SET_FILTER_EARLIEST_TIME': {
      return {
        ...state,
        filterEarliestTime: action.payload
      }
    }
    case 'SET_FILTER_LATEST_TIME': {
      return {
        ...state,
        filterLatestTime: action.payload
      }
    }
    case 'SET_FILTER_WAR_GROUP': {
      return {
        ...state,
        filterWarGroup: action.payload
      }
    }
    case 'SET_SELECTED_WIKI': {
      return {
        ...state,
        selectedWiki: action.payload
      }
    }
    default:
      return state
  }
}

// export default createReducer(initialState, {
//   [actions.HOME_ADD_ITEM]: ($$state, action) => {
//     return $$state.updateIn(['wikiIds'], $$wikiIds => $$wikiIds.push(action.payload))
//   }
// })
