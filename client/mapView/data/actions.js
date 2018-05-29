import axios from 'axios'
import sortBy from 'lodash/sortBy'
import take from 'lodash/take'
import moment from 'moment'
import { getTimeRange } from '../utils'

export const HOME_ADD_ITEM = 'HOME_ADD_ITEM'

// function prepareData (data) {
//   let earliestTime, latestTime
//
//   const rows = sortBy(data.map(row => {
//     const startTimeMoment = row.start_time && moment(row.start_time)
//     const endTimeMoment = row.end_time && moment(row.end_time)
//
//     if (row.start_time && (!earliestTime || startTimeMoment < earliestTime)) {
//       earliestTime = startTimeMoment
//     }
//
//     if (row.end_time && (!latestTime || endTimeMoment > latestTime)) {
//       latestTime = endTimeMoment
//     }
//
//     return {
//       ...row,
//       startTimeMoment,
//       endTimeMoment,
//       start_ms: startTimeMoment && startTimeMoment.valueOf()
//     }
//   }), 'start_ms')
//
//   return { rows, earliestTime, latestTime }
// }

/* Shouldnt really add moment instances to store but its faster for now */
function addMomentDates (data) {
  data.forEach(row => {
    row.startTimeMoment = row.start_time && moment(row.start_time)
    row.endTimeMoment = row.end_time && moment(row.end_time)
  })
}

// function buildWarGroups (wars) {
//   const groups = {}
//
//   wars.forEach(war => {
//     if (!war.part_of) {
//       return
//     }
//     if (!groups[war.part_of]) {
//       groups[war.part_of] = {
//         item: war.part_of,
//         item_label: war.part_of_label,
//         wars: [],
//         warCount: 0
//       }
//     }
//     groups[war.part_of].wars.push({
//       item: war.item,
//       item_label: war.item_label
//     })
//     groups[war.part_of].warCount += 1
//   })
//
//   return take(sortBy(Object.values(groups), 'warCount').reverse(), 150)
// }

// function fetchWars () {
//   return dispatch => {
//     axios.get('/wars').then(response => {
//       const { rows, earliestTime, latestTime } = prepareData(response.data)
//
//       dispatch({
//         type: 'SET_WARS',
//         payload: {
//           wars: rows,
//           warGroups: buildWarGroups(rows),
//           warsEarliestTime: earliestTime,
//           warsLatestTime: latestTime
//         }
//       })
//     })
//   }
// }
//
// function fetchBattles () {
//   return dispatch => {
//     axios.get('/battles').then(response => {
//       const { rows } = prepareData(response.data)
//       dispatch({ type: 'SET_BATTLES', payload: rows })
//     })
//   }
// }

export function init () {
  return dispatch => {
    axios.get('/data').then(response => {
      const { wars, warGroups, battles } = response.data

      const warModels = Object.values(wars)// wars.map(id => models[id])
      const battleModels = Object.values(battles)// battles.map(id => models[id])
      addMomentDates(warModels)
      addMomentDates(battleModels)
      const { earliestTime, latestTime } = getTimeRange(warModels)

      // console.log('erere', models)

      // const { rows, earliestTime, latestTime } = prepareData(response.data)

      dispatch({
        type: 'SET_DATA',
        payload: {
          wars,
          warGroups,
          battles,
          warsEarliestTime: earliestTime,
          warsLatestTime: latestTime
        }
      })
    })
  }
}

export function setFilterEarliestTime (time) {
  return {
    type: 'SET_FILTER_EARLIEST_TIME',
    payload: time
  }
}

export function setFilterLatestTime (time) {
  return {
    type: 'SET_FILTER_LATEST_TIME',
    payload: time
  }
}

export function setSelectedWars (warIds) {
  return {
    type: 'SET_SELECTED_WARS',
    payload: warIds || []
  }
}

export function setFilterWarGroup (groupId) {
  return (dispatch, getState) => {
    const state = getState()

    if (!groupId) {
      dispatch({ type: 'SET_FILTER_WAR_GROUP', payload: groupId })
      dispatch(setFilterEarliestTime(state.mapView.warsEarliestTime))
      dispatch(setFilterLatestTime(state.mapView.warsLatestTime))
      dispatch(setSelectedWars())
    } else {
      // const group = state.mapView.warGroups.find(g => g.item === groupId)
      const group = state.mapView.warGroups[groupId]
      const warModels = group.wars.map(id => state.mapView.wars[id])
      const { earliestTime, latestTime } = getTimeRange(warModels)

// const { earliestTime, latestTime } = getTimeRange(warModels)

      // let earliestTime, latestTime
      // group.wars.forEach(warRef => {
      //   /* TODO: Should store as dictionary for faster lookups */
      //   const war = state.mapView.wars.find(w => w.item === warRef.item)
      //   if (!earliestTime || (war.startTimeMoment && war.startTimeMoment.isBefore(earliestTime))) {
      //     earliestTime = war.startTimeMoment
      //   }
      //   if (!latestTime || (war.endTimeMoment && war.endTimeMoment.isAfter(latestTime))) {
      //     latestTime = war.endTimeMoment
      //   }
      // })

      /* TODO: Should use batch actions */
      dispatch({ type: 'SET_FILTER_WAR_GROUP', payload: groupId })
      dispatch(setFilterEarliestTime(earliestTime))
      dispatch(setFilterLatestTime(latestTime))
      dispatch(setSelectedWars(group.wars))
    }
  }
}
