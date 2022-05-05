import React, { useState, useEffect } from 'react';

import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

import { Section, GraphContainer } from '../styledCompo/mainStyle';

import { useRecoilValue, useRecoilState } from 'recoil';
import {
  trackingState,
  userInfoState,
  foodSelectedState,
  kcalPerUnitState,
  trackingUpdateState,
  exerciseSelectedState,
  kcalPerHourState,
} from '../../atoms';

import * as Api from '../../api';

function MainGraph({}) {
  const user = useRecoilValue(userInfoState);

  const [tracking, setTracking] = useRecoilState(trackingState);
  const [trackingUpdate, setTrackingUpdate] = useRecoilState(trackingUpdateState);

  const [foodSelected, setFoodSelected] = useRecoilState(foodSelectedState);
  const [kcalPerUnit, setKcalPerUnit] = useRecoilState(kcalPerUnitState);

  const [exerciseSelected, setExerciseSelected] = useRecoilState(exerciseSelectedState);
  const [kcalPerHour, setKcalPerHour] = useRecoilState(kcalPerHourState);

  const [trackingKcal, setTrackingKcal] = useState();
  const [trackingRecKcal, setTrackingRecKcal] = useState();

  const isMypage = window.location.href.split('/')[3];

  useEffect(() => {
    Api.get(`tracking/${user._id}`).then((res) => {
      // 오늘의 트래킹 정보
      setTracking(res.data);
      // 오늘의 트래킹 정보 중 칼로리
      setTrackingKcal(res.data?.acc_cal);
      setTrackingRecKcal(res.data?.rec_cal);
    });
  }, [trackingUpdate]);

  const labels = [''];

  const options = {
    // legend: {
    // 	display: false, // label 보이기 여부
    // },
    // scales: {
    // 	yAxes: [
    // 		{
    // 			ticks: {
    // 				min: 0, // y축 스케일에 대한 최소값 설정
    // 				stepSize: 1, // y축 그리드 한 칸당 수치
    // 			},
    // 		},
    // 	],
    // },

    // // false : 사용자 정의 크기에 따라 그래프 크기가 결정됨.
    // // true : 크기가 알아서 결정됨.
    // maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
        text: '오늘의 칼로리',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const handelTrackingKcal = () => {
    if (trackingKcal > trackingRecKcal) {
      return [trackingRecKcal];
    } else {
      return [trackingKcal];
    }
  };

  const handelTrackingKcalColor = () => {
    if (trackingKcal > trackingRecKcal) {
      return ['rgba(91,7,7, 0.7)'];
    } else {
      return ['rgba(240,62,62, 0.5)'];
    }
  };

  const handelTrackingKcalBorderColor = () => {
    if (trackingKcal > trackingRecKcal) {
      return ['rgba(91,7,7)'];
    } else {
      return ['rgba(240,62,62)'];
    }
  };

  const remainingKcal = () => {
    // console.log(typeof trackingKcal, trackingKcal);
    // console.log(typeof trackingRecKcal, trackingRecKcal);
    // console.log(kcalPerGram);

    // 1)섭취 칼로리나 2)선택 칼로리나 3)섭취 + 선택 칼로리가 권장 칼로리를 넘는다면, 남는 칼로리 없음
    if (
      trackingKcal > trackingRecKcal ||
      kcalPerUnit.reduce((acc, cur) => acc + cur, 0) > trackingRecKcal ||
      trackingKcal + kcalPerUnit.reduce((acc, cur) => acc + cur, 0) > trackingRecKcal
    ) {
      return [0];
      // 권장 칼로리를 넘을 경우 최대치를 5000 단위로 늘림
      //   let line = (parseInt(trackingKcal / 10000) * 10 + 5) * 1000;
      //   // console.log(line);

      //   if (trackingKcal > line) {
      //     return [line + 5000 - trackingKcal];
      //   } else {
      //     return [line - trackingKcal];
      //   }
    }

    // 소모 칼로리가 섭취 칼로리보다 많다면 최대치는 권장 칼로리
    if (trackingKcal < 0) {
      return [0];
    }

    // 선택된 항목이 없을 경우
    if (kcalPerUnit[0] === 0) {
      return [trackingRecKcal - trackingKcal];
    }

    return [trackingRecKcal - trackingKcal - kcalPerUnit.reduce((acc, cur) => acc + cur, 0)];
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Current Kcal',
        data: handelTrackingKcal(),
        backgroundColor: handelTrackingKcalColor(),
        // backgroundColor: ['rgba(240,62,62, 0.5)'],
        borderColor: handelTrackingKcalBorderColor(),
        // borderColor: ['rgba(240,62,62)'],
        borderWidth: 1,
      },
      {
        label: 'Kcal Remaining',
        data: remainingKcal(),
        backgroundColor: ['rgba(201, 203, 207, 0.2)'],
        borderColor: ['rgb(201, 203, 207)'],
        borderWidth: 1,
      },
    ],
  };

  const backgroundColor = [
    'rgba(156,253,8, 0.4)',
    'rgba(152,235,26, 0.6)',
    'rgba(148,216,45, 0.6)',
    'rgba(120,177,33, 0.5)',
    'rgba(91,134,25, 0.5)',
    'rgba(62,91,17, 0.5)',
    'rgba(47,70,13, 0.5)',
  ];

  const borderColor = [
    'rgba(156,253,8)',
    'rgba(152,235,26)',
    'rgba(148,216,45)',
    'rgba(120,177,33)',
    'rgba(91,134,25)',
    'rgba(62,91,17)',
    'rgba(47,70,13)',
  ];

  const addData = () => {
    foodSelected.map((food, idx) => {
      const newDataset = {
        label: food?.name,
        backgroundColor: backgroundColor[idx],
        borderColor: borderColor[idx],
        borderWidth: 1,
        data: [kcalPerUnit[idx]],
      };

      if (food !== 0) {
        data.datasets.splice(1, 0, newDataset);
      }
    });

    exerciseSelected.map((exercise, idx) => {
      const newDataset = {
        label: exercise?.name,
        backgroundColor: backgroundColor[idx],
        borderColor: borderColor[idx],
        borderWidth: 1,
        data: [-kcalPerHour[idx]],
      };

      if (exercise !== 0) {
        data.datasets.splice(1, 0, newDataset);
      }
    });
  };

  // mypage에서는 음식/운동 선택 막대(초록) 보이지 않음
  isMypage !== 'mypage' && addData();

  return (
    <Section>
      <h1>Calorie Graph</h1>
      <GraphContainer>
        <Bar data={data} options={options} height={300} />
      </GraphContainer>
      {trackingKcal > trackingRecKcal && (
        <h3>It's over {trackingKcal - trackingRecKcal} calories</h3>
      )}
    </Section>
  );
}

export default MainGraph;
