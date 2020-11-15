import React, { Component } from 'react';
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
import GlobalColors from '../colors/GlobalColors';
import RatingDisplay from './RatingDisplay';

export default class SerieDisplayPureComponent extends React.PureComponent {
  render() {
    return(
      <TouchableOpacity onPress={this.props.onPress} style={styles.item} disabled={this.props.disabledTouch}>
        <Image
          style={styles.tinyLogo}
          source={{uri:this.props.displayImage}}
        />
        <View style={styles.itemTitleContainer}>
          <Text style={styles.itemTitle}>{(this.props.titleEn)?(this.props.titleEn):(this.props.titleEnJp)?(this.props.titleEnJp):(itemData.attr.titles.titleJa)?(itemData.attr.titles.titleJa):(itemData.attr.titles.titleCa)}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    height:260,
    width:125,
    backgroundColor: GlobalColors.AnalogousColor,
    justifyContent:'center',
		alignItems:'center',
    flex:1,
    marginHorizontal: 4,
		borderRadius:20,
		padding:10,
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
  itemTitleContainer: {
    backgroundColor: 'transparent',
    justifyContent:'center',
		alignItems:'center',
    flex:1,
  },
  itemTitle: {
    fontSize: 20,
		color:GlobalColors.LetterColor,
		fontFamily:"Dosis-Regular",
  },
  tinyLogo: {
    width: 100,
    height: 180,
    borderRadius:10,
  }
})
