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

const Item = ({ itemData, widthSt, onPress }) => (
  <TouchableOpacity style={{...styles.item,width:widthSt,flexDirection:"row"}}  onPress={onPress}>
    <View style={{width:widthSt*0.5,backgroundColor:"transparent"}}>
      <Image
        style={{height:((widthSt*0.9)/2),resizeMode: 'contain'}}
        source={{uri:itemData.mediumImage}}
      />
    </View>
    <View style={{width:widthSt*0.5,backgroundColor:"transparent", flexDirection:"column",justifyContent:"center" }}>
      <Text style={{...styles.title,paddingLeft:"8%"}}>{(itemData.attr.titles.en)?(itemData.attr.titles.en):(itemData.attr.titles.en_jp)?(itemData.attr.titles.en_jp):(itemData.attr.titles.ja_jp)}</Text>
    </View>
  </TouchableOpacity>
);

const Search = () => {
  const [loading,setLoading] = useState(false);
	const [dimensions, setDimensions] = useState({ window, screen });
	const [dataFL,setDataFL] = useState([]);
  const [isRefreshing,setIsRefreshing] = useState(false);
	const [apiURL,setApiURL] = useState("");
	const {getAnimeData} = useApiKitsu();

  const [searchResult,setSearchResult] = useState([]);
  const [searchText,setSearchText] = useState("");
  const [searching,setSearching] = useState(false);


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
    <Item itemData={item} widthSt={dimensions.window.width*0.8} onPress={() => onSeriesSelected(item)}/>
  );

  const getSearchQuery = () => {
    if(searchText.trim() != ""){
      var searchTextClean = searchText.trim();
      setSearching(true);
      getFromApi(`https://kitsu.io/api/edge/anime?filter[text]=${searchTextClean}`);
    }

  }


	const getFromApi = (searchUrl) => {
    getAnimeData(searchUrl,(res)=> {
      let jsonResponse = JSON.parse(res);
      let seriesData = jsonResponse.data;
      var arrayRecoveredData = seriesData.map(function(element){
				var mappedElement = {};
				mappedElement.id = element.id;
				mappedElement.type = element.type;
				mappedElement.mediumImage = element.attributes.posterImage.medium;
				var mappedElementAttributes = {};
				mappedElementAttributes.synopsis = element.attributes.synopsis;
				mappedElementAttributes.description = element.attributes.description;
				mappedElementAttributes.averageRating = element.attributes.averageRating;
				mappedElementAttributes.youtubeVideoId = element.attributes.youtubeVideoId;
				mappedElementAttributes.genres = element.relationships.genres.links.related;
				var mappedElementTitles = {};
				mappedElementTitles.canonicalTitle = element.attributes.canonicalTitle;
				mappedElementTitles.en = element.attributes.titles.en;
				mappedElementTitles.en_jp = element.attributes.titles.en_jp;
				mappedElementTitles.ja_jp = element.attributes.titles.ja_jp;
				mappedElementAttributes.titles = mappedElementTitles;
				mappedElement.attr = mappedElementAttributes;
				var mappedElementDates = {};
				mappedElementDates.startDate = element.attributes.startDate;
				mappedElementDates.endDate = element.attributes.endDate;
				mappedElementDates.status = element.attributes.status;
				mappedElementDates.nextRelease = element.attributes.nextRelease;
				mappedElement.dates = mappedElementDates;
				var mappedElementEpisodes = {};
				mappedElementEpisodes.count = element.attributes.episodeCount;
				mappedElementEpisodes.episodeLength = element.attributes.episodeLength;
				mappedElementEpisodes.episodeListLink = element.relationships.episodes.links.related;
				mappedElement.episodes = mappedElementEpisodes;
				var mappedElementRating = {};
				mappedElementRating.ageRating = element.attributes.ageRating;
				mappedElementRating.ageRatingGuide = element.attributes.ageRatingGuide;
				mappedElement.rating = mappedElementRating;
				var mappedElementCharacters = {};
				mappedElementCharacters.characterListLink = element.relationships.characters.links.related;
				mappedElement.characters = mappedElementCharacters;
				return mappedElement;
      });
      setSearchResult([...arrayRecoveredData ]);
      setSearching(false)
    }, (err) => {
      console.log("Respuesta no exitosa ",err);
    });
  }

  const onSeriesSelected = (itemData) => {
    console.log("id ",itemData.id);
		Actions.details({singleSerie: itemData });
  }


  return (
    <View style={styles.container}>

      <View style={{...styles.topContainer,height:dimensions.window.height*0.1, borderColor:"green", borderWidth:1,flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
        <View style={{ borderColor:"black", borderWidth:1, flexDirection:"row", alignItems:'center',justifyContent:'center', width:"60%", height:"50%", backgroundColor:'white',borderRadius:10,marginHorizontal:5}}>
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

      <View style={{...styles.topContainer,height:dimensions.window.height*0.9, borderColor:"green", borderWidth:1, width:dimensions.window.width, alignItems:"center", justifyItems:"center"}}>
        {(searching)&&(
          <ActivityIndicator visible={searching} size='large' color={"pink"}/>
        )}
        <FlatList
          data={searchResult}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator ={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  inputBorder: {
    flex:1,
    width:"90%",
		// borderBottomColor: '#DDDDDD',
		// borderBottomWidth: 1,
		textAlign:'left',

	},
  topContainer:{
    backgroundColor:"orange",
  },

  item: {
    backgroundColor: 'pink',
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth:4,
  },
  title: {
    fontSize: 15,
  },

});

export default Search;
