"use client";

import { useState } from "react";
import type { CorrectedSaju } from "@fullstackfamily/manseryeok";
import { CITIES } from "./lib/cities";
import { computeSaju } from "./lib/computeSaju";

type Gender = "남" | "여";

// 명식과 함께 보여줄 표시용 입력(계산에는 쓰지 않음).
interface ResultView {
  saju: CorrectedSaju;
  gender: Gender;
  name: string;
}

export default function Home() {
  const [birthDate, setBirthDate] = useState("");
  const [calendar, setCalendar] = useState<"solar" | "lunar">("solar");
  const [birthTime, setBirthTime] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [cityId, setCityId] = useState(CITIES[0].id);
  const [gender, setGender] = useState<Gender>("남");
  const [name, setName] = useState("");

  const [result, setResult] = useState<ResultView | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const [year, month, day] = birthDate.split("-").map(Number);
    const city = CITIES.find((c) => c.id === cityId);
    if (!year || !month || !day || !city) {
      setError("생년월일과 출생지를 입력하세요.");
      return;
    }

    // 시간 모름이면 hour/minute를 넘기지 않는다 → 엔진이 정오 가정 + timeUnknown 처리.
    const time = !timeUnknown && birthTime ? birthTime.split(":").map(Number) : null;

    try {
      const saju = await computeSaju({
        year,
        month,
        day,
        ...(time ? { hour: time[0], minute: time[1] } : {}),
        calendar,
        timezone: city.timezone,
      });
      setResult({ saju, gender, name });
    } catch {
      setError("명식 계산에 실패했습니다. 입력을 확인하세요.");
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 24, lineHeight: 1.6 }}>
      <h1>saja-saju 명식</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          생년월일{" "}
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </label>

        <fieldset>
          <legend>달력</legend>
          <label>
            <input
              type="radio"
              name="calendar"
              checked={calendar === "solar"}
              onChange={() => setCalendar("solar")}
            />{" "}
            양력
          </label>{" "}
          <label>
            <input
              type="radio"
              name="calendar"
              checked={calendar === "lunar"}
              onChange={() => setCalendar("lunar")}
            />{" "}
            음력
          </label>
        </fieldset>

        <label>
          태어난 시간{" "}
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            disabled={timeUnknown}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={timeUnknown}
            onChange={(e) => setTimeUnknown(e.target.checked)}
          />{" "}
          시간 모름 (정오 가정, 시주는 참고용)
        </label>

        <label>
          출생지{" "}
          <select value={cityId} onChange={(e) => setCityId(e.target.value)}>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend>성별</legend>
          <label>
            <input
              type="radio"
              name="gender"
              checked={gender === "남"}
              onChange={() => setGender("남")}
            />{" "}
            남
          </label>{" "}
          <label>
            <input
              type="radio"
              name="gender"
              checked={gender === "여"}
              onChange={() => setGender("여")}
            />{" "}
            여
          </label>
        </fieldset>

        <label>
          이름{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <button type="submit">명식 보기</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {result && <Myeongsik view={result} />}
    </main>
  );
}

const PILLAR_LABELS = ["연주", "월주", "일주", "시주"] as const;

function Myeongsik({ view }: { view: ResultView }) {
  const { saju, gender, name } = view;
  const pillars = [
    { hangul: saju.yearPillar, hanja: saju.yearPillarHanja },
    { hangul: saju.monthPillar, hanja: saju.monthPillarHanja },
    { hangul: saju.dayPillar, hanja: saju.dayPillarHanja },
    { hangul: saju.hourPillar, hanja: saju.hourPillarHanja },
  ];

  return (
    <section style={{ marginTop: 24 }}>
      <h2>명식</h2>
      <p>
        {name ? `${name} · ` : ""}
        {gender}
      </p>
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          {PILLAR_LABELS.map((label, i) => {
            const isHour = label === "시주";
            const p = pillars[i];
            return (
              <tr key={label}>
                <th style={{ textAlign: "left", padding: "4px 12px 4px 0" }}>
                  {label}
                  {isHour && saju.timeUnknown ? " (참고용, 시간 미상)" : ""}
                </th>
                <td style={{ padding: "4px 0" }}>
                  {p.hangul ?? "—"}
                  {p.hanja ? ` (${p.hanja})` : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
