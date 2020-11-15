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
	ScrollView,
	Dimensions,
	Modal,
	TouchableHighlight,
	FlatList,
	Linking,
	PixelRatio,
	BackHandler,
}	from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
import useApiKitsu from './../utils/useApiKitsu';
import GlobalColors from '../colors/GlobalColors';

const Details = (props) => {

  const [loadingEpisodes,setLoadingEpisodes] = useState(false);
  const [serieGenres,setSerieGenres] = useState([]);
	const [serieEpisodes,setSerieEpisodes] = useState([]);
	const [serieCharacters,setSerieCharacters] = useState([]);
	const [charList,setCharList] = useState([]);
	const [counter,setCounter] = useState(0);
	const {getAnimeData,getFromApiAsync} = useApiKitsu();
	const [dimensions, setDimensions] = useState({ window, screen });
	const [renderMult,setRenderMult] = useState(["AAAAA","BBBBB","CCCCC","AAAAA","BBBBB","CCCCC","AAAAA","BBBBB","CCCCC"]);
	const [renderMultObj,setRenderMultObj] = useState([{"id":"1","name":"AAA"},{"id":"2","name":"BBB"},{"id":"3","name":"CCC"},{"id":"4","name":"AAA"},{"id":"5","name":"BBB"},{"id":"6","name":"CCC"},{"id":"7","name":"CCC"},{"id":"8","name":"CCC"},{"id":"9","name":"CCC"},{"id":"10","name":"CCC"}]);
	const [characterModalVisible, setCharacterModalVisible] = useState(false);
	const [episodeModalVisible, setEpisodeModalVisible] = useState(false);
	const [renderMultObjEp,setRenderMultObjEp] = useState([{"id":"1","name":"AAA"},{"id":"2","name":"BBB"},{"id":"3","name":"CCC"},{"id":"4","name":"AAA"},{"id":"5","name":"BBB"},{"id":"6","name":"CCC"},{"id":"7","name":"CCC"},{"id":"8","name":"CCC"},{"id":"9","name":"CCC"},{"id":"10","name":"CCC"}]);
	const [modalFlToRender,setModalFlToRender] = useState("");
	const [modalTitleToRender,setModalTitleToRender] = useState("");
	const [responsiveFontSize,setResponsiveFontSize] = useState({});
	const [nextEpisodeBatchUrl,setNextEpisodeBatchUrl] = useState("");

	// Set fonts size based on orientation change.
	const onChange = ({ window, screen }) => {
		console.log("onChange")
    setDimensions({ window, screen });
			const scale = dimensions.window.height / 300;
			var typeScale = {};
			typeScale.headline1 = Math.round(PixelRatio.roundToNearestPixel(60*scale));
			typeScale.headline2 = Math.round(PixelRatio.roundToNearestPixel(40*scale));
			typeScale.headline3 = Math.round(PixelRatio.roundToNearestPixel(20*scale));
			typeScale.subtitle1 = Math.round(PixelRatio.roundToNearestPixel(16*scale));
			typeScale.body1 = Math.round(PixelRatio.roundToNearestPixel(14*scale));
			typeScale.button1 = Math.round(PixelRatio.roundToNearestPixel(10*scale));
			setResponsiveFontSize(typeScale);
  };

	BackHandler.addEventListener('hardwareBackPress', function() {
		Actions.pop();
		return true;
	});

	useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

	// Set initial fonts size based on actual dimensions. Set scale based on actual dimensions.
  useEffect(()=>{
		var scale = 0.0;
		if(dimensions.window.width>dimensions.window.height){
			scale = dimensions.window.height / 300;
		}else{
			scale = dimensions.window.width / 300;
		}
		var typeScale = {};
		typeScale.headline1 = Math.round(PixelRatio.roundToNearestPixel(60*scale));
		typeScale.headline2 = Math.round(PixelRatio.roundToNearestPixel(40*scale));
		typeScale.headline3 = Math.round(PixelRatio.roundToNearestPixel(20*scale));
		typeScale.subtitle1 = Math.round(PixelRatio.roundToNearestPixel(16*scale));
		typeScale.body1 = Math.round(PixelRatio.roundToNearestPixel(14*scale));
		typeScale.button1 = Math.round(PixelRatio.roundToNearestPixel(10*scale));
		setResponsiveFontSize(typeScale);
	},[]);

	// set state variables (arrays) with serie info passed from home view.
	useEffect(()=>{
		//console.log("listado de genres ",props.singleSerie.attr.genresList);
		setSerieGenres([...props.singleSerie.attr.genresList]);
		//console.log("listado de episodios ",props.singleSerie.episodes.episodesList);
		setSerieEpisodes([...props.singleSerie.episodes.episodesList]);
		setNextEpisodeBatchUrl(props.singleSerie.episodes.episodesNextBatchUrl);
		//console.log("listado de characters ",props.singleSerie.characters.singleCharacterList);
		setSerieCharacters([...props.singleSerie.characters.singleCharacterList]);
	},[]);

	const renderItemChar = ({ item }) => (
		<View style={{backgroundColor:GlobalColors.AnalogousSecondaryColor,borderRadius:20,marginHorizontal:10,marginVertical:3, padding:3, height:125, width:250, alignItems:"center", justifyContent:"center"}}>
			<Text style={{...styles.textHeader, fontSize:responsiveFontSize.body1, fontFamily:"Dosis-Light" ,paddingLeft:0,padding:4, color:GlobalColors.LetterColor}} allowFontScaling={false}>{(item.names.name)}</Text>
		</View>
  );

	const renderItemEp = ({ item }) => (
		<View style={{backgroundColor:GlobalColors.AnalogousSecondaryColor,borderRadius:20,marginHorizontal:10,marginVertical:3, padding:3, height:125, width:250, alignItems:"center", justifyContent:"center"}}>
			<Text style={{...styles.textHeader, fontSize:responsiveFontSize.body1, fontFamily:"Dosis-Light",paddingLeft:0,padding:4, color:GlobalColors.LetterColor}} allowFontScaling={false}>{(item.titles.canonicalTitle)}</Text>
			<Text style={{...styles.textHeader, fontSize:responsiveFontSize.body1, fontFamily:"Dosis-Light",paddingLeft:0,padding:4, color:GlobalColors.LetterColor}} allowFontScaling={false}>S{(item.seasonNumber)} Ep{(item.number)}</Text>
			<Text style={{...styles.textHeader, fontSize:responsiveFontSize.body1, fontFamily:"Dosis-Light",paddingLeft:0,padding:4, color:GlobalColors.LetterColor}} allowFontScaling={false}>{(item.airdate)?(item.airdate).split("-").reverse().join("-"):"-"}</Text>
		</View>
  );

	const nextDataBatch = () => {
		getFromApiAsync(nextEpisodeBatchUrl,"episodeList").then(response => {
			if (response.length != 0){
				var nextUrlFromResponse = response.pop();
				setNextEpisodeBatchUrl(nextUrlFromResponse);
				setSerieEpisodes([...serieEpisodes,...response ]);
				setLoadingEpisodes(false);
			} else {
				Alert.alert("Sorry, ","We could not retrieve data for next episodes.")
				setLoadingEpisodes(false);
			}
		})
  }

	const onRefresh = () => {
    setLoadingEpisodes(true);
    nextDataBatch();
 }

  return (
		<View style={styles.container}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={characterModalVisible}
				onBackdropPress={() => setCharacterModalVisible(false)}
				onRequestClose={() => setCharacterModalVisible(false)}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<TouchableHighlight
							style={{ ...styles.openButton }}
							onPress={() => { setCharacterModalVisible(false) }}
						>
							<Text style={{...styles.textStyle,fontSize:responsiveFontSize.button1, fontFamily:"Dosis-Medium"}}>Close</Text>
						</TouchableHighlight>
						<Text style={{...styles.modalText,fontSize:responsiveFontSize.headline3, fontFamily:"Dosis-Medium"}}>Series Characters</Text>
							<FlatList
								data={serieCharacters}
								renderItem={renderItemChar}
								keyExtractor={item => item.id}
								horizontal={true}
								showsVerticalScrollIndicator ={false}
								showsHorizontalScrollIndicator={false}
							/>
					</View>
				</View>
			</Modal>
			<Modal
				animationType="slide"
				transparent={true}
				visible={episodeModalVisible}
				onBackdropPress={() => setEpisodeModalVisible(false)}
				onRequestClose={() => setEpisodeModalVisible(false)}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<TouchableHighlight
							style={{ ...styles.openButton }}
							onPress={() => { setEpisodeModalVisible(false) }}
						>
							<Text style={{...styles.textStyle,fontSize:responsiveFontSize.button1, fontFamily:"Dosis-Medium"}}>Close</Text>
						</TouchableHighlight>
						{(loadingEpisodes)&&(
		          <ActivityIndicator visible={loadingEpisodes} size={30} color={GlobalColors.ComplementaryColor}/>
		        )}
						<Text style={{...styles.modalText,fontSize:responsiveFontSize.headline3, fontFamily:"Dosis-Medium"}}>Series First Episodes</Text>
							<FlatList
								data={serieEpisodes}
								renderItem={renderItemEp}
								keyExtractor={item => item.id}
								horizontal={true}
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
			</Modal>

      <ScrollView style={styles.scroll}>
				{/*	Image and basic info container*/}
	      <View style={{...styles.topContainer,height:(dimensions.window.height > dimensions.window.width)?(dimensions.window.height*0.4):(dimensions.window.height*1.2), flexDirection:"row", width:dimensions.window.width}}>
					{/*	Image container with play button in top right button. TouchableOpacity for image.*/}
	        <View style={{width:(dimensions.window.width*0.4), justifyContent:"center", alignItems:"center"}}>
						<TouchableOpacity style={{ width:"95%", height:"95%",borderColor:"black", borderWidth:3, borderRadius:6}} onPress={() => Linking.openURL(`http://www.youtube.com/watch?v=${props.singleSerie.attr.youtubeVideoId}`)}>
							<ImageBackground
								style={{width:"100%", height:"100%"}}
								source={{uri:props.singleSerie.mediumImage}}
							>
								<Icon name="play-arrow" color={GlobalColors.LetterColor} size={responsiveFontSize.headline2} style={{...styles.headerIcon,position:"absolute", right:"5%"}} />
							</ImageBackground>
						</TouchableOpacity>
	        </View>
					{/*	Info container next to image container. */}
	        <View style={{flex:3,flexDirection:"column"}}>
	          <View style={{...styles.textHeaderContainer,flex:2,backgroundColor:"transparent",flexDirection:"row",width:"100%"}}>
	            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.headline3, fontFamily:"Dosis-Medium"}} allowFontScaling={false}>{(props.singleSerie.attr.titles.en)?(props.singleSerie.attr.titles.en):(props.singleSerie.attr.titles.en_jp)?(props.singleSerie.attr.titles.en_jp):(props.singleSerie.attr.titles.ja_jp)}</Text>
	          </View>
	          <View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"transparent",flexDirection:"row",width:"100%"}}>
	            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1, fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{props.singleSerie.attr.titles.canonicalTitle}</Text>
	          </View>
						<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"transparent",flexDirection:"row",width:"100%",justifyContent:"center"}}>
							<TouchableOpacity style={{...styles.playButton}} onPress={() => { setCharacterModalVisible(true)}}>
								<Icon name="face" color={GlobalColors.LetterColor} size={responsiveFontSize.subtitle1} style={styles.headerIcon} />
								<Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1, marginHorizontal:2,fontFamily:"Dosis-Bold"}} allowFontScaling={false}>Characters</Text>
							</TouchableOpacity>
							{(props.singleSerie.attr.subtype != "movie")&&(
								<TouchableOpacity style={{...styles.playButton}} onPress={() => { setEpisodeModalVisible(true)}}>
									<Icon name="subscriptions" color={GlobalColors.LetterColor} size={responsiveFontSize.subtitle1} style={styles.headerIcon} />
									<Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1, marginHorizontal:2,fontFamily:"Dosis-Bold"}} allowFontScaling={false}>Episodes</Text>
								</TouchableOpacity>
							)}
	          </View>
						<View style={{...styles.textHeaderContainer,flex:0.5,backgroundColor:"transparent",flexDirection:"row"}}>
							<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"transparent",flexDirection:"row",width:"100%",justifyContent:"flex-start"}}>
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1,fontFamily:"Dosis-Light"}} allowFontScaling={false}>{props.singleSerie.type}</Text>
		          </View>
							<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"transparent",flexDirection:"row",width:"100%",justifyContent:"flex-start"}}>
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1,fontFamily:"Dosis-Light"}} allowFontScaling={false}>{(props.singleSerie.attr.subtype == "movie")?(""):(`${props.singleSerie.episodes.count} episodes`)}</Text>
		          </View>
	          </View>
						<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"transparent",flexDirection:"row",width:"100%"}}>
	            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.body1,fontFamily:"Dosis-Light"}} allowFontScaling={false}>{(props.singleSerie.dates.startDate).split("-").reverse().join("-")}{(props.singleSerie.attr.subtype == "movie")?(" Release date"):(` to ${(props.singleSerie.dates.startDate).split("-").reverse().join("-")}`)}</Text>
	          </View>
	        </View>
	      </View>
				{/*	Bottom info container*/}
	      <View style={{...styles.topContainer,height:(dimensions.window.height > dimensions.window.width)?(dimensions.window.height*0.40):(dimensions.window.height*0.8)}}>
					<View style={{flex:3,flexDirection:"column"}}>
						<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"transparent",flexDirection:"row",width:"100%"}}>
							<Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1, fontFamily:"Dosis-Medium"}} allowFontScaling={false}>Genres</Text>
						</View>
						<View style={{...styles.textHeaderContainer,flex:3,backgroundColor:"transparent",flexDirection:"row",width:"100%",flexWrap:"wrap",justifyContent:"center"}}>
						{serieGenres.map((usr)=>{
							try{
									return(
										<View style={{backgroundColor:GlobalColors.TriadicColor,borderRadius:30,marginHorizontal:20,marginVertical:10, padding:3}} key={usr.id}>
											<Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1,paddingLeft:0,padding:4, fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{usr.name}</Text>
										</View>
									)
							} catch(ex) {
							}
						})}
						</View>
						<View style={{...styles.textHeaderContainer,flex:2,backgroundColor:"transparent",flexDirection:"row"}}>
							<View style={{...styles.textHeaderContainer,flex:0.5,backgroundColor:"transparent",flexDirection:"row",width:"100%",justifyContent:"center"}}>
								<Icon name="star" color="yellow" size={responsiveFontSize.headline3} style={{...styles.headerIcon}} />
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.headline3,fontFamily:"Dosis-Medium"}} allowFontScaling={false}>{((props.singleSerie.attr.averageRating)/20).toFixed(1)}</Text>
		          </View>
							<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"transparent",flexDirection:"row",width:"100%",justifyContent:"center",height:"70%"}}>
								<View style={{...styles.textHeaderContainer,backgroundColor:GlobalColors.TriadicSecondaryColor,flexDirection:"column",justifyItems:"center", borderRadius:10, alignItems:"center"}}>
			            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1, color:GlobalColors.LetterColor,fontFamily:"Dosis-Medium", paddingLeft:"0%", paddingHorizontal:"10%"}} allowFontScaling={false}>{props.singleSerie.rating.ageRating}</Text>
			          </View>
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1, fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{props.singleSerie.rating.ageRatingGuide}</Text>
		          </View>
	          </View>
						<View style={{...styles.textHeaderContainer,flex:2,backgroundColor:"transparent",flexDirection:"row"}}>
							<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"transparent",flexDirection:"column",width:"100%",justifyContent:"center"}}>
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1,fontFamily:"Dosis-Medium"}} allowFontScaling={false}>{(props.singleSerie.attr.subtype == "movie")?("Movie Duration"):("Episode Duration")}</Text>
								<Text style={{...styles.textHeader, fontSize:responsiveFontSize.body1,fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{props.singleSerie.episodes.episodeLength} min.</Text>
		          </View>
							<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"transparent",flexDirection:"column",width:"100%",justifyContent:"center"}}>
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1,fontFamily:"Dosis-Medium"}} allowFontScaling={false}>Airing Status</Text>
								<Text style={{...styles.textHeader, fontSize:responsiveFontSize.body1,fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{props.singleSerie.dates.status}</Text>
		          </View>
	          </View>
					</View>
	      </View>
	      <View style={{...styles.topContainer,height:(dimensions.window.height > dimensions.window.width)?(dimensions.window.height*0.6):(dimensions.window.height*1.2)}}>
					<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"transparent",flexDirection:"row",width:"100%"}}>
						<Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1, fontFamily:"Dosis-Medium"}} allowFontScaling={false}>Synopsis</Text>
					</View>
					<View style={{...styles.textHeaderContainer,flex:5,backgroundColor:"transparent",flexDirection:"row",width:"100%", alignItems:"flex-start"}}>
						<Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1,fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{props.singleSerie.attr.synopsis}</Text>
					</View>
	      </View>
      </ScrollView>
		</View>
  );
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: GlobalColors.PrimaryColor,
		flex: 1
	},
	scroll:{
     flex:4,
  },
	topContainer:{
    backgroundColor:"transparent",
  },
	headerIcon: {
	},
	textHeader:{
    color:GlobalColors.LetterColor,
		paddingLeft:"8%",
  },
	textHeaderContainer:{
    alignItems:'center',
    justifyContent:'flex-start'
  },
	playButton: {
		backgroundColor:GlobalColors.AnalogousColor,
		width:"45%",
		height:"80%",
		borderRadius:10,
		padding:3,
		justifyContent:"center",
		flexDirection:"row",
		alignItems:"center",
		marginHorizontal:10,
	},
	modalView: {
    margin: 35,
    backgroundColor: GlobalColors.SecondaryColor,
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: GlobalColors.TriadicColor,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
		alignSelf:'flex-end'

  },
  textStyle: {
    color: GlobalColors.LetterColor,
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
		color: GlobalColors.LetterColor,
  },








  midContainer:{
    flex:4,
    backgroundColor:"blue",
  },
  dteScrollContainer:{
    width:'100%',
		flex:4,
		height:'100%',
    alignItems:'center',
  },

	scrollModal:{
     flex:8,
		 //backgroundColor:'pink',
		 // height:'80%',
  },
  item: {
    backgroundColor: '#f9c2ff',
    height:250,
    padding:5,

  },
  title: {
    fontSize: 32,
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

export default Details;
