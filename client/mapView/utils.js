import sortBy from 'lodash/sortBy'
import moment from 'moment'

const BIG_NUMBER = 100000000

// const temp = {}

export function formatMomentDate (momentDate) {
  if (!momentDate || !momentDate.year) {
    return ''
  }

  if (momentDate.year() > 0) {
    return momentDate.format('YYYY') + ' A.D.'
  }

  return `${Math.abs(momentDate.year())} B.C.`
}

const FROM_COLOR = [255, 232, 98]
const TO_COLOR = [255, 122, 98]
export function colorInterpolator (fraction) {
  return [
    FROM_COLOR[0] + fraction * (TO_COLOR[0] - FROM_COLOR[0]),
    FROM_COLOR[1] + fraction * (TO_COLOR[1] - FROM_COLOR[1]),
    FROM_COLOR[2] + fraction * (TO_COLOR[2] - FROM_COLOR[2])
  ]
}

// const ONE_MONTH = 1000 * 60 * 60 * 24 * 30
const ONE_THOUSAND_YEARS = 1000 * 60 * 60 * 24 * 365 * 1000
export function getTimelineDates (earliestTime, latestTime) {
  const timeDiff = latestTime.diff(earliestTime)

  /* Return clean timeline for more then 1000 years */
  if (timeDiff > ONE_THOUSAND_YEARS) {
    return [
      moment().year(2000),
      moment().year(1500),
      moment().year(1000),
      moment().year(500),
      moment().year(0),
      moment().year(-500),
      moment().year(-1000),
      moment().year(-1500)
    ]
  }

  const interval = timeDiff / 8
  const results = []
  for (let i = 1; i < 8; i++) {
    results.push(earliestTime.clone().add((i * interval), 'ms'))
  }
  return results

  // const firstDate = moment().setYear(2000)
}

/* Assumes rows have keys 'startTimeMoment' and 'endTimeMoment' which is a moment object.
Not great, but ok for now.  */
export function getTimeRange (rows) {
  let earliestTime, latestTime
  rows.forEach(row => {
    if (!row) {
      return
    }
    if (row.startTimeMoment && (!earliestTime || row.startTimeMoment.isBefore(earliestTime))) {
      earliestTime = row.startTimeMoment
    }

    if (row.endTimeMoment && (!latestTime || row.endTimeMoment.isAfter(latestTime))) {
      latestTime = row.endTimeMoment
    }
  })

  return { earliestTime, latestTime }
}

function getCost (battleA, battleB, timeRange) {
  if (battleA.wikiId === battleB.wikiId) {
    return BIG_NUMBER
  }

  if (!battleA.start_time || !battleB.start_time) {
    return BIG_NUMBER
  }

  /* Pretty rough, but seems to work well enough */
  const timePenalty = 100 * battleB.startTimeMoment.diff(battleA.startTimeMoment) / timeRange
  const distancePenalty = Math.abs(battleA.coordinates[0] - battleB.coordinates[0]) +
    (Math.abs(battleA.coordinates[1] - battleB.coordinates[1]))

  return timePenalty + distancePenalty
}

function findCosts (battles, timeRange) {
  const costs = []
  for (let i = 0; i < battles.length; i++) {
    for (let j = i + 1; j < i + 50 && j < battles.length; j++) {
      costs.push({i, j, cost: getCost(battles[i], battles[j], timeRange)})
    }
  }
  return sortBy(costs, 'cost')
}

export function makeLines (battles, timeRange) {
  if (battles.length > 300) {
    return []
  }

  const costs = findCosts(battles, timeRange)
  const lines = []
  const into = {}
  for (let i = 0; i < costs.length; i++) {
    if (into[costs[i].j]) {
      continue
    }
    into[costs[i].j] = true
    lines.push({
      from: battles[costs[i].i],
      to: battles[costs[i].j],
      // sourcePosition: .coordinates,
      // targetPosition: .coordinates,
      cost: costs[i].cost
    })
  }

  return lines.filter(line => line.cost < 20)

  // let previous = battles[0].coordinates
  //
  // const lines = []
  // for (let i = 1; i < battles.length; i++) {
  //   const sourcePosition = previous
  //   const targetPosition = battles[i].coordinates
  //   if (sourcePosition && targetPosition) {
  //     lines.push({ sourcePosition, targetPosition })
  //   }
  //   previous = targetPosition
  // }

  // return lines
}
