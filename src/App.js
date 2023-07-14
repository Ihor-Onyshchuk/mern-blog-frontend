import React from 'react';
import Container from '@mui/material/Container';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Header } from './components';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import { Home, FullPost, Registration, AddPost, Login } from './pages';

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe())
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth='lg'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />
          <Route path='/posts/create' element={<AddPost />} />
          <Route path='/posts/:id' element={<FullPost />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
