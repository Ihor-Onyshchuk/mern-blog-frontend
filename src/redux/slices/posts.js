import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (queryParams) => {
    const { data } = await axios.get(`/posts${queryParams || ''}`);
    return data;
  }
);

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  'posts/fetchRemovePost',
  async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);
    return data;
  }
);

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    // get posts
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    // get tags
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },
    // remove post
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        ({ _id }) => _id !== action.meta.arg
      );
    },
  },
});

export const postsReducer = postsSlice.reducer;
