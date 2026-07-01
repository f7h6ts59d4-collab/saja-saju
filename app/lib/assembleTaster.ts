// 맛보기 해석 조립 — 엔진 명식(dayMaster·elements)으로 콘텐츠 3단을 규칙 조립한다.
// 순서: 일간(정체성) → 결핍(약점) → 갈증(공통). LLM 없음(변동비 0).
// 순수 함수 — 같은 명식이면 항상 같은 결과, 부수효과 없음.
// 표시단에서 언어를 고르도록 각 조각의 body/bodyEn를 그대로 넘긴다(현재 노출은 bodyEn).

import type { CorrectedSaju } from "@fullstackfamily/manseryeok";
import {
  DAY_MASTERS,
  DEFICIENCIES,
  DEFICIENCY_PRIORITY,
  BALANCE,
  TEASER,
  type DayMasterPiece,
  type TasterPiece,
} from "./tasterContent";

export interface AssembledTaster {
  dayMaster: DayMasterPiece;
  deficiency: TasterPiece;
  teaser: TasterPiece;
}

type ElementKey = keyof CorrectedSaju["elements"];

export function assembleTaster(saju: CorrectedSaju): AssembledTaster {
  const dayMaster = DAY_MASTERS[saju.dayMaster.hangul];

  // 없는 오행(개수 0)을 DEFICIENCY_PRIORITY 순서로 훑어 첫 하나만 짚는다(일관성).
  // 하나도 없으면(다섯 기운 균형) BALANCE.
  const missing = DEFICIENCY_PRIORITY.find(
    (el) => saju.elements[el as ElementKey] === 0,
  );
  const deficiency = missing ? DEFICIENCIES[missing] : BALANCE;

  return { dayMaster, deficiency, teaser: TEASER };
}
