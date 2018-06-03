import { batchActions } from 'redux-batched-actions'
import axios from 'axios'
import moment from 'moment'
import { getTimeRange } from '../utils'
export const HOME_ADD_ITEM = 'HOME_ADD_ITEM'

/* Shouldnt really add moment instances to store but its faster for now */
function addMomentDates (data) {
  data.forEach(row => {
    row.startTimeMoment = row.start_time && moment(row.start_time)
    row.endTimeMoment = row.end_time && moment(row.end_time)
  })
}

function buildWarGroups (models) {
  const warGroups = {}

  const metaCounts = {
    war: 0,
    battle: 0
  }

  Object.values(models).forEach(model => {
    if (model.type_label === 'war') {
      metaCounts.war += 1
    } else if (model.type_label === 'battle' || model.type_label === 'naval battle') {
      metaCounts.battle += 1
    }

    model.part_of.forEach(id => {
      if (!warGroups[id]) {
        warGroups[id] = {
          id: id,
          label: models[id].label,
          children: []
        }
      }
      warGroups[id].children.push(model.wikiId)
    })
  })

  return { warGroups, metaCounts }
}

const filterWars = modelsArr => modelsArr.filter(model => model.type_label === 'war')

const badData = {
  //  'Soviet–Japanese War'
  'http://www.wikidata.org/entity/Q220602': true,
  // Battle of Rehe
  'http://www.wikidata.org/entity/Q2948000': true
}

export function init () {
  return dispatch => {
    axios.get('/data').then(response => {
      const models = response.data

      /* There are a few data points that seem wrong, lets just filter these out
      unitl maybe updating wikipedia */
      Object.keys(models).forEach(key => {
        if (models[key].label === 'Battle of Rehe') {
          console.log('this key: ', key)
        }
        if (badData[key]) {
          delete models[key]
        }
      })

      const { warGroups, metaCounts } = buildWarGroups(models)
      const modelsArr = Object.values(models)

      addMomentDates(modelsArr)
      const { earliestTime, latestTime } = getTimeRange(filterWars(modelsArr))

      metaCounts.years = latestTime.diff(earliestTime, 'years')

      return dispatch(batchActions([
        setTimeRange(earliestTime, latestTime),
        setFilterEarliestTime(earliestTime),
        setFilterLatestTime(latestTime),
        {
          type: 'SET_DATA',
          payload: {
            models,
            warGroups,
            metaCounts
          }
        }
      ]))
    })
  }
}

export function setTimeRange (earliestTime, latestTime) {
  return {
    type: 'SET_TIME_RANGE',
    payload: { earliestTime, latestTime }
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

export function setSelectedWiki (id) {
  return {
    type: 'SET_SELECTED_WIKI',
    payload: id
  }
}

export function setFilterWarGroup (groupId) {
  return (dispatch, getState) => {
    const { models, warGroups } = getState().mapView
    if (!groupId) {
      const { earliestTime, latestTime } = getTimeRange(filterWars(Object.values(models)))
      dispatch(batchActions([
        { type: 'SET_FILTER_WAR_GROUP', payload: null },
        setTimeRange(earliestTime, latestTime),
        setFilterEarliestTime(earliestTime),
        setFilterLatestTime(latestTime)
      ]))
    } else {
      const group = warGroups[groupId]
      const children = group.children.map(id => models[id])
      const { earliestTime, latestTime } = getTimeRange(children)

      dispatch(batchActions([
        { type: 'SET_FILTER_WAR_GROUP', payload: groupId },
        setTimeRange(earliestTime, latestTime),
        setFilterEarliestTime(earliestTime),
        setFilterLatestTime(latestTime)
      ]))
    }
  }
}
