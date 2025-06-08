import React, {Fragment} from 'react'
import DeckGL, {LineLayer, IconLayer, TextLayer, ArcLayer} from 'deck.gl'
import MapGL from 'react-map-gl'
import { colorInterpolator } from '../utils'
import BattleDetails from './BattleDetails'
import SelectedWiki from './SelectedWiki'
import CircularProgress from '@material-ui/core/CircularProgress'

export default class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      viewport: {
        latitude: -22.2751,
        longitude: 43.9144,
        zoom: 1.7,
        bearing: 0,
        pitch: 55
      },
      hoverInfo: null
    }
    this.hoverBattle = this.hoverBattle.bind(this)
  }

  // _onHover(info) {
  //   const hoverInfo = info.sample ? info : null;
  //   if (hoverInfo !== this.state.hoverInfo) {
  //     this.setState({hoverInfo});
  //   }
  // }
  hoverBattle (data) {
    if (data.object) {
      this.setState({ hoverInfo: { row: data.object, x: data.x, y: data.y } })
    }
  }
  render () {
    const { viewport, hoverInfo } = this.state
    const { token, ready, width, height, mapItems, earliestTime, latestTime, selectedWiki } = this.props

    if (!ready || !token) {
      return (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <CircularProgress style={{ width: 80, height: 80, color: 'rgb(42, 65, 113)' }} />
        </div>
      )
    }

    const tooltip = hoverInfo && (
      <div style={{ display: 'inline-box', position: 'absolute', zIndex: 2, top: hoverInfo.y, left: hoverInfo.x }}>
        <BattleDetails selectedBattle={hoverInfo.row} />
      </div>
    )

    const iconLayer = new IconLayer({
      data: mapItems,
      pickable: true,
      iconAtlas: 'location-icon-atlas.png',
      iconMapping: {
        marker: {
          x: 0,
          y: 0,
          width: 128,
          height: 128,
          anchorY: 128,
          mask: true
        }
      },
      sizeScale: 15,
      getPosition: d => d.coordinates,
      getIcon: d => 'marker',
      getSize: d => {
        if (d.wikiId === selectedWiki) {
          return 5
        }
        if (mapItems.length > 400) {
          return d.type_label === 'war' ? 2 : 1.25
        }
        return d.type_label === 'war' ? 3 : 2
      },
      onHover: this.hoverBattle,
      getColor: d => {
        if (d.wikiId === selectedWiki) {
          return [255, 255, 0]
        }
        if (d.type_label === 'war') {
          return [42, 65, 113]
        }
        if (!earliestTime || !d.startTimeMoment || !d.endTimeMoment) {
          return [200, 200, 200]
        }
        const timeFrame = latestTime.diff(earliestTime)
        const fromStart = d.startTimeMoment.diff(earliestTime)
        return colorInterpolator(fromStart / timeFrame)
      }
    })

    return (
      <Fragment>
        <SelectedWiki />
        {tooltip}
        <MapGL
          {...viewport}
          width={width}
          height={height}
          mapboxApiAccessToken={token}
          onViewportChange={(viewport) => this.setState({ viewport, hoverInfo: null })}>
          <DeckGL
            {...viewport}
            width={width}
            height={height}
            debug
            layers={[iconLayer]} />
        </MapGL>
      </Fragment>
    )
  }
}
