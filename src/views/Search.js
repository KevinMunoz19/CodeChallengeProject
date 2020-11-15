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
  TextInput,
}	from 'react-native';
import useApiKitsu from './../utils/useApiKitsu';
import GlobalColors from '../colors/GlobalColors';
import SerieDisplay from '../components/SerieDisplay';
import Icon from "react-native-vector-icons/MaterialIcons";
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const Item = ({ itemData, widthSt, onPress, disabledTouch }) => (
  <TouchableOpacity style={{...styles.item,width:widthSt,flexDirection:"row"}}  onPress={onPress} disabled={disabledTouch}>
    <View style={{width:widthSt*0.5,backgroundColor:"transparent"}}>
      <Image
        style={{height:((widthSt*0.9)/2),resizeMode: 'contain'}}
        source={{uri:itemData.mediumImage}}
      />
    </View>
    <View style={{width:widthSt*0.4,backgroundColor:"transparent", flexDirection:"column",justifyContent:"center" }}>
      <Text style={{...styles.title,paddingLeft:"8%",fontFamily:"Dosis-Medium"}}>{(itemData.attr.titles.en)?(itemData.attr.titles.en):(itemData.attr.titles.en_jp)?(itemData.attr.titles.en_jp):(itemData.attr.titles.ja_jp)?(itemData.attr.titles.ja_jp):(itemData.attr.titles.canonicalTitle)}</Text>
    </View>
  </TouchableOpacity>
);

const Search = () => {
  const [loading,setLoading] = useState(false);
	const [dimensions, setDimensions] = useState({ window, screen });
	const [dataFL,setDataFL] = useState([]);
  const [isRefreshing,setIsRefreshing] = useState(false);
	const [nextUrl,setNextUrl] = useState("");
	const {getAnimeData,getFromApiAsync} = useApiKitsu();
  const [searchResult,setSearchResult] = useState([]);
  const [searchText,setSearchText] = useState("");
  const [searching,setSearching] = useState(false);

	const [serieGenres,setSerieGenres] = useState([]);
	const [serieEpisodes,setSerieEpisodes] = useState([]);
	const [singleSerieToDetail,setSingleSerieToDetail] = useState({});
	const [charList,setCharList] = useState([]);
	const [singleCharList,setSingleCharList] = useState([]);
	const [counter,setCounter] = useState(0);

  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };
  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

  const renderItem = ({ item }) => (
    <Item itemData={item} widthSt={dimensions.window.width*0.8} onPress={() => onSeriesSelected(item)} disabledTouch={searching}/>
  );

  const getSearchQuery = () => {
    if(searchText.trim() != ""){
      var searchTextClean = searchText.trim();
      setSearching(true);
			getFromApiAsync(`https://kitsu.io/api/edge/anime?filter[text]=${searchTextClean}`,"series").then(response => {
				if (response.length != 0){
					var nextUrlFromResponse = response.pop();
					setNextUrl(nextUrlFromResponse);
					setSearchResult([...response ]);
					setSearching(false);
				} else {
					Alert.alert("Sorry, ","We could not retrieve data for your search.")
					setSearching(false);
				}
			})
    }
  }

	useEffect(() => {
    if(charList.length != 0){
			if(counter < charList.length){
				var urlActual = charList[counter].singleCharacterLink;
				getFromApiAsync(urlActual,"singleCharacter").then(response => {
					setSingleCharList([...singleCharList,response]);
					setCounter(counter+1);
				});
			}
			if (counter==charList.length){
				var singleSerieToDetailUpdated = singleSerieToDetail;
				singleSerieToDetailUpdated.characters.singleCharacterList = [...singleCharList]
				Actions.details({singleSerie: singleSerieToDetailUpdated });
				setCharList([]);
				setCounter(0);
				setSingleCharList([]);
				setSearching(false);
			}
		}
  },[charList,counter]);

	const onSeriesSelected = (itemData) => {
		setSearching(true);
		getFromApiAsync(itemData.attr.genres, "genres").then(response =>{
			if (response.length != 0){
				response.pop();
				itemData.attr.genresList= [...response];
				getFromApiAsync(itemData.episodes.episodeListLink,"episodeList").then(response =>{
					if (response.length != 0){
						response.pop();
						itemData.episodes.episodesList= [...response];
						getFromApiAsync(itemData.characters.characterListLink,"characterList").then(response =>{
							if (response.length != 0){
								response.pop();
								itemData.characters.charactersList= [...response];
								setCharList([...response]);
								setSingleSerieToDetail(itemData);
							} else {
								Alert.alert("Sorry, ","We could not retrieve the data for characters")
								setSearching(false);
							}
						})
					} else {
						Alert.alert("Sorry, ","We could not retrieve the data for episodes")
						setSearching(false);
					}
				})
			} else {
				Alert.alert("Sorry, ","We could not retrieve the data for genres")
				setSearching(false);
			}
		})
  }


	const nextDataBatch = () => {
		getFromApiAsync(nextUrl,"series").then(response => {
			if (response.length != 0){
				var nextUrlFromResponse = response.pop();
				setNextUrl(nextUrlFromResponse);
				setSearchResult([...searchResult,...response ]);
				setSearching(false);
			} else {
				Alert.alert("Sorry, ","We could not retrieve data for your search.")
				setSearching(false);
			}
		})
  }

	const onRefresh = () => {
    setSearching(true);
    nextDataBatch();
 }

  return (
    <View style={styles.container}>
      <View style={{...styles.headerContainer,height:dimensions.window.height*0.1, flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
        <View style={{ borderColor:"black", borderWidth:2, flexDirection:"row", alignItems:'center',justifyContent:'center', width:"60%", height:"50%", backgroundColor:'white',borderRadius:10,marginHorizontal:5}}>
          <Icon
            name="search"
            color={"black"}
            size={20}/>
          <TextInput
            placeholder="Search"
            placeholderTextColor="black"
            onChangeText={(e)=>{setSearchText(e)}}
            value={searchText}
            style={{...styles.inputBorder}}
            onBlur={getSearchQuery}
            maxlength={20}
            editable={!searching}
          />
        </View>
      </View>

      <View style={{...styles.bodyContainer,height:dimensions.window.height*0.9, width:dimensions.window.width, alignItems:"center", justifyItems:"center"}}>
        {(searching)&&(
          <ActivityIndicator visible={searching} size={100} color={GlobalColors.ComplementaryColor}/>
        )}
        <FlatList
          data={searchResult}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator ={false}
          showsHorizontalScrollIndicator={false}
					onEndReachedThreshold={0.1}
	        onEndReached={({ distanceFromEnd }) => {
	          if(distanceFromEnd >= 0) {
	            console.log("end reached");
	            onRefresh();
	          }
	        }}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  inputBorder: {
    flex:1,
    width:"90%",
		textAlign:'left',
	},
	container: {
		backgroundColor:GlobalColors.AnalogousColor,
		flex: 1
	},
	headerContainer:{
    backgroundColor:GlobalColors.SecondaryColor,
  },
	bodyContainer:{
    backgroundColor:"transparent",
  },
  item: {
    backgroundColor: GlobalColors.AnalogousSecondaryColor,
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth:4,
  },
  title: {
    fontSize: 25,
		color: GlobalColors.LetterColor,
  },

});

export default Search;
