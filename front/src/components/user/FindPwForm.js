import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert, { useAlert } from 'react-alert';

// Mui
import Box from '@mui/material/Box';

import Stack from '@mui/material/Stack';

import Container from '@mui/material/Container';

import * as Api from '../../api';
// import { DispatchContext } from '../../App';
import Header from '../Header';
import Footer from '../Footer';
import { validateEmail } from '../../utils';

// import styled compo
import { ValidationTextField, ColorButton, ColorButtonB } from '../styledCompo/muiCustom';
import { CaloriesBack, CatchBack, LoginGlass, TitleText } from '../styledCompo/LoginStyle';

function LoginForm() {
  const [email, setEmail] = useState('');
  const isEmailValid = validateEmail(email);
  const [sentEmail, setSentEmail] = useState(true);
  const navigate = useNavigate();
  const Alert = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Alert.success('Temporary password sent successfully.');
      const res = await Api.put('password/init', {
        email,
      });

      navigate('/login', { replace: true });

      setEmail('');
    } catch (err) {
      setSentEmail(false);
      Alert.success('The email was not sent normally.');
    }
  };

  return (
    <div>
      <Header></Header>
      <CatchBack>Catch</CatchBack>
      <CaloriesBack>Calories</CaloriesBack>
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 400,
          marginBottom: 400,
        }}
      >
        <LoginGlass>
          <form
            action="/"
            onSubmit={handleSubmit}
            style={{
              marginTop: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexFlow: 'column',
            }}
          >
            <TitleText style={{ fontSize: '80px' }}>Find Password</TitleText>
            <Box
              sx={{
                width: '438px',
              }}
              noValidate
              autoComplete="off"
            >
              <ValidationTextField
                style={{ width: 438, marginBottom: 80 }}
                autoFocus
                required
                // {!checkLogin && error}
                error={!sentEmail}
                id="outlined-required"
                label="Email Address"
                autoComplete="email"
                helperText={
                  (!isEmailValid && <span>The email format is not valid.</span>) ||
                  (!sentEmail && <span>Invalid email.</span>)
                }
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSentEmail(true);
                }}
                // defaultValue="Hello World"
              />
              <br></br>
              <Stack
                spacing={1}
                // direction="row"
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <ColorButton
                  style={{ width: '100%' }}
                  variant="contained"
                  type="submit"
                  disabled={!isEmailValid}
                  onClick={handleSubmit}
                >
                  Send a temporary PW
                </ColorButton>
                <ColorButtonB
                  style={{ width: '100%' }}
                  variant="outlined"
                  onClick={() => navigate(-1)}
                >
                  back
                </ColorButtonB>
              </Stack>
            </Box>
          </form>
          {/* <form onSubmit={handleSubmit}>
            <div>
              <label>????????? ??????</label>
              <input
                type="email"
                autoComplete="on"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            {!isEmailValid && <p>????????? ????????? ???????????? ????????????.</p>}
            <div>
              <label>????????????</label>
              <input
                type="password"
                autoComplete="on"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {!isPasswordValid && <p> ??????????????? 4?????? ???????????????. </p>}
            <button type="submit" disabled={!isFormValid}>
              ?????????
            </button>
            <button onClick={() => navigate('/register')}>??????????????????</button>
          </form> */}
        </LoginGlass>
      </Container>
    </div>
  );
}

export default LoginForm;
