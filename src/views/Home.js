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
}	from 'react-native';
import useApiKitsu from './../utils/useApiKitsu';
import GlobalColors from '../colors/GlobalColors';
import SerieDisplay from '../components/SerieDisplay';
import SerieDisplayPureComponent from '../components/SerieDisplayPureComponent';
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const Home = (props) => {
  const [loading,setLoading] = useState(false);
	const [dimensions, setDimensions] = useState({ window, screen });
	const [dataFL,setDataFL] = useState([]);
  const [isRefreshing,setIsRefreshing] = useState(false);
	const [apiURL,setApiURL] = useState("");
	const {getAnimeData,getFromApiAsync} = useApiKitsu();

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

	useEffect(() => {
    if(charList.length != 0){
			if(counter < charList.length){
				var urlActual = charList[counter].singleCharacterLink;
				getCharacterSingleFromApi(urlActual).then(response => {
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
				setLoading(false);
			}
		}
  },[charList,counter]);

	// Save API URL for next data page (paginated data, 20 records) and series data passed from init view (Action props).
	useEffect(()=>{
		setApiURL(props.nextLink);
		setDataFL([ ...dataFL, ...props.dataApi]);
	},[]);

	const getFromApi = () => {
    getAnimeData(apiURL,(res)=> {
      let jsonResponse = JSON.parse(res);
      let seriesData = jsonResponse.data;
      console.log("Numero de series ",seriesData.length);
      setApiURL(jsonResponse.links.next);
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
      setDataFL([ ...dataFL, ...arrayRecoveredData ]);
    }, (err) => {
      console.log("Respuesta no exitosa ",err);
    });
  }
	const renderItem = ({ item }) => (
		<SerieDisplayPureComponent displayImage={item.mediumImage} titleEn={item.attr.titles.en} titleEnJp={item.attr.titles.en_jp} titleJa={item.attr.titles.ja_jp} onPress={() => onSeriesSelected(item)} disabledTouch={loading}/>
  );
  const onSeriesSelected = (itemData) => {
		setLoading(true);
    console.log("id ",itemData.id);
		getFromApiAsync(itemData.attr.genres, "genres").then(response =>{
			response.pop();
			itemData.attr.genresList= [...response];
			//setSingleSerieToDetail(itemData);
			console.log("resp ",response)
			console.log("then genres")

			getEpisodesFromApi(itemData.episodes.episodeListLink).then(response =>{
				console.log("resp ep ",response)
				itemData.episodes.episodesList= [...response];
				//Actions.details({singleSerie: itemData });

				getCharacterListFromApi(itemData.characters.characterListLink).then(response =>{
					console.log("resp char lst ",response)
					itemData.characters.charactersList= [...response];
					setCharList([...response]);
					setSingleSerieToDetail(itemData);
					//Actions.details({singleSerie: itemData });
				})
			})
		})

		//Actions.details({singleSerie: itemData });
  }
	const getGenresFromApi = async (genresApiUrl) => {


		var myHeaders = new Headers();
		myHeaders.append("Accept", "application/vnd.api+json");
		myHeaders.append("Content-Type", "application/vnd.api+json");
		myHeaders.append("Cookie", "__cfduid=d5f5453d12d2a1c6de803292f3a73e8ab1604949302");
		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};
	  try {
	    let response = await fetch(
	      genresApiUrl,
				requestOptions
	    );
      let jsonResponse = await response.json();
      let seriesData = await jsonResponse.data;
			//Map data from result to custom JSON. Await for every record baing mapped
      let arrayRecoveredData =  await Promise.all(seriesData.map(async (element) => {
				var mappedElement = {};
					mappedElement.id = await element.id;
					mappedElement.name = await element.attributes.name;
				return mappedElement;
       }));
	    return arrayRecoveredData;
	  } catch (error) {
	    console.error(error);
	  }
  }

	const getEpisodesFromApi = async (episodesApiUrl) => {
		var myHeaders = new Headers();
		myHeaders.append("Accept", "application/vnd.api+json");
		myHeaders.append("Content-Type", "application/vnd.api+json");
		myHeaders.append("Cookie", "__cfduid=d5f5453d12d2a1c6de803292f3a73e8ab1604949302");
		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};
	  try {
	    let response = await fetch(
	      episodesApiUrl,
				requestOptions
	    );
      let jsonResponse = await response.json();
      let seriesData = await jsonResponse.data;
			//Map data from result to custom JSON. Await for every record baing mapped
      let arrayRecoveredData =  await Promise.all(seriesData.map(async (element) => {
				var mappedElement = {};
				mappedElement.id = element.id;
				var mappedElementTitles = {};
				mappedElementTitles.canonicalTitle = await element.attributes.canonicalTitle;
				mappedElementTitles.en_us = await element.attributes.titles.en_us;
				mappedElementTitles.en_jp = await element.attributes.titles.en_jp;
				mappedElementTitles.ja_jp = await element.attributes.titles.ja_jp;
				mappedElement.titles = await mappedElementTitles;
				mappedElement.seasonNumber = await element.attributes.seasonNumber;
				mappedElement.number = await element.attributes.number;
				mappedElement.airdate = await element.attributes.airdate;
				return mappedElement;
       }));
	    return arrayRecoveredData;
	  } catch (error) {
	    console.error(error);
	  }
  }

	const getCharacterListFromApi = async (characterListApiUrl) => {
		var myHeaders = new Headers();
		myHeaders.append("Accept", "application/vnd.api+json");
		myHeaders.append("Content-Type", "application/vnd.api+json");
		myHeaders.append("Cookie", "__cfduid=d5f5453d12d2a1c6de803292f3a73e8ab1604949302");
		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};
	  try {
	    let response = await fetch(
	      characterListApiUrl,
				requestOptions
	    );
      let jsonResponse = await response.json();
      let seriesData = await jsonResponse.data;
			//Map data from result to custom JSON. Await for every record baing mapped
      let arrayRecoveredData =  await Promise.all(seriesData.map(async (element) => {
				var mappedElement = {};
				mappedElement.id = await element.id;
				mappedElement.singleCharacterLink = await element.relationships.character.links.related;
				return mappedElement;
       }));
	    return arrayRecoveredData;
	  } catch (error) {
	    console.error(error);
	  }
  }

	const getCharacterSingleFromApi = async (characterSingleApiUrl) => {
		//console.log("Entrada Async");
		//console.log("Entrada Async url ",apiUrl);
		var myHeaders = new Headers();
		myHeaders.append("Accept", "application/vnd.api+json");
		myHeaders.append("Content-Type", "application/vnd.api+json");
		myHeaders.append("Cookie", "__cfduid=d5f5453d12d2a1c6de803292f3a73e8ab1604949302");
		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};
	  try {
	    let response = await fetch(
	      characterSingleApiUrl,
				requestOptions
	    );
	    let jsonResponse = await response.json();
			let singleCharacterData = await jsonResponse.data;
      let mappedElementC = {};
      mappedElementC.id = await singleCharacterData.id;
      let mappedElementName = {};
      mappedElementName.canonicalName =  await singleCharacterData.attributes.canonicalName;
      mappedElementName.en = await singleCharacterData.attributes.names.en;
      mappedElementName.ja_jp = await singleCharacterData.attributes.names.ja_jp;
      mappedElementName.name = await singleCharacterData.attributes.name;
      mappedElementC.names = await mappedElementName;
	    return mappedElementC;
	  } catch (error) {
	    console.error(error);
	  }
	};
  const onRefresh = () => {
    setIsRefreshing(true);
    mockApi();
 }
  const mockApi = () => {
    setTimeout(()=>{
      getFromApi();
			setIsRefreshing(false);
		},3000);
  }

  return (
    <View style={styles.container}>
			<FlatList
				data={dataFL}
				renderItem={renderItem}
				keyExtractor={item => item.id}
				horizontal={true}
				showsVerticalScrollIndicator ={false}
				showsHorizontalScrollIndicator={false}
			/>

    </View>
  );
};

const styles = StyleSheet.create({
	textHeader:{
    color:"blue",
		paddingLeft:"8%",
  },
	item: {
    backgroundColor: '#f9c2ff',
    height:250,
    padding:5,
  },
  title: {
    fontSize: 32,
  },
  tinyLogo: {
    width: 150,
    height: 150,
  },
	container: {
		backgroundColor: "transparent",
		flex: 1
	},
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
