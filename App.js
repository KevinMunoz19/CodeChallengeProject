import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Scene, Router, Stack, Tabs, Actions, ActionConst } from 'react-native-router-flux';
import Init from './src/views/Init';
import Home from './src/views/Home';
import Details from './src/views/Details';
import Search from './src/views/Search';

const App = () => {
  const [loading,setLoading] = useState(false);
  return (
    <Router>
      <Stack>
        <Scene key="init" component={Init} hideNavBar={true} title="Inicio" initial={true}/>
        <Scene key="home" component={Home} hideNavBar={true} title="Home"/>
        <Scene key="details" component={Details} hideNavBar={true} title="Details"/>
        <Scene key="search" component={Search} hideNavBar={true} title="Search"/>
      </Stack>
    </Router>
  );
};

export default App;
