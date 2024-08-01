import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const PauseVideoPlayerIcon = ({ Color, Style, Width, Height }) => (
  <Svg
    fill={Color}
    width={Width}
    height={Height}
    viewBox="0 0 47.607 47.607"
    style={Style}>
    <Path d="M17.991,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C4.729,2.969,7.698,0,11.36,0 l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z" />
    <Path d="M42.877,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631 C29.616,2.969,32.585,0,36.246,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z" />
  </Svg>
);

export default PauseVideoPlayerIcon;