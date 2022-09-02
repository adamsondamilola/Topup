import React, { Component } from 'react';
import images from '../constants/images';
export default class LoadingImage extends Component {
    render() {
        return <img src={images.loader} style={{height: 30, width: 30}} />;
      }
}
