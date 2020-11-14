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
	const [dataPrev,setDataPrev] = useState([]);
  const [apiURL,setApiURL] = useState("https://kitsu.io/api/edge/anime?page%5Blimit%5D=20&page%5Boffset%5D=0");
	const [count,setCount] = useState(0);
	const {getAnimeData,getFromApiAsync} = useApiKitsu();

  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };

	useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

	// Trigger with change in data recovered from API. Get last 60 records by calling three times, pagination 20.
  useEffect(()=>{
		setLoading(true)
    if(count < 3){
      apiCon();
    } else {
    	setLoading(false);
			Actions.home({dataApi:dataPrev, nextLink: apiURL});
    }
	},[dataPrev]);

	// Call API, wait for result andcombine it with previous data. Add 1 to counter.
	const apiCon = () => {
    getFromApiAsync(apiURL,"series").then(response => {
			console.log("response ",response.length)
			var newUrl = response.pop();
			console.log("response ",response.length)
			setApiURL(newUrl);
      setCount(count+1);
      setDataPrev([...dataPrev, ...response])
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
