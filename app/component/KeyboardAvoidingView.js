/**
 * @created at Aug 5, 2019 14:24
 * @author chensai@tonknet.com
 * @abstract 防止键盘遮住输入框
 * @class KeyboardAvoidingView
 */
import React, { Component } from 'react';
 import {
	Keyboard,
	LayoutAnimation,
	Platform,
	StyleSheet,
  View,
  UIManager
 } from 'react-native'
 import { deviceH } from '../tools'




const viewRef = 'VIEW';
export default class KeyboardAvoidingView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bottom: 0,
		}
		_frame = null;
  	_subscriptions = [];
	}
  static defaultProps = {
    enabled: true,
    keyboardVerticalOffset: 0,
  };

  
  _relativeKeyboardHeight(keyboardFrame,mode) {
    let promise = new Promise((resolve,reject)=>{
      const frame = this._frame;
      if (!frame || !keyboardFrame || mode == 'hide') {
        resolve(0)
        return
      }
      UIManager.measureInWindow(this.target,(x,y,width,height)=>{
        let newHeight = y + height - deviceH + keyboardFrame.height
        resolve(Math.max(newHeight, 0))
        return
      })
    })
    
    return promise
  }

  _onKeyboardChange = async (event,mode) => {
    if (event == null) {
      this.setState({bottom: 0});
      return;
    }
    console.log(event)
    const {duration, easing, endCoordinates} = event;
    const height = await this._relativeKeyboardHeight(endCoordinates,mode);
    console.log(height)
    if (this.state.bottom === height) {
      return;
    }

    if (duration && easing) {
      LayoutAnimation.configureNext({
        duration: duration,
        update: {
          duration: duration,
          type: LayoutAnimation.Types[easing] || 'keyboard',
        },
      });
    }
    this.setState({bottom: height});
  };

  _onLayout = (event) => {
    this._frame = event.nativeEvent.layout;
    this.target = event.target
  };

  UNSAFE_componentWillUpdate(nextProps, nextState){
    if (
      nextState.bottom === this.state.bottom &&
      this.props.behavior === 'height' &&
      nextProps.behavior === 'height'
    ) {
      nextState.bottom = 0;
    }
  }

  componentDidMount() {
      this._subscriptions = [
        Keyboard.addListener('keyboardWillHide',(e)=> this._onKeyboardChange(e,'hide')),
        Keyboard.addListener('keyboardWillShow',(e)=> this._onKeyboardChange(e,'show')),
      ];
  }

  componentWillUnmount() {
    this._subscriptions.forEach(subscription => {
      subscription.remove();
    });
  }

  render() {
    const {
      behavior,
      children,
      contentContainerStyle,
      enabled,
      keyboardVerticalOffset, // eslint-disable-line no-unused-vars
      style,
      ...props
    } = this.props;
    const bottomHeight = enabled ? this.state.bottom : 0;
    switch (behavior) {
      case 'height':
        let heightStyle;
        if (this._frame != null) {
          // Note that we only apply a height change when there is keyboard present,
          // i.e. this.state.bottom is greater than 0. If we remove that condition,
          // this.frame.height will never go back to its original value.
          // When height changes, we need to disable flex.
          heightStyle = {
            height: this._frame.height - bottomHeight,
            flex: 0,
          };
        }
        return (
          <View
            ref={viewRef}
            style={StyleSheet.compose(
              style,
              heightStyle,
            )}
            onLayout={this._onLayout}
            {...props}>
            {children}
          </View>
        );

      case 'position':
        return (
          <View
            ref={viewRef}
            style={style}
            onLayout={this._onLayout}
            {...props}>
            <View
              style={StyleSheet.compose(
                contentContainerStyle,
                {
                  bottom: bottomHeight,
                },
              )}>
              {children}
            </View>
          </View>
        );

      case 'padding':
        return (
          <View
            ref={viewRef}
            style={StyleSheet.compose(
              style,
              {paddingBottom: bottomHeight},
            )}
            onLayout={this._onLayout}
            {...props}>
            {children}
          </View>
        );

      default:
        return (
          <View
            ref={viewRef}
            onLayout={this._onLayout}
            style={style}
            {...props}>
            {children}
          </View>
        );
    }
  }
}