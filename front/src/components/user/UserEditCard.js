import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { userInfoState } from '../../atoms';
import * as Api from '../../api';

import {
  UserAKAInfo,
  UserCardFrame,
  UserBodyInfo,
  UserBtnInfo,
  UserBadgeImgInfo,
} from '../styledCompo/LoginStyle';

import { ColorButton, ValidationTextField, IOSSwitch } from '../styledCompo/muiCustom';

//Mui
import {
  Typography,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Switch,
  ButtonGroup,
  Button,
} from '@mui/material';

//단위변환
import configureMeasurements, { mass, length } from 'convert-units';
import { Stack } from '@mui/material';
import { BodyInfo } from '../styledCompo/UserCardStyle';
const convert = configureMeasurements({ mass, length });

const UserEditCard = ({ setCardState }) => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const FTHeight = Number(convert(userInfo.height).from('cm').to('ft').toFixed(2));
  const LBWeight = Number(convert(userInfo.weight).from('kg').to('lb').toFixed(2));

  const [editUser, setEditUser] = useState({
    ...userInfo,
    UsHeight: FTHeight,
    UsWeight: LBWeight,
  });

  const { UsHeight, UsWeight, height, weight, name, open, unit, status, gender, icon } = editUser;

  useEffect(() => {
    if (unit === 'us') {
      setEditUser((cur) => ({
        ...cur,
        UsHeight: convert(Number(cur.height)).from('cm').to('ft').toFixed(2),
        UsWeight: convert(Number(cur.weight)).from('kg').to('lb').toFixed(2),
      }));
      return;
    }
  }, [unit]);

  useEffect(() => {
    if (unit === 'non_us') {
      setEditUser((cur) => ({
        ...cur,
        height: convert(Number(cur.UsHeight)).from('ft').to('cm').toFixed(2),
        weight: convert(Number(cur.UsWeight)).from('lb').to('kg').toFixed(2),
      }));
    }
  }, [unit]);

  // 이름이 2글자 이상인지 여부를 확인함.
  const isNameValid = name.length >= 2;
  // 공백이나 숫자인지 여부를 확인함.
  const isHeightValid = String(height).length > 0 && Number(height) > 0;
  // 공백이나 숫자인지 여부를 확인함.
  const isWeightValid = String(weight).length > 0 && Number(weight) > 0;
  // 공백이나 숫자인지 여부를 확인함.
  const isUsHeightValid = String(UsHeight).length > 0 && Number(UsHeight) > 0;
  // 공백이나 숫자인지 여부를 확인함.
  const isUsWeightValid = String(UsWeight).length > 0 && Number(UsWeight) > 0;

  // 조건이 모두 동시에 만족되는지 여부를 확인함.
  const isFormValid =
    isNameValid && isHeightValid && isWeightValid && isUsHeightValid && isUsWeightValid;

  // 스위치 State
  const [checked, setChecked] = useState(true);
  const [openChecked, setOpenChecked] = useState(open);

  // unit 변경 함수
  // const handleUnitSwitch = (e) => {
  //   setChecked(e.target.checked);
  //   if (checked) {
  //     setEditUser((prev) => ({ ...prev, unit: 'non_us' }));
  //   } else {
  //     setEditUser((prev) => ({ ...prev, unit: 'us' }));
  //   }
  // };

  // open 변경 함수
  const handleOpenSwitch = (e) => {
    setOpenChecked(e.target.checked);
    if (openChecked) {
      setEditUser((prev) => ({ ...prev, open: false }));
    } else {
      setEditUser((prev) => ({ ...prev, open: true }));
    }
  };

  const buttons = [
    <Button
      key="cm/kg"
      color="success"
      variant={unit === 'non_us' ? 'contained' : 'outlined'}
      onClick={() => setEditUser((prev) => ({ ...prev, unit: 'non_us' }))}
    >
      Metric
    </Button>,
    <Button
      key="ft/lb"
      color="success"
      variant={unit === 'us' ? 'contained' : 'outlined'}
      onClick={() => setEditUser((prev) => ({ ...prev, unit: 'us' }))}
    >
      U.S.Standard
    </Button>,
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await Api.put(`users/${userInfo._id}`, {
        // email: editUser.email,
        // password: editUser.password,
        name,
        gender,
        height: unit === 'us' ? Number(UsHeight) : Number(height),
        weight: unit === 'us' ? Number(UsWeight) : Number(weight),
        unit,
        open,
        icon,
        status,
      });

      setUserInfo(res.data);
      setCardState();
    } catch (err) {
      console.log(`req 요청이 제대로 가지 않았군요 ${err}`);
    }
  };

  return (
    <>
      <UserCardFrame>
        <UserBodyInfo>
          <BodyInfo variant="h5">Edit User Info</BodyInfo>
        </UserBodyInfo>
        <UserBodyInfo></UserBodyInfo>

        <UserBadgeImgInfo style={{ flexFlow: 'column' }}>
          <ValidationTextField
            required
            sx={{ width: 300 }}
            error={!isNameValid}
            label="Nick Name"
            helperText={!isNameValid && <span>Please set the nickname at least 2 characters.</span>}
            value={name}
            onChange={(e) => {
              setEditUser((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
          <br />

          <Stack direction="row" spacing={1} alignItems="center">
            <FormLabel style={{ marginRight: 16 }}>physical info open</FormLabel>
            <Typography>Private</Typography>
            <IOSSwitch checked={openChecked} onChange={handleOpenSwitch} />
            <Typography>Public</Typography>
          </Stack>
          {/* <RadioGroup
            sx={{ width: 300 }}
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={open}
            onChange={(e) => setEditUser((prev) => ({ ...prev, open: e.target.value }))}
          >
            <FormControlLabel value={true} control={<Radio color="success" />} label="Public" />
            <FormControlLabel value={false} control={<Radio color="success" />} label="Private" />
          </RadioGroup> */}
          <br />
          {/* <FormLabel id="demo-row-radio-buttons-group-label">Unit</FormLabel>
          <RadioGroup
            sx={{ width: 300 }}
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={unit}
            onChange={(e) => setEditUser((prev) => ({ ...prev, unit: e.target.value }))}
          >
            <FormControlLabel value="us" control={<Radio color="success" />} label="US" />
            <FormControlLabel value="non_us" control={<Radio color="success" />} label="Non-Us" />
          </RadioGroup> */}
          {/* <FormLabel>unit</FormLabel> */}
          {/* <Stack direction="row" spacing={1} alignItems="center">
            <Typography>(cm/kg)</Typography>
            <IOSSwitch checked={checked} onChange={handleUnitSwitch} />
            <Typography>(ft/lb)</Typography>
          </Stack> */}
          <ButtonGroup size="small" aria-label="small button group">
            {buttons}
          </ButtonGroup>
          <div style={{ width: 290, marginTop: 14, marginBottom: 6 }}>
            <Typography style={{ color: '#F03E3E' }}>
              If you modify the body information, it will be reflected from the next day.
            </Typography>
          </div>
          <br />
          {unit === 'us' ? (
            <ValidationTextField
              required
              type="number"
              sx={{ width: 300 }}
              error={!isHeightValid}
              label="Height-feet"
              helperText={
                !isHeightValid && <span>Please enter a number only.(The unit is feet.)</span>
              }
              value={UsHeight}
              onChange={(e) => {
                setEditUser((prev) => ({ ...prev, UsHeight: e.target.value }));
              }}
            />
          ) : (
            <ValidationTextField
              required
              type="number"
              sx={{ width: 300 }}
              error={!isHeightValid}
              label="Height-cm"
              helperText={
                !isHeightValid && <span>Please enter a number only.(The unit is feet.)</span>
              }
              value={height}
              onChange={(e) => {
                setEditUser((prev) => ({ ...prev, height: e.target.value }));
              }}
            />
          )}
          <br></br>
          {unit === 'us' ? (
            <ValidationTextField
              required
              type="number"
              sx={{ width: 300 }}
              error={!isWeightValid}
              label="Weight-lb"
              helperText={
                !isWeightValid && <span>Please enter a number only.(The unit is pounds.)</span>
              }
              value={UsWeight}
              onChange={(e) => {
                setEditUser((prev) => ({ ...prev, UsWeight: e.target.value }));
              }}
            />
          ) : (
            <ValidationTextField
              required
              type="number"
              sx={{ width: 300 }}
              error={!isWeightValid}
              label="Weight-kg"
              helperText={
                !isWeightValid && <span>Please enter a number only.(The unit is pounds.)</span>
              }
              value={weight}
              onChange={(e) => {
                setEditUser((prev) => ({ ...prev, weight: e.target.value }));
              }}
            />
          )}
          <br></br>
          <ValidationTextField
            label="Status"
            sx={{ width: 300 }}
            value={status}
            onChange={(e) => {
              setEditUser((prev) => ({ ...prev, status: e.target.value }));
            }}
          />
        </UserBadgeImgInfo>
        <UserAKAInfo></UserAKAInfo>

        <UserBtnInfo>
          <ColorButton
            sx={{ width: 130, height: 50, fontSize: 18, marginRight: 2 }}
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            Confirm
          </ColorButton>
          <ColorButton sx={{ width: 130, height: 50, fontSize: 18 }} onClick={() => setCardState()}>
            Cancel
          </ColorButton>
        </UserBtnInfo>
      </UserCardFrame>
    </>
  );
};

export default UserEditCard;
