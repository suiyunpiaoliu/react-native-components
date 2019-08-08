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
	ScrollView,
} from 'react-native';
import {
	DatePicker,
	ActionSheet,
	Pickers,
	FilePicker,
	TextInput,
	Button,
} from './component'
import BaseComponent from './component/BaseComponent'
export default class Root extends BaseComponent {
	ClassName = 'Root'
	constructor(props) {
		super(props);
		this.state = {
			format:'YYYY-MM',
			dateSelect:'2019-07',
			pickerSelect:[],
			text:'',
			validate:true,
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
	showFilePicker(){
		this.refs.filePicker.show((response)=>{
			console.log(response)
		})
	}
	render() {
		return (
			<View style={styles.container}>
				<ScrollView>
				<Button 
					style={styles.button} 
					onPress={()=>this.showPicker()} 
					title={'显示Picker'}
					backgroundImage={require(`./assets/bgc.jpg`)}
				/>
					<Button 
					icon='ios-battery-charging' 
					style={styles.button} 
					onPress={()=>this.showDatePicker()} 
					title={'显示DatePicker'}
					backgroundImage={require(`./assets/bgc.jpg`)}
					/>
					<Button style={styles.button} onPress={()=>this.showActionSheet()} />
					<Button style={styles.button} onPress={()=>this.showFilePicker()} title={'显示FilePicker'}/>
					<Button style={styles.button} onPress={()=>this.showFilePicker()}>
						<Text>显示文件夹</Text>
						<Text>显示文件夹</Text>
					</Button>
					<TextInput 
						style={{height:35,width:300,marginTop:4,alignSelf:'center',fontSize: 16,borderWidth:1,borderColor:'#f0f0f0'}}
						value={this.state.text}
						placeholder={'请填写'}
						onChangeText={(text,validate)=>this.setState({text,validate})}
						rules={[{pattern:/^\d+$/,trigger:'change',message:'格式错误'}]}
						prefix={<View style={{backgroundColor:'#f0f0f0',height:'100%'}}><Text style={{lineHeight:30,paddingHorizontal:5,fontSize:16}}>￥</Text></View>}
						suffix={<View style={{backgroundColor:'#f0f0f0',height:'100%'}}><Text style={{lineHeight:35,paddingHorizontal:10,}}>@</Text></View>}
					/>
					
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
					<FilePicker accept={['pdf','image','doc']} ref='filePicker'/>
				</ScrollView>
			</View>
			
		)
	}
}

const styles = StyleSheet.create({
	container:{
		backgroundColor:'white',
		flex:1,
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
		fontSize:20,
		color:'red',
	}
});
