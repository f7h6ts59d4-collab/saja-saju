// 출생지 → IANA 시간대 id 하드코딩 매핑.
// 프로토타입 단계라 자동완성·전 세계 데이터셋 없이 도시 5개만 둔다(명세 "도시 처리").
export interface City {
  id: string;
  label: string;
  timezone: string;
}

export const CITIES: readonly City[] = [
  { id: "seoul", label: "서울 (Seoul)", timezone: "Asia/Seoul" },
  { id: "tokyo", label: "도쿄 (Tokyo)", timezone: "Asia/Tokyo" },
  { id: "manila", label: "마닐라 (Manila)", timezone: "Asia/Manila" },
  { id: "newyork", label: "뉴욕 (New York)", timezone: "America/New_York" },
  { id: "la", label: "로스앤젤레스 (Los Angeles)", timezone: "America/Los_Angeles" },
];
