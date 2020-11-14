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

			getFromApiAsync(itemData.episodes.episodeListLink,"episodeList").then(response =>{
				response.pop();
				console.log("resp ep ",response)
				itemData.episodes.episodesList= [...response];
				//Actions.details({singleSerie: itemData });

				getFromApiAsync(itemData.characters.characterListLink,"characterList").then(response =>{
					response.pop();
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
