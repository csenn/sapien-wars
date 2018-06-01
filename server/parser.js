const flattenDeep = require('lodash/flattenDeep')
const uniq = require('lodash/uniq')
const compact = require('lodash/compact')

/* Need to change BC dates to have leading 000 for javascript date engine
http://scholarslab.org/research-and-development/parsing-bc-dates-with-javascript/ */
function fixNegativeDate (isoDate) {
  if (!isoDate) return null
  if (isoDate[0] !== '-') return isoDate

  const split = isoDate.split('-')

  while (split[1].length < 6) {
    split[1] = '0' + split[1]
  }

  return split.join('-')
}

function getCoordinate (point) {
  if (!point) {
    return null
  }
  let result = point.replace('Point(', '')
  result = result.replace(')', '')
  result = result.split(' ')
  return [parseFloat(result[0]), parseFloat(result[1])]
}

/* Carry done for any recursive loops */
function _findParents (id, mapping, done = {}) {
  if (!mapping[id] || mapping[id].length === 0) {
    return []
  }

  mapping[id] = uniq(flattenDeep(mapping[id].map(childId => {
    if (done[childId]) return childId
    done[childId] = true

    const parents = _findParents(childId, mapping, done)
    return parents.length ? parents : childId
  })))

  return mapping[id]
}

function parseData (rawData) {
  const partOfMapping = {}

  rawData.forEach(row => {
    if (!partOfMapping[row.item]) {
      partOfMapping[row.item] = []
    }
    partOfMapping[row.item] = compact(uniq(partOfMapping[row.item].concat(row.part_of)))
  })

  const data = {}

  rawData.forEach(row => {
    const id = row.item
    if (!data[id]) {
      data[id] = {
        wikiId: id,
        label: row.item_label,
        type: row.type,
        type_label: row.type_label,
        start_time: fixNegativeDate(row.start_time) || fixNegativeDate(row.point_in_time),
        end_time: fixNegativeDate(row.end_time) || fixNegativeDate(row.point_in_time),
        coordinates: getCoordinate(row.coords) || getCoordinate(row.location_coords),
        location: row.location,
        location_label: row.location_label,
        part_of: _findParents(row.item, partOfMapping)
      }
      // console.log(row.item_label, data[id].part_of)
    } else {
      /* Just keep the first of all these for now. Maybe has multiple locations?? */
      if (!data[id].start_time) {
        data[id].start_time = fixNegativeDate(row.start_time) || fixNegativeDate(row.point_in_time)
      }
      if (!data[id].end_time) {
        data[id].end_time = fixNegativeDate(row.end_time) || fixNegativeDate(row.point_in_time)
      }
      if (!data[id].coordinates) {
        data[id].coordinates = getCoordinate(row.coordinates) || getCoordinate(row.location_coordinates)
      }
      if (!data[id].location) {
        data[id].location = row.location
      }
      if (!data[id].location_label) {
        data[id].location_label = row.location_label
      }
    }
  })

  return data
}

function getData () {
  /* Import locally to release from memory when done. Not sure if this works 100% though */
  const rawData = require('./raw_data.json')
  return parseData(rawData)
}

module.exports = { getData }
