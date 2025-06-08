import React, {Fragment} from 'react'
import Paper from '@material-ui/core/Paper'
import { connect } from 'react-redux'
import CloseIcon from '@material-ui/icons/Close'
import { setSelectedWiki } from '../data/actions'

class SelectedWars extends React.Component {
  constructor (props) {
    super(props)
    this.renderContent = this.renderContent.bind(this)
  }
  renderContent () {
    const { selectedWiki } = this.props

    if (!selectedWiki.wikipediaUrl) {
      return <div style={{padding: '15px'}}>Wiki could not be found</div>
    }

    const mobileUrl = selectedWiki.wikipediaUrl.replace('en.wikipedia', 'en.m.wikipedia')

    return (
      <Fragment>
        <div style={{
          height: '22px',
          background: 'rgb(42, 65, 113)',
          color: 'white',
          paddingLeft: '10px',
          paddingTop: '1px'
        }}>
          <CloseIcon
            style={{ cursor: 'pointer', float: 'left', width: '20px', height: '20px', marginRight: '7px' }}
            onClick={() => this.props.dispatch(setSelectedWiki(null))}
          />
          Wikipedia Article
        </div>
        <div style={{
          position: 'absolute',
          top: '22px',
          bottom: 0,
          right: 0,
          left: 0,
          border: 0
        }}>
          <iframe src={mobileUrl} style={{ width: '100%', height: '100%', border: 0 }} />
        </div>
      </Fragment>
    )
  }
  render () {
    if (!this.props.selectedWiki) {
      return false
    }

    return (
      <Paper elevation={8} style={{
        position: 'absolute',
        right: '0',
        top: '-5px',
        bottom: '10px',
        width: '500px',
        zIndex: 1,
        overflowX: 'visible'
      }}>
        {this.renderContent()}
      </Paper>
    )
  }
}

function mapStateToProps (state) {
  const selectedWiki = state.mapView.models[state.mapView.selectedWiki]
  return { selectedWiki }
}

export default connect(mapStateToProps)(SelectedWars)
