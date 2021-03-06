import React, { useState, useEffect } from 'react';

import { Button, ButtonGroup } from '@mui/material';

import { AutoCompleteCustom, AddAddButton, AddCancelButton } from '../styledCompo/MainMuiCustom';

import { BodyContainer, TrackingSwitchContainer } from '../styledCompo/mainStyle';
import {
  AddFormsContainer,
  AddTitle,
  AddFormSection,
  AddFormTitle,
  AddButtonContainer,
} from '../styledCompo/Add';
import { LoginGlass, RedSpan } from '../styledCompo/LoginStyle';
import { ValidationTextField } from '../styledCompo/muiCustom';

import { Grid } from '@mui/material';

import Header from '../Header';

import { useNavigate } from 'react-router-dom';

import { useRecoilValue } from 'recoil';

import { foodListState } from '../../atoms';

import { userInfoState } from '../../atoms';

import * as Api from '../../api';

function MainFoodAdd() {
  const navigate = useNavigate();

  const user = useRecoilValue(userInfoState);
  const foodList = useRecoilValue(foodListState);

  const [checked, setChecked] = useState(true);

  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState('');
  const [name, setName] = useState();
  const [kcal, setKcal] = useState();
  const [unit, setUnit] = useState('gram');

  const [isCategoryEmpty, setIsCategoryEmpty] = useState(false);
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [isKcalEmpty, setIsKcalEmpty] = useState(false);
  const [isKcalNumber, setIsKcalNumber] = useState(true);

  const [value, setValue] = useState();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const allFoodCategory = foodList.map((food) => food?.category);
    const set = new Set(allFoodCategory);

    setCategoryList([...set]);
  }, []);

  useEffect(() => {
    if (checked === true) {
      setUnit('gram');
    } else {
      setUnit('pound');
    }
  }, [checked]);

  const handleSubmit = async () => {
    setIsCategoryEmpty(!category);
    setIsNameEmpty(!name);
    setIsKcalEmpty(!kcal);
    setIsKcalNumber(Number(kcal) > 0);

    try {
      if (category && name && kcal && Number(kcal) > 0) {
        await Api.post(`foods`, {
          category: category,
          name: name,
          kcal: kcal,
          unit: unit,
        }).then((res) => res.status === 201 && alert('Food has been added'));
        navigate(`/tracking/${user._id}`, { replace: false });
      }
    } catch (err) {
      alert('Food that already exists');
    }
  };

  const buttons = [
    <Button
      key="cm/kg"
      color="success"
      variant={checked ? 'contained' : 'outlined'}
      onClick={() => setChecked(true)}
    >
      Metric
    </Button>,
    <Button
      key="ft/lb"
      color="success"
      variant={!checked ? 'contained' : 'outlined'}
      onClick={() => setChecked(false)}
    >
      U.S.Standard
    </Button>,
  ];

  return (
    <>
      <Header />
      <BodyContainer>
        <Grid container spacing={1}>
          <LoginGlass style={{ marginTop: '150px' }}>
            <AddTitle>Add Food</AddTitle>
            <Grid item sm={12}>
              <AddFormsContainer>
                <AddFormSection>
                  <AddFormTitle>Please Select a Category</AddFormTitle>
                  <AutoCompleteCustom
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                      setCategory(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                    }}
                    id="controllable-states-demo"
                    options={categoryList}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <ValidationTextField
                        {...params}
                        label="category"
                        helperText={isCategoryEmpty && <RedSpan>Please select a category</RedSpan>}
                      />
                    )}
                    style={{ width: '100%' }}
                  />
                </AddFormSection>
                <AddFormSection>
                  <AddFormTitle>Please Enter a Name</AddFormTitle>
                  <ValidationTextField
                    label="food name"
                    variant="outlined"
                    inputvalue={name}
                    onBlur={(e) => setName(e.target.value)}
                    helperText={isNameEmpty && <RedSpan>Please enter a name</RedSpan>}
                    style={{ width: '100%' }}
                  />
                </AddFormSection>
                <AddFormSection>
                  <AddFormTitle>Please Enter a Kcal Per Unit Weight</AddFormTitle>
                  <ValidationTextField
                    label="kcal"
                    variant="outlined"
                    inputvalue={kcal}
                    onBlur={(e) => setKcal(e.target.value)}
                    helperText={
                      isKcalEmpty ? (
                        <RedSpan>Please enter a kcal per unit weight</RedSpan>
                      ) : (
                        !isKcalNumber && <RedSpan>Please enter a number only</RedSpan>
                      )
                    }
                    style={{ width: '50%' }}
                  />
                  <TrackingSwitchContainer>
                    <ButtonGroup
                      style={{ marginBottom: -10, marginTop: 10 }}
                      size="small"
                      aria-label="small button group"
                    >
                      {buttons}
                    </ButtonGroup>
                  </TrackingSwitchContainer>
                </AddFormSection>
              </AddFormsContainer>

              <AddButtonContainer>
                <AddAddButton variant="contained" onClick={handleSubmit}>
                  Add
                </AddAddButton>
                <AddCancelButton
                  variant="contained"
                  onClick={() => navigate(`/tracking/${user._id}`, { replace: false })}
                >
                  Cancel
                </AddCancelButton>
              </AddButtonContainer>
            </Grid>
          </LoginGlass>
        </Grid>
      </BodyContainer>
    </>
  );
}

export default MainFoodAdd;
