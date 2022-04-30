import React, { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useRecoilState } from 'recoil';
import { trackingUpdateState } from '../../atoms';

import * as Api from '../../api';

function TrackingFoodList({ food }) {
  const [trackingUpdate, setTrackingUpdate] = useRecoilState(trackingUpdateState);

  const [isEditing, setIsEditing] = useState(false);
  const [gram, setGram] = useState(food.gram);

  const onChange = (e) => {
    setGram(e.target.value);
  };

  const handleCheck = async (e) => {
    await Api.put('tracking/food', {
      id: food.id,
      gram: gram,
    });

    setIsEditing(false);
    setTrackingUpdate(!trackingUpdate);
  };

  const handleModify = (e) => {
    setIsEditing(true);
  };

  const handleCancle = (e) => {
    setIsEditing(false);
  };

  const handleDelete = async (e) => {
    await Api.delete(`tracking/food/${food.id}`);

    setTrackingUpdate(!trackingUpdate);
  };

  const previewKcal = () => {
    return Math.round((gram * food.calorie) / food.gram);
  };

  return (
    <>
      {isEditing ? (
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '30px' }}>{food.name}</div>
            <TextField
              id="outlined-name"
              label="gram"
              value={gram}
              onChange={onChange}
              style={{ marginRight: '30px' }}
            />
            <div style={{ marginRight: '30px' }}>{previewKcal()}</div>
          </div>
          <div>
            <Button variant="contained" type="submit" onClick={handleCheck}>
              Check
            </Button>
            <Button variant="contained" type="submit" onClick={handleCancle}>
              Cancle
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '30px' }}>{food.name}</div>
            <div style={{ marginRight: '30px' }}>{food.gram}g</div>
            <div style={{ marginRight: '30px' }}>{food.calorie}kcal</div>
            <Button variant="contained" type="submit" onClick={handleModify}>
              Modify
            </Button>
            <Button variant="contained" type="submit" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default TrackingFoodList;