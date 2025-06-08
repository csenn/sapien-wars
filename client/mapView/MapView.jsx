import React from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import Map from './map/Map'
import TimeLine from './timeline/TimeLine'
import Acknowledgements from './Acknowledgements'
// import { makeLines } from './utils'
import { filterWarGroups, filterTimelineItems, filterMapItems } from './filters'
import { init, setFilterEarliestTime, setFilterLatestTime, setFilterWarGroup, setSelectedWiki } from './data/actions'

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
      token,
      timelineItems,
      mapItems,
      metaCounts,
      warGroups,
      lines,
      warsEarliestTime,
      warsLatestTime,
      filterEarliestTime,
      filterLatestTime,
      filterWarGroup,
      selectedWiki
    } = this.props

    return (
      <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>

        <Paper style={{ position: 'relative', padding: '0 18px', zIndex: 1 }}>
          <h3 style={{padding: 25, margin: 0, fontSize: '32px', color: 'rgb(42, 65, 113)'}}>
            Sapien Wars
            <span style={{fontSize: '16px', marginLeft: '25px', color: 'black'}}>
              {metaCounts.years} years, {metaCounts.war} wars, {metaCounts.battle} battles
            </span>
            <Acknowledgements />
          </h3>
        </Paper>

        <div style={{ position: 'relative', height: 'calc(100% - 70px)', width: '100%' }}>
          <div ref={node => (this.mapWrapper = node)} style={{ position: 'absolute', top: 0, bottom: '35%', left: 0, right: 0 }}>
            <Map
              token={token}
              ready={this._isMounted}
              height={this.state.height}
              width={this.state.width}
              mapItems={mapItems}
              lines={lines}
              earliestTime={filterEarliestTime}
              latestTime={filterLatestTime}
              selectedWiki={selectedWiki}
              dispatchSetSelectedWiki={this.props.dispatchSetSelectedWiki}
            />
          </div>

          <div style={{position: 'absolute', top: '65%', left: 0, right: 0, bottom: 0}}>
            <TimeLine
              models={this.props.models}
              timelineItems={timelineItems}
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
              dispatchSetSelectedWiki={this.props.dispatchSetSelectedWiki}
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
    dispatchSetFilterWarGroup: (...args) => dispatch(setFilterWarGroup(...args)),
    dispatchSetSelectedWiki: (...args) => dispatch(setSelectedWiki(...args))
  }
}

function mapStateToProps (state) {
  /* Fine for now */
  if (process.env.NODE_ENV === 'development') {
    console.log(state)
  }
  const {
    token,
    models,
    warGroups,
    warsEarliestTime,
    warsLatestTime,
    filterEarliestTime,
    filterLatestTime,
    filterWarGroup,
    metaCounts,
    selectedWiki
  } = state.mapView

  const modelArr = Object.values(models)
  const filteredWarGroups = filterWarGroups(Object.values(warGroups))
  const timelineItems = filterTimelineItems(modelArr, filterWarGroup, filterEarliestTime, filterLatestTime)
  const mapItems = filterMapItems(modelArr, filterWarGroup, filterEarliestTime, filterLatestTime)

  // const lines = makeLines(mapItems, warsLatestTime && warsLatestTime.diff(warsEarliestTime))

  return {
    token,
    models,
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
    selectedWiki
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView)
