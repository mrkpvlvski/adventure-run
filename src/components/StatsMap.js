import React, {Component} from "react"
import { StyleSheet, Text, View, Dimensions } from "react-native"
import { Icon } from 'react-native-elements'
import { MapView, Constants, Location, Permissions } from 'expo'


class StatsMap extends Component {
  render() {
   return (
      <MapView
        provider='google'
        style={styles.map}
        initialRegion={this.state.region}
        ref={ref => { this.statsMapView = ref }}
        onRegionChange	= {region => this.setState({region})}
      >
        {this.renderCheckpoints(this.props.checkpoints)}
        {this.props.path.length
        ? <MapView.Polyline
          coordinates={this.props.path}
          strokeColor="#000"
          strokeWidth={10}
        />
        : null}
      </MapView>
    )
  }

  constructor(props){
    super(props)
    this.state = {
      location: {
        latitude: 47.680471,
        longitude: -122.328945,
      },
      region: {
        ...this.getLatLong(props.latlong),
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }
    }
    this.statsMapView = null
  }

  componentDidMount(){
    console.log('!>', this.props.checkpoints)
    this.initialTimeout = setTimeout(() => this.fitToMarkers(this.props.checkpoints), 300)
    console.log('mounted');
    this.props.registerCallback(this.fitToMarkers)
  }

  componentWillUnmount(){
    clearInterval(this.initialTimeout)
  }


  fitToMarkers = (locations = this.props.checkpoints) => {
    coordinates = locations.map(location => this.getLatLong(location.latlong))
    this.statsMapView.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 50,
        right: 40,
        bottom: 50,
        left: 40
      }
    })
  }

  renderCheckpoints = (checkpoints) => {
    console.log('!?!?!?',`${this.statsMapView}`)
    return checkpoints.map((checkpoint,idx) => (
      <MapView.Marker
        coordinate={this.getLatLong(checkpoint.latlong)}
        key={idx}
      />
    ))
  }

  getLatLong(latlong){
    return (
      {
        latitude: latlong.split(', ')[0]*1,
        longitude: latlong.split(', ')[1]*1
      }
    )
  }


}


const styles = StyleSheet.create({
  map: {
    // flex: 1,
    height: 250,
    marginBottom: -30
  }
})


export default StatsMap
