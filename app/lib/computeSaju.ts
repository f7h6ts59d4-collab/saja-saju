"use server";

import { correctPillars, type CorrectedSaju } from "@fullstackfamily/manseryeok";

// 계산에 쓰이는 입력만 받는다(명세: correctPillars에 넘기는 것은 생년월일·시간·출생지tz 3개뿐).
// 성별·이름은 표시용이라 이 시그니처에 포함하지 않는다(CLAUDE.md 6번).
// 시간 모름이면 hour/minute를 생략해 호출한다 — 엔진이 정오 가정 + timeUnknown=true로 처리한다.
export interface SajuCalcInput {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  calendar: "solar" | "lunar";
  timezone: string;
}

export async function computeSaju(input: SajuCalcInput): Promise<CorrectedSaju> {
  return correctPillars(input);
}
