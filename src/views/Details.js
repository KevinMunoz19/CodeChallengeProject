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

const Details = (props) => {

  const [loading,setLoading] = useState(false);
  const [serieGenres,setSerieGenres] = useState([]);
	const [serieEpisodes,setSerieEpisodes] = useState([]);
	const [serieCharacters,setSerieCharacters] = useState([]);
	const [charList,setCharList] = useState([]);
	const [counter,setCounter] = useState(0);
	const {getAnimeData} = useApiKitsu();
	const [dimensions, setDimensions] = useState({ window, screen });
	const [renderMult,setRenderMult] = useState(["AAAAA","BBBBB","CCCCC","AAAAA","BBBBB","CCCCC","AAAAA","BBBBB","CCCCC"]);
	const [renderMultObj,setRenderMultObj] = useState([{"id":"1","value":"AAA"},{"id":"2","value":"BBB"},{"id":"3","value":"CCC"},{"id":"4","value":"AAA"},{"id":"5","value":"BBB"},{"id":"6","value":"CCC"},{"id":"7","value":"CCC"},{"id":"8","value":"CCC"},{"id":"9","value":"CCC"},{"id":"10","value":"CCC"}]);
	const [characterModalVisible, setCharacterModalVisible] = useState(false);
	const [renderMultObjEp,setRenderMultObjEp] = useState([{"id":"1","value":"111"},{"id":"2","value":"222"},{"id":"3","value":"333"},{"id":"4","value":"AAA"},{"id":"5","value":"BBB"},{"id":"6","value":"CCC"},{"id":"7","value":"CCC"},{"id":"8","value":"CCC"},{"id":"9","value":"CCC"},{"id":"10","value":"CCC"}]);
	const [modalFlToRender,setModalFlToRender] = useState("");
	const [modalTitleToRender,setModalTitleToRender] = useState("");
	const [responsiveFontSize,setResponsiveFontSize] = useState({});
	const onChange = ({ window, screen }) => {
		console.log("onChange")
    setDimensions({ window, screen });
			const scale = dimensions.window.height / 300;
			var typeScale = {};
			typeScale.headline1 = Math.round(PixelRatio.roundToNearestPixel(60*scale));
			typeScale.headline2 = Math.round(PixelRatio.roundToNearestPixel(40*scale));
			typeScale.headline3 = Math.round(PixelRatio.roundToNearestPixel(25*scale));
			typeScale.subtitle1 = Math.round(PixelRatio.roundToNearestPixel(18*scale));
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

  useEffect(()=>{
		console.log("should trigger onChange");
		var scale = 0.0;
		if(dimensions.window.width>dimensions.window.height){
			scale = dimensions.window.height / 300;
		}else{
			scale = dimensions.window.width / 300;
		}
		var typeScale = {};
		typeScale.headline1 = Math.round(PixelRatio.roundToNearestPixel(60*scale));
		typeScale.headline2 = Math.round(PixelRatio.roundToNearestPixel(40*scale));
		typeScale.headline3 = Math.round(PixelRatio.roundToNearestPixel(25*scale));
		typeScale.subtitle1 = Math.round(PixelRatio.roundToNearestPixel(18*scale));
		typeScale.body1 = Math.round(PixelRatio.roundToNearestPixel(14*scale));
		typeScale.button1 = Math.round(PixelRatio.roundToNearestPixel(10*scale));
		setResponsiveFontSize(typeScale);
	},[]);
	useEffect(()=>{
		var serieDetailsObj = props.singleSerie;
		//getGenresFromApi(serieDetailsObj.attr.genres);
    //getEpisodesFromApi(serieDetailsObj.episodes.episodeListLink);
    getCharacterListFromApi(serieDetailsObj.characters.characterListLink);
	},[]);

	useEffect(()=>{
		if(serieGenres.length != 0){
			//console.log("entrada use effect genres change",serieGenres);
		}
	},[serieEpisodes]);

	useEffect(()=>{
		if(serieEpisodes.length != 0){
			//console.log("entrada use effect serieEpisodes change",serieEpisodes);
		}
	},[serieEpisodes]);

	useEffect(()=>{
		if(charList.length != 0){
			if(counter < charList.length){
				var urlActual = charList[counter].singleCharacterLink;
				getMoviesFromApiAsync(urlActual).then(response => {
					setSerieCharacters([...serieCharacters,response]);
					setCounter(counter+1);
				});
			}
		}
	},[charList,counter]);

	//Linking.openURL('http://www.youtube.com/watch?v=PLgD9br3bze22iMSimpPeQ85CIqLswcklR');

	const getGenresFromApi = (genresApiUrl) => {
    getAnimeData(genresApiUrl,(res)=> {
      let jsonResponse = JSON.parse(res);
      let genresData = jsonResponse.data;
      var arrayRecoveredData = genresData.map(function(element){
         var mappedElement = {};
         mappedElement.id = element.id;
         mappedElement.name = element.attributes.name;
         return mappedElement;
      });
			setSerieGenres([...arrayRecoveredData]);
    }, (err) => {
      console.log("Respuesta no exitosa ",err);
    });
  }
	const getEpisodesFromApi = (episodesApiUrl) => {
    getAnimeData(episodesApiUrl,(res)=> {
      let jsonResponse = JSON.parse(res);
      let episodesData = jsonResponse.data;
      let episodesLinks = jsonResponse.links;
      var arrayRecoveredData = episodesData.map(function(element){
         var mappedElement = {};
         mappedElement.id = element.id;
         var mappedElementTitles = {};
         mappedElementTitles.canonicalTitle = element.attributes.canonicalTitle;
         mappedElementTitles.en_us = element.attributes.titles.en_us;
         mappedElementTitles.en_jp = element.attributes.titles.en_jp;
         mappedElementTitles.ja_jp = element.attributes.titles.ja_jp;
         mappedElement.titles = mappedElementTitles;
         mappedElement.seasonNumber = element.attributes.seasonNumber;
         mappedElement.number = element.attributes.number;
         mappedElement.airdate = element.attributes.airdate;
         return mappedElement;
      });
			setSerieEpisodes([...arrayRecoveredData]);
    }, (err) => {
      console.log("Respuesta no exitosa ",err);
    });
  }
	const getCharacterListFromApi = (charactersApiUrl) => {
    getAnimeData(charactersApiUrl,(res)=> {
      let jsonResponse = JSON.parse(res);
      let characterData = jsonResponse.data;
      var arrayRecoveredData = characterData.map(function(element){
         var mappedElement = {};
         mappedElement.id = element.id;
         mappedElement.singleCharacterLink = element.relationships.character.links.related;
         return mappedElement;
      });
			setCharList([...arrayRecoveredData])
    }, (err) => {
      console.log("Respuesta no exitosa ",err);
    });
  }
	const getMoviesFromApiAsync = async (apiUrl) => {
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
	      apiUrl,
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
  const getSingleCharacterFromApi = (singleCharacterApiUrl) => {
		console.log(singleCharacterApiUrl)
    getAnimeData(singleCharacterApiUrl,(res)=> {
      let jsonResponse = JSON.parse(res);
      let singleCharacterData = jsonResponse.data;
      let mappedElementC = {};
      mappedElementC.id = singleCharacterData.id;
      let mappedElementName = {};
      mappedElementName.canonicalName = singleCharacterData.attributes.canonicalName;
      mappedElementName.en = singleCharacterData.attributes.names.en;
      mappedElementName.ja_jp = singleCharacterData.attributes.names.ja_jp;
      mappedElementName.name = singleCharacterData.attributes.name;
      mappedElementC.names = mappedElementName;
      let arrayToInsert = [];
      arrayToInsert.push(mappedElementC);
      setSerieCharacters([...serieCharacters, arrayToInsert])
    }, (err) => {
      console.log("Respuesta no exitosa ",err);
    });
  }

	const renderItem = ({ item }) => (
		<View style={{backgroundColor:"black",borderRadius:20,marginHorizontal:10,marginVertical:3, padding:3, height:50, width:100, alignItems:"center", justifyContent:"center"}}>
			<Text style={{...styles.textHeader, fontSize:18,paddingLeft:0,padding:4, color:"white"}} allowFontScaling={false}>{item.value}</Text>
		</View>
  );
	const openModal = (modalType) => {
		if (modalType == "Characters"){
			setModalFlToRender([...renderMultObj]);
			setModalTitleToRender(modalType);
			setCharacterModalVisible(true);
		} else {
			setModalFlToRender([...renderMultObjEp]);
			setModalTitleToRender(modalType);
			setCharacterModalVisible(true);
		}
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
							style={{ ...styles.openButton, backgroundColor: "#2196F3", alignSelf:'flex-end' }}
							onPress={() => { setCharacterModalVisible(false) }}
						>
							<Text style={styles.textStyle}>Close</Text>
						</TouchableHighlight>
						<Text style={styles.modalText}>Series {modalTitleToRender}</Text>
							<FlatList
								data={modalFlToRender}
								renderItem={renderItem}
								keyExtractor={item => item.id}
								horizontal={true}
								showsVerticalScrollIndicator ={false}
								showsHorizontalScrollIndicator={false}
							/>

					</View>
				</View>
			</Modal>
      <ScrollView style={styles.scroll}>
	      <View style={{...styles.topContainer,height:(dimensions.window.height > dimensions.window.width)?(dimensions.window.height*0.4):(dimensions.window.height*1.2), borderColor:"green", borderWidth:1,flexDirection:"row", width:dimensions.window.width}}>
	        <View style={{width:(dimensions.window.width*0.4), borderColor:"yellow", borderWidth:1, justifyContent:"center", alignItems:"center"}}>
						<TouchableOpacity style={{ width:"95%", height:"95%",borderColor:"black", borderWidth:3, borderRadius:6}} onPress={() => Linking.openURL(`http://www.youtube.com/watch?v=${props.singleSerie.attr.youtubeVideoId}`)}>
							<ImageBackground
								style={{width:"100%", height:"100%"}}
								source={{uri:props.singleSerie.mediumImage}}
							>
								<Icon name="play-arrow" color="white" size={responsiveFontSize.headline2} style={{...styles.headerIcon,position:"absolute", right:"5%"}} />
							</ImageBackground>
						</TouchableOpacity>
	        </View>
	        <View style={{borderColor:"black", borderWidth:1,flex:3,flexDirection:"column"}}>
	          <View style={{...styles.textHeaderContainer,flex:2,backgroundColor:"red",flexDirection:"row",width:"100%"}}>
	            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.headline3, fontFamily:"Dosis-Medium"}} allowFontScaling={false}>{(props.singleSerie.attr.titles.en)?(props.singleSerie.attr.titles.en):(props.singleSerie.attr.titles.en_jp)?(props.singleSerie.attr.titles.en_jp):(props.singleSerie.attr.titles.ja_jp)}</Text>
	          </View>
	          <View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"black",flexDirection:"row",width:"100%"}}>
	            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1, fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{props.singleSerie.attr.titles.canonicalTitle}</Text>
	          </View>
						<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"green",flexDirection:"row",width:"100%",justifyContent:"center"}}>
							<TouchableOpacity style={{...styles.playButton}} onPress={() => { openModal("Characters")}}>
								<Icon name="face" color="white" size={responsiveFontSize.subtitle1} style={styles.headerIcon} />
								<Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1, marginHorizontal:2,fontFamily:"Dosis-Bold"}} allowFontScaling={false}>Characters</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{...styles.playButton}} onPress={() => { openModal("Episodes")}}>
								<Icon name="subscriptions" color="white" size={responsiveFontSize.subtitle1} style={styles.headerIcon} />
								<Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1, marginHorizontal:2,fontFamily:"Dosis-Bold"}} allowFontScaling={false}>Episodes</Text>
							</TouchableOpacity>
	          </View>
						<View style={{...styles.textHeaderContainer,flex:0.5,backgroundColor:"purple",flexDirection:"row"}}>
							<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"green",flexDirection:"row",width:"100%",justifyContent:"flex-start"}}>
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1,fontFamily:"Dosis-Light"}} allowFontScaling={false}>{props.singleSerie.type}</Text>
		          </View>
							<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"pink",flexDirection:"row",width:"100%",justifyContent:"flex-start"}}>
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1,fontFamily:"Dosis-Light"}} allowFontScaling={false}>{props.singleSerie.episodes.count} episodes</Text>
		          </View>
	          </View>
						<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"black",flexDirection:"row",width:"100%"}}>
	            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.body1,fontFamily:"Dosis-Light"}} allowFontScaling={false}>{(props.singleSerie.dates.startDate).split("-").reverse().join("-")}  to {(props.singleSerie.dates.endDate).split("-").reverse().join("-")}</Text>
	          </View>
	        </View>
	      </View>
	      <View style={{...styles.topContainer,height:(dimensions.window.height > dimensions.window.width)?(dimensions.window.height*0.40):(dimensions.window.height*0.8), borderColor:"green", borderWidth:5}}>
					<View style={{borderColor:"black", borderWidth:1,flex:3,flexDirection:"column"}}>
						<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"red",flexDirection:"row",width:"100%"}}>
							<Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1, fontFamily:"Dosis-Medium"}} allowFontScaling={false}>Genres</Text>
						</View>
						<View style={{...styles.textHeaderContainer,flex:3,backgroundColor:"gray",flexDirection:"row",width:"100%",flexWrap:"wrap",justifyContent:"center"}}>
						{renderMult.map((usr)=>{
							try{
									return(
										<View style={{backgroundColor:"pink",borderRadius:30,marginHorizontal:10,marginVertical:3, padding:3}}>
											<Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1,paddingLeft:0,padding:4, fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{usr}</Text>
										</View>
									)
							} catch(ex) {
							}
						})}
						</View>
						<View style={{...styles.textHeaderContainer,flex:2,backgroundColor:"purple",flexDirection:"row"}}>
							<View style={{...styles.textHeaderContainer,flex:0.5,backgroundColor:"green",flexDirection:"row",width:"100%",justifyContent:"center"}}>
								<Icon name="star" color="yellow" size={responsiveFontSize.headline3} style={{...styles.headerIcon}} />
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.headline3,fontFamily:"Dosis-Medium"}} allowFontScaling={false}>{((props.singleSerie.attr.averageRating)/20).toFixed(1)}</Text>
		          </View>
							<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"pink",flexDirection:"row",width:"100%",justifyContent:"center",height:"70%"}}>
								<View style={{...styles.textHeaderContainer,backgroundColor:"gray",flexDirection:"column",justifyItems:"center", borderRadius:10, alignItems:"center"}}>
			            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1, color:"white",fontFamily:"Dosis-Medium"}} allowFontScaling={false}>{props.singleSerie.rating.ageRating}</Text>
			          </View>
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1, fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{props.singleSerie.rating.ageRatingGuide}</Text>
		          </View>
	          </View>
						<View style={{...styles.textHeaderContainer,flex:2,backgroundColor:"purple",flexDirection:"row"}}>
							<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"green",flexDirection:"column",width:"100%",justifyContent:"center"}}>
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1,fontFamily:"Dosis-Medium"}} allowFontScaling={false}>Episode Duration</Text>
								<Text style={{...styles.textHeader, fontSize:responsiveFontSize.body1,fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{props.singleSerie.episodes.episodeLength} min.</Text>
		          </View>
							<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"red",flexDirection:"column",width:"100%",justifyContent:"center"}}>
		            <Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1,fontFamily:"Dosis-Medium"}} allowFontScaling={false}>Airing Status</Text>
								<Text style={{...styles.textHeader, fontSize:responsiveFontSize.body1,fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{props.singleSerie.dates.status}</Text>
		          </View>
	          </View>
					</View>
	      </View>
	      <View style={{...styles.topContainer,height:(dimensions.window.height > dimensions.window.width)?(dimensions.window.height*0.6):(dimensions.window.height*1.2), borderColor:"green", borderWidth:5}}>
					<View style={{...styles.textHeaderContainer,flex:1,backgroundColor:"red",flexDirection:"row",width:"100%"}}>
						<Text style={{...styles.textHeader, fontSize:responsiveFontSize.subtitle1, fontFamily:"Dosis-Medium"}} allowFontScaling={false}>Synopsis</Text>
					</View>
					<View style={{...styles.textHeaderContainer,flex:5,backgroundColor:"black",flexDirection:"row",width:"100%", alignItems:"flex-start"}}>
						<Text style={{...styles.textHeader, fontSize:responsiveFontSize.button1,fontFamily:"Dosis-Regular"}} allowFontScaling={false}>{props.singleSerie.attr.synopsis}</Text>
					</View>
	      </View>
      </ScrollView>
		</View>
  );
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "transparent",
		flex: 1
	},
	playButton: {
		backgroundColor:"red",
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
    backgroundColor: "white",
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
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },





	textHeader:{
    color:"blue",
		paddingLeft:"8%",
  },
  textHeaderContainer:{
    alignItems:'center',
    justifyContent:'flex-start'
  },
  topContainer:{
    backgroundColor:"orange",
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
	scroll:{
     flex:4,
		 //backgroundColor:'pink',
		 // height:'80%',
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
