import sortBy from 'lodash/sortBy'

export function filterWarGroups (warGroupsArr) {
  const data = warGroupsArr.filter(group => group.children.length > 9)
  return sortBy(data, group => -1 * group.children.length)
}

export function filterTimelineItems (modelArr, filterWarGroupId, filterEarliestTime, filterLatestTime) {
  const data = modelArr.filter(model => {
    if (filterWarGroupId && !model.part_of.includes(filterWarGroupId)) {
      return false
    }

    if (!filterWarGroupId && model.type_label !== 'war') {
      return false
    }

    /* Without time war doesnt event render so might as well filter here */
    return model.startTimeMoment &&
      model.endTimeMoment &&
      model.startTimeMoment.isSameOrAfter(filterEarliestTime) &&
      model.endTimeMoment.isSameOrBefore(filterLatestTime)
  })

  return sortBy(data, d => d.startTimeMoment.valueOf())
}

export function filterMapItems (modelArr, filterWarGroupId, filterEarliestTime, filterLatestTime) {
  return modelArr.filter(model => {
    if (!model.coordinates) {
      return false
    }

    if (filterWarGroupId && !model.part_of.includes(filterWarGroupId)) {
      return false
    }

    return model.startTimeMoment &&
      model.endTimeMoment &&
      model.startTimeMoment.isSameOrAfter(filterEarliestTime) &&
      model.endTimeMoment.isSameOrBefore(filterLatestTime)
  })
}
//
// export function filterWarGroups (warGroups, wars, battles) {
//   const data = Object.values(warGroups).map(group => {
//     let hasBattle = false
//     group.wars.forEach(warId => {
//       wars[warId] && wars[warId].battles.forEach(battleId => {
//         if (battles[battleId] && battles[battleId].coordinates) {
//           hasBattle = true
//         }
//       })
//     })
//
//     if (!hasBattle) {
//       return false
//     }
//
//     return { warCount: group.wars.length, ...group }
//   })
//
//   return sortBy(compact(data), 'warCount').reverse()
// }
//
// export function filterWars (wars, filterWarGroup, filterEarliestTime, filterLatestTime) {
//   const counter = { 'yes': 0, 'no': 0}
//   const data = Object.values(wars).filter(war => {
//     if (filterWarGroup && !war.part_of.includes(filterWarGroup)) {
//       return false
//     }
//
//     const a = war.startTimeMoment &&
//       war.endTimeMoment &&
//       war.startTimeMoment.isSameOrAfter(filterEarliestTime) &&
//       war.endTimeMoment.isSameOrBefore(filterLatestTime)
//
//     if (!a) {
//       console.log(war.label, war.wikiId)
//       counter.no += 1
//     } else {
//       counter.yes += 1
//     }
//
//     /* Without time war doesnt event render so might as well filter here */
//     return war.startTimeMoment &&
//       war.endTimeMoment &&
//       war.startTimeMoment.isSameOrAfter(filterEarliestTime) &&
//       war.endTimeMoment.isSameOrBefore(filterLatestTime)
//   })
//   console.log(counter)
//   return sortBy(data, d => d.startTimeMoment.valueOf())
// }
//
// export function filterBattles (wars, battles, selectedWars, warsEarliestTime, warsLatestTime, filterEarliestTime, filterLatestTime) {
//   return Object.values(battles).filter(battle => {
//     if (!battle.coordinates) {
//       return false
//     }
//
//     if (selectedWars.length) {
//       let found = false
//       selectedWars.forEach(id => {
//         if (found) return
//         const war = wars[id]
//         if (war.battles.includes(battle.wikiId)) {
//           found = true
//         }
//       })
//       if (!found) {
//         return false
//       }
//     }
//
//     /* Only show battles for any wars in this wargroup */
//     // if (filterWarGroupFound) {
//     //   let found
//     //   for (let i = 0; i < battle.wars.length; i++) {
//     //     const warId = battle.wars[i].wikiId
//     //     if (filterWarGroupFound.wikiId === warId || filterWarGroupFound.wars.find(w => w.wikiId === warId)) {
//     //       found = true
//     //       break
//     //     }
//     //   }
//     //   if (!found) {
//     //     return false
//     //   }
//     // }
//
//     /* Just render everything before filtering */
//     if (warsEarliestTime.isSame(filterEarliestTime) && warsLatestTime.isSame(filterLatestTime)) {
//       return true
//     }
//
//     return battle.startTimeMoment &&
//       battle.endTimeMoment &&
//       battle.startTimeMoment.isSameOrAfter(filterEarliestTime) &&
//       battle.endTimeMoment.isSameOrBefore(filterLatestTime)
//   })
// }
