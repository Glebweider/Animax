import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export type TYPE_FORGOTPASSWORD = 'SMS' | 'EMAIL'

interface ForgotPasswordState {
	type: TYPE_FORGOTPASSWORD;
	data: string;
	expiresAt: number;
}

const initialState: ForgotPasswordState = {
	type: 'EMAIL',
	data: '',
	expiresAt: 0
};

const forgotPasswordSlice = createSlice({
	name: 'forgotPassword',
	initialState,
	reducers: {
		setType: (state, action: PayloadAction<TYPE_FORGOTPASSWORD>) => {
			state.type = action.payload;
		},
		setData: (state, action: PayloadAction<string>) => {
			state.data = action.payload;
		},
		setExpiresAt: (state, action: PayloadAction<number>) => {
			state.expiresAt = action.payload;
		},
		clearState: (state) => {
			state.type = 'EMAIL';
			state.data = null;
			state.expiresAt = 0;
		},
	},
});

export const { setType, setData, setExpiresAt, clearState } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;