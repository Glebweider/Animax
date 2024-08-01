import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ExpendVideoPlayerIcon = ({ Color, Style, Width, Height }) => (
  <Svg
    viewBox="0 0 24 24"
    fill={Color}
    stroke={Color}
    width={Width}
    height={Height}
    style={Style}>
    <Path
      d="M14 10L20 4M20 4H15.5M20 4V8.5M4 4L10 10M4 4V8.5M4 4H8.5M14 14L20 20M20 20V15.5M20 20H15.5M10 14L4 20M4 20H8.5M4 20L4 15.5"
      stroke={Color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"/>
  </Svg>
);

export default ExpendVideoPlayerIcon;