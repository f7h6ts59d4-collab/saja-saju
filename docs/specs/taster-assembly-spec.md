# 작업 명세: 맛보기 해석 조립 (로직 검증 위주)

> saja-saju 레포. 엔진이 주는 dayMaster·elements로 맛보기 콘텐츠(일간→결핍→갈증)를
> 조립해 화면에 띄운다. 지금은 **로직 검증**이 목적 — 표현(CSS·연출)은 최소로, 조립이
> 올바른지만 확인한다. 예쁜 UI·일러스트·연출은 이후 UI 대공사 때. 원칙은 CLAUDE.md.

## 목적

명식(사주)을 내면, 그 사람의 일간·오행에 맞는 맛보기 텍스트가 규칙 조립으로 나온다.
LLM 없음(변동비 0). "일간(정체성) → 결핍(약점) → 갈증(결제 유도)" 순.

## 0. 엔진 의존성 업데이트 (먼저)

package.json의 엔진 의존성을 오행·일간 포함 최신 main 해시로 갱신:
```
"@fullstackfamily/manseryeok": "github:f7h6ts59d4-collab/saju-engine#6be6c8f"
```
(키 이름 @fullstackfamily/manseryeok 유지, git ref만 갱신. 작업 시점 main HEAD 확인.)
설치 후 correctPillars 출력에 dayMaster·elements가 오는지 타입으로 확인.

## 1. 콘텐츠 데이터

- `app/lib/tasterContent.ts` (제공됨) — DAY_MASTERS(10), DEFICIENCIES(5),
  DEFICIENCY_PRIORITY, BALANCE, TEASER. body(한국어)/bodyEn(영어) 병기.

## 2. 조립 로직

`app/lib/assembleTaster.ts` (신규) — 명식 결과를 받아 맛보기 텍스트를 조립.

입력: correctPillars 결과(dayMaster, elements 포함).
처리:
1. 일간 = dayMaster.hangul → DAY_MASTERS[일간] 선택.
2. 없는 오행 = elements에서 값이 0인 오행 목록.
   - 여럿이면 DEFICIENCY_PRIORITY 순서로 첫 번째 하나만 선택 → DEFICIENCIES[그 오행].
   - 없으면(균형) BALANCE 선택.
3. 갈증 = TEASER(공통).
출력: { dayMaster: DayMasterPiece, deficiency: TasterPiece, teaser: TasterPiece }
  (각 조각의 body/bodyEn를 그대로 넘겨, 표시단에서 언어 선택.)

- 순수 함수로(입력→출력, 부수효과 없음). 같은 명식이면 항상 같은 결과(일관성).
- 언어는 일단 영어(bodyEn) 노출 기준(미국 타깃). 한국어는 개발·검수용.

## 3. 표시 (최소)

- 기존 명식 결과 화면 아래에, 조립된 맛보기 3단(일간→결핍→갈증)을 **텍스트로** 출력.
- 스타일 최소(검은 배경에 흰 글씨 정도면 충분). 연출·애니메이션·일러스트 없음.
- 목적은 "조립이 맞나" 확인이지 예쁜 화면이 아님. 멋은 UI 대공사 때.

## 4. 검증 (로직 위주)

- 엔진 dayMaster·elements가 조립에 정상 전달되는지.
- 케이스별 조립 확인:
  - 없는 오행 1개(예: 수 없음) → 해당 결핍 문구.
  - 없는 오행 여럿 → DEFICIENCY_PRIORITY 첫 번째만.
  - 균형(없는 오행 0) → BALANCE.
- 같은 명식 재실행 → 같은 맛보기(일관성).
- 일간 10종이 각각 올바른 DAY_MASTERS 항목과 매칭되는지(스팟 체크).
- typecheck/build 통과.

## 5. 범위 밖 (이후 UI 대공사)

- CSS·디자인·애니메이션·저승사자 연출·후크 일러스트·말풍선.
- 결제 UI·MoR 연동, 결제 후 정밀 해석(십성 필요).
- 언어 토글(한/영). 지금은 영어 노출 고정.

## 산출물
1. package.json — 엔진 의존성 최신 해시
2. app/lib/tasterContent.ts (제공 데이터)
3. app/lib/assembleTaster.ts (조립 순수 함수)
4. 기존 결과 화면에 맛보기 최소 표시
