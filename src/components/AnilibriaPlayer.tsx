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
import {
	getAnimeProgressById, getAnimeVolumeToStorage, IAnimeProgress, saveAnimeProgressToStorage,
	saveAnimeVolumeToStorage
} from '@Utils/functions';


// Modals
import QualityEpisodeModal from './modals/QualityEpisodeModal';

// Data
import { COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';


interface AnilibriaPlayerProps {
	animeId: string;
	episode: IEpisode;
	setPlaying: (bool: boolean) => void;
	hasNextEpisode: boolean;
	hasPrevEpisode: boolean;
	onNextEpisode: () => void;
	onPrevEpisode: () => void;
	selectedEpisodeId: React.Dispatch<React.SetStateAction<number>>;
}

const AnilibriaPlayer: React.FC<AnilibriaPlayerProps> = ({
	animeId,
	episode,
	setPlaying,
	hasNextEpisode,
	hasPrevEpisode,
	onNextEpisode,
	onPrevEpisode,
	selectedEpisodeId
}) => {
	const [qualityEpisode, setQualityEpisode] = useState<'hls_480' | 'hls_720' | 'hls_1080'>('hls_480');
	const [save, setSave] = useState<IAnimeProgress>(null);

	const [isOpenModalQuality, setIsOpenModalQuality] = useState<boolean>(false);
	const [controlsVisible, setControlsVisible] = useState<boolean>(true);
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	const [screenWidth, setScreenWidth] = useState<number>(Dimensions.get('window').width);
	const [screenHeight, setScreenHeight] = useState<number>(Dimensions.get('window').height);
	const [position, setPosition] = useState<number>(0);
	const [volume, setVolume] = useState<number>(getAnimeVolumeToStorage() || 100);

	const positionRef = useRef<number>(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const intervalSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const player = useVideoPlayer(episode?.[qualityEpisode] ?? '', player => {
		player.volume = volume / 100;
		player.loop = false;
		player.timeUpdateEventInterval = 0.1;
	});

	const sourceLoad = useEvent(player, 'sourceLoad', { videoSource: '', duration: 0, availableVideoTracks: [], availableSubtitleTracks: [], availableAudioTracks: [] });
	const duration = sourceLoad.duration * 1000;

	useEventListener(player, 'timeUpdate', (event) => {
		if (player.playing) {
			const currentMs = event.currentTime * 1000;
			positionRef.current = currentMs;
			setPosition(currentMs);
		}
	});

	useEventListener(player, 'playingChange', (event) => {
		setIsPlaying(event.isPlaying);
	});

	useEffect(() => {
		setSave(getAnimeProgressById(animeId));
	}, [animeId]);

	useEffect(() => {
		const switchQuality = async () => {
			const wasPlaying = player.playing;
			const currentTime = player.currentTime;

			await player.replaceAsync(episode?.[qualityEpisode] ?? '');

			player.currentTime = currentTime;

			if (wasPlaying) {
				player.play();
				setIsPlaying(true);
			} else {
				setIsPlaying(false);
			}
		};

		switchQuality();
	}, [qualityEpisode]);

	useEffect(() => {
		setSaveTime(save ? save.time : 0);

		if (save)
			setSave(null);
	}, [episode]);

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
			stopTimer();

			if (timeoutRef.current)
				clearTimeout(timeoutRef.current);
		};
	}, []);

	const setSaveTime = (value: number) => {
		player.currentTime = value / 1000;
		positionRef.current = value;
		setPosition(value);
	};

	const startTimer = () => {
		if (intervalSaveRef.current) return;

		intervalSaveRef.current = setInterval(() => {
			saveAnimeProgressToStorage({
				animeId,
				episode: episode.ordinal,
				time: positionRef.current + 1,
			});
		}, 5000);
	};

	const stopTimer = () => {
		if (intervalSaveRef.current) {
			clearInterval(intervalSaveRef.current);
			intervalSaveRef.current = null;
		}
	};

	const exitFullScreen = async () => {
		setIsFullScreen(false);

		StatusBar.setHidden(false);
		NavigationBar.setHidden(false);


		setPlaying(false);

		await ScreenOrientation.unlockAsync();
	};

	const handleSeekChange = (value: number) => {
		setPosition(value);
	};

	const handleSeekStart = () => {
		stopTimer();

		if (player.playing)
			player.pause();
	};

	const handleSeekComplete = async (value: number) => {
		player.currentTime = value / 1000;

		setPosition(value);

		player.play();
		setIsPlaying(true);
		startTimer();
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

		volumeTimeoutRef.current = setTimeout(() => {
			player.volume = value / 100;
			saveAnimeVolumeToStorage(value);
		}, 50);
	};

	// TODO: Вынести все форматеры временни и создать общий
	const formatTime = (millis: number) => {
		const minutes = Math.floor(millis / 60000);
		const seconds = Math.floor((millis % 60000) / 1000);

		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	};

	const handlePlay = () => {
		if (isPlaying) {
			stopTimer();

			player.pause();
			setIsPlaying(false);
		} else {
			startTimer();

			player.play();
			setIsPlaying(true);
		}
	};

	const handleResume = () => {
		if (!save) return;

		selectedEpisodeId(save.episode);
		setSaveTime(save.time);

		if (save.episode == episode.ordinal)
			setSave(null);
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

			{save && (
				<View style={isFullScreen ? styles.resumeBannerFullScreen : styles.resumeBanner}>
					<View style={styles.resumeLeft}>
						<Text style={styles.resumeTitle}>
							{save.episode} {i18n.t('anime.episode')?.toLowerCase()} • {formatTime(save.time)}
						</Text>
						<Text style={styles.resumeSubtitle}>Продолжить?</Text>
					</View>
					<View style={styles.resumeButtons}>
						<TouchableOpacity style={styles.resumeBtnApply} onPress={handleResume}>
							<Text style={styles.resumeBtnApplyText}>Да</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.resumeBtnClose} onPress={() => setSave(null)}>
							<Text style={styles.resumeBtnCloseText}>✕</Text>
						</TouchableOpacity>
					</View>
				</View>
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

								<TouchableOpacity
									style={styles.Btn}
									disabled={!hasPrevEpisode}
									onPress={onPrevEpisode}>
									<BackwardStepVideoPlayerIcon
										Color={COLOR_TEXT_PRIMARY}
										Style={!hasPrevEpisode && { opacity: 0.6 }}
										Width={26}
										Height={26} />
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.button}
									onPress={handlePlay}>
									{isPlaying ?
										<PauseVideoPlayerIcon Color={COLOR_TEXT_PRIMARY} Style={{}} Width={26} Height={26} />
										:
										<PlayVideoPlayerIcon Color={COLOR_TEXT_PRIMARY} Style={{}} Width={26} Height={26} />
									}
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.Btn}
									disabled={!hasNextEpisode}
									onPress={onNextEpisode}>
									<ForwardStepVideoPlayerIcon
										Color={COLOR_TEXT_PRIMARY}
										Style={!hasNextEpisode && { opacity: 0.6 }}
										Width={26}
										Height={26} />
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
								onPress={handlePlay}>
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
	resumeBanner: {
		position: 'absolute',
		bottom: 25,
		left: '5%',
		width: '90%',
		backgroundColor: 'rgba(28, 28, 30, 0.9)',
		borderRadius: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
		zIndex: 10,
	},
	resumeBannerFullScreen: {
		position: 'absolute',
		bottom: 90,
		left: 40,
		width: 320,
		backgroundColor: 'rgba(28, 28, 30, 0.95)',
		borderRadius: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.15)',
		zIndex: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	resumeLeft: {
		flexDirection: 'column',
		flex: 1,
	},
	resumeTitle: {
		color: COLOR_TEXT_PRIMARY,
		fontSize: 13,
		fontFamily: 'Outfit',
		fontWeight: '600',
	},
	resumeSubtitle: {
		color: '#A0A0A0',
		fontSize: 11,
		fontFamily: 'Outfit',
		marginTop: 2,
	},
	resumeButtons: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 10,
		gap: 8
	},
	resumeBtnClose: {
		padding: 8,
		marginRight: 8,
	},
	resumeBtnCloseText: {
		color: '#707070',
		fontSize: 14,
	},
	resumeBtnApply: {
		backgroundColor: COLOR_PRIMARY,
		paddingVertical: 6,
		paddingHorizontal: 16,
		borderRadius: 20,
	},
	resumeBtnApplyText: {
		color: COLOR_TEXT_PRIMARY,
		fontSize: 13,
		fontFamily: 'Outfit',
	},
});

export default AnilibriaPlayer;