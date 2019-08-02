/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from "react";
import {
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Root from './app/Root'
import {} from './app/category'

const App = () => {
  return (
    <Fragment>
      <SafeAreaView>
      <Root/>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
