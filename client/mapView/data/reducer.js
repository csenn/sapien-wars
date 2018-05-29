
const initialState = {
  warGroups: {},
  wars: {},
  battles: {},
  warsEarliestTime: null,
  warsLatestTime: null,

  filterEarliestTime: null,
  filterLatestTime: null,
  filterWarGroup: null,
  selectedWars: []
}

export default function mapViewReducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_DATA': {
      return {
        ...state,
        wars: action.payload.wars,
        warGroups: action.payload.warGroups,
        battles: action.payload.battles,
        warsEarliestTime: action.payload.warsEarliestTime,
        warsLatestTime: action.payload.warsLatestTime,
        // Set these the same as start initially
        filterEarliestTime: action.payload.warsEarliestTime,
        filterLatestTime: action.payload.warsLatestTime
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
    case 'SET_SELECTED_WARS': {
      return {
        ...state,
        selectedWars: action.payload
      }
    }
    default:
      return state
  }
}

// export default createReducer(initialState, {
//   [actions.HOME_ADD_ITEM]: ($$state, action) => {
//     return $$state.updateIn(['items'], $$items => $$items.push(action.payload))
//   }
// })
