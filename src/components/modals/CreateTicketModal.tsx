import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

// Styles
import globalStyles from '@Styles/index';

// Utils
import { socket } from '@Utils/socket';

// Data
import {
	COLOR_BACKGROUND_SECONDARY, COLOR_PRIMARY,
	COLOR_PRIMARY_DARK, COLOR_TEXT_PRIMARY,
	COLOR_TEXT_TERTIARY
} from '@Data/constants';
import { SUPPORT_TAGS } from '@Data/supportTags';


interface ModalProps {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateTicketModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
	const [textReason, setTextReason] = useState<string>('');
	const [selectedTags, setSelectedTags] = useState<{ id: string; text: string; }[]>([]);
	const [isEnabledButton, setEnabledButton] = useState<boolean>(true);

	useEffect(() => {
		if (textReason.length > 4 && selectedTags.length >= 1) {
			setEnabledButton(false);
		}
	}, [textReason, selectedTags]);

	const createTicket = () => {
		socket.emit('createTicket', {
			reason: textReason,
			tags: selectedTags
		});
		setVisible(false);
	};

	return (
		<Modal transparent visible={visible} animationType="slide">
			<View style={globalStyles.ModalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.titleText}>Create Ticket</Text>
					<View style={styles.emailSection}>
						<TextInput
							style={styles.emailInput}
							placeholderTextColor={COLOR_TEXT_TERTIARY}
							placeholder="Reason"
							keyboardType="default"
							onChangeText={(newText) => setTextReason(newText)}
							value={textReason} />
					</View>
					<View style={styles.tagsContainer}>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							style={styles.tagsScrollView}>
							{SUPPORT_TAGS.map((tag) => (
								<TouchableOpacity
									style={[
										styles.tagContainer,
										selectedTags.some(selectedTag => selectedTag.id === tag.id) && { backgroundColor: COLOR_PRIMARY }
									]}
									key={tag.id}
									onPress={() => {
										setSelectedTags(prevTags => {
											if (prevTags.some(selectedTag => selectedTag.id === tag.id)) {
												return prevTags.filter(selectedTag => selectedTag.id !== tag.id);
											} else {
												return [...prevTags, tag];
											}
										});
									}}>
									<Text
										style={[
											styles.tagText,
											selectedTags.some(selectedTag => selectedTag.id === tag.id) && { color: COLOR_TEXT_PRIMARY }
										]}>
										{tag.text}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
					<View style={styles.containerButtons}>
						<TouchableOpacity
							style={styles.containerButtonCancel}
							onPress={() => setVisible(false)}>
							<Text style={styles.textButton}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.containerButtonCreate}
							disabled={isEnabledButton}
							onPress={createTicket}>
							<Text style={styles.textButton}>Create Ticket</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	...globalStyles,
	tagsContainer: {
		width: '94%',
		height: 36,
		marginLeft: 10,
		alignItems: 'center',
	},
	tagsScrollView: {
		width: '100%',
		height: 36,
		flexGrow: 1,
		paddingRight: 10
	},
	tagContainer: {
		...globalStyles.Center,
		height: 36,
		borderColor: COLOR_PRIMARY,
		borderRadius: 8,
		borderWidth: 1,
		marginLeft: 7,
		paddingRight: 7,
		paddingLeft: 7
	},
	tagText: {
		color: COLOR_PRIMARY,
		fontFamily: 'Outfit',
		fontSize: 10
	},
	containerTag: {
		margin: 7,
		marginTop: 10,
		width: 150,
		height: 200,
		borderRadius: 15,
		flexDirection: 'row',
		backgroundColor: COLOR_BACKGROUND_SECONDARY
	},
	titleText: {
		...globalStyles.TextPrimary,
		marginTop: 16,
		fontSize: 18,
		width: '80%',
		textAlign: 'center'
	},
	containerButtons: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-evenly',
		marginBottom: 20
	},
	containerButtonCancel: {
		...globalStyles.Center,
		width: '44%',
		padding: 14,
		borderRadius: 15,
		backgroundColor: '#35383F',
		marginTop: 15
	},
	containerButtonCreate: {
		...globalStyles.Center,
		width: '44%',
		padding: 14,
		borderRadius: 15,
		backgroundColor: COLOR_PRIMARY_DARK,
		marginTop: 15
	},
	textButton: {
		color: 'white',
		fontSize: 16,
		fontFamily: 'Outfit'
	},
	modalContent: {
		...globalStyles.ModalPanel,
		width: '90%',
		minHeight: '37%',
		borderRadius: 20,
		justifyContent: 'space-between'
	},
	emailSection: {
		...globalStyles.Section,
		width: '90%',
		height: 64,
		borderRadius: 20,
		borderColor: '#35383F',
		borderWidth: 1
	},
	emailInput: {
		...globalStyles.Input,
		marginLeft: 22
	}
});

export default CreateTicketModal;