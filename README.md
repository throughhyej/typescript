# typescript
https://www.inflearn.com/course/타입스크립트-실전
https://github.com/joshua1988/learn-typescript/tree/master/setup

- 강의: npm init -y, npm i -D typescript 등등 통해 프로젝트 구성
- 적용: vue create 통해 typescript 적용

# 자바스크립트 프로젝트에 타입스크립트 적용

0. 자바스크립트 파일에 JSDoc으로 타입 시스템 적용 (큰 프로젝트의 경우, 이 방법 추천)
1. 타입스크립트 기본 환경 구성
    - NPM 초기화
        npm init -y
    - 타입스크립트 라이브러리 설치
        npm i -D typescript
    - 타입스크립트 설정 파일 생성 및 기본 값 추가
        tsconfig.json
    - 자바스크립트 파일을 타입스크립트 파일로 변환
    - `tsc`명령어로 타입스크립트 컴파일
2. 명시적인 any 선언
    tsconfig.json > "compilerOptions" > "noImplicitAny": true
    가능한 구체적인 타입으로 정의
3. 프로젝트 환경 구성
    babel, eslint, prettier 등
4. 외부 라이브러리 모듈화


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
