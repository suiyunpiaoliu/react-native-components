/**
 * @created at Aug 8, 2019 14:13
 * @author chensai@tonknet.com
 * @abstract 按钮组件
 * @class Button
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
} from 'react-native';
import { layoutStyle, textStyle, shadowStyle, borderStyle, flexStyle } from '../tools'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Ionicons';
// 文字、图片相对位置
const ICONPOSITION = {
	left: 'left',
	right: 'right',
	top: 'top',
	bottom: 'bottom',
}
export default class Button extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	static propTypes = {
		title: PropTypes.string,
		icon: PropTypes.string,
		style: PropTypes.object,
		onPress: PropTypes.func,
		disabled: PropTypes.bool,
		iconPosition: PropTypes.string,
		backgroundImage:PropTypes.oneOfType(PropTypes.string,PropTypes.object),
		children:PropTypes.array,
	}
	static defaultProps = {
		disabled: false,
		iconPosition: ICONPOSITION.top,
		children:[],
	}

	_renderButton() {
		let { title, icon, style, iconPosition,backgroundImage,children } = this.props
		if(children.length == undefined)children = [children]
		let flexS = flexStyle(style)
		let titleStyle = textStyle(style)
		switch (iconPosition) {
			case ICONPOSITION.left:
				return (
					<View style={[{ flex: 1, flexDirection: 'row' }, flexS]}>
						{backgroundImage ? <Image source={backgroundImage} style={styles.bgImage}/>:null}
						{icon ? <Icon size={titleStyle.fontSize || 14} name={icon} color={titleStyle.color || 'white'} /> : null}
						{title?<Text style={titleStyle}>{title}</Text>:null}
						{children.map(item=>item)}
					</View>
				)
			case ICONPOSITION.right:
				return (
					<View style={[{ flex: 1, flexDirection: 'row' }, flexS]}>
						{backgroundImage ? <Image source={backgroundImage} style={styles.bgImage}/>:null}
						{title?<Text style={titleStyle}>{title}</Text>:null}
						{children.map(item=>item)}
						{icon ? <Icon size={titleStyle.fontSize || 14} name={icon} color={titleStyle.color || 'white'} /> : null}
					</View>
				)
			case ICONPOSITION.top:
					return (
						<View style={[{ flex: 1 }, flexS]}>
							{backgroundImage ? <Image source={backgroundImage} style={styles.bgImage}/>:null}
							{icon ? <Icon size={titleStyle.fontSize || 14} name={icon} color={titleStyle.color || 'white'} /> : null}
							{title?<Text style={titleStyle}>{title}</Text>:null}
							{children.map(item=>item)}
						</View>
					)
			case ICONPOSITION.bottom:
					return (
						<View style={[{ flex: 1}, flexS]}>
							{backgroundImage ? <Image source={backgroundImage} style={styles.bgImage}/>:null}
							{title?<Text style={titleStyle}>{title}</Text>:null}
							{children.map(item=>item)}
							{icon ? <Icon size={titleStyle.fontSize || 14} name={icon} color={titleStyle.color || 'white'} /> : null}
						</View>
					)
		}
	}
	render() {
		let { style, onPress, disabled } = this.props
		let container = layoutStyle(style)
		let shadow = shadowStyle(style)
		let border = borderStyle(style)

		return (
			<TouchableOpacity style={[container, shadow, border]} onPress={disabled ? null : onPress}>
				{this._renderButton()}
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	bgImage: {
		position:'absolute',
		left:0,
		right:0,
		width:'100%',
		height:'100%',
		resizeMode:'stretch',
	}
});
