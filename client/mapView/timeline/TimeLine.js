import compact from 'lodash/compact'
import React from 'react'
import { colorInterpolator, formatMomentDate, getTimelineDates } from '../utils'
import Paper from '@material-ui/core/Paper'
import Slider from './Slider'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
const SELECT_ALL = 'All Wars'

const TWENTY_YEARS = 1000 * 60 * 60 * 24 * 365 * 20

export default class TimeLine extends React.Component {
  constructor (props) {
    super(props)

    this.convertTimeToPercent = this.convertTimeToPercent.bind(this)
    this.onChangeLeftPosition = this.onChangeLeftPosition.bind(this)
    this.onChangeRightPosition = this.onChangeRightPosition.bind(this)
    this.onFilterGroup = this.onFilterGroup.bind(this)
    this.renderTimeline = this.renderTimeline.bind(this)
    this.renderTimelineItems = this.renderTimelineItems.bind(this)
    this.renderWarGroupSelector = this.renderWarGroupSelector.bind(this)
  }

  convertTimeToPercent (time) {
    const { warsEarliestTime, warsLatestTime } = this.props
    const fromStart = time.diff(warsEarliestTime)
    return fromStart / warsLatestTime.diff(warsEarliestTime)
  }

  onChangeLeftPosition (percent) {
    const { warsEarliestTime, warsLatestTime } = this.props
    const range = warsLatestTime.diff(warsEarliestTime)
    this.props.dispatchSetFilterEarliestTime(warsEarliestTime.clone().add(range * percent))
  }

  onChangeRightPosition (percent) {
    const { warsEarliestTime, warsLatestTime } = this.props
    const range = warsLatestTime.diff(warsEarliestTime)
    this.props.dispatchSetFilterLatestTime(warsEarliestTime.clone().add(range * percent))
  }

  onFilterGroup (event) {
    const value = event.target.value === SELECT_ALL
      ? null
      : event.target.value
    this.props.dispatchSetFilterWarGroup(value)
  }

  renderWarGroupSelector () {
    const wikiIds = this.props.warGroups.map(group => {
      const style = {
        padding: '4px 15px',
        fontSize: '14px'
      }
      return (
        <MenuItem
          key={group.id}
          value={group.id}
          style={style}
        >
          {group.label} - ({group.children.length} conflicts)
        </MenuItem>
      )
    })

    const value = this.props.filterWarGroup
      ? this.props.filterWarGroup
      : SELECT_ALL

    return (
      <Select
        value={value}
        onChange={this.onFilterGroup}
        style={{ fontSize: '14px', position: 'relative', top: '5px', fontWeight: 'bold' }}
        disableUnderline>
        <MenuItem value={SELECT_ALL}>
          <em>Show All Wars</em>
        </MenuItem>
        {wikiIds}
      </Select>
    )
  }

  renderTimeline () {
    const { warsEarliestTime, warsLatestTime } = this.props

    const timeFrame = warsLatestTime.diff(warsEarliestTime)

    const timeViews = getTimelineDates(warsEarliestTime, warsLatestTime).map(momentTime => {
      const fromStart = momentTime.diff(warsEarliestTime) / timeFrame

      const style = {
        position: 'absolute',
        fontSize: '12px',
        top: '0px',
        left: `calc(${fromStart * 100}% - 40px)`,
        width: 80
      }

      return (
        <span style={style}>
          {formatMomentDate(momentTime)}
        </span>
      )
    })

    return (
      <div style={{ padding: '20px', whiteSpace: 'nowrap', zIndex: 0 }}>
        {timeViews}
      </div>
    )
  }

  renderTimelineItems (timelineItems) {
    const { filterEarliestTime, filterLatestTime, dispatchSetSelectedWiki } = this.props

    const timeFrame = filterLatestTime.diff(filterEarliestTime)

    return timelineItems.map((battle, index) => {
      const fromStart = battle.startTimeMoment.diff(filterEarliestTime) / timeFrame
      const width = battle.endTimeMoment.diff(battle.startTimeMoment) / timeFrame
      const color = `rgba(${colorInterpolator(fromStart).join(',')},.5)`

      const minWidth = Math.max(width * 100, 0.25)
      const fromLeft = fromStart * 100 + minWidth < 100
        ? fromStart * 100
        : 100 - minWidth

      const rowStyle = {
        position: 'relative',
        height: 25

      }

      const barStyle = {
        display: 'inline-block',
        position: 'absolute',
        left: `${fromLeft}%`,
        background: color,
        height: 22,
        width: `${minWidth}%`
      }

      const textWrapper = {
        cursor: 'pointer',
        display: 'inline-block',
        position: 'absolute',
        left: `${fromLeft}%`,
        overflowX: 'visible',
        whiteSpace: 'nowrap',
        color: 'black',
        fontSize: '14px',
        height: 25,
        width: 0
      }

      const textStyle = {
        position: 'absolute',
        color: 'rgb(42, 65, 113)'
      }

      const numStyle = {
        display: 'inline-block',
        position: 'absolute',
        top: '2px',
        left: '-15px',
        fontSize: '12px',
        color: 'rgb(180,180,180)'
      }

      if (fromStart < 0.5) {
        textStyle.left = 0
      } else {
        textStyle.right = 5
      }

      const partOf = compact(battle.part_of.map(id =>
        this.props.models[id] && this.props.models[id].label
      ))

      const partOfView = !!partOf.length && (
        <span style={{fontWeight: 'bold', color: 'black', marginRight: '3px'}}>
          [{partOf.join(', ')}]
        </span>
      )

      const fromTime = battle.endTimeMoment.diff(battle.startTimeMoment) > 100 && (
        <span>
          <span style={{margin: '0 3px'}}>for</span>
          {battle.endTimeMoment.from(battle.startTimeMoment, true)}
        </span>
      )

      return (
        <div style={rowStyle}>
          <span style={numStyle}>{index + 1}</span>
          <span style={barStyle} />
          <span style={textWrapper} onClick={() => dispatchSetSelectedWiki(battle.wikiId)}>
            <span style={textStyle}>
              {partOfView}
              {battle.label}
              <span style={{marginLeft: '7px', color: 'black'}}>
                {formatMomentDate(battle.startTimeMoment)}
                {fromTime}
              </span>
            </span>
          </span>
        </div>
      )
    })
  }

  render () {
    const { timelineItems, warsLatestTime, warsEarliestTime, filterEarliestTime, filterLatestTime } = this.props

    if (!warsEarliestTime || !filterEarliestTime) {
      return false
    }

    const isLessThanTwentyYears = TWENTY_YEARS > warsLatestTime.diff(warsEarliestTime)

    return (
      <div>
        <Paper style={{
          display: 'flex',
          borderBottom: '1px solid rgb(230,230,230)',
          borderTop: '1px solid rgb(230,230,230)',
          marginBottom: '5px',
          zIndex: -2
        }}>

          <div style={{ flexGrow: 2, padding: '0 10px', maxWidth: 360 }}>
            {this.renderWarGroupSelector()}
          </div>

          <div style={{ flexGrow: 8, marginRight: 72 }}>
            <Slider
              leftLabel={formatMomentDate(filterEarliestTime, isLessThanTwentyYears)}
              rightLabel={formatMomentDate(filterLatestTime, isLessThanTwentyYears)}
              leftHandlePosition={this.convertTimeToPercent(filterEarliestTime)}
              rightHandlePosition={this.convertTimeToPercent(filterLatestTime)}
              onChangeRightPosition={this.onChangeRightPosition}
              onChangeLeftPosition={this.onChangeLeftPosition}>
              {this.renderTimeline()}
            </Slider>
          </div>

        </Paper>

        <div style={{
          position: 'absolute',
          top: '50px',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '0 10px 40px 25px',
          overflowY: 'scroll'
        }}>
          {this.renderTimelineItems(timelineItems)}
        </div>
      </div>
    )
  }
}
