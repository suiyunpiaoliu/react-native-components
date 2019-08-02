/**
 * @created at Jul 29, 2019 21:50
 * @author chensai@tonknet.com
 * @abstract BaseComponent
 * @class BaseComponent
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class BaseComponent extends Component {
	ClassName = 'BaseComponent'
    constructor(props) {
        super(props);
        this.state= {};
		}
		componentDidMount() {
			
		}
    render(){
        return (
					<View></View>
        )
    }
}

const styles = StyleSheet.create({
});
  