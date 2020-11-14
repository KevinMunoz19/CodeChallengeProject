
const useApiKitsu = () => {

  const getAnimeData = (apiURL,res,rej) => {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/vnd.api+json");
    myHeaders.append("Content-Type", "application/vnd.api+json");
    myHeaders.append("Cookie", "__cfduid=d5f5453d12d2a1c6de803292f3a73e8ab1604949302");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(apiURL, requestOptions)
      .then(response => response.text())
      .then(result => {
        res(result);
      })
      .catch(error => {
        console.log('error', error)
        rej(error);
      });
  }


  const getFromApiAsync = async (urlToUse, customJsonType) => {
		// Headers defined by KJitsui API Docs
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
	      urlToUse,
				requestOptions
	    );
      let jsonResponse = await response.json();
      let seriesData = await jsonResponse.data;

      //setApiURL(nextLink);
			//Map data from result to custom JSON. Await for every record baing mapped
      let arrayRecoveredData =  await Promise.all(seriesData.map(async (element) => {
				var mappedElement = {};
        if(customJsonType=="series"){
          mappedElement.id = await element.id;
  				mappedElement.type =  await element.type;
  				mappedElement.mediumImage = await element.attributes.posterImage.medium;
  				var mappedElementAttributes = {};
  					mappedElementAttributes.synopsis = await element.attributes.synopsis;
  					mappedElementAttributes.description = await element.attributes.description;
  					mappedElementAttributes.averageRating = await element.attributes.averageRating;
  					mappedElementAttributes.youtubeVideoId = await element.attributes.youtubeVideoId;
  					mappedElementAttributes.genres = await element.relationships.genres.links.related;
  				var mappedElementTitles = {};
  					mappedElementTitles.canonicalTitle = await element.attributes.canonicalTitle;
  					mappedElementTitles.en = await element.attributes.titles.en;
  					mappedElementTitles.en_jp = await element.attributes.titles.en_jp;
  					mappedElementTitles.ja_jp = await element.attributes.titles.ja_jp;
  					mappedElementAttributes.titles = await mappedElementTitles;
  					mappedElement.attr = await mappedElementAttributes;
  				var mappedElementDates = {};
  					mappedElementDates.startDate = await element.attributes.startDate;
  					mappedElementDates.endDate = await element.attributes.endDate;
  					mappedElementDates.status = await element.attributes.status;
  					mappedElementDates.nextRelease = await element.attributes.nextRelease;
  					mappedElement.dates = await mappedElementDates;
  				var mappedElementEpisodes = {};
  					mappedElementEpisodes.count = await element.attributes.episodeCount;
  					mappedElementEpisodes.episodeLength = await element.attributes.episodeLength;
  					mappedElementEpisodes.episodeListLink = await element.relationships.episodes.links.related;
  					mappedElement.episodes = await mappedElementEpisodes;
  				var mappedElementRating = {};
  					mappedElementRating.ageRating = await element.attributes.ageRating;
  					mappedElementRating.ageRatingGuide = await element.attributes.ageRatingGuide;
  					mappedElement.rating = await mappedElementRating;
  				var mappedElementCharacters = {};
  					mappedElementCharacters.characterListLink = await element.relationships.characters.links.related;
  					mappedElement.characters = await mappedElementCharacters;
        }
        if(customJsonType=="genres"){
          mappedElement.id = await element.id;
					mappedElement.name = await element.attributes.name;
        }
				return mappedElement;
       }));
      let nextLink = await jsonResponse.links.next;
      var arrayToReturn = await [...arrayRecoveredData,nextLink]
	    return arrayToReturn;
	  } catch (error) {
	    console.error(error);
	  }
	};
  return {
    getAnimeData,
    getFromApiAsync,
  };

}

export default useApiKitsu;
