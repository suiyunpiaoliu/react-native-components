/**
 * @created at Jul 24, 2019 16:58
 * @author chensai@tonknet.com
 * @abstract Root
 * @class Root
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import {DatePicker,ActionSheet,Pickers} from './component'
import BaseComponent from './component/BaseComponent'
export default class Root extends BaseComponent {
	ClassName = 'Root'
	constructor(props) {
		super(props);
		this.state = {
			format:'YYYY-MM',
			dateSelect:'2019-07',
			pickerSelect:[],
		};
	}
	componentDidMount(){
		super.componentDidMount()
	}
	onConfirm(dateSelect){
		this.setState({dateSelect})
	}
	onPickerConfirm(pickerSelect){
		console.log(pickerSelect)
		this.setState({pickerSelect})
	}
	onValueChange(item,index){
		console.log(item,index)
	}
	getClassName(){
		let s = this.constructor.toString()
		let index = s.indexOf('(props)') 
		let startIndex = s.indexOf('function ') + 9

		return s.substring(startIndex,index)
	}
	showPicker(){
		this.refs.picker.show()
	}
	showDatePicker(){
		this.refs.datePicker.show()
	}
	showActionSheet(){
		this.refs.actionSheet.show()
	}
	render() {
		return (
			<View style={styles.container}>
				<ScrollView>
				<TouchableOpacity style={styles.button} onPress={()=>this.showPicker()}><Text>显示Picker</Text></TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={()=>this.showDatePicker()}><Text>显示DatePicker</Text></TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={()=>this.showActionSheet()}><Text>显示ActionSheet</Text></TouchableOpacity>
					<Pickers
						ref='picker'
						title='请选择'
						onValueChange={(item, index) => this.onValueChange(item, index)}
						onConfirm={(value) => this.onPickerConfirm(value)}
						selected={this.state.pickerSelect}
						numColumns={2}
						options={[[{label:'C',value:'C'},{label:'Script',value:'Script'}],[{label:'C',value:'C'},{label:'Script',value:'Script'}]]}
					/>
					<DatePicker
						ref='datePicker'
						title='请选择时间'
						onValueChange={(item,index)=>this.onValueChange(item,index)}
						onConfirm={(value)=>this.onConfirm(value)}
						selected={this.state.selected}
						format={this.state.format}
						from={new Date(2000,0,1)}
						to={new Date(2036,11,31)}
					/>
					<ActionSheet ref='actionSheet'>
						<ActionSheet.Item onPress={()=>console.log('ceshi')} title={'测试1'}/>
						<ActionSheet.Item onPress={()=>console.log('ceshi2')} title={'测试2'}/>
						<ActionSheet.Item onPress={()=>console.log('ceshi3')} title={'测试2'}/>
					</ActionSheet>
				</ScrollView>
			</View>
			
		)
	}
}

const styles = StyleSheet.create({
	container:{
	},
	button: {
		height:50,
		width:'80%',
		backgroundColor:'orange',
		alignSelf:'center',
		alignItems:'center',
		marginTop:10,
		justifyContent:'center',
		flexDirection:'row',
	}
});
