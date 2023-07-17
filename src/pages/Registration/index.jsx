import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';

import styles from './Login.module.scss';

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: 'McFly12@mail.com',
      password: '',
      fullName: '',
    },
  });

  const onSubmit = async (values) => {
    console.log(values);
    try {
      const data = await dispatch(fetchRegister(values));
      console.log(data);

      if (data.payload?.token) {
        return window.localStorage.setItem('token', data.payload.token);
      }
    } catch (error) {
      return alert('Something went wrong', error);
    }

    return alert('Register faild');
  };

  if (isAuth) {
    return <Navigate to='/' />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant='h5'>
        Create Account
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register('fullName', { required: 'Provide a full name' })}
          className={styles.field}
          error={!!errors.fullName?.message}
          helperText={errors.fullName?.message}
          label='Full name'
          fullWidth
        />
        <TextField
          {...register('email', { required: 'Provide a email' })}
          className={styles.field}
          label='E-Mail'
          error={!!errors.email?.message}
          type='email'
          helperText={errors.email?.message}
          fullWidth
        />
        <TextField
          fullName
          className={styles.field}
          label='Password'
          fullWidth
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          {...register('password', { required: 'Provide a password' })}
        />
        <Button
          type='submit'
          size='large'
          variant='contained'
          fullWidth
          disabled={!isValid}
        >
          Create
        </Button>
      </form>
    </Paper>
  );
};
