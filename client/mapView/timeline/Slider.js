import React from 'react'

const HANDLE_WIDTH = 6

export default class Slider extends React.Component {
  constructor (props) {
    super(props)
    this.onLeftHandleMouseDown = this.onLeftHandleMouseDown.bind(this)
    this.onDoneDraggingLeftHandle = this.onDoneDraggingLeftHandle.bind(this)
    this.onLeftHandleMouseMove = this.onLeftHandleMouseMove.bind(this)
    this.onRightHandleMouseDown = this.onRightHandleMouseDown.bind(this)
    this.onDoneDraggingRightHandle = this.onDoneDraggingRightHandle.bind(this)
    this.onRightHandleMouseMove = this.onRightHandleMouseMove.bind(this)
  }

  /* Left Handle */
  onLeftHandleMouseDown () {
    document.addEventListener('mousemove', this.onLeftHandleMouseMove)
    document.addEventListener('mouseup', this.onDoneDraggingLeftHandle, { once: true })
  }

  onDoneDraggingLeftHandle () {
    document.removeEventListener('mousemove', this.onLeftHandleMouseMove)
  }

  onLeftHandleMouseMove (event) {
    event.preventDefault()
    const { rightHandlePosition } = this.props
    const wrapperBounds = this.wrapper.getBoundingClientRect()
    const distanceFromLeft = event.pageX - wrapperBounds.x
    let leftPercent = distanceFromLeft / wrapperBounds.width

    if (leftPercent <= 0) {
      leftPercent = 0
    } else if (leftPercent > rightHandlePosition) {
      leftPercent = rightHandlePosition
    }

    this.props.onChangeLeftPosition(leftPercent)
  }

  /* Right Handle */
  onRightHandleMouseDown () {
    document.addEventListener('mousemove', this.onRightHandleMouseMove)
    document.addEventListener('mouseup', this.onDoneDraggingRightHandle, { once: true })
  }

  onDoneDraggingRightHandle () {
    document.removeEventListener('mousemove', this.onRightHandleMouseMove)
  }

  onRightHandleMouseMove (event) {
    event.preventDefault()
    const { leftHandlePosition } = this.props
    const wrapperBounds = this.wrapper.getBoundingClientRect()
    const distanceFromLeft = event.pageX - wrapperBounds.x
    let leftPercent = distanceFromLeft / wrapperBounds.width

    if (leftPercent > 1) {
      leftPercent = 1
    } else if (leftPercent < leftHandlePosition) {
      leftPercent = leftHandlePosition
    }

    this.props.onChangeRightPosition(leftPercent)
  }

  render () {
    const { leftHandlePosition, rightHandlePosition, leftLabel, rightLabel } = this.props

    const stylesHandle = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: HANDLE_WIDTH,
      background: 'rgba(42,65,113, .8)',
      cursor: 'ew-resize',
      boxShadow: '0px 1px 1px 1px rgba(100,100,100, .2)',
      zIndex: 1
    }

    const leftStyle = {
      ...stylesHandle,
      bottom: '-10px',
      left: `${100 * leftHandlePosition}%`
    }

    const rightStyle = {
      ...stylesHandle,
      top: '-10px',
      left: `calc(${100 * rightHandlePosition}%)`
    }

    const stylesLabel = {
      position: 'absolute',
      bottom: '5px',
      fontSize: '13px',
      whiteSpace: 'nowrap',
      color: 'rgb(42, 65, 113)'
    }

    const leftLabeStyles = {
      ...stylesLabel,
      left: `calc(${100 * leftHandlePosition}% - 70px)`
    }

    const rightLabeStyles = {
      ...stylesLabel,
      left: `calc(${100 * rightHandlePosition}% + 10px)`
    }

    const middleStyle = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      background: 'linear-gradient(to left, rgba(255, 122, 98, .5), rgba(255, 232, 98, .5))',
      left: `calc(${HANDLE_WIDTH}px + ${100 * leftHandlePosition}%)`,
      right: `${100 * (1 - rightHandlePosition)}%`
    }

    return (
      <div
        ref={node => (this.wrapper = node)}
        style={{ minHeight: '20px', position: 'relative', background: 'rgb(245,245,245)' }}
      >
        <span style={leftLabeStyles}>
          {leftLabel}
        </span>
        <span style={rightLabeStyles}>
          {rightLabel}
        </span>
        <span
          style={leftStyle}
          ref={node => (this.leftHandle = node)}
          onMouseDown={this.onLeftHandleMouseDown}
          role='img'
        />
        <span style={middleStyle} />
        <span
          style={rightStyle}
          ref={node => (this.rightHandle = node)}
          onMouseDown={this.onRightHandleMouseDown}
          role='img'
        />
        {this.props.children}
      </div>
    )
  }
}
