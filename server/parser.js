const warsRaw = require('./war_raw_data.json')
const battlesRaw = require('./battles_raw_data.json')
const sortBy = require('lodash/sortBy')
const take = require('lodash/take')

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

function addToArray (arr, id) {
  if (id && !arr.includes(id)) {
    arr.push(id)
  }
}

// const key

function parseWarGroups () {
  const warGroups = {}

  warsRaw.forEach(warRaw => {
    const id = warRaw.part_of

    if (!id || !warRaw.part_of_label) {
      return
    }

    if (!warGroups[id]) {
      warGroups[id] = {
        item: id,
        item_label: warRaw.part_of_label,
        wars: []
      }
    }
    addToArray(warGroups[id].wars, warRaw.item)
  })

  return warGroups
}

function parseWarRaw () {
  const wars = {}

  warsRaw.forEach(warRaw => {
    const id = warRaw.item

    if (id.indexOf('Q179975') > -1) {
      console.log('eeeeeeeeeeeeeejejejejejejejejejej')
    }

    if (warRaw.item_label.indexOf('Darfur') > -1) {
      console.log('ehehehehrurururu')
    }

    if (!wars[id]) {
      wars[id] = {
        item: id,
        item_label: warRaw.item_label,
        start_time: fixNegativeDate(warRaw.start_time),
        end_time: fixNegativeDate(warRaw.end_time),
        number_of_deaths: warRaw.number_of_deaths,
        part_of: [],
        countries: [],
        battles: []
      }
    } else {
      if (!wars[id].start_time) {
        wars[id].start_time = fixNegativeDate(warRaw.start_time)
      }
      if (!wars[id].end_time) {
        wars[id].end_time = fixNegativeDate(warRaw.end_time)
      }
      if (!wars[id].number_of_deaths) {
        wars[id].number_of_deaths = warRaw.number_of_deaths
      }
      if (!wars[id].part_of) {
        wars[id].part_of = warRaw.part_of
      }
      if (!wars[id].part_of_label) {
        wars[id].part_of_label = warRaw.part_of_label
      }
    }

    addToArray(wars[id].part_of, warRaw.part_of)
    // addToArray(wars[id].countries, warRaw.country, warRaw.country_label)
    // addToArray(wars[id].countries, warRaw.participant, warRaw.participant_label)
  })

  return wars
}

function parseBattlesRaw () {
  const battles = {}

  battlesRaw.forEach(battleRaw => {
    const id = battleRaw.item

    if (!battles[id]) {
      battles[id] = {
        item: id,
        item_label: battleRaw.item_label,
        start_time: fixNegativeDate(battleRaw.start_time) || fixNegativeDate(battleRaw.point_in_time),
        end_time: fixNegativeDate(battleRaw.end_time) || fixNegativeDate(battleRaw.point_in_time),
        // part_of: battleRaw.part_of,
        // part_of_label: battleRaw.part_of_label,
        coordinates: getCoordinate(battleRaw.coordinates) || getCoordinate(battleRaw.location_coordinates),
        location_label: battleRaw.location_label,
        country_label: battleRaw.country_label,
        part_of: []
      }
    } else {
      const battle = battles[id]
      if (!battle.start_time) {
        battle.start_time = fixNegativeDate(battleRaw.start_time)
      }
      if (!battle.end_time) {
        battle.end_time = fixNegativeDate(battleRaw.end_time)
      }
      if (!battle.location_label) {
        battle.location_label = battleRaw.location_label
      }
      if (!battle.country_label) {
        battle.country_label = battleRaw.country_label
      }
    }

    addToArray(battles[id].part_of, battleRaw.part_of)
  })

  return battles
}

// function buildWarGroups (wars) {
//   const warGroups = {}
//
//   Object.values(wars).forEach(war => {
//     war.part_of.forEach(id => {
//       if (!warGroups[id]) {
//         warGroups[id] = {
//           item: war.part_of,
//           item_label: war.part_of_label,
//           wars: [],
//           warCount: 0
//         }
//       }
//       warGroups[id].wars.push({
//         item: war.item,
//         item_label: war.item_label
//       })
//       warGroups[war.part_of].warCount += 1
//     })
//   })
//
//   return warGroups
// }

function addBattlesToWars (wars, battles) {
  Object.values(battles).forEach(battle => {
    battle.part_of.forEach(id => {
      if (wars[id]) {
        wars[id].battles.push(battle.item)
      } else {
        // console.log(battle.item + ' ' + battle.item_label + ' was part of ' + id)
      }
    })
  })
}

// function getData () {
//   const warGroups = parseWarGroups()
//   const wars = parseWarRaw()
//   const battles = parseBattlesRaw()
//   addBattlesToWars(wars, battles)
//
//   return {
//     warGroups,
//     wars,
//     battles
//   }
// }

const overrides = {

}

function getPartOfMapping (rawData) {
  const partOf = {}

  rawData.forEach(row => {
    if (!row.part_of) {
      return
    }

    if (row.part_of_label && row.part_of_label.indexOf('history of the United States')) {
      console.log('eeeeee: ', row.part_of_type_label)
    }

    if (!partOf[row.part_of_label]) {
      // partOf[row.part_of_label] = {
      //   part_of: row.part_of,
      //   part_of_label: row.part_of_label
      // }
      partOf[row.part_of_label] = {
        type: row.part_of_type_label,
        children: []
      }
    }
    addToArray(partOf[row.part_of_label].children, row.item_label)
  })

  return partOf
}

function parseData (rawData) {
  const data = {}

  rawData.forEach(row => {
    const id = row.item
    if (!data[id]) {
      data[id] = {
        item: id,
        item_label: row.item_label,
        typel: row.type,
        type_labell: row.type_label,
        start_time: fixNegativeDate(row.start_time) || fixNegativeDate(row.point_in_time),
        end_time: fixNegativeDate(row.end_time) || fixNegativeDate(row.point_in_time),
        coordinates: getCoordinate(row.coordinates) || getCoordinate(row.location_coordinates),
        location: row.location,
        location_label: row.location_label,
        part_of: []
      }
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

    addToArray(data[id].part_of, row.part_of_type_label)
  })

  return data
}

// function _flattenMapping (mapping) {
//   const counts = {}
//   Object.values(data).forEach(row => {
//     row.part_of.forEach(p => {
//       if (!counts[p]) {
//         counts[p] = 0
//       }
//       counts[p] += 1
//     })
//   })
//   console.log(counts)
// }

function _countPartOf (data) {
  const counts = {}
  Object.values(data).forEach(row => {
    row.part_of.forEach(p => {
      if (!counts[p]) {
        counts[p] = 0
      }
      counts[p] += 1
    })
  })
  console.log(counts)
}

function _printMapping (mapping) {
  const arr = Object.keys(mapping).map(key => ({label: key, len: mapping[key].children.length}))
  console.log(take(sortBy(arr, 'len').reverse(), 50))
  console.log(Object.keys(mapping).length)
}

function _cleanMapping (mapping) {
  const keys = Object.keys(mapping)

  const allow = [
    'war',
    'battle',
    'civil war',
    'world war',
    'armed conflict',
    'naval battle',
    'aerial bombing',
    'aerial bombing of a city',
    'cold war',
    'military campaign'
  ]

  keys.forEach(searchKey => {
    let inChild = false

    Object.keys(mapping).forEach(key => {
      if (key === searchKey) {
        return
      }

      /* only add to parent if war */
      // if (allow.includes(mapping[key].type)) {
      if (mapping[key].children.includes(searchKey)) {
        inChild = true
        mapping[key].children.push(...mapping[searchKey].children)
      }
      // }
    })

    if (inChild) {
      delete mapping[searchKey]
    }
  })
}

function getData () {
  /* Import locally to release from memory when done */
  const rawData = require('./raw_data.json')

  const partOfMapping = getPartOfMapping(rawData)

  // console.log(partOfMapping)

  // console.log(partOfMapping)
  _printMapping(partOfMapping)

  // console.log(partOfMapping)
  _cleanMapping(partOfMapping)
  _printMapping(partOfMapping)

  // _cleanMapping(partOfMapping)
  // _printMapping(partOfMapping)
  // console.log(partOfMapping)
  // console.log(Object.keys(partOfMapping).length)

  // const data = parseData(rawData)
  // _countPartOf(data)
}

module.exports = { getData }
