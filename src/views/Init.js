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
	Alert,
	BackHandler,
}	from 'react-native';
import GlobalColors from '../colors/GlobalColors';
import useApiKitsu from './../utils/useApiKitsu';
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const Init = () => {
  const [loading,setLoading] = useState(false);
	const [dimensions, setDimensions] = useState({ window, screen });
	const [dataPrev,setDataPrev] = useState([]);
	const [dataPrevPopular,setDataPrevPopular] = useState([]);
	const [dataPrevRating,setDataPrevRating] = useState([]);
  const [apiURL,setApiURL] = useState("https://kitsu.io/api/edge/anime?page%5Blimit%5D=20&page%5Boffset%5D=0");
	const [apiURLPopular,setApiURLPopular] = useState("https://kitsu.io/api/edge/anime?sort=popularityRank");
	const [apiURLRating,setApiURLRating] = useState("https://kitsu.io/api/edge/anime?sort=-averageRating");
	const [count,setCount] = useState(0);
	const {getAnimeData,getFromApiAsync} = useApiKitsu();

	// Backhandler listener to prevent returning from home to init view.
	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', () => true)
		return () =>
			BackHandler.removeEventListener('hardwareBackPress', () => true)
	}, [])

	// OnChange funciton to detect change in orientation
  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };

	// Add listener to orientation change
	useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

	// Trigger with change in data recovered from API. Get last 60 records of anime by fetching three times (pagination 20).
	// Get last 30 records of anime with popularity filter by fetching three times (pagination 10).
	// Get last 30 records of anime with averageRating filter by fetching three times (pagination 10).
  useEffect(()=>{
		setLoading(true);
    if(count < 3){
      apiCon();
    } else {
    	setLoading(false);
			Actions.home({dataApi:dataPrev, nextLink: apiURL, dataApiPopular:dataPrevPopular,dataApiRating:dataPrevRating});
    }
	},[dataPrev]);


	// Call API, wait for result and merge it with previous data. Add 1 to counter.
	const apiCon = () => {
    getFromApiAsync(apiURL,"series").then(response => {
			if (response.length != 0){
				var newUrl = response.pop();
				setApiURL(newUrl);
	      setDataPrev([...dataPrev, ...response])
				getFromApiAsync(apiURLPopular,"series").then(response => {
					if (response.length != 0){
						var newUrl = response.pop();
						setApiURLPopular(newUrl);
			      setDataPrevPopular([...dataPrevPopular, ...response]);
						getFromApiAsync(apiURLRating,"series").then(response => {
							if (response.length != 0){
								var newUrl = response.pop();
								setApiURLRating(newUrl);
					      setCount(count+1);
					      setDataPrevRating([...dataPrevRating, ...response])
							} else {
								Alert.alert("Sorry, ","We could not retrieve data for the series, please try again later.")
								setLoading(false);
							}
				    });
					} else {
						Alert.alert("Sorry, ","We could not retrieve data for the series, please try again later.")
						setLoading(false);
					}
		    });
			} else {
				Alert.alert("Sorry, ","We could not retrieve data for the series, please try again later.")
				setLoading(false);
			}
    });
  }

  return (
    <View style={styles.container}>
			<View style={styles.containerUpper}>
				<View style={styles.containerTitle}>
					<Text style={styles.title}>
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
				{(loading)&&(
					<ActivityIndicator visible={loading} size={100} color={GlobalColors.ComplementaryColor}/>
				)}
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
		flex: 2,
		alignItems:'center',
    justifyContent:'center',
	},
	containerLoading: {
		backgroundColor: "transparent",
		flex: 1,
		alignItems:'center',
    justifyContent:'center',
	},
	title: {
		color:GlobalColors.LetterColor,
		fontSize:50,
		fontFamily:"Dosis-Bold"
	}
});

export default Init;
