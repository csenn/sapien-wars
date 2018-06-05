import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

export default class Acknowledgements extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isOpen: false }

    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
  }
  handleOpen () {
    this.setState({ isOpen: true })
  }
  handleClose () {
    this.setState({ isOpen: false })
  }
  render () {
    return (
      <span style={{float: 'right'}}>
        <Button onClick={this.handleOpen} variant='contained' style={{ textTransform: 'none', fontSize: '16px' }}>
          Acknowledgements
        </Button>

        <Dialog open={this.state.isOpen} onClose={this.handleClose}>
          <div style={{ minWidth: '500px', padding: '40px' }}>
            Special thanks to all those that have entered data into <a target='_blank' href='https://www.wikidata.org/wiki/Wikidata:Main_Page'> WikiData </a> providing
            the raw data for this site, to the contributors
            at <a target='_blank' href='https://www.mapbox.com/'> MapBox </a> and <a target='_blank' href='https://www.openstreetmap.org/'> OpenStreetMaps </a>
            for building beautiful maps, and the visualization team at Uber for open sourcing
            <a target='_blank' href='http://uber.github.io/deck.gl/#/'> Deck.gl</a>.
            <div style={{marginTop: '15px'}}>
              Each dot on this map represents the lives of hundreds or thousands of men and women. Contained within this small visualization are innumerable
              brave deeds, sacrifices for greater ideals, moments of honor, acts of pitliess atrocity, and instances
              of both rising hope and utter hopelessness.
            </div>
            <div style={{marginTop: '15px'}}>
              To live in a time where the lives and deeds of millions
              can be summarized on a small pixelated screen is a great gift.
            </div>
            <div style={{marginTop: '15px'}}>
              <a target='_blank' href='https://github.com/csenn/sapien-wars'>
                Also thanks to all open source contributors
              </a>
            </div>
          </div>
        </Dialog>
      </span>
    )
  }
}
