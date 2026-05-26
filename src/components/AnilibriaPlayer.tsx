import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, StatusBar, Text, BackHandler } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationBar } from 'expo-navigation-bar';
import { useEvent, useEventListener } from 'expo';

// Icons
import PlayVideoPlayerIcon from '@Icons/videoplayer/PlayVideoPlayerIcon';
import PauseVideoPlayerIcon from '@Icons/videoplayer/PauseVideoPlayerIcon';
import MinimizeVideoPlayerIcon from '@Icons/videoplayer/MinimizeVideoPlayerIcon';
import ExpendVideoPlayerIcon from '@Icons/videoplayer/ExpendVideoPlayerIcon';
import BackwardStepVideoPlayerIcon from '@Icons/videoplayer/BackwardStepVideoPlayerIcon';
import ForwardStepVideoPlayerIcon from '@Icons/videoplayer/ForwardStepVideoPlayerIcon';
import RewindBackVideoPlayerIcon from '@Icons/videoplayer/RewindBackVideoPlayerIcon';
import RewindForwVideoPlayerIcon from '@Icons/videoplayer/RewindForwPlayerIcon';
import AutoVolumeVideoPlayerIcon from '@Icons/videoplayer/AutoVolumeVideoPlayerIcon';
import ArrowLeftIcon from '@Icons/ArrowLeftIcon';
import SettingsIcon from '@Icons/SettingsIcon';

// Interface
import { IEpisode } from '@Interfaces/AnimeScreen.interface';

// Utils
import { i18n } from '@Utils/localization';

// Modals
import QualityEpisodeModal from './modals/QualityEpisodeModal';

// Data
import { COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';


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
	const [qualityEpisode, setQualityEpisode] = useState<'hls_480' | 'hls_720' | 'hls_1080'>('hls_480');

	const [isOpenModalQuality, setIsOpenModalQuality] = useState<boolean>(false);
	const [controlsVisible, setControlsVisible] = useState<boolean>(true);
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

	const [screenWidth, setScreenWidth] = useState<number>(Dimensions.get('window').width);
	const [screenHeight, setScreenHeight] = useState<number>(Dimensions.get('window').height);
	const [position, setPosition] = useState<number>(0);
	const [volume, setVolume] = useState<number>(100);

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const player = useVideoPlayer(episode?.[qualityEpisode] ?? '', player => {
		player.volume = volume / 100;
		player.loop = false;
		player.timeUpdateEventInterval = 0.25;
	});
	const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
	const sourceLoad = useEvent(player, 'sourceLoad', { videoSource: '', duration: 0, availableVideoTracks: [], availableSubtitleTracks: [], availableAudioTracks: [] });
	const duration = sourceLoad.duration * 1000;

	useEventListener(player, 'timeUpdate', (event) => {
		if (player.playing) {
			const currentMs = event.currentTime * 1000;
			setPosition(currentMs);
		}
	});

	useEffect(() => {
		player.replaceAsync(episode?.[qualityEpisode] ?? '');
	}, [qualityEpisode, episode]);

	// Отлов нажатия выхода, для закрытия плеера
	useEffect(() => {
		const onBackPress = () => {
			if (isFullScreen) {
				exitFullScreen();
				return true;
			}

			return false;
		};

		const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
		return () => sub.remove();
	}, [isFullScreen]);

	// Обновленния высоты плеера для перевода в другой режим роботы
	useEffect(() => {
		const updateScreenDimensions = () => {
			const { width, height } = Dimensions.get('screen');

			setScreenWidth(width);
			setScreenHeight(height);
		};

		const subscription = Dimensions.addEventListener('change', updateScreenDimensions);
		return () => {
			subscription?.remove();
			if (timeoutRef.current)
				clearTimeout(timeoutRef.current);
		};
	}, []);

	const exitFullScreen = async () => {
		setIsFullScreen(false);

		StatusBar.setHidden(false);
		NavigationBar.setHidden(false);

		setScroll(true);
		setPlaying(false);

		await ScreenOrientation.unlockAsync();
	};

	const handleSeekChange = (value: number) => {
		setPosition(value);
	};

	const handleSeekStart = () => {
		if (player.playing)
			player.pause();
	};

	const handleSeekComplete = async (value: number) => {
		player.currentTime = value / 1000;

		setPosition(value);

		if (!player.playing)
			player.play();
	};

	const handlePressInShowControls = () => {
		setControlsVisible(true);

		if (timeoutRef.current)
			clearTimeout(timeoutRef.current);
	};

	const handlePressOutShowControls = () => {
		timeoutRef.current = setTimeout(() => setControlsVisible(false), 3000);
	};

	const toggleFullscreen = async () => {
		if (!isFullScreen) {
			setIsFullScreen(true);

			StatusBar.setHidden(true);
			NavigationBar.setHidden(true);

			setScroll(false);
			setPlaying(true);

			await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
		} else {
			await exitFullScreen();
		}
	};

	const handleSkip = async (ms: number) => {
		const newPosition = Math.min(Math.max(position + ms, 0), duration);
		player.currentTime = newPosition / 1000; // 10 sec
	};

	const handleVolumeChange = (value: number) => {
		setVolume(value);

		if (volumeTimeoutRef.current)
			clearTimeout(volumeTimeoutRef.current);

		volumeTimeoutRef.current = setTimeout(() => { player.volume = value / 100; }, 50);
	};

	const handlePrevEpisodePress = () => {
		if (hasPrevEpisode) // Затемнить иконку если нету
			onPrevEpisode();
	};

	const handleNextEpisodePress = () => {
		if (hasNextEpisode) // Затемнить иконку если нету
			onNextEpisode();
	};

	const formatTime = (millis: number) => {
		const minutes = Math.floor(millis / 60000);
		const seconds = Math.floor((millis % 60000) / 1000);

		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	};

	return (
		<TouchableOpacity
			activeOpacity={1}
			onPressIn={handlePressInShowControls}
			onPressOut={handlePressOutShowControls}
			style={
				isFullScreen ? [
					StyleSheet.absoluteFill,
					styles.fullScreenContainer,
					{ width: screenWidth, height: screenHeight }
				] :
					styles.container
			}>
			<QualityEpisodeModal
				visible={isOpenModalQuality}
				setVisible={setIsOpenModalQuality}
				setQualityEpisode={setQualityEpisode} />
			<VideoView
				player={player}
				style={isFullScreen ?
					[styles.fullScreenVideo, { width: screenWidth, height: screenHeight }]
					: styles.video
				}
				contentFit='cover'
				nativeControls={false} />
			{controlsVisible && (
				<View style={styles.background} />
			)}
			<View style={styles.controlsContainer}>
				{controlsVisible && (isFullScreen ?
					<View style={styles.infoContainer}>
						<View style={styles.infoContent}>
							<View style={styles.infoLeft}>
								<TouchableOpacity onPress={toggleFullscreen}>
									<ArrowLeftIcon Color={COLOR_TEXT_PRIMARY} Style={{}} />
								</TouchableOpacity>
								<Text style={styles.infoTitle}>{i18n.t('anime.episode')} {episode?.ordinal}</Text>
							</View>
							<View>
								<TouchableOpacity onPress={() => setIsOpenModalQuality(true)}>
									<SettingsIcon Color={COLOR_TEXT_PRIMARY} Style={{}} />
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
							<Text style={styles.timeText}>{formatTime(position)}</Text>
							<Slider
								style={styles.slider}
								minimumValue={0}
								maximumValue={duration}
								value={position}
								onSlidingStart={handleSeekStart}
								onValueChange={handleSeekChange}
								onSlidingComplete={handleSeekComplete}
								minimumTrackTintColor={COLOR_PRIMARY}
								maximumTrackTintColor="#4F4F4F"
								thumbTintColor={COLOR_PRIMARY} />
							<Text style={styles.timeText}>{formatTime(duration)}</Text>
						</View>
						<View style={styles.controls}>
							<View style={styles.volumeView}>
								<TouchableOpacity style={[styles.Btn, { marginLeft: 20 }]}>
									<AutoVolumeVideoPlayerIcon
										Color={COLOR_TEXT_PRIMARY}
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
									minimumTrackTintColor={COLOR_PRIMARY}
									maximumTrackTintColor="#4F4F4F"
									thumbTintColor={COLOR_PRIMARY} />
							</View>
							<View style={{
								marginRight: 160,
								flexDirection: 'row',
								justifyContent: 'space-evenly',
								alignItems: 'flex-end',
								width: '36%'
							}}>
								<TouchableOpacity style={styles.Btn} onPress={() => handleSkip(-10)}>
									<RewindBackVideoPlayerIcon Color={COLOR_TEXT_PRIMARY} Style={{}} Width={26} Height={26} />
								</TouchableOpacity>

								<TouchableOpacity style={styles.Btn} onPress={handlePrevEpisodePress}>
									<BackwardStepVideoPlayerIcon Color={COLOR_TEXT_PRIMARY} Style={{}} Width={26} Height={26} />
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.button}
									onPress={() => isPlaying ? player.pause() : player.play()}>
									{isPlaying ?
										<PauseVideoPlayerIcon Color={COLOR_TEXT_PRIMARY} Style={{}} Width={26} Height={26} />
										:
										<PlayVideoPlayerIcon Color={COLOR_TEXT_PRIMARY} Style={{}} Width={26} Height={26} />
									}
								</TouchableOpacity>

								<TouchableOpacity style={styles.Btn} onPress={handleNextEpisodePress}>
									<ForwardStepVideoPlayerIcon Color={COLOR_TEXT_PRIMARY} Style={{}} Width={26} Height={26} />
								</TouchableOpacity>

								<TouchableOpacity style={styles.Btn} onPress={() => handleSkip(10)}>
									<RewindForwVideoPlayerIcon Color={COLOR_TEXT_PRIMARY} Style={{}} Width={26} Height={26} />
								</TouchableOpacity>

							</View>
							<TouchableOpacity
								style={[styles.Btn, { marginRight: 20 }]}
								onPress={toggleFullscreen}>
								<MinimizeVideoPlayerIcon
									Color={COLOR_TEXT_PRIMARY}
									Style={{}}
									Width={24}
									Height={24} />
							</TouchableOpacity>
						</View>
					</View>
					:
					<View style={styles.controlsView}>
						<View style={styles.progressBar}>
							<Text style={styles.timeText}>{formatTime(position)}</Text>
							<Slider
								style={[styles.slider, { width: '70%', }]}
								minimumValue={0}
								maximumValue={duration}
								value={position}
								onSlidingStart={handleSeekStart}
								onValueChange={handleSeekChange}
								onSlidingComplete={handleSeekComplete}
								minimumTrackTintColor={COLOR_PRIMARY}
								maximumTrackTintColor="#4F4F4F"
								thumbTintColor={COLOR_PRIMARY} />
							<Text style={styles.timeText}>{formatTime(duration)}</Text>
						</View>
						<View style={styles.controls}>
							<View style={styles.volumeViewMinimize}>
								<TouchableOpacity style={[styles.Btn, { marginLeft: 20 }]}>
									<AutoVolumeVideoPlayerIcon
										Color={COLOR_TEXT_PRIMARY}
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
									minimumTrackTintColor={COLOR_PRIMARY}
									maximumTrackTintColor="#4F4F4F"
									thumbTintColor={COLOR_PRIMARY} />
							</View>
							<TouchableOpacity
								style={[styles.button, { marginRight: 100 }]}
								onPress={() => isPlaying ? player.pause() : player.play()}>
								{isPlaying ?
									<PauseVideoPlayerIcon Color={COLOR_TEXT_PRIMARY} Width={18} Height={18} Style={{}} />
									:
									<PlayVideoPlayerIcon Color={COLOR_TEXT_PRIMARY} Width={18} Height={18} Style={{}} />
								}
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.Btn, { marginRight: 20 }]}
								onPress={toggleFullscreen}>
								<ExpendVideoPlayerIcon
									Color={COLOR_TEXT_PRIMARY}
									Style={{}}
									Width={24}
									Height={24} />
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>
		</TouchableOpacity>
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
		color: COLOR_TEXT_PRIMARY,
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
		color: COLOR_TEXT_PRIMARY,
		fontSize: 12,
		fontFamily: 'Outfit',
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
	fullScreenContainer: {
		zIndex: 1000,
	},
	fullScreenVideo: {
		width: '100%',
		height: '100%',
		position: 'absolute',
	},
	Btn: {
		padding: 7,
		borderRadius: 5,
	},
});

export default AnilibriaPlayer;