/**
 * @created at Aug 1, 2019 14:32
 * @author chensai@tonknet.com
 * @abstract 文件选择器
 * @class FilePicker
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	NativeModules,
	Animated,
	Platform,
} from 'react-native';
import { px2dp, fontSize, colors,android } from '../tools';
import ActionSheet from './ActionSheet'
import ImagePicker from 'react-native-image-picker';
const FileTypes = Platform.select({
	ios:{
		txt:['public.text','public.plain-text','public.utf8-plain-text','public.utf16-external-plain-​text','public.utf16-plain-text','com.apple.traditional-mac-​plain-text',],
		html:['public.html','public.xhtml',],
		doc:['com.microsoft.word.doc','com.microsoft.word.wordml','org.openxmlformats.wordprocessingml.document'],
		xls:['com.microsoft.excel.xls','org.openxmlformats.spreadsheetml.sheet'],
		pdf:['com.adobe.pdf',],
		ppt:['com.microsoft.powerpoint.​ppt','org.openxmlformats.presentationml.presentation','public.presentation',],
		png:['public.png',],
		jpg:['public.jpeg',],
		gif:['com.compuserve.gif',],
		svg:['public.xml',],
		ico:['com.microsoft.ico',],
		bmp:['com.microsoft.bmp',],
		key:['com.apple.keynote.key','com.apple.iwork.keynote.key','com.apple.iwork.keynote.kth',],
		numbers:['com.apple.numbers.numbers','com.apple.iwork.numbers.numbers','com.apple.iwork.numbers.template',],
		pages:['com.apple.page.pages','com.apple.iwork.pages.pages','com.apple.iwork.pages.template',],
		image:['public.image',],
		audio:['public.audio'],
		movie:['public.movie'],
	},
	android:{
		image:'png|jpg|jpeg',
		audio:'mp3',
		movie:'mp4|avi|mov|mpg'
	},
})
const Base64Prefix = {
	txt:'data:text/plain;base64,',
	doc:'data:application/msword;base64,',
	docx:'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,',
	xls:'data:application/vnd.ms-excel;base64,',
	xlsx:'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
	pdf:'data:application/pdf;base64,',
	pptx:'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,',
	ppt:'data:application/vnd.ms-powerpoint;base64,',
	png:'data:image/png;base64,',
	jpg:'data:image/jpeg;base64,',
	gif:'data:image/gif;base64,',
	svg:'data:image/svg+xml;base64,',
	ico:'data:image/x-icon;base64,',
	bmp:'data:image/bmp;base64,',
	get:function(type){
		return this[type]||'data:image/png;base64,'
	}
}
export default class FilePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			positionAni: new Animated.Value(-240),
		};
	}
	onCancel() {
		this.dismiss()
	}
	show(callback) {
		this.callback = callback
		this.refs.actionSheet.show(callback)
	}
	dismiss(callback) {
		this.refs.actionSheet.dismiss(callback)
	}
	async pickerAlbum() {
		var options = {
			title: '选择照片',
			cancelButtonTitle: '取消',
			takePhotoButtonTitle: '拍照',
			chooseFromLibraryButtonTitle: '选择照片',
			cameraType: 'back',
			mediaType: 'photo',
			videoQuality: 'high',
			durationLimit: 10,
			maxWidth: 1500,
			maxHeight: 1500,
			quality: 0.8,
			angle: 0,
			allowsEditing: false,
			noData: false,
			storageOptions: {
				skipBackup: true
			},
			permissionDenied: {
				title: '权限不足',
				text: '多特瑞需要访问您的相册和相机权限',
				reTryTitle: '去设置',
				okTitle: '知道了'
			}
		}
		this.dismiss(()=>{
			setTimeout(() => {
				ImagePicker.launchImageLibrary(options, (response) => {
					response.data = Base64Prefix.get('png') + response.data
					this.callback(response)
				})
			}, 100);
			
		})
		
	}
	async pickerFolder() {
		let {accept=[]} = this.props
		this.dismiss(()=>{
			setTimeout(async() => {
				let filter = null
				if(android){
					let filterAndroid = accept.map(item=>FileTypes[item]||item).join('|')
					filter =  filterAndroid ? `.*\\\.(${filterAndroid})$`:''
				} else {
					filter = accept.length ? accept.map(item=>FileTypes[item]||item).flatMap(item=>item):['public.content']
				}
				let response = await NativeModules.RNFilePicker.pickerFile(filter)
				response.data = Base64Prefix.get(response.type) + response.data
				this.callback(response)
			},100)
			
		})
	}
	render() {
		return (
			<View>
				<ActionSheet ref='actionSheet'>
					<ActionSheet.Item onPress={() => this.pickerAlbum()} title={'相册'}/>
					<ActionSheet.Item onPress={() => this.pickerFolder()} title={'文件夹'}/>
				</ActionSheet>
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
		lineHeight: px2dp(40),
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
		height: px2dp(56),
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
