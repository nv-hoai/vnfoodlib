import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Collection } from '../../../types';

interface CollectionsState {
  selectedCollection: Collection | null;
  selectedCollections: string[];
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'dishes-count';
  loading: boolean;
  searchKeyword: string;
}

const initialState: CollectionsState = {
  selectedCollection: null,
  selectedCollections: [],
  viewMode: 'grid',
  sortBy: 'date',
  loading: false,
  searchKeyword: ''
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setSelectedCollection: (state, action: PayloadAction<Collection | null>) => {
      state.selectedCollection = action.payload;
    },
    toggleSelectedCollection: (state, action: PayloadAction<string>) => {
      const index = state.selectedCollections.indexOf(action.payload);
      if (index > -1) {
        state.selectedCollections.splice(index, 1);
      } else {
        state.selectedCollections.push(action.payload);
      }
    },
    clearSelectedCollections: (state) => {
      state.selectedCollections = [];
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'date' | 'dishes-count'>) => {
      state.sortBy = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    }
  }
});

export const {
  setSelectedCollection,
  toggleSelectedCollection,
  clearSelectedCollections,
  setViewMode,
  setSortBy,
  setLoading,
  setSearchKeyword
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
