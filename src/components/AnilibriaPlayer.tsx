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
import { IEpisode } from '@Stack/AnimeScreen';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { i18n } from '@Utils/localization';
import SettingsIcon from './icons/SettingsIcon';
import QualityEpisodeModal from './modals/QualityEpisodeModal';

interface AnilibriaPlayerProps {
	episode: IEpisode;
	setScroll: (bool: boolean) => void;
	setPlaying: (bool: boolean) => void;
	hasNextEpisode: boolean;
	hasPrevEpisode: boolean;
	onNextEpisode: () => void;
	onPrevEpisode: () => void;
}

const AnilibriaPlayer: React.FC<AnilibriaPlayerProps> = ({
	episode,
	setScroll,
	setPlaying,
	hasNextEpisode,
	hasPrevEpisode,
	onNextEpisode,
	onPrevEpisode
}) => {
	const video = useRef<Video>(null);
	const [status, setStatus] = useState<AVPlaybackStatusSuccess | null>(null);
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
	const [qualityEpisode, setQualityEpisode] = useState<'hls_480' | 'hls_720' | 'hls_1080'>('hls_480');
	const [screenWidth, setScreenWidth] = useState<number>(Dimensions.get('window').width);
	const [screenHeight, setScreenHeight] = useState<number>(Dimensions.get('window').height);
	const [volume, setVolume] = useState<number>(100);
	const [controlsVisible, setControlsVisible] = useState<boolean>(true);
	const [isOpenModalQuality, setOpenModalQuality] = useState<boolean>(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const isSeekingRef = useRef(false);
	const wasPlayingBeforeSeek = useRef<boolean>(false);

	const isPlaying = (status: AVPlaybackStatus): status is AVPlaybackStatusSuccess => {
		return (status as AVPlaybackStatusSuccess).isPlaying !== undefined;
	};

	const hideControls = () => {
		setControlsVisible(false);
	};

	const showControls = () => {
		setControlsVisible(true);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(hideControls, 5000);
	};

	const handleUserActivity = () => {
		if (!isSeekingRef.current) {
			showControls();
		}
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
			subscription?.remove();
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const toggleFullscreen = () => {
		setIsFullScreen(prev => !prev);
		if (!isFullScreen) {
			StatusBar.setHidden(true);
			setScroll(false);
			setPlaying(true);
			ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
			NavigationBar.setVisibilityAsync('hidden');
		} else {
			StatusBar.setHidden(false);
			setScroll(true);
			setPlaying(false);
			ScreenOrientation.unlockAsync();
			NavigationBar.setVisibilityAsync('visible');
			NavigationBar.setBackgroundColorAsync('black');
		}
	};

	const handleSkip = async (ms: number) => {
		if (status && video.current) {
			const newPosition = Math.min(Math.max(status.positionMillis + ms, 0), status.durationMillis || 0);
			await video.current.setPositionAsync(newPosition);
		}
	};

	const handleVolumeChange = (value: number) => {
		setVolume(value);
		if (video.current) video.current.setVolumeAsync(value / 100);
	};

	const handleSeekStart = () => {
		if (status?.isPlaying) {
			wasPlayingBeforeSeek.current = true;
			video.current?.pauseAsync();
		}
		isSeekingRef.current = true;
	};

	const handleSeekComplete = async (value: number) => {
		if (video.current) await video.current.setPositionAsync(value);
		isSeekingRef.current = false;
		if (wasPlayingBeforeSeek.current) {
			wasPlayingBeforeSeek.current = false;
			video.current?.playAsync();
		}
	};

	const formatTime = (millis: number) => {
		const minutes = Math.floor(millis / 60000);
		const seconds = Math.floor((millis % 60000) / 1000);
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	};

	const handlePrevEpisodePress = () => {
		if (hasPrevEpisode && onPrevEpisode) onPrevEpisode();
	};

	const handleNextEpisodePress = () => {
		if (hasNextEpisode && onNextEpisode) onNextEpisode();
	};

	return (
		<TouchableWithoutFeedback onPress={handleUserActivity}>
			<View style={
				isFullScreen ? [
					StyleSheet.absoluteFillObject,
					styles.fullScreenContainer,
					{ width: screenWidth, height: screenHeight }] :
					styles.container}>

				<QualityEpisodeModal
					visible={isOpenModalQuality}
					setVisible={setOpenModalQuality}
					setQualityEpisode={setQualityEpisode} />

				<Video
					ref={video}
					style={isFullScreen ? [styles.fullScreenVideo, { width: screenWidth, height: screenHeight }] : styles.video}
					source={{
						uri: episode?.[qualityEpisode] ?? '',
					}}
					resizeMode={ResizeMode.COVER}
					useNativeControls={false}
					volume={volume}
					onPlaybackStatusUpdate={(status) => {
						if (isPlaying(status)) {
							setStatus(status);
						}
					}} />

				{controlsVisible && (
					<View style={styles.background} />
				)}

				<View style={styles.controlsContainer}>
					{controlsVisible && (isFullScreen ?
						<View style={styles.infoContainer}>
							<View style={styles.infoContent}>
								<View style={styles.infoLeft}>
									<TouchableOpacity onPress={toggleFullscreen}>
										<ArrowLeftIcon Color={'#FFFFFF'} Style={{}} />
									</TouchableOpacity>
									<Text style={styles.infoTitle}>{i18n.t('anime.episode')} {episode.ordinal}</Text>
								</View>
								<View>
									<TouchableOpacity onPress={() => setOpenModalQuality(true)}>
										<SettingsIcon Color={'#FFFFFF'} Style={{}} />
									</TouchableOpacity>
								</View>
							</View>
						</View>
						:
						<View />
					)}

					{controlsVisible && (isFullScreen ?
						<View style={[styles.controlsView, { alignItems: 'center' }]}>
							<View style={styles.progressBar}>
								<Text style={styles.timeText}>{status?.positionMillis ? formatTime(status.positionMillis) : '00:00'}</Text>
								<Slider
									style={styles.slider}
									minimumValue={0}
									maximumValue={status?.durationMillis || 1}
									value={status?.positionMillis || 0}
									onSlidingStart={handleSeekStart}
									onSlidingComplete={handleSeekComplete}
									minimumTrackTintColor="#06C149"
									maximumTrackTintColor="#4F4F4F"
									thumbTintColor="#06C149" />
								<Text style={styles.timeText}>{status?.durationMillis ? formatTime(status.durationMillis) : '00:00'}</Text>
							</View>
							<View style={styles.controls}>
								<View style={styles.volumeView}>
									<TouchableOpacity style={[styles.Btn, { marginLeft: 20 }]}>
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
										thumbTintColor="#06C149" />
								</View>
								<View style={{
									marginRight: 160,
									flexDirection: 'row',
									justifyContent: 'space-evenly',
									alignItems: 'flex-end',
									width: '36%'
								}}>

									<TouchableOpacity style={styles.Btn} onPress={() => handleSkip(-10000)}>
										<RewindBackVideoPlayerIcon Color={'#fff'} Style={{}} Width={26} Height={26} />
									</TouchableOpacity>

									<TouchableOpacity style={styles.Btn} onPress={handlePrevEpisodePress}>
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

									<TouchableOpacity style={styles.Btn} onPress={handleNextEpisodePress}>
										<ForwardStepVideoPlayerIcon Color={'#fff'} Style={{}} Width={26} Height={26} />
									</TouchableOpacity>

									<TouchableOpacity style={styles.Btn} onPress={() => handleSkip(10000)}>
										<RewindForwVideoPlayerIcon Color={'#fff'} Style={{}} Width={26} Height={26} />
									</TouchableOpacity>

								</View>
								<TouchableOpacity
									style={[styles.Btn, { marginRight: 20 }]}
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
									style={[styles.slider, { width: '70%', }]}
									minimumValue={0}
									maximumValue={status?.durationMillis || 1}
									value={status?.positionMillis || 0}
									onSlidingStart={handleSeekStart}
									onSlidingComplete={handleSeekComplete}
									minimumTrackTintColor="#06C149"
									maximumTrackTintColor="#4F4F4F"
									thumbTintColor="#06C149" />
								<Text style={styles.timeText}>{status?.durationMillis ? formatTime(status.durationMillis) : '00:00'}</Text>
							</View>
							<View style={styles.controls}>
								<View style={styles.volumeViewMinimize}>
									<TouchableOpacity style={[styles.Btn, { marginLeft: 20 }]}>
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
										thumbTintColor="#06C149" />
								</View>
								<TouchableOpacity
									style={[styles.button, { marginRight: 100 }]}
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
									style={[styles.Btn, { marginRight: 20 }]}
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

			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '90%',
		height: 210,
		marginTop: 32,
		borderRadius: 10,
	},
	infoLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	infoTitle: {
		marginLeft: 20,
		color: '#fff',
		fontSize: 16,
		fontFamily: 'Outfit',
	},
	infoContainer: {
		width: '100%',
		marginTop: 15,
		alignItems: 'center',
	},
	infoContent: {
		width: '96%',
		flexDirection: 'row',
		justifyContent: 'space-between',

		paddingHorizontal: 25
	},
	controlsContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '100%'
	},
	background: {
		backgroundColor: 'black',
		opacity: 0.2,
		width: '100%',
		height: '100%',
		position: 'absolute'
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
		height: 210,
		position: 'absolute',
		borderRadius: 10,
	},
	controlsView: {
		width: '100%',
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
		width: '96%',
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
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	Btn: {
		padding: 7,
		borderRadius: 5,
	},
});

export default AnilibriaPlayer;