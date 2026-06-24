"use client";

import { useState } from "react";
import type { CorrectedSaju } from "@fullstackfamily/manseryeok";
import { US_CITIES, type UsCity } from "./lib/usCities";
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
  const [city, setCity] = useState<UsCity | null>(null);
  const [gender, setGender] = useState<Gender>("남");
  const [name, setName] = useState("");

  const [result, setResult] = useState<ResultView | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const [year, month, day] = birthDate.split("-").map(Number);
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
        timezone: city.tz,
        longitude: city.lng,
        latitude: city.lat,
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
          Where were you born?
          <CityAutocomplete value={city} onChange={setCity} />
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

// 출생지 도시 자동완성. 데이터(US_CITIES)는 인구순 정렬이라 큰 도시가 위에 노출된다.
// 동명 도시 구분 위해 항상 "City, ST"로 표기하고, 검색 결과는 상위 8개로 제한한다.
// 입력이 바뀌면 이전 선택을 무효화해 표시값과 선택값이 어긋나지 않게 한다.
const MAX_RESULTS = 8;

function CityAutocomplete({
  value,
  onChange,
}: {
  value: UsCity | null;
  onChange: (city: UsCity | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const matches = q
    ? US_CITIES.filter((c) => c.city.toLowerCase().includes(q)).slice(0, MAX_RESULTS)
    : [];

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        placeholder="City where you were born"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (value) onChange(null);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && matches.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "1px solid #ccc",
            background: "#fff",
          }}
        >
          {matches.map((c, i) => (
            <li key={`${c.city}-${c.state}-${i}`}>
              <button
                type="button"
                style={{ display: "block", width: "100%", textAlign: "left" }}
                onClick={() => {
                  onChange(c);
                  setQuery(`${c.city}, ${c.state}`);
                  setOpen(false);
                }}
              >
                {c.city}, {c.state}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
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
