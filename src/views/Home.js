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
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const Home = (props) => {
  const [loading,setLoading] = useState(false);
	const [dimensions, setDimensions] = useState({ window, screen });
	const [dataFL,setDataFL] = useState([]);
  const [isRefreshing,setIsRefreshing] = useState(false);
	const [apiURL,setApiURL] = useState("");
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

	useEffect(()=>{
		//console.log("next link ",props.nextLink);
		//console.log("data ",props.dataApi);
		setApiURL(props.nextLink);
		setDataFL([ ...dataFL, ...props.dataApi]);
		//getFromApi();
	},[]);

	const getFromApi = () => {
		console.log("Entrada getFromApi con link ",apiURL);
    getAnimeData(apiURL,(res)=> {
      let jsonResponse = JSON.parse(res);
      let seriesData = jsonResponse.data;
			setApiURL(jsonResponse.links.next);
			var arrayRecoveredData = seriesData.map(element => element);
			setDataFL([ ...dataFL, ...arrayRecoveredData]);
    }, (err) => {
      console.log("Respuesta no exitosa ",err);
    });
  }

	const Item = ({ itemData,onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item]}>
      <Image
        style={styles.tinyLogo}
        source={{uri:itemData.attributes.posterImage.medium}}
      />
    </TouchableOpacity>
  );
  const renderItem = ({ item }) => (
    <Item itemData={item} onPress={() => onSeriesSelected(item)}/>
  );
  const onSeriesSelected = (itemData) => {
    console.log("id ",itemData.id);
		Actions.details({singleSerie: itemData.id });

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
				onRefresh={onRefresh}
				refreshing={isRefreshing}
				onEndReachedThreshold={0.1}
				onEndReached={({ distanceFromEnd }) => {
					if(distanceFromEnd >= 0) {
						console.log("end reached");
						onRefresh();
					}
				}}
			/>
    </View>
  );
};

const styles = StyleSheet.create({
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
