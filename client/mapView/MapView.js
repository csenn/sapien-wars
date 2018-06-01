import React from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import Map from './map/Map'
import TimeLine from './timeline/TimeLine'
import { makeLines } from './utils'
import { filterWarGroups, filterTimelineItems, filterMapItems } from './filters'
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
      timelineItems,
      mapItems,
      metaCounts,
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
            Sapien Wars
            <span style={{fontSize: '16px', marginLeft: '25px', color: 'black'}}>
              {metaCounts.years} years, {metaCounts.war} wars, {metaCounts.battle} battles
            </span>
          </h3>
        </Paper>

        <div style={{ position: 'relative', height: 'calc(100% - 70px)', width: '100%' }}>
          <div ref={node => (this.mapWrapper = node)} style={{ position: 'absolute', top: 0, bottom: '35%', left: 0, right: 0 }}>
            <Map
              ready={this._isMounted}
              height={this.state.height}
              width={this.state.width}
              battles={mapItems}
              lines={lines}
              earliestTime={filterEarliestTime}
              latestTime={filterLatestTime}
            />
          </div>

          <div style={{position: 'absolute', top: '65%', left: 0, right: 0, bottom: 0}}>
            <TimeLine
              battles={timelineItems}
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
    models,
    warGroups,
    warsEarliestTime,
    warsLatestTime,
    filterEarliestTime,
    filterLatestTime,
    filterWarGroup,
    metaCounts,
    selectedWars
  } = state.mapView

  const modelArr = Object.values(models)
  const filteredWarGroups = filterWarGroups(Object.values(warGroups))
  const timelineItems = filterTimelineItems(modelArr, filterWarGroup, filterEarliestTime, filterLatestTime)
  const mapItems = filterMapItems(modelArr, filterWarGroup, filterEarliestTime, filterLatestTime)

  const lines = makeLines(mapItems, warsLatestTime && warsLatestTime.diff(warsEarliestTime))

  return {
    // warGroupDict: warGroups,
    warGroups: filteredWarGroups,
    // wars: filteredWars,
    timelineItems,
    mapItems,
    warsEarliestTime,
    warsLatestTime,
    filterEarliestTime,
    filterLatestTime,
    filterWarGroup,
    metaCounts,
    lines: lines || []
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView)
