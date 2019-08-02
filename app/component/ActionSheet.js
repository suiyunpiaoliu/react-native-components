/**
 * @created at Aug 1, 2019 14:32
 * @author chensai@tonknet.com
 * @abstract 文件选择器
 * @class FilePicker
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Modal,
	TouchableOpacity,
	Animated,
	Easing,
} from 'react-native';
import { px2dp, fontSize, colors } from '../tools';

const TITLE_HEIGHT = px2dp(40)
const BUTTON_HEIGHT = px2dp(56)
const BOTTOM_HEIGHT = px2dp(30)

class Item extends Component {
	constructor(props) {
			super(props);
			this.state= {};
	}
	render(){
		let {style,titleStyle,title,last,onPress} = this.props
			return (
				<TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.button,style,last?styles.last:null]}>
					<Text style={[styles.btnTitle,titleStyle]}>{title}</Text>
				</TouchableOpacity>
			)
	}
}
export default class ActionSheet extends Component {
	static Item = Item
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			positionAni: new Animated.Value(-240),
			height:240,
		};
	}
	onCancel() {
		this.dismiss()
	}
	show(callback) {
		this.callback = callback
		let { children } = this.props
		let height = (children.length + 1) * BUTTON_HEIGHT + TITLE_HEIGHT + 10 + BOTTOM_HEIGHT
		console.log(height)
		this.setState({
			modalVisible: true,
			height,
		}, () => {
			Animated.timing(                  // 随时间变化而执行动画
				this.state.positionAni,            // 动画中的变量值
				{
					easing: Easing.ease,
					toValue: BOTTOM_HEIGHT,                   // 透明度最终变为1，即完全不透明
					duration: 300,              // 让动画持续一段时间
				}
			).start();
		})
	}
	dismiss(callback) {
		Animated.timing(                  // 随时间变化而执行动画
			this.state.positionAni,            // 动画中的变量值
			{
				easing: Easing.ease,
				toValue: - this.state.height,                   // 透明度最终变为1，即完全不透明
				duration: 300,              // 让动画持续一段时间
			}
		).start(() => {
			this.setState({
				modalVisible: false
			},()=>{
				callback&&callback()
			})
		});

	}
	render() {
		let {title='请选择',children=[]} = this.props
		let length = children.length
		let {height} = this.state
		return (
			<View>
				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.modalVisible}
				>
					<View style={styles.container}>
						<TouchableOpacity style={styles.cover} onPress={() => this.onCancel()}>
							<View style={styles.cover}></View>
						</TouchableOpacity>
						<Animated.View style={[styles.pickerContainer,{height,}, { bottom: this.state.positionAni }]}>
							<View style={styles.actions}>
								<View style={[styles.header, styles.first]}><Text style={styles.title}>{title}</Text></View>
								{children.map((item,index)=><Item {...item.props} last={index == length-1} key={'ActionItem'+index} onPress={()=>this.dismiss(item.props.onPress)}/>)}
							</View>

							<TouchableOpacity onPress={()=>this.dismiss()} activeOpacity={0.9} style={[styles.button, styles.cancelBtn]}><Text style={styles.btnTitle}>取消</Text></TouchableOpacity>
						</Animated.View>
					</View>
				</Modal>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.2)'
	},
	cover: {
		flex: 1,
	},
	pickerContainer: {
		// backgroundColor:'white',
		height: 240,
		width: '100%',
		position: 'absolute',
	},
	actions: {
	},
	header: {
		backgroundColor: 'white',
		width: px2dp(359),
		alignSelf: 'center',
		borderBottomColor: colors.theme_gray,
		borderBottomWidth: px2dp(1),
	},
	title: {
		color: colors.normal_text,
		fontSize: fontSize.normal,
		lineHeight: TITLE_HEIGHT,
		textAlign: 'center',
	},
	first: {
		borderTopLeftRadius: px2dp(14),
		borderTopEndRadius: px2dp(14)
	},
	last: {
		borderBottomLeftRadius: px2dp(14),
		borderBottomEndRadius: px2dp(14)
	},
	button: {
		height: BUTTON_HEIGHT,
		backgroundColor: 'white',
		alignItems: 'center',
		width: px2dp(359),
		alignSelf: 'center',
		borderBottomColor: colors.theme_gray,
		borderBottomWidth: px2dp(1),
	},
	cancelBtn: {
		borderRadius: px2dp(14),
		marginTop: px2dp(10),
	},

	btnTitle: {
		color: '#007AFF',
		backgroundColor: 'white',
		fontSize: fontSize.normal,
		lineHeight: px2dp(56),
	},
});
