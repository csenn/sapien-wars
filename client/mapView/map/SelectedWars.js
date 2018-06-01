import React from 'react'
import Paper from '@material-ui/core/Paper'
import compact from 'lodash/compact'
import sortBy from 'lodash/sortBy'
import { connect } from 'react-redux'
import CloseIcon from '@material-ui/icons/Close'
import { setSelectedWars } from '../data/actions'

const Pill = props => (
  <div style={{ marginBottom: '10px' }}>
    <Paper onClick={props.onClick} style={{
      cursor: 'pointer',
      position: 'relative',
      padding: '4px 30px 4px 10px',
      display: 'inline-block',
      fontSize: '14px',
      whiteSpace: 'nowrap'
    }}>
      {props.label}
      <CloseIcon style={{
        position: 'absolute',
        right: '5px',
        top: '4px',
        color: 'rgb(160,160,160)',
        width: '18px',
        height: '18px'
      }} />
    </Paper>
  </div>
)

class SelectedWars extends React.Component {
  constructor (props) {
    super(props)
    this.onRemoveWar = this.onRemoveWar.bind(this)
  }
  onRemoveWar (id) {
    const wars = compact(this.props.selectedWars.map(war => {
      if (war.wikiId === id) {
        return false
      }
      return war.wikiId
    }))
    this.props.dispatch(setSelectedWars(wars))
  }
  render () {
    const { selectedWars } = this.props

    if (!selectedWars.length) {
      return false
    }

    const results = selectedWars.map(war => (
      <Pill key={war.wikiId} label={war.label} onClick={() => this.onRemoveWar(war.wikiId)} />
    ))

    return (
      <div style={{
        position: 'absolute',
        left: '15px',
        top: '15px',
        bottom: '25px',
        width: '10px',
        zIndex: 1,
        overflowX: 'visible'
      }}>
        <Pill
          label={<strong>Clear All</strong>}
          onClick={() => this.props.dispatch(setSelectedWars([]))} />
        {results}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const selectedWars = sortBy(
    state.mapView.selectedWars.map(id => state.mapView.wars[id]),
    war => war.startTimeMoment && war.startTimeMoment.valueOf()
  )
  return { selectedWars }
}

export default connect(mapStateToProps)(SelectedWars)
