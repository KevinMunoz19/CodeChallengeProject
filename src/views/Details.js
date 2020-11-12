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
}	from 'react-native';
import useApiKitsu from './../utils/useApiKitsu';


const Details = (props) => {

  const [loading,setLoading] = useState(false);
  const [serieGenres,setSerieGenres] = useState([]);
	const [serieEpisodes,setSerieEpisodes] = useState([]);
	const [serieCharacters,setSerieCharacters] = useState([]);
	const [charList,setCharList] = useState([]);
	const [counter,setCounter] = useState(0);
	const {getAnimeData} = useApiKitsu();

  useEffect(()=>{
		//console.log("Objeto en details view "+JSON.stringify(props.singleSerie));
		var serieDetailsObj = props.singleSerie;
		//getGenresFromApi(serieDetailsObj.attr.genres);
    //getEpisodesFromApi(serieDetailsObj.episodes.episodeListLink);
    getCharacterListFromApi(serieDetailsObj.characters.characterListLink);
	},[]);

	useEffect(()=>{
		if(serieGenres.length != 0){
			console.log("entrada use effect genres change",serieGenres);
		}
	},[serieEpisodes]);
	useEffect(()=>{
		if(serieEpisodes.length != 0){
			console.log("entrada use effect serieEpisodes change",serieEpisodes);
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
			//setCounter(counter+1);




		}
	},[charList,counter]);

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
		console.log("Entrada Async");
		console.log("Entrada Async url ",apiUrl);
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

// 	const getMoviesFromApiAsync = async () => {
//   try {
//     let response = await fetch(
//       'https://reactnative.dev/movies.json'
//     );
//     let json = await response.json();
// 		setSerieCharacters([...serieCharacters,json]);
//     return json;
//   } catch (error) {
//     console.error(error);
//   }
// };




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

	const showChar = () => {

		console.log("chars ",serieCharacters);
	}

  return (
    <View style={styles.container}>
      {!loading && (
        <View style={styles.textHeaderContainer}>
          <Text style={{ ...styles.textHeader, fontSize:30}} allowFontScaling={false}>Details</Text>
        </View>
      )}
      {!loading && (
        <React.Fragment>
          <View style={styles.imageContainer}>

          </View>
          <TouchableOpacity style={styles.sendButton} onPress={showChar}>
            <Text style={{color:"black", textAlign:'center', fontSize:25}} allowFontScaling={false}>Iniciar Sesion</Text>
          </TouchableOpacity>
        </React.Fragment>
      )}
			<Text style={{color:"black", textAlign:'center', fontSize:25}} allowFontScaling={false}>AAA</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
