import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const MinimizeVideoPlayerIcon = ({ Color, Style, Width, Height }) => (
  <Svg
    viewBox="0 0 24 24"
    fill={Color}
    stroke={Color}
    width={Width}
    height={Height}
    style={Style}>
    <Path
      d="M14 10L20 4M14 10H18.5M14 10V5.5M4 4L10 10M10 10V5.5M10 10H5.5M14 14L20 20M14 14V18.5M14 14H18.5M10 14L4 20M10 14H5.5M10 14V18.5"
      stroke={Color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default MinimizeVideoPlayerIcon;