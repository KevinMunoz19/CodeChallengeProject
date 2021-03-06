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
	Dimensions,
	FlatList,
	ScrollView,
	BackHandler,
}	from 'react-native';
import useApiKitsu from './../utils/useApiKitsu';
import GlobalColors from '../colors/GlobalColors';
import SerieDisplay from '../components/SerieDisplay';
import SerieDisplayPureComponent from '../components/SerieDisplayPureComponent';
import Icon from "react-native-vector-icons/MaterialIcons";
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const Home = (props) => {
  const [loading,setLoading] = useState(false);
	const [dimensions, setDimensions] = useState({ window, screen });
	const [dataFL,setDataFL] = useState([]);
	const [dataFLPopular,setDataFLPopular] = useState([]);
	const [dataFLRating,setDataFLRating] = useState([]);
  const [isRefreshing,setIsRefreshing] = useState(false);
	const [apiURL,setApiURL] = useState("");
	const {getAnimeData,getFromApiAsync} = useApiKitsu();
	const [serieGenres,setSerieGenres] = useState([]);
	const [serieEpisodes,setSerieEpisodes] = useState([]);
	const [singleSerieToDetail,setSingleSerieToDetail] = useState({});
	const [charList,setCharList] = useState([]);
	const [singleCharList,setSingleCharList] = useState([]);
	const [counter,setCounter] = useState(0);

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

	// Fetch single character data when counter or charList changes. Fetch until counter has the same value as the character array.
	// When counter and character array length is equal, navigate to details view and pass data as props
	useEffect(() => {
    if(charList.length != 0){
			if(counter < charList.length){
				var urlActual = charList[counter].singleCharacterLink;
				getFromApiAsync(urlActual,"singleCharacter").then(response => {
					if (response.length != 0){
						setSingleCharList([...singleCharList,response]);
						setCounter(counter+1);
					} else {
						Alert.alert("Sorry, ","We could not retrieve the data for characters")
						setLoading(false);
					}
				});
			}
			if (counter==charList.length){
				var singleSerieToDetailUpdated = singleSerieToDetail;
				singleSerieToDetailUpdated.characters.singleCharacterList = [...singleCharList]
				Actions.details({singleSerie: singleSerieToDetailUpdated });
				setCharList([]);
				setCounter(0);
				setSingleCharList([]);
				setLoading(false);
			}
		}
  },[charList,counter]);

	// Save API URL for next data page (paginated data, 20 records) and series data passed from init view (Action props).
	useEffect(()=>{
		setApiURL(props.nextLink);
		setDataFL([ ...dataFL, ...props.dataApi]);
		setDataFLPopular([ ...dataFLPopular, ...props.dataApiPopular]);
		setDataFLRating([ ...dataFLRating, ...props.dataApiRating]);
	},[]);

	// Render item for flatlist, using pure component serie display.
	// Props for component are tittles, on press function and bool to disable TouchableOpacity.
	const renderItem = ({ item }) => (
		<SerieDisplayPureComponent displayImage={item.mediumImage} titleEn={item.attr.titles.en} titleEnJp={item.attr.titles.en_jp} titleJa={item.attr.titles.ja_jp} titleCa={item.attr.titles.canonicalTitle} onPress={() => onSeriesSelected(item)} disabledTouch={loading}/>
  );

	// Function triggered when flat list item is pressed.
	// Fetch genres, episode list and character list. Change in charList array triggers use effect to fetch isngle character info.
  const onSeriesSelected = (itemData) => {
		setLoading(true);
		getFromApiAsync(itemData.attr.genres, "genres").then(response =>{
			if (response.length != 0){
				response.pop();
				itemData.attr.genresList= [...response];
				getFromApiAsync(itemData.episodes.episodeListLink,"episodeList").then(response =>{
					if (response.length != 0){
						var nextEpUrl = response.pop();
						itemData.episodes.episodesList= [...response];
						itemData.episodes.episodesNextBatchUrl = nextEpUrl;
						getFromApiAsync(itemData.characters.characterListLink,"characterList").then(response =>{
							if (response.length != 0){
								response.pop();
								itemData.characters.charactersList= [...response];
								setCharList([...response]);
								setSingleSerieToDetail(itemData);
							} else {
								Alert.alert("Sorry, ","We could not retrieve the data for characters")
								setLoading(false);
							}
						})
					} else {
						Alert.alert("Sorry, ","We could not retrieve the data for episodes")
						setLoading(false);
					}
				})
			} else {
				Alert.alert("Sorry, ","We could not retrieve the data for genres")
				setLoading(false);
			}
		})
  }

	// Navigate to search view.
	const goToSearch = () => {
		Actions.search();
	}

  return (
    <View style={styles.container}>
			<View style={{...styles.headerContainer,width:dimensions.window.width,height:dimensions.window.height*0.1}}>
				<View style={{flex:1, backgroundColor:"transparent", alignItems:"center", justifyContent:"center"}}>
					<Image
						source={require('../images/applaudo_logo.png')}
						style={{
							height:dimensions.window.height*0.08,
							width:dimensions.window.height*0.08,
						}}
					/>
				</View>
				<View style={{flex:3, backgroundColor:"transparent", justifyContent:"center", alignItems:"flex-end", padding:10}}>
					<TouchableOpacity onPress={goToSearch}>
				    <Icon name="search" color={"white"} size={dimensions.window.height*0.05}/>
				  </TouchableOpacity>
				</View>
			</View>
			<View style={{...styles.bodyContainer,width:dimensions.window.width,height:dimensions.window.height*0.9}}>
				<ScrollView style={{flex:1}}>
					<View style={{flex:1, backgroundColor:"transparent"}}>
						<Text style={styles.flatListTitle}>
							Anime
						</Text>
						<FlatList
							data={dataFL}
							renderItem={renderItem}
							keyExtractor={item => item.id}
							horizontal={true}
							showsVerticalScrollIndicator ={false}
							showsHorizontalScrollIndicator={false}
						/>
					</View>

					<View style={{flex:1, backgroundColor:"transparent"}}>
						<Text style={styles.flatListTitle}>
							Most Popular
						</Text>
						<FlatList
							data={dataFLPopular}
							renderItem={renderItem}
							keyExtractor={item => item.id}
							horizontal={true}
							showsVerticalScrollIndicator ={false}
							showsHorizontalScrollIndicator={false}
						/>
					</View>

					<View style={{flex:1, backgroundColor:"transparent"}}>
						<Text style={styles.flatListTitle}>
							Best Rating
						</Text>
						<FlatList
							data={dataFLRating}
							renderItem={renderItem}
							keyExtractor={item => item.id}
							horizontal={true}
							showsVerticalScrollIndicator ={false}
							showsHorizontalScrollIndicator={false}
						/>
					</View>
				</ScrollView>
				{(loading)&&(
					<ActivityIndicator visible={loading} size={100} color={GlobalColors.ComplementaryColor} style={{position:"absolute"}}/>
				)}
			</View>
    </View>
  );
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: GlobalColors.PrimaryColor,
		flex: 1,
	},
	headerContainer: {
		backgroundColor: GlobalColors.SecondaryColor,
		flexDirection:"row",
	},
	bodyContainer: {
		backgroundColor: "transparent",
		padding:8,
		justifyContent:"center",
		alignItems:"center",
	},
	flatListTitle: {
		color:GlobalColors.LetterColor,
		fontSize:30,
		fontFamily:"Dosis-Regular",
		marginVertical:20,
		marginHorizontal:10,
	}
});

export default Home;
