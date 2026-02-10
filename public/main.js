const form = document.getElementById("saju-form");
const result = document.getElementById("result");

const stems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

const elementMap = {
  갑: "목",
  을: "목",
  병: "화",
  정: "화",
  무: "토",
  기: "토",
  경: "금",
  신: "금",
  임: "수",
  계: "수",
};

function pillarFromIndex(index) {
  const stem = stems[index % 10];
  const branch = branches[index % 12];
  return { stem, branch, value: `${stem}${branch}` };
}

function dayIndexFromDate(date) {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(utc / 86400000);
}

function hourBranch(hour) {
  const slot = Math.floor(((hour + 1) % 24) / 2);
  return branches[slot % 12];
}

function buildResult(data) {
  const { name, calendar, birthdate, birthtime, pillars } = data;
  const dayStem = pillars.day.stem;
  const dayElement = elementMap[dayStem] || "미상";

  return `
    <div class="pillars">
      <div class="pillar">
        <h4>년주</h4>
        <div class="value">${pillars.year.value}</div>
      </div>
      <div class="pillar">
        <h4>월주</h4>
        <div class="value">${pillars.month.value}</div>
      </div>
      <div class="pillar">
        <h4>일주</h4>
        <div class="value">${pillars.day.value}</div>
      </div>
      <div class="pillar">
        <h4>시주</h4>
        <div class="value">${pillars.hour.value}</div>
      </div>
    </div>
    <div class="summary">
      <p><strong>${name ? `${name}님의` : "입력하신"} 사주</strong>는
      <strong>${dayStem}</strong> 일간, 오행은 <strong>${dayElement}</strong>로 표시됩니다.</p>
      <p>입력: ${birthdate} ${birthtime} · ${calendar === "lunar" ? "음력(보정 없음)" : "양력"}</p>
      <p class="muted">간단 계산(데모) 결과입니다. 절기/음력 보정은 반영하지 않았습니다.</p>
    </div>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const birthdate = document.getElementById("birthdate").value;
  const birthtime = document.getElementById("birthtime").value;
  const calendar = document.getElementById("calendar").value;

  if (!birthdate || !birthtime) {
    result.innerHTML = `<p class="muted">생년월일과 태어난 시간을 입력해 주세요.</p>`;
    return;
  }

  const [yearStr, monthStr, dayStr] = birthdate.split("-");
  const [hourStr, minuteStr] = birthtime.split(":");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  const date = new Date(year, month - 1, day);
  const dayIndex = dayIndexFromDate(date);

  const yearPillar = pillarFromIndex(year);
  const monthPillar = pillarFromIndex(year * 12 + month);
  const dayPillar = pillarFromIndex(dayIndex);
  const hourIndex = dayIndex * 12 + Math.floor(hour / 2);
  const hourPillar = {
    stem: stems[hourIndex % 10],
    branch: hourBranch(hour),
    value: `${stems[hourIndex % 10]}${hourBranch(hour)}`,
  };

  result.innerHTML = buildResult({
    name,
    calendar,
    birthdate,
    birthtime: `${hourStr}:${minuteStr}`,
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
    },
  });
});
