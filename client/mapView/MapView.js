import React from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import Map from './map/Map'
import TimeLine from './timeline/TimeLine'
import { makeLines } from './utils'
import { filterWarGroups, filterWars, filterBattles } from './filters'
import { init, setFilterEarliestTime, setFilterLatestTime, setFilterWarGroup } from './data/actions'

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN; // eslint-disable-line

class MapView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      width: 0,
      height: 0
    }
    this.hoverBattle = this.hoverBattle.bind(this)
    this.calcDimension = this.calcDimension.bind(this)
  }
  componentDidMount () {
    this._isMounted = true
    this.calcDimension()
    this.props.dispatchInit()
    window.addEventListener('resize', this.calcDimension)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.calcDimension)
  }
  calcDimension () {
    if (this.mapWrapper) {
      this.setState({
        width: this.mapWrapper.offsetWidth,
        height: this.mapWrapper.offsetHeight
      })
    }
  }
  hoverBattle (data) {
    if (data.object) {
      this.setState({hoveredBattle: data.object})
    }
  }
  render () {
    const {
      wars,
      battles,
      warGroups,
      lines,
      warsEarliestTime,
      warsLatestTime,
      filterEarliestTime,
      filterLatestTime,
      filterWarGroup
    } = this.props

    return (
      <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>

        <Paper style={{ position: 'relative', padding: '0 18px', zIndex: 1 }}>
          <h3 style={{padding: 25, margin: 0, fontSize: '32px', color: 'rgb(42, 65, 113)'}}>
            WAR
            <span style={{fontSize: '16px', marginLeft: '25px', color: 'black'}}>
              4000 years, 560 wars, 6500 battles
            </span>
          </h3>
        </Paper>

        <div style={{ position: 'relative', height: 'calc(100% - 70px)', width: '100%' }}>
          <div ref={node => (this.mapWrapper = node)} style={{ position: 'absolute', top: 0, bottom: '35%', left: 0, right: 0 }}>
            <Map
              ready={this._isMounted}
              height={this.state.height}
              width={this.state.width}
              battles={battles}
              lines={lines}
              earliestTime={filterEarliestTime}
              latestTime={filterLatestTime}
            />
          </div>

          <div style={{position: 'absolute', top: '65%', left: 0, right: 0, bottom: 0}}>
            <TimeLine
              battles={wars}
              warGroups={warGroups}
              warsEarliestTime={warsEarliestTime}
              warsLatestTime={warsLatestTime}
              filterEarliestTime={filterEarliestTime}
              filterLatestTime={filterLatestTime}
              filterWarGroup={filterWarGroup}
              warGroupDict={this.props.warGroupDict}
              dispatchSetFilterEarliestTime={this.props.dispatchSetFilterEarliestTime}
              dispatchSetFilterLatestTime={this.props.dispatchSetFilterLatestTime}
              dispatchSetFilterWarGroup={this.props.dispatchSetFilterWarGroup}
            />
          </div>
        </div>

      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchInit: (...args) => dispatch(init(...args)),
    dispatchSetFilterEarliestTime: (...args) => dispatch(setFilterEarliestTime(...args)),
    dispatchSetFilterLatestTime: (...args) => dispatch(setFilterLatestTime(...args)),
    dispatchSetFilterWarGroup: (...args) => dispatch(setFilterWarGroup(...args))
  }
}

function mapStateToProps (state) {
  /* Fine for now */
  if (process.env.NODE_ENV === 'development') {
    console.log(state)
  }
  const {
    wars,
    battles,
    warGroups,
    warsEarliestTime,
    warsLatestTime,
    filterEarliestTime,
    filterLatestTime,
    filterWarGroup,
    selectedWars
  } = state.mapView

  const filteredWarGroups = filterWarGroups(warGroups, wars, battles)// Object.values(warGroups)
  const filteredWars = filterWars(wars, filterWarGroup, filterEarliestTime, filterLatestTime) // Object.values(wars)
  const filteredBattles = filterBattles(wars, battles, selectedWars, warsEarliestTime, warsLatestTime, filterEarliestTime, filterLatestTime)
  // const battleModels = Object.values(battles)

   // warGroups.map(id => models[id])
  // const warModels = wars.map(id => models[id])
  // const battleModels = battles.map(id => models[id])

  // console.log(filteredWarGroups, filteredWars, filteredBattles)

  // const filteredWars = warModels.filter(war => {
  //   if (filterWarGroup && war.part_of !== filterWarGroup) {
  //     return false
  //   }
  //
  //   /* Without time war doesnt event render so might as well filter here */
  //   return war.startTimeMoment &&
  //     war.endTimeMoment &&
  //     war.startTimeMoment.isSameOrAfter(filterEarliestTime) &&
  //     war.endTimeMoment.isSameOrBefore(filterLatestTime)
  // })
  //
  // const filterWarGroupFound = warGroups.find(group => group.item === filterWarGroup)
  //
  // const filteredBattles = battles.filter(battle => {
  //   if (!battle.coordinates) {
  //     return false
  //   }
  //
  //   /* Only show battles for any wars in this wargroup */
  //   if (filterWarGroupFound) {
  //     let found
  //     for (let i = 0; i < battle.wars.length; i++) {
  //       const warId = battle.wars[i].item
  //       if (filterWarGroupFound.item === warId || filterWarGroupFound.wars.find(w => w.item === warId)) {
  //         found = true
  //         break
  //       }
  //     }
  //     if (!found) {
  //       return false
  //     }
  //   }
  //
  //   /* Just render everything before filtering */
  //   if (warsEarliestTime.isSame(filterEarliestTime) && warsLatestTime.isSame(filterLatestTime)) {
  //     return true
  //   }
  //
  //   return battle.startTimeMoment &&
  //     battle.endTimeMoment &&
  //     battle.startTimeMoment.isSameOrAfter(filterEarliestTime) &&
  //     battle.endTimeMoment.isSameOrBefore(filterLatestTime)
  // })

  const lines = [] // warsLatestTime && makeLines(filteredBattles, warsLatestTime.diff(warsEarliestTime))

  return {
    warGroupDict: warGroups,
    warGroups: filteredWarGroups,
    wars: filteredWars,
    battles: filteredBattles,
    warsEarliestTime,
    warsLatestTime,
    filterEarliestTime,
    filterLatestTime,
    filterWarGroup,
    lines: lines || []
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView)
