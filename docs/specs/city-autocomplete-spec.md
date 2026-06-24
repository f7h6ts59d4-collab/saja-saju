# 작업 명세: 출생지 도시 자동완성 + 진태양시 엔진 연동

> saja-saju 레포. 기존 하드코딩 도시 드롭다운(app/lib/cities.ts, 5개)을 미국 도시
> 자동완성으로 교체하고, 진태양시 보정이 들어간 새 엔진과 연동한다. 원칙은 CLAUDE.md.

## 배경

엔진(saju-engine)에 진태양시 보정이 추가됐다(일주·시주를 출생지 경도+EoT 기준 계산).
엔진의 correctPillars는 이제 longitude·latitude를 **필수로** 받는다. 따라서 saja-saju는
(1) 도시를 받아 경도·위도·시간대를 얻고, (2) 그것을 엔진에 넘겨야 한다.

## 0. 엔진 의존성 업데이트 (먼저)

package.json의 saju-engine 의존성을 진태양시가 포함된 최신 main 커밋으로 갱신:
```
"saju-engine": "github:f7h6ts59d4-collab/saju-engine#01bc5d5"
```
(정확한 해시는 작업 시점 main HEAD로 확인.) 설치 후 correctPillars가 longitude·
latitude를 받는 새 시그니처인지 타입으로 확인.

## 1. 데이터

- `app/lib/usCities.ts` (제공됨) — 미국 774개 도시. 각 도시: city, state, lat, lng, tz.
  - 인구순 정렬(자동완성 상위 노출), 동명 도시는 state로 구분.
  - 도시별 tz가 정확해 갈림 주 추가 질문 불필요(Indianapolis/Gary 자동 구분).
- 기존 `app/lib/cities.ts`(하드코딩 5개)는 제거.

## 2. 입력 UX — 도시 자동완성

- 출생지를 **도시명 자동완성**으로 받는다(주 기반 아님, 추가 질문 없음).
  - 사용자가 "new" 입력 → "New York, NY" 등 매칭 도시 노출.
  - 동명 도시는 "City, ST"로 주를 병기해 구분(예: Springfield, IL / Springfield, MA).
  - 인구순 정렬이라 큰 도시가 위에. 결과는 적당히 제한(예: 상위 8개).
- 검색은 **클라이언트에서**(데이터 내장, 변동비 0). 서버 요청 없음.
- 도시 선택 시 그 도시의 { lat, lng, tz }를 확보 → 계산에 사용.
- 질문 문구 예: "Where were you born?" + 보조 "City where you were born."

## 3. 엔진 연동 — 시그니처 변경

computeSaju('use server' 액션)가 경도·위도를 받아 correctPillars에 전달하도록 확장.

- 기존 입력: { 생년월일, 시간, calendar, timezone }
- 변경 입력: { 생년월일, 시간, calendar, timezone, **longitude, latitude** }
- correctPillars 호출 시 longitude·latitude 포함(엔진이 필수로 요구).
- 계산 입력은 여전히 출생 정보뿐 — 성별·이름은 계산에 안 씀(CLAUDE.md 6번).
- 폼(page.tsx): 선택한 도시의 lat·lng·tz를 computeSaju에 넘긴다.

## 4. 동작 확인

### 4-1. 도시 자동완성
- "new"→New York, NY / "los"→Los Angeles, CA.
- 동명 도시는 "City, ST"로 주 병기(예: Springfield, IL / MA / MO …).
- 같은 도시 같은 시각이면 결과 일관.
- 시간 모름 체크 시: 정오 가정, 시주 "참고용" 표시(기존 동작 유지).
- typecheck/build 통과.

### 4-2. 진태양시가 살아있음을 검증하는 올바른 기준
> 주의: "New York vs Los Angeles를 **같은 벽시계 시각**으로 넣으면 일주·시주가
> 다르게 나온다"는 잘못된 기준이다. 타임존 오프셋이 경도(태양시)를 근사하도록
> 만들어졌기 때문에, 같은 벽시계의 두 도시는 진태양시도 거의 같다(보통 수 분 차이).
> 따라서 NY와 LA를 같은 벽시계로 넣으면 같은 결과가 나오는 게 **정상이며 버그가 아니다.**

진태양시(경도+EoT) 보정이 실제로 적용되는지는 다음으로 검증한다.
- **같은 UTC 순간 + 다른 경도** → 일주·시주가 갈림. (timezone을 고정한 채 longitude만
  −74 vs −118로 바꾸면 신해/기축 → 경술/병자로 바뀜 = 경도가 계산에 반영됨을 증명.)
- 같은 도시 안에서도, 시계 시각 그대로 vs 진태양시 보정 결과가 **시주 경계 근처에서
  갈릴 수 있음**(경도 오프셋 + EoT가 분 단위로 작용).
- DST·EoT 반영: 같은 도시·같은 벽시계라도 여름/겨울(DST), 2월/11월(EoT 부호) 등
  시기에 따라 진태양시 보정량이 달라진다.

## 5. 범위 밖 (이번에 하지 말 것)

- 미국 외 국가(국가별 웹앱 분리, 이 앱은 미국 전용).
- CSS·디자인 다듬기(몰입 퍼널 작업 때 일괄). 인라인 최소 유지.
- 결제·LLM 해석·배포.

## 산출물
1. package.json — saju-engine 의존성 최신 해시로 갱신
2. app/lib/usCities.ts (제공 데이터)
3. 도시 자동완성 UI (기존 드롭다운 교체)
4. computeSaju 시그니처 확장(longitude·latitude) + correctPillars 전달
5. app/lib/cities.ts 제거
