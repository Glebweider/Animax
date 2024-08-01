import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const BackwardStepVideoPlayerIcon = ({ Color, Style, Width, Height }) => (
  <Svg 
    viewBox="0 0 24 24" 
    fill={Color}
    stroke={Color}
    width={Width}
    height={Height}
    style={Style}
    stroke-linecap="round" 
    stroke-linejoin="round">
    <Path d="M7 5V19M17 7.329V16.671C17 17.7367 17 18.2695 16.7815 18.5432C16.5916 18.7812 16.3035 18.9197 15.9989 18.9194C15.6487 18.919 15.2327 18.5861 14.4005 17.9204L10.1235 14.4988C9.05578 13.6446 8.52194 13.2176 8.32866 12.7016C8.1592 12.2492 8.1592 11.7508 8.32866 11.2984C8.52194 10.7824 9.05578 10.3554 10.1235 9.50122L14.4005 6.07961C15.2327 5.41387 15.6487 5.081 15.9989 5.08063C16.3035 5.0803 16.5916 5.21876 16.7815 5.45677C17 5.73045 17 6.2633 17 7.329Z" 
      stroke="#ffffff" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round">
    </Path> 
  </Svg>
);

export default BackwardStepVideoPlayerIcon;