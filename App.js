import React, {Component} from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { MapView, Constants, Location, Permissions  } from "expo";
export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    number: 0
  }

  onMove(){
    console.log('You moved!')
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
    setInterval(()=>this.setState({number: Math.random()}), 1000)
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    this.setState({ location });
    Location.watchPositionAsync({enableHighAccuracy: true, timeInterval: 500}, location=>{
      console.log('watchcall');
      this.setState({ location });
    })
  };

  render() {
    return (
      <MapView
        provider='google'
        style={{
          flex: 1
        }}
        showsUserLocation={true}
        initialRegion={{
          latitude: 47.620242,
          longitude: -122.349848,
          latitudeDelta: 0.09222,
          longitudeDelta: 0.1221
        }}
      >

        <MapView.Marker
          coordinate={{
            latitude: 47.667289,
            longitude: -122.383815
          }}
          title={`${this.state.number}`}
          description={'metadata'}
        />
        {
          this.state.location
          ? <MapView.Marker
              coordinate={this.state.location.coords}
              title={`${this.state.location ? [this.state.location.coords.latitude.toFixed(4), this.state.location.coords.longitude.toFixed(4)].join(',') : null }`}
              description={'metadata'}
            />
          : null
        }
      </MapView>

    );
  }
}
