import {Dimensions} from 'react-native'
const deviceW = Dimensions.get('window').width
const basePx = 375

const px2dp = (px) => {
    return px *  deviceW / basePx
}

export default {
    smallest:px2dp(9),
    small:px2dp(10.4),
    normal:px2dp(12.5),
    partial:px2dp(14),
    big:px2dp(16.7),
    bigest:px2dp(20)

} 