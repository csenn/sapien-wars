import sortBy from 'lodash/sortBy'
import compact from 'lodash/compact'

export function filterWarGroups (warGroups, wars, battles) {
  const data = Object.values(warGroups).map(group => {
    let hasBattle = false
    group.wars.forEach(warId => {
      wars[warId] && wars[warId].battles.forEach(battleId => {
        if (battles[battleId] && battles[battleId].coordinates) {
          hasBattle = true
        }
      })
    })

    if (!hasBattle) {
      return false
    }

    return { warCount: group.wars.length, ...group }
  })

  return sortBy(compact(data), 'warCount').reverse()
}

export function filterWars (wars, filterWarGroup, filterEarliestTime, filterLatestTime) {
  const counter = { 'yes': 0, 'no': 0}
  const data = Object.values(wars).filter(war => {
    if (filterWarGroup && !war.part_of.includes(filterWarGroup)) {
      return false
    }

    const a = war.startTimeMoment &&
      war.endTimeMoment &&
      war.startTimeMoment.isSameOrAfter(filterEarliestTime) &&
      war.endTimeMoment.isSameOrBefore(filterLatestTime)

    if (!a) {
      console.log(war.item_label, war.item)
      counter.no += 1
    } else {
      counter.yes += 1
    }

    /* Without time war doesnt event render so might as well filter here */
    return war.startTimeMoment &&
      war.endTimeMoment &&
      war.startTimeMoment.isSameOrAfter(filterEarliestTime) &&
      war.endTimeMoment.isSameOrBefore(filterLatestTime)
  })
  console.log(counter)
  return sortBy(data, d => d.startTimeMoment.valueOf())
}

export function filterBattles (wars, battles, selectedWars, warsEarliestTime, warsLatestTime, filterEarliestTime, filterLatestTime) {
  return Object.values(battles).filter(battle => {
    if (!battle.coordinates) {
      return false
    }

    if (selectedWars.length) {
      let found = false
      selectedWars.forEach(id => {
        if (found) return
        const war = wars[id]
        if (war.battles.includes(battle.item)) {
          found = true
        }
      })
      if (!found) {
        return false
      }
    }

    /* Only show battles for any wars in this wargroup */
    // if (filterWarGroupFound) {
    //   let found
    //   for (let i = 0; i < battle.wars.length; i++) {
    //     const warId = battle.wars[i].item
    //     if (filterWarGroupFound.item === warId || filterWarGroupFound.wars.find(w => w.item === warId)) {
    //       found = true
    //       break
    //     }
    //   }
    //   if (!found) {
    //     return false
    //   }
    // }

    /* Just render everything before filtering */
    if (warsEarliestTime.isSame(filterEarliestTime) && warsLatestTime.isSame(filterLatestTime)) {
      return true
    }

    return battle.startTimeMoment &&
      battle.endTimeMoment &&
      battle.startTimeMoment.isSameOrAfter(filterEarliestTime) &&
      battle.endTimeMoment.isSameOrBefore(filterLatestTime)
  })
}
