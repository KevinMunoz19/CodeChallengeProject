import React, {Fragment,useState,useEffect} from 'react';
import Icon from "react-native-vector-icons/MaterialIcons";

import {
	Text,
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    Button,
    Image,
}	from 'react-native';

const RatingDisplay = () =>{

  const [stars,setStars] = useState([<Icon name="star" color="white" size={10} style={styles.headerIcon} />]);
  useEffect(() => {
    var starsToRender =[];
    starsToRender.push(<Icon name="star" color="white" size={10} style={styles.headerIcon} />);
    starsToRender.push(<Icon name="star" color="white" size={10} style={styles.headerIcon} />);
    starsToRender.push(<Icon name="star-border" color="white" size={10} style={styles.headerIcon} />);
    starsToRender.push(<Icon name="star-half" color="white" size={10} style={styles.headerIcon} />);
    setStars([...stars,starsToRender]);
  },[])

	return(
    <View style={[styles.item]}>
      {stars.map((value) => {
        return value
      })}
    </View>
	);

}

const styles = StyleSheet.create({
  headerIcon:{
    //marginRight: '2%'
  },
  item: {
    backgroundColor: 'green',
    justifyContent:'center',
		alignItems:'center',
    flex: 1,
    flexDirection:'row',
  },

})

export default RatingDisplay;
