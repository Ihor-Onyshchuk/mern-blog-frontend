import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';

import styles from './Login.module.scss';

export const Login = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'McFly12@mail.com',
      password: '12345678',
    },
  });

  const onSubmit = async (values) => {
    try {
      const data = await dispatch(fetchAuth(values));

      if (data.payload?.token) {
        return window.localStorage.setItem('token', data.payload.token);
      }
    } catch (error) {
      return alert('Something went wrong', error);
    }

    return alert('Login faild');
  };

  if (isAuth) {
    return <Navigate to='/' />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant='h5'>
        Login to the account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label='E-Mail'
          error={!!errors.email?.message}
          type='email'
          helperText={errors.email?.message}
          fullWidth
          {...register('email', { required: 'Provide an email' })}
        />
        <TextField
          className={styles.field}
          label='Password'
          type='password'
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          fullWidth
          {...register('password', { required: 'Provide a password' })}
        />
        <Button size='large' variant='contained' fullWidth type='submit'>
          Login
        </Button>
      </form>
    </Paper>
  );
};
