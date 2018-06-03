import React from 'react'
import Paper from '@material-ui/core/Paper'
import { formatMomentDate } from '../utils'
import { connect } from 'react-redux'

const Row = props => {
  return (
    <div style={{paddingBottom: '4px', fontSize: '12px'}}>
      <span style={{ fontWeight: 'bold' }}>{props.label}: </span>
      {props.value}
    </div>
  )
}

class BattleDetails extends React.Component {
  render () {
    const { selectedBattle, wars, warGroups } = this.props

    if (!selectedBattle) {
      return false
    }

    const warViews = false && selectedBattle.part_of.map(id => {
      const model = wars[id] || warGroups[id]
      if (!model) {
        return false
      }
      return <span key={id}>{model.label}</span>
    })

    return (
      <Paper>
        <div style={{padding: 5, borderBottom: '1px solid rgb(230,230,230)', color: 'rgb(42, 65, 113)', fontSize: 14}}>
          {selectedBattle.label}
        </div>
        <div style={{padding: 5}}>
          <Row label='Wars' value={warViews} />
          <Row label='Start' value={formatMomentDate(selectedBattle.startTimeMoment)} />
          <Row label='End' value={formatMomentDate(selectedBattle.endTimeMoment)} />
          <Row label='Location' value={selectedBattle.location_label} />
        </div>
      </Paper>
    )
  }
}

function mapStateToProps (state) {
  return {
    wars: state.mapView.wars,
    warGroups: state.mapView.warGroups
  }
}

export default connect(mapStateToProps)(BattleDetails)
