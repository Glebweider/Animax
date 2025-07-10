import * as React from 'react';
import Svg, { G, Path, Polyline, Rect } from 'react-native-svg';

const RewindForwVideoPlayerIcon = ({ Color, Style, Width, Height }) => (
  <Svg
    viewBox="0 0 64 64"
    strokeWidth="4"
    fill="none"
    stroke={Color}
    width={Width}
    height={Height}
    style={Style}>
    <G transform="scale(-1,1) translate(-64,0)">
      <Polyline points="9.57 15.41 12.17 24.05 20.81 21.44" strokeLinecap="round" />
      <Path d="M26.93,41.41V23a.09.09,0,0,0-.16-.07s-2.58,3.69-4.17,4.78" strokeLinecap="round" />
      <Rect x="32.19" y="22.52" width="11.41" height="18.89" rx="5.7" />
      <Path d="M12.14,23.94a21.91,21.91,0,1,1-.91,13.25" strokeLinecap="round" />
    </G>
  </Svg>
);

export default RewindForwVideoPlayerIcon;