import fontSize from './fontSize'
import colors from './colors'
import {Dimensions} from 'react-native'

const generator =(ruleFunc,num) => {
	let arr = []
	for (var i = 0; i < num; i++) {
		arr.push(ruleFunc(i))
	}
	return arr
}

const deviceW = Dimensions.get('window').width
const basePx = 375
const os = Platform.OS
const android = os == 'android'
const ios = os == 'ios'

const px2dp = (px) => {
    return px * deviceW / basePx
}

const filterStyle = (styles,keys)=>{
	let style = Object.assign({},...styles)
	let newStyle = {}
	Object.keys(style).forEach(key =>{
			if (keys.includes(key)) {
					newStyle[key] = style[key]
			}
	});
	return newStyle
}

const layoutStyle = (...styles)=>{
	const keys = ['alignContent','alignItems','alignSelf','aspectRatio','bottom','direction','display','end','flex','flexBasis','flexDirection','flexGrow','flexShrink','flexWrap','height','justifyContent','left','margin','marginBottom','marginEnd','marginHorizontal','marginLeft','marginRight','marginStart','marginTop','marginVertical','maxHeight','maxWidth','minHeight','minWidth','overflow','padding','paddingBottom','paddingEnd','paddingHorizontal','paddingLeft','paddingRight','paddingStart','paddingTop','paddingVertical','position','right','start','top','width','zIndex',]
	let newStyle = filterStyle(styles, keys)
	return newStyle
}
const borderStyle = (...styles)=>{
	const keys = ['borderEndWidth','borderStartWidth','borderRightColor','backfaceVisibility','borderBottomColor','borderBottomEndRadius','borderBottomLeftRadius','borderBottomRightRadius','borderBottomStartRadius','borderBottomWidth','borderColor','borderEndColor','borderLeftColor','borderLeftWidth','borderRadius','backgroundColor','borderRightWidth','borderStartColor','borderStyle','borderTopColor','borderTopEndRadius','borderTopLeftRadius','borderTopRightRadius','borderTopStartRadius','borderTopWidth','borderWidth','opacity','elevation',]
	let newStyle = filterStyle(styles, keys)
	return newStyle
}
const shadowStyle = (...styles)=>{
	const keys = ['shadowColor','shadowOffset','shadowOpacity','shadowRadius']
	let newStyle = filterStyle(styles, keys)
	return newStyle
}
const textStyle = (...styles)=>{
	const keys = ['textShadowOffset','color','fontSize','fontStyle','fontWeight','lineHeight','textAlign','textDecorationLine','textShadowColor','fontFamily','textShadowRadius','includeFontPadding','textAlignVertical','fontVariant','letterSpacing','textDecorationColor','textDecorationStyle','textTransform','writingDirection',]
	let newStyle = filterStyle(styles, keys)
	return newStyle
}
const unNullStyle = (...styles) => {
	let style = Object.assign({},...styles)
	let newStyle = {}
	let keys = Object.keys(style)
	for (const key in keys)  {
		if(style[key] != null){
			newStyle[key] = style[key]
		}
	}
	return newStyle
}


export {
	generator,
	px2dp,
	fontSize,
	colors,
	android,
	ios,
	layoutStyle,
	borderStyle,
	shadowStyle,
	textStyle,
	unNullStyle,
}