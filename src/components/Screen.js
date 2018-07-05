import React, { Component } from 'react'
import { Animated,Dimensions,ScrollView,StyleSheet,Text, View, Easing } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from 'react-native-elements'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'


import { changeActiveScrollItem} from '../actions'


class Screen extends Component {

  render = () => {
    const props = this.props
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (
    <View style={styles.scrollPage}>
      <Animated.View style={[styles.screen, this.transitionAnimation(props.index)]}>
        <View style={{
          justifyContent: 'space-around',
          height: 200,
          alignItems: 'center'
        }}>
            <GestureRecognizer
              onSwipeUp={(state) => this.onSwipeUp(state)}
              onSwipeDown={(state) => this.onSwipeDown(state)}
              config={config}
              style={{
                flex: 1,
                backgroundColor: this.state.backgroundColor
              }}
            >
            <Text style={styles.text} onPress={this.handleAnimateSlide}>{props.text}</Text>

          </GestureRecognizer>
          <Button
            title="EXPLORE TRACK"
            loadingProps={{ size: "large", color: "rgba(111, 202, 186, 1)" }}
            // titleStyle={{ fontWeight: "700", fontSize: 70 }}
            fontSize={16}
            color='#378287'
            buttonStyle={{
              backgroundColor: "rgba(92, 99,216, 0)",
              padding: 10,
              borderColor: '#378287',
              borderWidth: 2,
              borderRadius: 5
            }}
            onPress={()=>props.exploreTrack(props.index)}
          />
        </View>
      </Animated.View>
    </View>
  )}

  constructor(props) {
    super(props)
    this.state = {
      gestureName: 'none',
    }
  }

  handleAnimateSlide = () => {
    console.log(this.props.displaySize)
    if (this.props.displaySize === HALF) this.props.animateSlide(HALF,FULL)
    if (this.props.displaySize === FULL) this.props.animateSlide(FULL,HALF)
  }

  onSwipeUp(gestureState) {
    if (this.props.displaySize === HALF) this.props.animateSlide(HALF,FULL)
    console.log('up')
  }

  onSwipeDown(gestureState) {
    if (this.props.displaySize === FULL) this.props.animateSlide(FULL,HALF)
    console.log('down')
  }

  transitionAnimation = index => {
    const xOffset = this.props.xOffset
    return {
      transform: [
        { perspective: 800 },
        {
          scale: xOffset.interpolate({
            inputRange: [
              (index - 1) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 1) * SCREEN_WIDTH
            ],
            outputRange: [0.25, 1, 0.25]
          })
        },
        {
          rotateX: xOffset.interpolate({
            inputRange: [
              (index - 1) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 1) * SCREEN_WIDTH
            ],
            outputRange: ["45deg", "0deg", "45deg"]
          })
        },
        {
          rotateY: xOffset.interpolate({
            inputRange: [
              (index - 1) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 1) * SCREEN_WIDTH
            ],
            outputRange: ["-45deg", "0deg", "45deg"]
          })
        }
      ]
    }
  }

}



const SCREEN_WIDTH = Dimensions.get("window").width;
const MARGIN_TOP = 400
const SMALL_CONTENT_HEIGHT = 150
const HALF_THRESHOLD = SMALL_CONTENT_HEIGHT/MARGIN_TOP
const NONE = 'NONE'
const HALF = 'HALF'
const FULL = 'FULL'


const styles = StyleSheet.create({
  scrollPage: {
    width: SCREEN_WIDTH,
    padding: 20
  },
  screen: {
    height: 400,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "white"
  },
  text: {
    fontSize: 30,
    fontWeight: "bold"
  }
});


const mapStateToProps = ({activeScrollItem, trackData}) => ({activeScrollItem, trackData})
const mapDispatchToProps = dispatch => bindActionCreators({changeActiveScrollItem}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Screen)