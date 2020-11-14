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

export default class SerieDisplayPureComponent extends React.PureComponent {
  render() {
    return(
      <TouchableOpacity onPress={this.props.onPress} style={[styles.item]} disabled={this.props.disabledTouch}>
        <Image
          style={styles.tinyLogo}
          source={{uri:this.props.displayImage}}
        />
        <View style={[styles.itemTitle]}>
          <Text>{(this.props.titleEn)?(this.props.titleEn):(this.props.titleEnJp)?(this.props.titleEnJp):(itemData.attr.titles.titleJa)}</Text>
        </View>
      </TouchableOpacity>
    )
  }
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
