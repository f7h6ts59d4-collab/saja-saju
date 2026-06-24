"use server";

import { correctPillars, type CorrectedSaju } from "@fullstackfamily/manseryeok";

// 계산에 쓰이는 입력만 받는다(출생 정보: 생년월일·시간·출생지의 tz·경도·위도).
// 성별·이름은 표시용이라 이 시그니처에 포함하지 않는다(CLAUDE.md 6번).
// 시간 모름이면 hour/minute를 생략해 호출한다 — 엔진이 정오 가정 + timeUnknown=true로 처리한다.
// longitude·latitude는 진태양시(일주·시주) 보정에 쓰이며 엔진이 필수로 요구한다.
//
// 주의(오해 방지): 서로 다른 도시(예: New York, Los Angeles)를 "같은 벽시계 시각"으로
// 넣으면 일주·시주가 거의 같게 나온다 — 이는 버그가 아니라 정상이다. 타임존 오프셋이
// 그 지역의 경도(=태양시)를 근사하도록 만들어졌기 때문에, 같은 벽시계는 두 도시에서
// 거의 같은 진태양시가 된다(보통 수 분 차이). 경도 보정이 결과를 가르려면 "같은 UTC
// 순간 + 다른 경도"여야 한다(상세: docs/specs/city-autocomplete-spec.md §4-2).
export interface SajuCalcInput {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  calendar: "solar" | "lunar";
  timezone: string;
  longitude: number;
  latitude: number;
}

export async function computeSaju(input: SajuCalcInput): Promise<CorrectedSaju> {
  return correctPillars(input);
}
