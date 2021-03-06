# catch-calorie 

엘리스 AI 트랙 4기 2차 데이터 분석 웹 프로젝트 13팀 무지개발자 레포지토리입니다.

- 건강을 위한 식습관 및 운동습관을 잡아주는 서비스

## 프로젝트 구성 안내

## 1. 프로젝트 소개

**사용하려는 데이터셋 (출처: Kaggle)**
  - [현대인의 비만률과 연관있는 요소](https://www.kaggle.com/datasets/mandysia/obesity-dataset-cleaned-and-data-sinthetic) 
  - [운동 별 소모하는 칼로리](https://www.kaggle.com/datasets/aadhavvignesh/calories-burned-during-exercise-and-activities)
  - [음식 별 섭취하는 칼로리](https://www.kaggle.com/datasets/kkhandekar/calories-in-food-items-per-100-grams)
  
**기술 스택** 
  - python
  - mongoDB
  - react
  - node.js

**라이브러리**
  - pandas, matplotlib
  - mui

## 2. 프로젝트 목표

**데이터 분석 결과로 도출되는 인사이트와 웹서비스의 해결과제에 대한 논의 (50자 이상)**
  - 현대인들의 비만도는 고칼로리 음식을 섭취한다고 증가하는 것이 아니다.
  - 데이터 분석에 따르면 BMI 수치가 높을수록 섭취한 칼로리를 확인하지 않는다.
  - 더불어 신체 활동을 자주 할수록 BMI 수치가 낮다.

  - 단순하게 마음만 먹는다고 건강을 관리하긴 쉽지 않다.
  - 하루동안 먹은 것과 운동한 것을 한 번에 볼 수 있는 방법이 없을까?
  - **자신이 섭취한 것과 소모한 칼로리를 한 눈에 그래프로 볼 수 있도록 트래킹하는 웹 사이트를 생각**
  

## 3. 프로젝트 기능 설명

**웹서비스의 유용성, 편의성 및 시각화의 실용성에 대한 설명**
  - 주요 기능 (주된 활용성) 및 서브 기능
    - **주요 기능**
      
      <섭취한 칼로리와 소모한 칼로리 트래킹>

        자신이 섭취한 음식을 등록하면 하루 권장 칼로리 이내에 섭취하였는지 표시
        자신이 운동한 것을 등록하면 하루 섭취 칼로리에서 차감한 것을 표시

    - **서브 기능**

      <잔디 심기(가제)>

        만약 하루동안 권장 칼로리 이내로 섭취 시 해당 일의 칸의 색 변화

      <보상 시각화>

        일정 기간동안 꾸준히 운동한 것을 등록하면,
        치팅데이 때 소모한 칼로리만큼의 음식 추천
        
        (예시. "일주일 간 권장 칼로리보다 200kcal씩 섭취하셨네요, 오늘은 520kcal의 치킨 피자 두 조각 어떠세요?")

  - 프로젝트만의 차별점, 기대 효과
    (작성 중)

## 4. 프로젝트 구성도
  - 와이어프레임/스토리보드 추가

## 5. 프로젝트 팀원 역할 분담
| 이름 | 담당 업무 | 역할 |
| ------ | ------ | ------|
| 김유진 | 백엔드 개발 | 데이터 분석 피드백 관리 |
| 김채정 | 백엔드 개발 | 팀장 |
| 김현서 | 백엔드 개발 | 백 피드백 관리 |
| 조원일 | 프론트엔드 개발 | 깃랩 이슈 관리 |
| 윤여건 | 프론트엔드 개발 | 발표 |
| 임경민 | 프론트엔드 개발 | 프론트 피드백 관리 |

**멤버별 responsibility**

1. 팀장 

- 기획 단계: 구체적인 설계와 지표에 따른 프로젝트 제안서 작성
- 개발 단계: 팀원간의 일정 등 조율 + 프론트 or 백엔드 개발
- 수정 단계: 기획, 스크럼 진행, 코치님 피드백 반영해서 수정, 발표 준비

2. 프론트엔드 

- 기획 단계: 큰 주제에서 문제 해결 아이디어 도출, 데이터 수집, 와이어프레임 작성
- 개발 단계: 와이어프레임을 기반으로 구현, 데이터 처리 및 시각화 담당, UI 디자인 완성
- 수정 단계: 피드백 반영해서 프론트 디자인 수정

 3. 백엔드 & 데이터 담당  

- 기획 단계: 기획 데이터 분석을 통해 해결하고자 하는 문제를 정의
- 개발 단계: 웹 서버 사용자가 직접 백엔드에 저장할수 있는 기능 구현, 데이터 베이스 구축 및 API 활용, 데이터 분석 개념 총동원하기
- 수정 단계: 코치님 피드백 반영해서 분석/ 시각화 방식 수정

## 6. 버전
  - 프로젝트의 버전 기입

## 7. FAQ
  - 자주 받는 질문 정리
