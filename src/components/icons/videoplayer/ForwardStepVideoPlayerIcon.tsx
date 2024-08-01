import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ForwardStepVideoPlayerIcon = ({ Color, Style, Width, Height }) => (
  <Svg 
    viewBox="0 0 24 24" 
    fill={Color}
    stroke={Color}
    width={Width}
    height={Height}
    style={Style} 
    stroke-width="0"
    stroke-linecap="round" 
    stroke-linejoin="round"> 
    <Path d="M17 5V19M7 7.329V16.671C7 17.7367 7 18.2695 7.21846 18.5432C7.40845 18.7812 7.69654 18.9197 8.00108 18.9194C8.35125 18.919 8.76734 18.5861 9.59951 17.9204L13.8765 14.4988C14.9442 13.6446 15.4781 13.2176 15.6713 12.7016C15.8408 12.2492 15.8408 11.7508 15.6713 11.2984C15.4781 10.7824 14.9442 10.3554 13.8765 9.50122L9.59951 6.07961C8.76734 5.41387 8.35125 5.081 8.00108 5.08063C7.69654 5.0803 7.40845 5.21876 7.21846 5.45677C7 5.73045 7 6.2633 7 7.329Z" 
      stroke="#ffffff" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" />
  </Svg>
);

export default ForwardStepVideoPlayerIcon;