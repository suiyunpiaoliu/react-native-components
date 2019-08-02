/**
 * @created at Jul 24, 2019 14:34
 * @author chensai@tonknet.com
 * @abstract Picker
 * @class Picker
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
	View,
	Picker,
	Modal,
	TouchableOpacity,
	Animated,
	Easing
} from 'react-native';

export default class Pickers extends Component {
    constructor(props) {
        super(props);
        this.state= {
					selected:[],
					show:false,
					positionAni:new Animated.Value(-240),
				};
		}
		onCancel(){
			this.dismiss()
		}
		show(){
			let {selected = this.state.selected} = this.props
			this.setState({
				show:true,
				selected,
			},()=>{
				Animated.timing(                  // 随时间变化而执行动画
					this.state.positionAni,            // 动画中的变量值
					{
						easing: Easing.ease,
						toValue: 0,                   // 透明度最终变为1，即完全不透明
						duration: 300,              // 让动画持续一段时间
					}
				).start();  
			})
		}
		dismiss(){
			Animated.timing(                  // 随时间变化而执行动画
				this.state.positionAni,            // 动画中的变量值
				{
					easing: Easing.ease,
					toValue: -240,                   // 透明度最终变为1，即完全不透明
					duration: 300,              // 让动画持续一段时间
				}
			).start(()=>{
				this.setState({
					show:false
				})
			});  
			
		}
		onConfirm(){
			let {onConfirm,numColumns = 1,options,} = this.props
			let {selected} = this.state
			if(numColumns == 1 ) {
				if(!selected[0]) selected[index] = options[0]
			} else {
				for (let index = 0; index < numColumns; index++) {
					if(!selected[index] && options[index][0]){
						selected[index] = options[index][0]
					} else if(!options[index][0]){
						selected[index] = undefined
					}
				}
			}
			console.log(selected)
			onConfirm && onConfirm(selected)
			this.dismiss()
		}
		onValueChange(item,index){
			let {onValueChange,numColumns = 1,options} = this.props
			onValueChange && onValueChange(item,index)
			let {selected} = this.state
			selected[index] = item
			if(numColumns != 1) {
				for (let index2 = index + 1; index2 < numColumns; index2++) {
					selected[index2] = options[index2][0]
				}
			}
			this.setState({selected})
			
		}
		_renderColumns(){
			let {
				options,
				numColumns=1,
				labelName = 'label',
				valueName = 'value'
			} = this.props
			if(!(options&&options.length))return
			if(numColumns == 1){
				return (
					<View style={styles.scrollContainer}>			
						<Picker
							selectedValue={(this.state.selected[0]||{})[valueName]}
							style={{flex:1}}
							itemStyle={{fontSize:14,color:'#333'}}
							onValueChange={(itemValue, itemIndex) => this.onValueChange(options[itemIndex],0)}>
								{options.map(item=><Picker.Item key={item[labelName]+item[valueName]} label={item[labelName]} value={item[valueName]} />)}
						</Picker>
					</View>
					)
			} else {
				let pickers = []
				for (let index = 0; index < numColumns; index++) {
					pickers.push(
						<Picker
							selectedValue={(this.state.selected[index]||{})[valueName]}
							key={index}
							style={{flex:1}}
							itemStyle={{fontSize:14,color:'#333'}}
							onValueChange={(itemValue, itemIndex) => this.onValueChange(options[index][itemIndex],index)}>
								{options[index].map(item=><Picker.Item key={item[labelName]+item[valueName]} label={item[labelName]} value={item[valueName]} />)}
						</Picker>
					)
				}
				return (
					<View style={styles.scrollContainer}>
						{pickers.map(item=>item)}
					</View>
				)
			}
		}
    render(){
				let {
					title='请选择',
					cancelText='取消',
					confirmText='确定',
				} = this.props
        return (
					<View>
						<Modal
						animationType="fade"
						transparent={true}
						visible={this.state.show}
						>
							<View style={styles.container}>
								<TouchableOpacity style={styles.cover} onPress={()=>this.onCancel()}>
									<View style={styles.cover}></View>
								</TouchableOpacity>
								<Animated.View style={[styles.pickerContainer,{bottom:this.state.positionAni}]}>
									<View style={styles.toolBar}>
										<TouchableOpacity onPress={()=>this.onCancel()} style={styles.toolButton}><Text style={styles.buttonTitle}>{cancelText}</Text></TouchableOpacity>
										<Text style={styles.title}>{title}</Text>
										<TouchableOpacity onPress={()=>this.onConfirm()} style={styles.toolButton}><Text style={styles.buttonTitle}>{confirmText}</Text></TouchableOpacity>
									</View>
									{this._renderColumns()}
								</Animated.View>
							</View>
							
						</Modal>
						
					</View>
        )
    }
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'rgba(0,0,0,0.2)'
	},
	cover:{
		flex:1,
	},
	pickerContainer:{
		backgroundColor:'white',
		height:240,
		width:'100%',
		position:'absolute',
	},
	toolBar:{
		height:40,
		backgroundColor:'#999',
		flexDirection:'row',
		alignItems:'center',
	},
	toolButton:{
		flex:1,
		height:'100%',
	},
	title:{
		flex:4,
		textAlign:'center',
		lineHeight:40,
		color:'white',
	},
	buttonTitle:{
		textAlign:'center',
		lineHeight:40,
		color:'white',
	},
	scrollContainer:{
		flex:1,
		flexDirection:'row',
		height:200,
	}
});
  