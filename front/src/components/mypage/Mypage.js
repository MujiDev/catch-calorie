import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../Header.js';

import Jandi from './Jandi.js';
import Badges from './Badges.js';
import { useRecoilValue } from 'recoil';
import { useParams } from 'react-router-dom';
import { userInfoState } from '../../atoms.js';
import * as Api from '../../api';
import UserInfo from './userInfo/userInfo.js';

import * as MP from '../styledCompo/MypageStyle';

const BadgesPage = styled.section`
  height: auto;
  width: auto;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-bottom: 30px;

  @media screen and (max-width: 1440px) {
    padding-top: 500px;
  }
`;

const JandiPage = styled.section`
  height: auto;
  width: auto;
  background-color: white;
  display: flex;
  justify-content: center;
  padding-bottom: 100px;
`;

function Mypage() {
  const user = useRecoilValue(userInfoState);
  const params = useParams();

  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  // const [isEditable, setIsEditable] = useState(false);
  useEffect(() => {
    if (params.user_id) {
      // 네트워크에서 다른 유저를 눌러서 들어온 경우 해당 params를 통해 다른 유저 마이페이지 정보를 가져옴
      const userId = params.user_id;

      async function getUserInfo(userId) {
        const res = await Api.get('users', userId);
        const temp = res.data;
        setCurrentUserInfo(temp);
      }
      getUserInfo(userId);
    } else {
      // 네트워크가 아닌 마이페이지 누르기를 통해 들어온 경우 전역에 있는 아이디값을 통해 자신의 마이페이지 정보를 가저옴
      // console.log(user.icon);
      setCurrentUserInfo(user);
      // setIsEditable(true);
    }
  }, [params, user]);

  return (
    <>
      <Header />
      <MP.MypageCircleRed></MP.MypageCircleRed>
      <MP.MypageCircleGreen></MP.MypageCircleGreen>
      <UserInfo currentUserInfo={currentUserInfo} />
      <BadgesPage>
        <Badges currentUserInfo={currentUserInfo} />
      </BadgesPage>
      {/* <MP.MypageCircleRed2></MP.MypageCircleRed2> */}
      <JandiPage>
        <Jandi />
      </JandiPage>

      {/* <Footer /> */}
    </>
  );
}

export default Mypage;
