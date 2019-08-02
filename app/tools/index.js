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

const px2dp = (px) => {
    return px * deviceW / basePx
}

export {
	generator,
	px2dp,
	fontSize,
	colors,
	

}