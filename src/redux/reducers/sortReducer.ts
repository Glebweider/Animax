import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Filter {
  id: number;
  text: string;
}

interface SortState  {
  filter: Filter[];
}

const initialState: SortState = {
  filter: [],
};

const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    addFilter: (state, action: PayloadAction<Filter>) => {
      const filterExists = state.filter.find(filter => filter.id === action.payload.id);
      if (!filterExists) {
        state.filter.push(action.payload);
      } else {
        const index = state.filter.findIndex(filter => filter.id === action.payload.id);
        if (index !== -1) {
          state.filter.splice(index, 1);
        }
      }
    },
    reset: (state, action: PayloadAction<boolean>) => {
      state.filter = [];
    },
  },
});

export const {addFilter, reset} = sortSlice.actions;

export default sortSlice.reducer;