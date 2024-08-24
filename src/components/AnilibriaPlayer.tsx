
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, StatusBar, Text, TouchableWithoutFeedback } from 'react-native';
import { Video, AVPlaybackStatusSuccess, AVPlaybackStatus, ResizeMode } from 'expo-av';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';

//Icons
import PlayVideoPlayerIcon from '@Icons/videoplayer/PlayVideoPlayerIcon';
import PauseVideoPlayerIcon from '@Icons/videoplayer/PauseVideoPlayerIcon';
import MinimizeVideoPlayerIcon from '@Icons/videoplayer/MinimizeVideoPlayerIcon';
import ExpendVideoPlayerIcon from '@Icons/videoplayer/ExpendVideoPlayerIcon';
import BackwardStepVideoPlayerIcon from '@Icons/videoplayer/BackwardStepVideoPlayerIcon';
import ForwardStepVideoPlayerIcon from '@Icons/videoplayer/ForwardStepVideoPlayerIcon';
import RewindBackVideoPlayerIcon from '@Icons/videoplayer/RewindBackVideoPlayerIcon';
import RewindForwVideoPlayerIcon from '@Icons/videoplayer/RewindForwPlayerIcon';
import AutoVolumeVideoPlayerIcon from '@Icons/videoplayer/AutoVolumeVideoPlayerIcon';

interface AnilibriaPlayerProps {
	url: string;
	setScroll: (bool: boolean) => void;
}

const AnilibriaPlayer = ({ url, setScroll }: AnilibriaPlayerProps) => {
	const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatusSuccess | null>(null);
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
	const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
	const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
	const [volume, setVolume] = useState(100);
	const [controlsVisible, setControlsVisible] = useState<boolean>(true);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const isPlaying = (status: AVPlaybackStatus): status is AVPlaybackStatusSuccess => {
		return (status as AVPlaybackStatusSuccess).isPlaying !== undefined;
	};

	const hideControls = () => {
		setControlsVisible(false);
	};

	const showControls = () => {
		setControlsVisible(true);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(hideControls, 5000);
	};

	const handleUserActivity = () => {
		showControls();
	};

	useEffect(() => {
		showControls();
		const updateScreenDimensions = () => {
			const { width, height } = Dimensions.get('screen');
			setScreenWidth(width);
			setScreenHeight(height);
		};
		const subscription = Dimensions.addEventListener('change', updateScreenDimensions);

		return () => {
			if (subscription && subscription.remove) {
				subscription.remove();
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const toggleFullscreen = () => {
		setIsFullScreen(prev => !prev);
		if (!isFullScreen) {
			StatusBar.setHidden(true);
			setScroll(false);
			const lockOrientation = async () => {
				await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
				await NavigationBar.setVisibilityAsync('hidden')
			};
			lockOrientation();
		} else {
			StatusBar.setHidden(false);
			setScroll(true);
			ScreenOrientation.unlockAsync();
			const Nav = async () => {
				NavigationBar.setVisibilityAsync('visible')
				NavigationBar.setBackgroundColorAsync('black')
			}
			Nav()

		}
	};

	const handleSkipBackward = async () => {
		if (status && video.current) {
			const newPosition = Math.max(status.positionMillis - 10000, 0);
			await video.current.setPositionAsync(newPosition);
		}
	};

	const handleSkipForward = async () => {
		if (status && video.current) {
			const newPosition = Math.min(status.positionMillis + 10000, status.durationMillis || 0);
			await video.current.setPositionAsync(newPosition);
		}
	};

	const handlePreviousEpisode = () => {
		// Логика для перехода на предыдущий эпизод
		console.log('Previous episode');
	};

	const handleNextEpisode = () => {
		// Логика для перехода на следующий эпизд
		console.log('Next episode');
	};

	const handleVolumeChange = (value: number) => {
		const volumeValue = value / 100;
		setVolume(value);
		if (video.current) {
			video.current.setVolumeAsync(volumeValue);
		}
	};

	const handleSeek = async (value: number) => {
		if (status && video.current) {
			const newPosition = value;
			await video.current.setPositionAsync(newPosition);
		}
	};

	const formatTime = (millis: number) => {
		const minutes = Math.floor(millis / 60000);
		const seconds = Math.floor((millis % 60000) / 1000);
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	};
	return (
		<TouchableWithoutFeedback onPress={handleUserActivity}>
			<View style={isFullScreen ? [StyleSheet.absoluteFillObject, styles.fullScreenContainer, { width: screenWidth, height: screenHeight }] : styles.container}>
				<Video
					ref={video}
					style={isFullScreen ? [styles.fullScreenVideo, { width: screenWidth, height: screenHeight }] : styles.video}
					source={{
					uri: url,
					}}
					resizeMode={ResizeMode.COVER}
					useNativeControls={false}
					volume={volume}
					onPlaybackStatusUpdate={(status) => {
						if (isPlaying(status)) {
							setStatus(status);
						}
				}}/>
				{controlsVisible && ( <View style={{backgroundColor: 'black', opacity: 0.2, width: '100%', height: '100%', position: 'absolute'}}></View>)}
				{controlsVisible && (
					isFullScreen ? 
					<View style={styles.controlsView}> 
						<View style={styles.progressBar}>
							<Text style={styles.timeText}>{status?.positionMillis ? formatTime(status.positionMillis) : '00:00'}</Text>
							<Slider
								style={styles.slider}
								minimumValue={0}
								maximumValue={status?.durationMillis || 1}
								value={status?.positionMillis || 0}
								onValueChange={handleSeek}
								minimumTrackTintColor="#06C149"
								maximumTrackTintColor="#4F4F4F"
								thumbTintColor="#06C149" />
							<Text style={styles.timeText}>{status?.durationMillis ? formatTime(status.durationMillis) : '00:00'}</Text>
						</View>
						<View style={styles.controls}>
							<View style={styles.volumeView}>
								<TouchableOpacity style={[styles.fullScreenToggle, { marginLeft: 20 }]}>
									<AutoVolumeVideoPlayerIcon
											Color={'#fff'}
											Style={{}}
											Width={26}
											Height={26} 
											Volume={volume} /> 
								</TouchableOpacity>
								<Slider
									style={styles.sliderVolume}
									minimumValue={0}
									maximumValue={100}
									value={volume}
									step={1}
									onValueChange={handleVolumeChange}
									minimumTrackTintColor="#06C149"
									maximumTrackTintColor="#4F4F4F"
									thumbTintColor="#06C149"/>
							</View>
							<View style={{ 
								marginRight: 160, 
								flexDirection: 'row', 
								justifyContent: 'space-evenly', 
								alignItems: 'flex-end', 
								width: '36%' }}>
								<TouchableOpacity style={styles.rewindButton} onPress={handleSkipBackward}>
									<RewindBackVideoPlayerIcon Color={'#fff'} Style={{}} Width={26} Height={26}/>
								</TouchableOpacity>
								<TouchableOpacity style={styles.stepButton} onPress={handlePreviousEpisode}>
									<BackwardStepVideoPlayerIcon Color={'#fff'} Style={{}} Width={26} Height={26} />
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.button}
									onPress={() =>
										status?.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()
									}>
									{status?.isPlaying ? 
										<PauseVideoPlayerIcon Color={'#fff'} Style={{}} Width={26} Height={26} /> 
										:
										<PlayVideoPlayerIcon Color={'#fff'} Style={{}} Width={26} Height={26} />
									}
								</TouchableOpacity>
								<TouchableOpacity style={styles.stepButton} onPress={handleNextEpisode}>
									<ForwardStepVideoPlayerIcon Color={'#fff'} Style={{}} Width={26} Height={26} />
								</TouchableOpacity>
								<TouchableOpacity style={styles.rewindButton} onPress={handleSkipForward}>
									<RewindForwVideoPlayerIcon Color={'#fff'} Style={{}} Width={26} Height={26}/>
								</TouchableOpacity>
							</View>
							<TouchableOpacity
								style={[styles.fullScreenToggle, {marginRight: 20}]}
								onPress={toggleFullscreen}>
								<MinimizeVideoPlayerIcon 
									Color={'#fff'} 
									Style={{}} 
									Width={24} 
									Height={24} /> 
							</TouchableOpacity>
						</View>
					</View>
					:
					<View style={styles.controlsView}>
						<View style={styles.progressBar}>
							<Text style={styles.timeText}>{status?.positionMillis ? formatTime(status.positionMillis) : '00:00'}</Text>
							<Slider
								style={[styles.slider, {width: '70%',}]}
								minimumValue={0}
								maximumValue={status?.durationMillis || 1}
								value={status?.positionMillis || 0}
								onValueChange={handleSeek}
								minimumTrackTintColor="#06C149"
								maximumTrackTintColor="#4F4F4F"
								thumbTintColor="#06C149" />
							<Text style={styles.timeText}>{status?.durationMillis ? formatTime(status.durationMillis) : '00:00'}</Text>
						</View> 
						<View style={styles.controls}>
							<View style={styles.volumeViewMinimize}>
								<TouchableOpacity style={[styles.fullScreenToggle, { marginLeft: 20 }]}>
									<AutoVolumeVideoPlayerIcon
										Color={'#fff'}
										Style={{}}
										Width={24}
										Height={24} 
										Volume={volume} /> 
								</TouchableOpacity>
								<Slider
									style={styles.sliderVolumeMinimize}
									minimumValue={0}
									maximumValue={100}
									value={volume}
									step={1}
									onValueChange={handleVolumeChange}
									minimumTrackTintColor="#06C149"
									maximumTrackTintColor="#4F4F4F"
									thumbTintColor="#06C149"/>
							</View>
							<TouchableOpacity
								style={[styles.button, {marginRight: 100}]}
								onPress={() =>
									status?.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()
								}>
								{status?.isPlaying ? 
									<PauseVideoPlayerIcon Color={'#fff'} Style={{}} Width={18} Height={18} /> 
									:
									<PlayVideoPlayerIcon Color={'#fff'} Style={{}} Width={18} Height={18} />
								}
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.fullScreenToggle, {marginRight: 20}]}
								onPress={toggleFullscreen}>
								<ExpendVideoPlayerIcon 
									Color={'#fff'} 
									Style={{}} 
									Width={24} 
									Height={24} /> 
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
  container: {
		width: '100%',
		height: 250,
		marginTop: 32,
		borderRadius: 10,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    width: '80%',
    height: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
		fontFamily: 'Outfit',
  },
  controlButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  video: {
    width: '100%',
    height: 250,
		position: 'absolute',
		borderRadius: 10,
  },
  controlsView: {
		width: '100%',
		height: '100%',
		justifyContent: 'flex-end',
  },
	sliderVolume: {
		width: 160,
	},
	sliderVolumeMinimize: {
		width: 100,
	},
	volumeView: {
		flexDirection: 'row',
	},
	volumeViewMinimize: {
		flexDirection: 'row',
	},
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
		alignItems: 'flex-end',
		width: '100%',
		height: 55,
		marginBottom: 13,
  },
  button: {
    padding: 11,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  fullScreenContainer: {
		zIndex: 1000,
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
		position: 'absolute',
  },
  fullScreenButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон для кнопки
  },
  fullScreenToggle: {
    padding: 7,
    borderRadius: 5,
  },
  stepButton: {
		padding: 7,
    borderRadius: 5,
  },
  rewindButton: {
		padding: 7,
    borderRadius: 5,
  }
});
  
export default AnilibriaPlayer;