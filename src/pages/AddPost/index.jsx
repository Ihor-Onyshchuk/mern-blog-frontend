import React from 'react';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { Navigate, useNavigate } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import TextField from '@mui/material/TextField';

import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  const inputFileRef = React.useRef(null);

  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);

      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
      console.log(data);
    } catch (error) {
      console.warn(error);
      alert('Uploading Failed!');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((text) => {
    setText(text);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        text,
        title,
        tags: tags.split(','),
        imageUrl,
      };

      const { data } = await axios.post('/posts', fields);

      const id = data._id;

      navigate(`/posts/${id}`);
    } catch (error) {
      console.warn(error);
      alert('Publishing Failed!');
    }
  };

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Write something...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!authState.data && authState.status !== 'loading') {
    return <Navigate to='/' />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={(e) => inputFileRef.current.click(e)}
        variant='outlined'
        size='large'
      >
        Upload preview
      </Button>
      <input
        ref={inputFileRef}
        type='file'
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <Button variant='contained' color='error' onClick={onClickRemoveImage}>
          Remove
        </Button>
      )}
      {imageUrl && (
        <img
          className={styles.image}
          src={`http://localhost:8080${imageUrl}`}
          alt='Uploaded'
        />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant='standard'
        placeholder='Post Title'
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant='standard'
        placeholder='Tags'
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button size='large' variant='contained' onClick={onSubmit} disabled={isLoading}>
          Publish
        </Button>
        <a href='/'>
          <Button size='large' disabled={isLoading}>Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
