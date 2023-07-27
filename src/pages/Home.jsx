import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { selectIsAuth } from '../redux/slices/auth';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

const postSortingMap = {
  new: {
    key: 'new',
    value: 'createdAt',
  },
  popular: {
    key: 'popular',
    value: 'viewsCount',
  },
};

export const Home = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const [activeTab, setActiveTab] = React.useState(postSortingMap.new.value);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  React.useEffect(() => {
    if (isAuth) {
      dispatch(fetchTags());
    }
  }, [isAuth]);

  React.useEffect(() => {
    if (isAuth) {
      dispatch(fetchPosts(`?sort=${activeTab}`));
    }
  }, [activeTab, isAuth]);

  const onTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!isAuth) {
    return <Navigate to='/login' />;
  }

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={activeTab}
        onChange={onTabChange}
        aria-label='post sorting tabs'
      >
        <Tab label={postSortingMap.new.key} value={postSortingMap.new.value} />
        <Tab
          label={postSortingMap.popular.key}
          value={postSortingMap.popular.value}
        />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((post, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={isPostsLoading} />
            ) : (
              <Post
                id={post._id}
                title={post.title}
                imageUrl={
                  post.imageUrl ? `http://localhost:8080${post.imageUrl}` : ''
                }
                user={{
                  avatarUrl:
                    'https://res.cloudinary.com/practicaldev/image/fetch/s--uigxYVRB--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/187971/a5359a24-b652-46be-8898-2c5df32aa6e0.png',
                  fullName: 'Keff',
                }}
                createdAt={post.createdAt}
                viewsCount={post.viewsCount}
                commentsCount={3}
                tags={post.tags}
                isEditable={userData?._id === post.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
