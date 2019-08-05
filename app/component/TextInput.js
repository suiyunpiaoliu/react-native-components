/**
 * @created at Aug 3, 2019 22:56
 * @author chensai@tonknet.com
 * @abstract TextInput
 * @class TextInput
 */
import React, { Component } from 'react';
import {
  StyleSheet,
	Text,
	TextInput,
  View,
} from 'react-native';
import { layoutStyle, textStyle, borderStyle } from '../tools';
import { hidden } from 'ansi-colors';


export default class RNTextInput extends Component {
    constructor(props) {
				super(props);
        this.state= {
					error:false,
					message:null,
				};
		}
		onBlur(){
			let {onBlur,rules=[],value} = this.props
			let {message,error} = this.state
			rules.forEach(rule => {
				if(rule.trigger == 'blur') {
					error = !rule.pattern.test(value)
					if(error) message = rule.message
					this.setState({error,message})
				}
			});
			onBlur&&onBlur(value,!error)
		}
		onChangeText(value){
			let {onChangeText,rules=[]} = this.props
			let {message,error} = this.state
			rules.forEach(rule => {
				if(rule.trigger == 'change') {
					error = !rule.pattern.test(value)
					if(error) message = rule.message
					this.setState({error,message})
				}
			});
			onChangeText&&onChangeText(value,!error)
		}
    render(){
				let {style,prefix,suffix} = this.props
				let {error,message} = this.state
				let s_layout = layoutStyle(style)
				let s_text = textStyle(style)
				let s_border = borderStyle(style)
				let height = s_layout.height
				if(error) {
					s_layout.height += 20
				}
				
        return (
					<View style={[styles.default,s_layout]}>
						<View style={[styles.inputContainer,s_border,error?styles.error:null,{height}]}>
							{prefix}
							<TextInput {...this.props} onBlur={()=>this.onBlur()} onChangeText={(value)=>this.onChangeText(value)} style={[styles.input,s_text]} />
							{suffix}
						</View>
						{error?<Text style={styles.errormsg}>{message}</Text>:null}
					</View>
        )
    }
}

const styles = StyleSheet.create({
	default: {
		height:30,
	},
	inputContainer: {
		flexDirection:'row',
		borderColor:'#f0f0f0',
		borderWidth:1,
		borderRadius:4,
		alignItems:'center',
		overflow:'hidden',
	},
	input: {
		flex:1,
		height:'100%',
	},
	error: {
		borderColor:'red',
	},
	errormsg: {
		color:'red',
		fontSize:12,
		marginTop:5,
	},
});
  