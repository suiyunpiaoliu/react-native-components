/**
 * @created at Jul 26, 2019 10:37
 * @author chensai@tonknet.com
 * @abstract 时间选择器
 * @class DatePicker
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';
import Pickers from './Pickers'
import PropTypes from 'prop-types'
import { generator } from '../tools'
export default class DatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			options:[],
			selected:[],
			numColumns:6,
		}
		let date = new Date
		this.default_earliest = new Date(1700,0,1)
		this.default_latest = new Date(date.getFullYear()+50,11,31,23,59,59)
		this.now = {
			year: date.getFullYear(),
			month: date.getMonth(),
			day: date.getDate(),
			hour: date.getHours(),
			minute: date.getMinutes(),
			second: date.getSeconds()
		}

	}
	static propTypes = {
		format:PropTypes.string,
		onConfirm:PropTypes.func,
		title:PropTypes.string,
	}	

	initData(props,callback) {
		let date = new Date
		let numColumns = 6
		let {
			from = this.default_earliest,
			to = this.default_latest,
			selected,
			format = 'YYYY-MM-dd HH:mm:ss',
		} = props
		numColumns = format.split(/[-:\s]/).length
		if(selected) {
			selected = selected.split(/[-:\s]/).map(item=>{return{label:item,value:item}})
		}
		let options = []
		let year = generator((i) => { return { label: from.getFullYear() + i + '', value: from.getFullYear() + i + '' } }, to.getFullYear() - from.getFullYear() + 1)
		let month = generator((i) => { return i < 9 ? { label: '0' + (i + 1), value: '0' + (i + 1) } : { label: '' + (i + 1), value: '' + (i + 1) } }, 12)
		let day = generator((i) => { return i < 9 ? { label: '0' + (i + 1), value: '0' + (i + 1) } : { label: '' + (i + 1), value: '' + (i + 1) } }, date.lastDayOfMonth())
		let hour = generator((i) => { return i < 10 ? { label: '0' + i, value: '0' + i } : { label: '' + i, value: '' + i } }, 24)
		let minute = generator((i) => { return i < 10 ? { label: '0' + i, value: '0' + i } : { label: '' + i, value: '' + i } }, 60)
		let second = generator((i) => { return i < 10 ? { label: '0' + i, value: '0' + i } : { label: '' + i, value: '' + i } }, 60)
		let tempOptions = {
			'YYYY':year,
			'MM':month,
			'dd':day,
			'HH':hour,
			'mm':minute,
			'ss':second,
		}
		let formatComponents = format.split(/[-:\s]/)
		formatComponents.forEach((item,index) => {
			options[index] = tempOptions[item]
		});
		let now = this.now
		this.setState({
			options,
			selected:selected || [{ label: now.year+'', value: now.year+'' }, month[now.month], day[now.day - 1], hour[now.hour], minute[now.minute], second[now.second]],
			numColumns,
		},()=>{
			callback && callback()
		});
	}
	onValueChange(item, index) {
		let {
			format = 'YYYY-MM-dd HH:mm:ss',
		} = this.props
		let {
			options,
			selected,
		} = this.state
		let formatComponents = format.split(/[-:\s]/)
		let yearIndex = formatComponents.indexOf('YYYY')
		let monthInex = formatComponents.indexOf('MM')
		let dayInex = formatComponents.indexOf('dd')
		if(yearIndex != -1 && monthInex == index) {
			let year = parseInt(selected[yearIndex].value)
			let month = parseInt(item.value)
			let day = []
			if([1,3,5,7,8,10,12].includes(month)){
				day = generator((i) => { return i < 9 ? { label: '0' + (i + 1), value: '0' + (i + 1) } : { label: '' + (i + 1), value: '' + (i + 1) } }, 31)
			} else if(month != 2) {
				day = generator((i) => { return i < 9 ? { label: '0' + (i + 1), value: '0' + (i + 1) } : { label: '' + (i + 1), value: '' + (i + 1) } }, 30)
			} else {
				if(year%400 == 0 || (year%100 != 0 && year % 4 == 0)) {
					day = generator((i) => { return i < 9 ? { label: '0' + (i + 1), value: '0' + (i + 1) } : { label: '' + (i + 1), value: '' + (i + 1) } }, 29)
				} else {
					day = generator((i) => { return i < 9 ? { label: '0' + (i + 1), value: '0' + (i + 1) } : { label: '' + (i + 1), value: '' + (i + 1) } }, 28)
				}
			}
			options[dayInex] = day
			this.setState({options})
		}
	}
	onConfirm(value){
		let {onConfirm,format = 'YYYY-MM-dd HH:mm:ss',} = this.props
		values = value.map(item=>item.value)
		let formatComponents = format.split(/[-:\s]/)
		let dateStr = format
		for (const item of formatComponents) {
			dateStr = dateStr.replace(item,values[formatComponents.indexOf(item)])
		}
		onConfirm && onConfirm(dateStr)
	}
	show(){
		this.initData(this.props,()=>{
			this.refs.picker.show()
		})
	}
	render() {
		let {title} = this.props
		return (
			<View>
				<Pickers
					ref='picker'
					title={title}
					onValueChange={(item, index) => this.onValueChange(item, index)}
					onConfirm={(value) => this.onConfirm(value)}
					selected={this.state.selected}
					numColumns={this.state.numColumns}
					options={this.state.options}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
});