import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlayVideoPlayerIcon = ({ Color, Style, Width, Height }) => (
  <Svg
    fill={Color}
    width={Width}
    height={Height}
    viewBox="0 0 460.114 460.114"
    style={Style}>
    <Path d="M393.538,203.629L102.557,5.543c-9.793-6.666-22.468-7.372-32.94-1.832c-10.472,5.538-17.022,16.413-17.022,28.26v396.173 c0,11.846,6.55,22.721,17.022,28.26c10.471,5.539,23.147,4.834,32.94-1.832l290.981-198.087 c8.746-5.954,13.98-15.848,13.98-26.428C407.519,219.477,402.285,209.582,393.538,203.629z" />
  </Svg>
);

export default PlayVideoPlayerIcon;