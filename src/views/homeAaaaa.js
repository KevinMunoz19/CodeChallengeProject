import React, { useState, useEffect, useRef } from 'React';
import { Actions } from 'react-native-router-flux';
import useUser from './../utils/useUser';
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
// import Colors from './../utils/colors';
import colorPalette from '../utils/colors';
import environmentVariables from '../utils/envVariables';
import SerieDisplay from '../components/SerieDisplay';

import PureComponent from '../components/PureComponent';

import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Image,
	ImageBackground,
  ActivityIndicator,
  Modal,
  Dimensions,
  BackHandler,
  NativeModules,
  NativeEventEmitter,
  FlatList,
  ScrollView,
  TextInput,
}	from 'react-native';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from 'react-native-chart-kit'

const printer = NativeModules.PrintModule;



import useUserLogin from './../utils/useUserLogin';
import decodeXML from './../utils/decodeXML';

import base64 from 'react-native-base64';
var DOMParser = require('xmldom').DOMParser;


import useApiKitsu from './../utils/useApiKitsu';

const Item = ({ title, widthSt }) => (
  <TouchableOpacity style={{...styles.item,width:widthSt,flexDirection:"row"}}>
    <View style={{width:widthSt/2,backgroundColor:"orange"}}>
      <Image
        style={{height:((widthSt*0.5)/2),width:((widthSt*0.5)/1.2)}}
        source={{uri:title.mediumImage}}
      />
    </View>
    <View style={{width:widthSt,backgroundColor:"red", flexDirection:"column",justifyContent:"center" }}>
      <Text style={{...styles.title,paddingLeft:"8%"}}>{(title.attr.titles.en)?(title.attr.titles.en):(title.attr.titles.en_jp)?(title.attr.titles.en_jp):(title.attr.titles.ja_jp)}</Text>
    </View>
  </TouchableOpacity>

);


const Home = () => {
  //const flatListOne = useRef(null);
  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");

  const [dimensions, setDimensions] = useState({ window, screen });
  const [user,setUser] = useState();
  const [characters,setCharacters] = useState([]);



  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };



  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

  BackHandler.addEventListener('hardwareBackPress', function() {
		Actions.home();
		return true;
	});


  const {getUserLogin} = useUserLogin();
  const {getUser} = useUser();
  const {decodeDataPrint} = decodeXML();
  const [dataFL,setDataFL] = useState([]);

  const [dataFLAction,setDataFLAction] = useState([]);
  const [isRefreshing,setIsRefreshing] = useState(false);
  const [isRefreshingAction,setIsRefreshingAction] = useState(false);
  const [apiURLAction,setApiURLAction] = useState("https://kitsu.io/api/edge/anime?filter[categories]=adventure");
  const [counter,setCounter] = useState([]);
  //const [renderMultObj,setRenderMultObj] = useState([{"id":"1","value":"AAA"},{"id":"2","value":"BBB"},{"id":"3","value":"CCC"},{"id":"4","value":"AAA"},{"id":"5","value":"BBB"},{"id":"6","value":"CCC"},{"id":"7","value":"CCC"},{"id":"8","value":"CCC"},{"id":"9","value":"CCC"},{"id":"10","value":"CCC"}]);
  const [searchResult,setSearchResult] = useState([]);
  const [searchText,setSearchText] = useState("");
  const [searching,setSearching] = useState(false);

  const [dataPrev,setDataPrev] = useState([]);
  const [apiURL,setApiURL] = useState("https://kitsu.io/api/edge/anime?page%5Blimit%5D=20&page%5Boffset%5D=0");





  const [count,setCount] = useState(0);
  useEffect(()=>{
    if(count < 3){
      apiCon();
    }
	},[dataPrev]);

  const apiCon = () => {
    getMoviesFromApiAsync().then(response => {
      setCount(count+1);
      setDataPrev([...dataPrev, ...response])
      //console.log("response ",response);
    });
  }

  const getMoviesFromApiAsync = async () => {
    console.log("api url to get ",apiURL)
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
	      apiURL,
				requestOptions
	    );
      let jsonResponse = await response.json();
      let seriesData = await jsonResponse.data;
      let nextLink = await jsonResponse.links.next;
      setApiURL(nextLink);
      let arrayRecoveredData =  await Promise.all(seriesData.map(async (element) => {
          var mappedElement = {};
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
          return mappedElement;
       }));
	    return arrayRecoveredData;
	  } catch (error) {
	    console.error(error);
	  }
	};



  const {getAnimeData} = useApiKitsu();

  useEffect(()=>{
		getUserLogin((userl)=>{
			if(userl != null){

			} else {

        Actions.loginuser();
      }
		})
    getUser((users)=>{

  			if(users != null){

  			} else {

          Actions.login();
        }
  		})
	},[]);

  function getKeyByValue(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
  }

  const {logout} = useUser();
  const [menuVisible,setMenuVisible] = useState(false);
  const handlePress = (view)=>{
		setMenuVisible(false);
		switch(view){
			case 'clients':Actions.clients({action:'manage'}); break;
			case 'products':Actions.products({action:'manage'}); break;
			case 'dte':Actions.dte(); break;
			case 'dtes':Actions.dtes(); break;
      case 'dtessummary':Actions.dtessummary(); break;
      case 'info':Actions.infouser(); break;
      case 'user':Actions.user(); break;
      case 'invaliddigifact':Actions.invaliddigifact(); break;
		}
  }

  const onMenu = ()=>{
    setMenuVisible(!menuVisible);
  }

  const chartConfig = {
    //backgroundGradientFrom: "#2E317E",
    backgroundGradientFromOpacity: 0,
    //backgroundGradientTo: "#2E317E",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 161, 44, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
  const data = {
    labels: ["Cross Sell"], // optional
    data: [0.8]
  };
  const data1 = {
    labels: ["Ventas"], // optional
    data: [0.5]
  };
  const chartConfigLineChart = {
    backgroundGradientFrom: "#2E317E",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#2E317E",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 161, 44, ${opacity})`,
    strokeWidth: 5, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: true, // optional
  };
  const dataLine = {
    labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Ma', 'Ju', 'Ju'],
    datasets: [{
      data: [
        50,
        20,
        2,
        86,
        71,
        100,
        70
      ],
      color: (opacity = 1) => `rgba(255, 161, 44, ${opacity})`, // optional
      legend: ["Rainy Days", "Sunny Days", "Snowy Days"], // optional
    }]
  }
  const onLogout = ()=>{
    setMenuVisible(false);
		logout();
		Actions.login();
  }

  const [renderMult,setRenderMult] = useState(["AAAAA","BBBBB","CCCCC","AAAAA","BBBBB","CCCCC","AAAAA","BBBBB","CCCCC"]);
  //<Item title={item} widthSt={dimensions.window.width*0.9}  />
  const renderItem = ({ item }) => (
    <PureComponent text={item.attr.titles.en}/>
  );


  const getSearchQuery = () => {
    console.log("dataPrev len ",dataPrev.length);
  }

  return (
    <View style={styles.container}>
      <View style={{...styles.topContainer,height:(dimensions.window.height*0.1), borderColor:"green", borderWidth:5, flexDirection:"row",}}>
        <View style={{ borderColor:"black", borderWidth:1, flexDirection:"row", alignItems:'center',justifyContent:'center', width:"60%", height:"90%", backgroundColor:'white',borderRadius:10,marginHorizontal:5}}>
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
      <View style={{...styles.topContainer,flex:1, borderColor:"green", borderWidth:5}}>
        {(searching)&&(
          <ActivityIndicator visible={searching} size='large' color={"pink"}/>
        )}
        <FlatList
          data={dataPrev}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator ={false}
		      showsHorizontalScrollIndicator={false}
        />
      </View>






{/*
      <View style={styles.headerContainer}>
        <View style={styles.textHeaderContainer}>
          <Text style={styles.textHeader} allowFontScaling={false}>Bienvenido</Text>
        </View>
      </View>
*/}

      {/*
      <View style={styles.infoContainer}>

        <View style={styles.subDataContainer}>

          <View style={styles.subDataContainerHalfOrange}>

            <View style={styles.textHeaderContainerTitle}>
  						<Text style={styles.textHeaderData} allowFontScaling={false}>312</Text>
              <Text style={styles.textHeaderTitle} allowFontScaling={false}>Clientes</Text>
  					</View>
            <View style={styles.textHeaderContainerTitle}>
  						<Text style={styles.textHeaderData} allowFontScaling={false}>Q80,340</Text>
              <Text style={styles.textHeaderTitle} allowFontScaling={false}>Ingreso Anual</Text>
  					</View>
            <View style={styles.textHeaderContainerTitle}>
  						<Text style={styles.textHeaderData} allowFontScaling={false}>Q10,232</Text>
              <Text style={styles.textHeaderTitle} allowFontScaling={false}>Ingreso Mensual</Text>
  					</View>

          </View>

          <View style={styles.subDataContainerHalf}>

            <View style={styles.grayHalfContainer}>

            <View style={styles.textHeaderContainerHalf}>
              <Text style={styles.textHeaderTitle} allowFontScaling={false}>Cross Sell</Text>
              <Text style={styles.textHeaderData} allowFontScaling={false}>Q1870</Text>
            </View>

            <View style={styles.textHeaderContainerHalf}>
              <ProgressChart
                data={data}
                width={75}
                height={40}
                strokeWidth={8}
                radius={16}
                chartConfig={chartConfig}
                hideLegend={true}
              />
            </View>

            </View>

            <View style={styles.grayHalfContainer}>

              <View style={styles.textHeaderContainerHalf}>
                <Text style={styles.textHeaderTitle} allowFontScaling={false}>Ventas</Text>
                <Text style={styles.textHeaderData} allowFontScaling={false}>230</Text>
              </View>

              <View style={styles.textHeaderContainerHalf}>
                <ProgressChart
                  data={data1}
                  width={75}
                  height={40}
                  strokeWidth={8}
                  radius={16}
                  chartConfig={chartConfig}
                  hideLegend={true}
                />
              </View>

            </View>

          </View>

        </View>

      </View>

      <View style={styles.dtesContainer}>
        <View style={styles.subDataContainer}>


        </View>

      </View>

      <View style={styles.graphContainer}>
        <View style={styles.subDataContainer}>
          <LineChart
            data={dataLine}
            width={300}
            height={100}
            chartConfig={chartConfigLineChart}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            bezier
            xAxisLabel={'a,b,c,d,e'}
            fromZero={true}
            verticalLabelRotation={90}
            yAxisLabel={'Q.'}
            xLabelsOffset={20}
            verticalLabelRotation={90}
            xAxisLabel={'Mes'}
          />

        </View>

      </View>

      */}

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







  textHeader:{
    color:"blue",
  },
  textHeaderContainer:{
    alignItems:'center',
    justifyContent:'center'
  },
  topContainer:{
    backgroundColor:"orange",
    alignItems:'center',
    justifyContent:'flex-end',

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
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 15,
  },




  headerContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
		marginBottom:10,
  },
	textHeader:{
    color:colorPalette.rgbColorPurple,
    fontSize:45,
		fontFamily: 'SansationBold',
  },
  textHeaderContainer:{
    width:'80%',
    height:'50%',
    alignItems:'center',
    justifyContent:'center'
  },
  textHeaderTitle:{
    color:'white',
    fontSize:15,
		fontFamily: 'AcuminVariableConcept',
		//marginLeft:20,
		//fontWeight:'bold',
  },
  textHeaderData:{
    color:'white',
    fontSize:17,
		fontFamily:'SansationBold',
		//fontWeight:'bold',
  },
  textHeaderContainerTitle:{
    //backgroundColor: colorPalette.rgbaColorBlackT,
    flex:0.30,
    width:'60%',
    // height:'50%',
    alignItems:'flex-start',
    flexDirection:'column',
    justifyContent:'center'
  },
  textHeaderContainerHalf:{
    //backgroundColor: colorPalette.rgbaColorBlackT,
    flex:0.48,
    // width:'60%',
    height:'100%',
    alignItems:'flex-start',
    flexDirection:'column',
    justifyContent:'center'
  },
  grayHalfContainer:{
    backgroundColor: colorPalette.rgbaColorBlackT,
    flexDirection:'row',
    flex:0.45,
    justifyContent:'center',
    borderRadius:10,
    borderBottomRightRadius:25,
  },
  subDataContainerHalf:{
    //backgroundColor: 'green',
    flexDirection:'column',
    //width:'90%',
    height:'90%',
    flex:0.48,
    justifyContent:'center',
    justifyContent:'space-between',
  },
  subDataContainerHalfOrange:{
    backgroundColor: colorPalette.rgbColorOrange,
    flexDirection:'column',
    //width:'90%',
    height:'90%',
    flex:0.48,
    justifyContent:'space-between',
    alignContent:'center',
    borderRadius:15,
    borderBottomRightRadius:55,
    paddingLeft:'5%',
  },

  subDataContainer:{
    //backgroundColor: colorPalette.rgbaColorBlackT,
    flexDirection:'row',
    width:'90%',
    flex:1,
    justifyContent:'space-between',
    alignContent:'center',
    alignItems:'center',
  },
  infoContainer:{
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',
    //backgroundColor: 'red',
    flex: 2,
  },

  dtesContainer:{
		justifyContent:'center',
		alignItems:'center',
		//backgroundColor: 'pink',
		flex: 2,
	},

  graphContainer:{
		justifyContent:'center',
		alignItems:'center',
		//backgroundColor: 'brown',
		flex: 2,
	},

  // headerContainer:{
  //   backgroundColor: colorPalette.rgbaColorBlack,
  //   //flex:1,
  //   alignItems:'center',
  //   justifyContent:'center',
  //   marginRight:15,
  //   borderRadius:90,
  //   width: wp('12%'),
  //   height: hp('6%'),
  //   // width:'12%',
  //   // height:'50%',
  // },
  subHeaderContainer:{
    // width:'20%',
    // height:'40%',
    alignItems:'center',
    justifyContent:'center',
    alignContent:'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header:{
    backgroundColor: 'white',
    width: '100%',
    height: '16%',
    //  height: '25%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center'
  },
  modal:{
    flex:1,
    flexDirection:'column'
  },
  menuContainer:{
    width:'100%',
    //width:'70%',
    height:'25%',
    //height:'50%',
    backgroundColor:'white'
  },
  menuHeaderContainer:{
    width:'100%',
    height:'25%',
    flexDirection:'row'
  },
  menuBodyContainer:{
    width:'100%',
    height:'75%',
    flexDirection:'column',
    backgroundColor:colorPalette.rgbColor,
    justifyContent: 'space-around'
  },
  menuLine:{
    height:'1%',
    backgroundColor:'white'
  },
  menuLogo:{
    marginLeft:'10%',
    width:'80%',
    height:'100%'
		//width: wp('30%'),//80
    //height: hp('20%'),//
  },
  menuText:{
    fontSize:20,
    color:'white',
    marginLeft:'5%'
    //marginLeft:'10%'
  },
  primaryGray:{
    flex:1,
    height:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  menuTouch:{
    justifyContent:'center'
  },
  body:{
    flexDirection: 'column',
    width:'100%',
    height:'100%',
		//alignItems:'center',
		//justifyContent:'center',
  },
  logo:{
    // width: '20%',
    // height: '20%',
    marginLeft: '10%',
    width: wp('18%'),
    height: hp('10%'),
    resizeMode: 'contain'
  },
  headerIcon:{
    //marginRight: '2%'
  },
  sectionTouch:{
    marginTop:'3%',
    backgroundColor:colorPalette.homeButtons,
    width:'100%',
    height:'15%',
		//width: wp('100%'),
		//height: hp('12%'),
    flexDirection:'row',
    alignItems:'center',
		justifyContent:'center',
  },
  sectionTouchText:{
    marginTop:'3%',
    marginLeft:'5%',
    fontSize:15,
    color:'white'
    //marginTop:'1%',
    //marginLeft:'10%',
    //fontSize: hp('4%'),
    //color:'white'
  },
  genContainer:{
		justifyContent:'center',
		alignItems:'center',
		flex: 1.5,
	},

  createButton:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
		alignContent:'center',
		backgroundColor:"orange",
		width:'45%',
		height:'80%',
		marginTop:5,
		borderRadius:10,
		borderBottomRightRadius:20,
		paddingTop:'2%',
		paddingBottom:'10%',
  },
  buttonText:{
		color:'white',
		fontSize:12,
	},





});

export default Home;
