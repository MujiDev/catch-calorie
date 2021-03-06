import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
// import { Container, Col, Row, Form, Button } from 'react-bootstrap';

import * as Api from '../../api';

// Mui
import { Box, Button, ButtonGroup } from '@mui/material';

import Stack from '@mui/material/Stack';

import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import FormLabel from '@mui/material/FormLabel';
import { validateEmail } from '../../utils';

//Compo
import Header from '../Header';

//styled Compo
import { RedSpan } from '../styledCompo/LoginStyle';
import {
  ValidationTextField,
  ColorButton,
  ColorButtonB,
  SmallButton,
} from '../styledCompo/muiCustom';

import {
  GenderBtn,
  RegisterGlass,
  RegisterTitle,
  RegisterCircleRed1,
  RegisterCircleRed2,
  RegisterCircleGreen1,
  RegisterCircleGreen2,
} from '../styledCompo/RegisterStyle';

function RegisterForm() {
  const navigate = useNavigate();
  const Alert = useAlert();

  ///@ 각 input 상태값
  //useState로 email 상태를 생성함.
  const [email, setEmail] = useState('');
  //useState로 password 상태를 생성함.
  const [password, setPassword] = useState('');
  //useState로 confirmPassword 상태를 생성함.
  const [confirmPassword, setConfirmPassword] = useState('');
  //useState로 name 상태를 생성함.
  const [name, setName] = useState('');
  //useState로 gender 상태를 생성함.
  const [gender, setGender] = useState('male');
  //useState로 height 상태를 생성함.
  const [height, setHeight] = useState('');
  //useState로 weight 상태를 생성함.
  const [weight, setWeight] = useState('');
  //useState로 icon 상태를 생성함.
  const [icon, setIcon] = useState(
    'https://bucket-5ialfb.s3.ap-northeast-2.amazonaws.com/icon/first_badge_1.png',
  );
  // Check 버튼 상태
  const [checkNum, setCheckNum] = useState(true);
  const [isEmailAuthed, setIsEmailAuthed] = useState(false);
  // unit
  const [unit, setUnit] = useState('us');
  // open
  // const [open, setOpen] = useState(false);
  // const [openChecked, setOpenChecked] = useState(open);

  const [code, setCode] = useState('유저가 임시번호를 치면 받아오는 곳이랍니다.');
  const [resCode, setResCode] = useState('임시번호가 할당되는 곳이랍니다.');

  ///@ 이메일로 임시 번호 보내는 곳
  const reqCode = async () => {
    try {
      Alert.success('Your email verification number has been successfully sent to your email.');
      return setResCode(await Api.get(`users/email/${email}`).then((data) => data.data));
    } catch (err) {
      Alert.error('Email transmission failed.', err.response.data.errorMessage);
    }
  };
  ///@ 임시번호를 알고싶나요? 콘솔을 켜시면 됩니당.
  // console.log(resCode);

  ///@ 각 input 유효성 검사
  //위 validateEmail 함수를 통해 이메일 형태 적합 여부를 확인함.
  const isEmailValid = validateEmail(email);
  // 비밀번호가 4글자 이상인지 여부를 확인함.
  const isPasswordValid = password.length >= 4;
  // 비밀번호와 확인용 비밀번호가 일치하는지 여부를 확인함.
  const isPasswordSame = password === confirmPassword;
  // 이름이 2글자 이상인지 여부를 확인함.
  const isNameValid = name.length >= 2;
  // 공백이나 숫자인지 여부를 확인함.
  const isHeightValid = Number(height) > 0 && height.length > 0;
  // 공백이나 숫자인지 여부를 확인함.
  const isWeightValid = Number(weight) > 0 && weight.length > 0;

  ///@ 조건이 모두 동시에 만족되는지 여부를 확인함.
  const isFormValid =
    isEmailValid &&
    isPasswordValid &&
    isPasswordSame &&
    isNameValid &&
    isHeightValid &&
    isWeightValid &&
    isEmailAuthed;

  ///@ 임시번호 확인후 상태값 변경
  const checkTempNumValid = () => {
    if (code === resCode) {
      Alert.success('You have successfully authenticated your email.');
      setIsEmailAuthed(true);
      // setCheckNum('이메일 인증 완료');
    } else {
      Alert.error('The authentication number was entered incorrectly.');
      setIsEmailAuthed(false);
      setCheckNum(false);
      // setCheckNum('');
    }
  };

  ///@ 버튼 그룹 gender
  const buttons = [
    <GenderBtn
      key="male"
      color="success"
      variant={gender === 'male' ? 'contained' : 'outlined'}
      onClick={() => setGender('male')}
    >
      male
    </GenderBtn>,
    <GenderBtn
      key="female"
      color="success"
      variant={gender === 'female' ? 'contained' : 'outlined'}
      onClick={() => setGender('female')}
    >
      female
    </GenderBtn>,
  ];
  ///@ 버튼 그룹 unit
  const unitButtons = [
    <Button
      key="cm/kg"
      color="success"
      variant={unit === 'non_us' ? 'contained' : 'outlined'}
      onClick={() => setUnit('non_us')}
    >
      Metric
    </Button>,
    <Button
      key="ft/lb"
      color="success"
      variant={unit === 'us' ? 'contained' : 'outlined'}
      onClick={() => setUnit('us')}
    >
      U.S.Standard
    </Button>,
  ];

  ///@ open 상태변경 함수
  // const handleOpenSwitch = (e) => {
  //   setOpenChecked(e.target.checked);
  //   if (openChecked) {
  //     setOpen(false);
  //   } else {
  //     setOpen(true);
  //   }
  // };

  ///@ height, weight 조건부 헬퍼텍스트 렌더링
  const unitChangeHeight = () => {
    if (unit === 'us') {
      return <RedSpan>Please enter a number only.(The unit is feet.)</RedSpan>;
    }
    return <RedSpan>Please enter a number only.(The unit is cm.)</RedSpan>;
  };

  const unitChangeWeight = () => {
    if (unit === 'us') {
      return <RedSpan>Please enter a number only.(The unit is lb.)</RedSpan>;
    }
    return <RedSpan>Please enter a number only.(The unit is kg.)</RedSpan>;
  };

  ///@ 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Api.post('users/register', {
        email,
        password,
        name,
        gender,
        height: Number(height),
        weight: Number(weight),
        unit,
        // open,
        icon,
      });

      // 로그인 페이지로 이동함.

      navigate('/login');
      Alert.success('You have successfully registered as a member.');
    } catch (err) {
      if (
        err.response.data.errorMessage ===
        '현재 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.'
      ) {
        Alert.error('This email is currently in use. Please enter another email.');
      }
    }
  };

  return (
    <>
      <Header></Header>
      {/* ///@ 동그라미들 */}
      <RegisterCircleRed1></RegisterCircleRed1>
      <RegisterCircleRed2></RegisterCircleRed2>
      <RegisterCircleGreen1></RegisterCircleGreen1>
      <RegisterCircleGreen2></RegisterCircleGreen2>
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexFlow: 'column',
          marginTop: 313,
          marginBottom: 313,
        }}
      >
        <RegisterGlass>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexFlow: 'column',
            }}
          >
            {/* ///@ 회원가입 타이틀 */}
            <RegisterTitle>Register</RegisterTitle>
            <Box
              sx={{
                // '@media (max-width: 766px)': {
                //   width: 'auto',
                // },

                '& > :not(style)': {
                  m: 1,
                  width: '560px',
                  '@media (max-width: 766px)': {
                    width: '420px',
                  },

                  '@media (max-width: 526px)': {
                    width: '260px',
                  },
                },
              }}
              autoComplete="off"
            >
              {/* ///@ 이메일 */}
              <div
                style={{
                  '@media (max-width: 766px)': {
                    width: 'auto',
                  },
                }}
              >
                <ValidationTextField
                  // style={{
                  //   width: 437,
                  //   '@media (max-width: 766px)': {
                  //     width: 'auto',
                  //   },
                  // }}
                  autoFocus
                  required
                  // error={!checkLogin}
                  id="outlined-required"
                  label="Email Address"
                  autoComplete="email"
                  helperText={!isEmailValid && <RedSpan>The email format is not valid.</RedSpan>}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsEmailAuthed(false);
                  }}
                  // defaultValue="Hello World"
                />
                {/* ///@ 이메일 인증 버튼 */}
                <ColorButton
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    fontSize: 14,
                    width: '100%',
                    '@media (max-width: 766px)': {
                      width: 'auto',
                    },
                  }}
                  disabled={!isEmailValid}
                  onClick={reqCode}
                  title="Click the button to receive the verification code by email."
                >
                  Email Authentication
                </ColorButton>
              </div>

              {/* ///@ 인증번호 확인 input */}
              <div>
                <ValidationTextField
                  error={!checkNum}
                  size="small"
                  helperText={
                    !isEmailAuthed && (
                      <RedSpan> Please enter the temporary number and press the button. </RedSpan>
                    )
                  }
                  placeholder="Please enter the authentication number after receiving the email verification."
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCheckNum(true);
                  }}
                />
                {/* ///@ 인증번호 확인 버튼 */}
                <SmallButton
                  style={{
                    marginTop: 10,
                    width: '100%',
                  }}
                  size="small"
                  disabled={!code || code === '유저가 임시번호를 치면 받아오는 곳이랍니다.'}
                  onClick={checkTempNumValid}
                >
                  Check
                </SmallButton>
              </div>
              <br></br>
              {/* ///@ 비밀번호 */}
              <ValidationTextField
                required
                // error={!checkLogin}
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                helperText={
                  !isPasswordValid && <RedSpan> Password is more than 4 characters. </RedSpan>
                }
                onChange={(e) => {
                  setPassword(e.target.value);
                  // setCheckLogin(true);
                }}
              />
              <br></br>
              {/* ///@ 비밀번호 확인 */}
              <ValidationTextField
                required
                // error={!checkLogin}
                label="Confirm Password"
                type="password"
                autoComplete="current-password"
                value={confirmPassword}
                helperText={!isPasswordSame && <RedSpan> Passwords do not match. </RedSpan>}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  // setCheckLogin(true);
                }}
              />
              <br></br>
              {/* ///@ 닉네임 */}
              <ValidationTextField
                required
                // {!checkLogin && error}
                // error={!checkLogin}
                label="Nick Name"
                // autoComplete="email"
                helperText={
                  !isNameValid && <RedSpan>Please set the nickname at least 2 characters.</RedSpan>
                }
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  // setCheckLogin(true);
                }}
                // defaultValue="Hello World"
              />
              <br></br>
              {/* ///@ 성별 */}
              <ButtonGroup>{buttons}</ButtonGroup>
              {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel value="male" control={<Radio color="success" />} label="Male" />
                <FormControlLabel value="female" control={<Radio color="success" />} label="Female" />
              </RadioGroup> */}
              <br></br>
              {/* ///@ 유닛 */}
              <ButtonGroup size="small" style={{ justifyContent: 'flex-end' }}>
                {/* ///@ 공개여부 */}
                {/* <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Private</Typography>
                  <IOSSwitch
                    title="Whether to disclose body information"
                    checked={openChecked}
                    onChange={handleOpenSwitch}
                  />
                  <Typography>Public</Typography>
                </Stack> */}
                <div>{unitButtons}</div>
              </ButtonGroup>

              <br></br>
              {/* ///@ 키 */}
              <ValidationTextField
                required
                // {!checkLogin && error}
                // error={!checkLogin}
                type="number"
                label="Height"
                // autoComplete="email"
                helperText={!isHeightValid && unitChangeHeight()}
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  // setCheckLogin(true);
                }}
                // defaultValue="Hello World"
              />
              <br></br>
              {/* ///@ 체중 */}
              <ValidationTextField
                required
                // {!checkLogin && error}
                // error={!checkLogin}
                type="number"
                label="Weight"
                // autoComplete="email"
                helperText={!isWeightValid && unitChangeWeight()}
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  // setCheckLogin(true);
                }}
                // defaultValue="Hello World"
              />
              <br></br>
            </Box>
            <Box
              sx={{
                '& > :not(style)': { m: 1, width: '560px' },
              }}
              noValidate
              autoComplete="off"
            >
              {/* ///@ 뱃지 */}

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FormLabel id="demo-row-radio-buttons-group-label">Badges</FormLabel>
              </div>

              <RadioGroup
                row
                title="You can choose one of these badges."
                name="row-radio-buttons-group"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '@media (max-width: 766px)': {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                  },

                  '@media (max-width: 526px)': {
                    gridTemplateColumns: 'repeat(1, 1fr)',
                  },
                }}
              >
                <FormControlLabel
                  title="일반인"
                  value="https://bucket-5ialfb.s3.ap-northeast-2.amazonaws.com/icon/first_badge_1.png"
                  labelPlacement="bottom"
                  control={<Radio color="success" />}
                  label={<img src="/first_badge_1.png" alt="all" style={{ width: 100 }}></img>}
                />
                <FormControlLabel
                  title="인싸"
                  value="https://bucket-5ialfb.s3.ap-northeast-2.amazonaws.com/icon/first_badge_2.png"
                  labelPlacement="bottom"
                  control={<Radio color="success" />}
                  label={<img src="/first_badge_2.png" alt="all" style={{ width: 100 }}></img>}
                />
                <FormControlLabel
                  title="핵인싸"
                  value="https://bucket-5ialfb.s3.ap-northeast-2.amazonaws.com/icon/first_badge_3.png"
                  labelPlacement="bottom"
                  control={<Radio color="success" />}
                  label={<img src="/first_badge_3.png" alt="all" style={{ width: 100 }}></img>}
                />
                <FormControlLabel
                  title="찐"
                  value="https://bucket-5ialfb.s3.ap-northeast-2.amazonaws.com/icon/first_badge_4.png"
                  labelPlacement="bottom"
                  control={<Radio color="success" />}
                  label={<img src="/first_badge_4.png" alt="all" style={{ width: 100 }}></img>}
                />
              </RadioGroup>
              <Stack
                spacing={1}
                direction="row"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                style={{ marginTop: 40 }}
              >
                {/* ///@ 버튼들 */}
                <ColorButton
                  variant="contained"
                  style={{ width: '35%' }}
                  type="submit"
                  disabled={!isFormValid}
                >
                  Sign-up
                </ColorButton>
                <ColorButtonB
                  variant="outlined"
                  style={{ width: '35%' }}
                  onClick={() => navigate('/login')}
                >
                  Back
                </ColorButtonB>
              </Stack>
            </Box>
          </form>
        </RegisterGlass>
      </Container>
    </>
  );
}

export default RegisterForm;
