import React, {Fragment,useState,useEffect} from 'react';
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
import RatingDisplay from './RatingDisplay';
const SerieDisplay = ({itemData,onPress}) =>{

	return(
    <TouchableOpacity onPress={onPress} style={[styles.item]}>
      <Image
        style={styles.tinyLogo}
        source={{uri:itemData.mediumImage}}
      />
      <View style={[styles.itemRating]}>
        <RatingDisplay/>
      </View>
      <View style={[styles.itemTitle]}>
        <Text>{(itemData.attr.titles.en)?(itemData.attr.titles.en):(itemData.attr.titles.en_jp)?(itemData.attr.titles.en_jp):(itemData.attr.titles.ja_jp)}</Text>
      </View>
    </TouchableOpacity>
	);

}

const styles = StyleSheet.create({

  item: {
    height:250,
    width:125,
    backgroundColor: '#f9c2ff',
    justifyContent:'center',
		alignItems:'center',
    flex:1,
    marginHorizontal: 4,
  },
  itemImage: {
    backgroundColor: 'red',
    justifyContent:'center',
		alignItems:'center',
    flex:6,

  },
  itemRating: {
    backgroundColor: 'blue',
    justifyContent:'center',
		alignItems:'center',
    flex:0.5,
  },
  itemTitle: {
    backgroundColor: 'orange',
    justifyContent:'center',
		alignItems:'center',
    flex:1,
  },
  title: {
    fontSize: 32,
  },
  tinyLogo: {
    width: 100,
    height: 180,
    borderRadius:10,
  }
})

export default SerieDisplay;
