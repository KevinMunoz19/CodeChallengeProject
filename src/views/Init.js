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

	const {getAnimeData} = useApiKitsu();
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
		setLoading(true)
		getFromApi();
  },[]);

	const getFromApi = () => {
    getAnimeData("https://kitsu.io/api/edge/anime",(res)=> {
      let jsonResponse = JSON.parse(res);
      let seriesData = jsonResponse.data;
      console.log("Numero de series ",seriesData.length);
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
			setLoading(false);
			Actions.home({dataApi:arrayRecoveredData, nextLink:jsonResponse.links.next });
    }, (err) => {
      console.log("Respuesta no exitosa ",err);
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
