import React from 'react'
import Paper from '@material-ui/core/Paper'
import { formatMomentDate } from '../utils'
import { connect } from 'react-redux'
import { setSelectedWiki } from '../data/actions'

const Row = props => {
  if (!props.value) {
    return false
  }
  return (
    <div style={{paddingBottom: '4px', fontSize: '12px'}}>
      <span style={{ fontWeight: 'bold' }}>{props.label}: </span>
      {props.value}
    </div>
  )
}

class BattleDetails extends React.Component {
  render () {
    const { selectedBattle, models } = this.props

    if (!selectedBattle) {
      return false
    }

    const warViews = selectedBattle.part_of.map(id => {
      const model = models[id]
      if (!model) {
        return false
      }
      return <span key={id}>{model.label}</span>
    })

    return (
      <Paper>
        <div style={{padding: '5px 10px', borderBottom: '1px solid rgb(230,230,230)', color: 'rgb(42, 65, 113)', fontSize: 14}}>
          {selectedBattle.label}
        </div>
        <div style={{padding: '5px 10px'}}>
          <Row label='Wars' value={warViews} />
          <Row label='Start' value={formatMomentDate(selectedBattle.startTimeMoment)} />
          <Row label='End' value={formatMomentDate(selectedBattle.endTimeMoment)} />
          <Row label='Location' value={selectedBattle.location_label} />
          <div
            style={{ cursor: 'pointer', padding: '4px 0', fontSize: '12px', fontWeight: 'bold', color: 'rgb(42, 65, 113)' }}
            onClick={() => this.props.dispatch(setSelectedWiki(selectedBattle.wikiId))}
          >
            View More >
          </div>
        </div>
      </Paper>
    )
  }
}

function mapStateToProps (state) {
  return {
    models: state.mapView.models,
    warGroups: state.mapView.warGroups
  }
}

export default connect(mapStateToProps)(BattleDetails)
