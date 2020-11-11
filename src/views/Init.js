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
	Dimensions,
}	from 'react-native';
import GlobalColors from '../colors/GlobalColors';
import useApiKitsu from './../utils/useApiKitsu';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const Init = () => {
  const [loading,setLoading] = useState(false);
	const [dimensions, setDimensions] = useState({ window, screen });

	const {getAnimeData} = useApiKitsu();
  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };
  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });
	useEffect(() => {
		setLoading(true)
		getFromApi();
  },[]);



	const getFromApi = () => {
    getAnimeData("https://kitsu.io/api/edge/anime?filter%5Bcategories%5D=adventure&page%5Blimit%5D=10&page%5Boffset%5D=0",(res)=> {
      let jsonResponse = JSON.parse(res);
      let seriesData = jsonResponse.data;
			var arrayRecoveredData = seriesData.map(element => element);
			setLoading(false);
			Actions.home({text: 'Hello World!', dataApi:arrayRecoveredData, nextLink:jsonResponse.links.next });
    }, (err) => {
      console.log("Respuesta no exitosa ",err);
    });
  }


  return (
    <View style={styles.container}>
			<View style={styles.containerUpper}>
				<View style={styles.containerTitle}>
					<Text>
						Coding Challenge Project
					</Text>
				</View>
				<View style={styles.containerLogo}>
					<Image
						source={require('../images/applaudo_logo.png')}
						style={{
							height:dimensions.window.height*0.30,
							width:dimensions.window.height*0.30,
						}}
					/>
				</View>
			</View>
			<View style={styles.containerLoading}>
				<ActivityIndicator visible={loading} size='large' color={GlobalColors.SecondaryColor}/>
			</View>
    </View>
  );
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: GlobalColors.PrimaryColor,
		flex: 1
	},
	containerUpper: {
		backgroundColor: "transparent",
		flex: 2,
		alignItems:'center',
    justifyContent:'center',
	},
	containerLogo: {
		backgroundColor: "transparent",
		flex: 5,
		alignItems:'center',
    justifyContent:'center',
	},
	containerTitle: {
		backgroundColor: "transparent",
		flex: 1,
		alignItems:'center',
    justifyContent:'center',
	},
	containerLoading: {
		backgroundColor: "transparent",
		flex: 1,
		alignItems:'center',
    justifyContent:'center',
	},
});

export default Init;
