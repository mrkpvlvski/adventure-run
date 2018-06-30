import React, {Component} from "react"
import {connect} from 'react-redux'
import { Platform, StyleSheet, Text, View } from "react-native"
import { MapView, Constants, Location, Permissions  } from "expo"
import { Icon } from 'react-native-elements'


class Map extends Component {

  DISTANCE_THRESHOLD = 10
  state = {
    location: null,
    region: {
      latitude: 47.599815,
      longitude:  -122.331373,
      latitudeDelta: 0.006222,
      longitudeDelta: 0.008221
    },
    errorMessage: null,
    number: 0,
    coordinates: [],
    checkpoints: [
      {
        name: 'Occidental Square',
        order: 1,
        latitude: 47.600434,
        longitude: -122.333188,
        visited: false
      },
      {
        name: 'Waterfall Garden Park',
        order: 2,
        latitude: 47.600111,
        longitude: -122.331692,
        visited: false
      },
      {
        name: 'Cafe Zeitgeist',
        order: 3,
        latitude: 47.599129,
        longitude: -122.331928,
        visited: false
      },
      {
        name: 'Galvanize',
        order: 4,
        latitude: 47.599155,
        longitude: -122.333778,
        visited: false
      },
    ]
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.timerId = setInterval(this.getLocationAsync,1000)
    }
  }
  componentWillUnmount() {
    clearInterval(this.timerId)
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true})
    this.setState({ location, coordinates: [...this.state.coordinates,location.coords] })
    this.testCheckpoints()
  }

  testCheckpoints(){
    const newCheckpoints = this.state.checkpoints.map(checkpoint => {
      const distance = this.getDistance(checkpoint, this.state.location.coords)
      if (!checkpoint.visited && distance < this.DISTANCE_THRESHOLD) {
        checkpoint = {...checkpoint, visited:true}
      }
      return checkpoint
    })
    this.setState({checkpoints: newCheckpoints})
  }


  getDistance(a,b){
    var R = 6371000; // metres
    var φ1 = a.latitude * (Math.PI / 180);
    var φ2 = b.latitude * (Math.PI / 180);
    var Δφ = φ2 - φ1
    var Δλ = (b.longitude-a.longitude)* (Math.PI / 180);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d
  }


  render = () => (
      <MapView
        provider='google'
        style={{
          flex: 1
        }}
        showsUserLocation
        // showsMyLocationButton
        initialRegion={this.state.region}
        ref={ref => { this.mapView = ref }}
        onRegionChange	= {region => {
          this.setState({region})
        }}
      >
        {/* {console.log(this.props)} */}
        {/* {this.mapView ? console.log(this.state.region) : null} */}
        {
          this.state.checkpoints.map((checkpoint, idx) =>
            <MapView.Marker
              key={idx}
              coordinate={checkpoint}
              title={`${checkpoint.name}`}
              description={`Checkpoint ${checkpoint.order}\n${this.state.location ? this.getDistance(this.state.location.coords,checkpoint).toFixed(0) : 0} meters away`}
            />
          )
        }
        {
          this.state.coordinates.length > 1
          ? <MapView.Polyline
          		coordinates={this.state.coordinates}
          		strokeColor="#000"
          		strokeWidth={6}
        	  />
          : null
        }
        {
          this.state.location
          ? <MapView.Marker
              coordinate={this.state.location.coords}
              title={`${this.state.location ? [this.state.location.coords.latitude.toFixed(4), this.state.location.coords.longitude.toFixed(4)].join(',') : null }`}
              description={'This is you!'}
            />
          : null
        }

      </MapView>
    )
}


const mapStateToProps = ({activePage}) => ({activePage})
export default connect(mapStateToProps)(Map)
