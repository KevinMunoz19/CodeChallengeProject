import React, { useState, useEffect } from 'react';
import { Actions } from 'react-native-router-flux';
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Image,
	ImageBackground,
	ActivityIndicator,
  Alert,
}	from 'react-native';

const Home = () => {

  const [loading,setLoading] = useState(false);
  const openDetailsView = () => Actions.details({text: 'Hello World!', message: 'AAAAA'});

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator visible={false} size='large' color={red}/>
          <Text allowFontScaling={false}>Cargando...</Text>
        </View>
      )}
      {!loading && (
        <View style={styles.textHeaderContainer}>
          <Text style={{ ...styles.textHeader, fontSize:30}} allowFontScaling={false}>Home</Text>
        </View>
      )}
      {!loading && (
        <React.Fragment>
          <View style={styles.imageContainer}>

          </View>
          <TouchableOpacity style={styles.sendButton} onPress={openDetailsView}>
            <Text style={{color:"black", textAlign:'center', fontSize:25}} allowFontScaling={false}>AAAA</Text>
          </TouchableOpacity>
        </React.Fragment>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "black",
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: "white",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: "black",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: "pink",
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: "blue",
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default Home;
