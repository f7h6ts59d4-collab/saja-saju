import { correctPillars } from "@fullstackfamily/manseryeok";

// 엔진 연결 스모크 테스트: 알려진 케이스(1990-05-15 14:30 서울 → 경오 신사 경진 계미).
// 입력 폼·도시 매핑 UI는 스펙의 다음 단계이며 여기서는 import·계산 경로만 확인한다.
export default function Home() {
  const saju = correctPillars({
    year: 1990,
    month: 5,
    day: 15,
    hour: 14,
    minute: 30,
    timezone: "Asia/Seoul",
  });

  const pillars = [
    { label: "연주", hangul: saju.yearPillar, hanja: saju.yearPillarHanja },
    { label: "월주", hangul: saju.monthPillar, hanja: saju.monthPillarHanja },
    { label: "일주", hangul: saju.dayPillar, hanja: saju.dayPillarHanja },
    { label: "시주", hangul: saju.hourPillar, hanja: saju.hourPillarHanja },
  ];

  return (
    <main>
      <h1>saja-saju 엔진 연결 확인</h1>
      <p>1990-05-15 14:30 Asia/Seoul</p>
      <ul>
        {pillars.map((p) => (
          <li key={p.label}>
            {p.label}: {p.hangul} ({p.hanja})
          </li>
        ))}
      </ul>
    </main>
  );
}
