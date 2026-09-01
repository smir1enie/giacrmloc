const YEARS = ["2026", "2025", "2024"];

const STUDENTS = [
  { id: 1, msu: "220", oo: "22108", klass: "11Д", ppe: "225", room: "7", last: "Абатуров", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
  { id: 2, msu: "220", oo: "22108", klass: "11В", ppe: "225", room: "2", last: "Горчакова", first: "Марина", middle: "Сергеевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
  { id: 3, msu: "220", oo: "22108", klass: "11Д", ppe: "225", room: "6", last: "Раджабов", first: "Михаил", middle: "Васильевич", series: "5222", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: true },
  { id: 4, msu: "220", oo: "22108", klass: "9А", ppe: "225", room: "1", last: "Воронко", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
  { id: 5, msu: "220", oo: "22108", klass: "11Д", ppe: "225", room: "5", last: "Быкова", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
  { id: 6, msu: "220", oo: "22108", klass: "9Б", ppe: "225", room: "5", last: "Минхаиров", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: true },
  { id: 7, msu: "220", oo: "22108", klass: "11Б", ppe: "225", room: "2", last: "Абатуров", first: "Михаил", middle: "Васильевич", series: "0124", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
  { id: 8, msu: "220", oo: "22108", klass: "9К", ppe: "225", room: "7", last: "Неъматов", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: true },
  { id: 9, msu: "220", oo: "22108", klass: "11Д", ppe: "225", room: "7", last: "Морев", first: "Михаил", middle: "Васильевич", series: "6723", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
  { id: 10, msu: "220", oo: "22108", klass: "9Д", ppe: "225", room: "1", last: "Сухенко", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
  { id: 11, msu: "220", oo: "22108", klass: "11Д", ppe: "225", room: "3", last: "Кузнецов", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
  { id: 12, msu: "220", oo: "22108", klass: "11А", ppe: "225", room: "4", last: "Таробрин", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
  { id: 13, msu: "220", oo: "22108", klass: "9В", ppe: "225", room: "2", last: "Спирка", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
  { id: 14, msu: "220", oo: "22108", klass: "11И", ppe: "225", room: "1", last: "Дроменко", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: true },
  { id: 15, msu: "220", oo: "22108", klass: "9Г", ppe: "225", room: "7", last: "Ибраев", first: "Михаил", middle: "Васильевич", series: "6722", number: "116991", short: "++++++++++++", long: "2(2)1(3)0(2)2(2)0(3)4(4)1(4)", score: "28", grade: "3", tall: false },
];

const DOCUMENTS = [
  {
    name: "Протокол проверки результатов государственной итоговой аттестации обучающихся, освоивших основные образовательные программы основного общего образования в 2026 г. “Русский язык”",
    type: "WORD",
    date: "11.07.2026",
  },
  {
    name: "Протокол проверки результатов государственной итоговой аттестации обучающихся, освоивших основные образовательные программы основного общего образования в 2026 г. “Математика”",
    type: "EXCEL",
    date: "11.07.2026",
  },
  {
    name: "Протокол проверки результатов государственной итоговой аттестации обучающихся, освоивших основные образовательные программы основного общего образования в 2026 г. “Литература”",
    type: "PDF",
    date: "11.07.2026",
  },
];

function cloneDocuments() {
  return DOCUMENTS.map((doc) => ({ name: doc.name, type: doc.type, date: doc.date }));
}

const moreIcon = `
  <button class="more-actions" type="button" aria-label="Действия">
    <span class="icon icon-16">
      <img src="./assets/icons/more-vertical.svg" width="16" height="16" alt="" />
    </span>
  </button>
`;

const SUBJECTS = [
  "Русский язык",
  "Базовая математика",
  "Профильная математика",
  "Обществознание",
  "Физика",
  "Химия и Биология",
  "История",
  "Литература",
  "География",
  "Информатика",
  "Иностранные языки",
];

const SCHOOLS = [
  { id: "1", name: "МБОУ СОШ № 1", oo: "22101", msu: "220", city: "Кемерово" },
  { id: "2", name: "МБОУ СОШ № 2", oo: "22102", msu: "220", city: "Кемерово" },
  { id: "3", name: "МБОУ СОШ № 3", oo: "22103", msu: "220", city: "Кемерово" },
  { id: "4", name: "МБОУ СОШ № 4", oo: "22104", msu: "220", city: "Кемерово" },
  { id: "5", name: "МБОУ СОШ № 5", oo: "22105", msu: "220", city: "Кемерово" },
  { id: "6", name: "МБОУ СОШ № 6", oo: "22106", msu: "220", city: "Кемерово" },
  { id: "7", name: "МБОУ СОШ № 7", oo: "22107", msu: "220", city: "Кемерово" },
  { id: "8", name: "МБОУ СОШ № 8", oo: "22108", msu: "220", city: "Кемерово" },
  { id: "9", name: "МБОУ СОШ № 9", oo: "22109", msu: "220", city: "Кемерово" },
  { id: "10", name: "МБОУ СОШ № 10", oo: "22110", msu: "220", city: "Кемерово" },
  { id: "gym1", name: "Гимназия № 1", oo: "22111", msu: "220", city: "Кемерово" },
];

const schoolDocuments = Object.fromEntries(SCHOOLS.map((school) => [school.id, cloneDocuments()]));

function currentDocuments() {
  if (!schoolDocuments[state.school]) schoolDocuments[state.school] = [];
  return schoolDocuments[state.school];
}

const PROTOCOL_TITLES = SUBJECTS.map(
  (subject) =>
    `Протокол проверки результатов государственной итоговой аттестации обучающихся, освоивших основные образовательные программы основного общего образования “${subject}”`
);

const PROTOCOL_TITLES_BY_YEAR = {
  "2026": PROTOCOL_TITLES,
  "2025": PROTOCOL_TITLES.slice(0, 7),
  "2024": PROTOCOL_TITLES.slice(0, 4),
};

function copyTitlesByYear() {
  return {
    "2026": PROTOCOL_TITLES.slice(),
    "2025": PROTOCOL_TITLES.slice(0, 7),
    "2024": PROTOCOL_TITLES.slice(0, 4),
  };
}

const PROTOCOL_TITLES_BY_SCHOOL = Object.fromEntries(
  SCHOOLS.map((school) => [school.id, copyTitlesByYear()])
);

function currentProtocolTitles() {
  const byYear = PROTOCOL_TITLES_BY_SCHOOL[state.school] || PROTOCOL_TITLES_BY_YEAR;
  return byYear[state.year] || PROTOCOL_TITLES;
}

function protocolSubject(title) {
  const match = String(title).match(/[“"«]([^”"»]+)[”"»]/);
  return match ? match[1] : title;
}

function rowMatchesQuery(row, query) {
  if (!query) return true;
  const cells = row.cells.map((cell) => String(cell || "").toLowerCase());
  if (cells.some((cell) => cell.includes(query))) return true;
  return cells.join(" ").includes(query);
}

function tableMatchesQuery(table, query) {
  if (!query) return true;
  return Boolean(table?.rows?.some((row) => rowMatchesQuery(row, query)));
}

function listedProtocols() {
  const schools = state.scope === "school" ? SCHOOLS.filter((school) => school.id === state.school) : SCHOOLS;
  const years = state.scope === "all" ? YEARS : [state.year];
  const query = state.search.trim().toLowerCase();
  const items = [];
  schools.forEach((school) => {
    years.forEach((year) => {
      const titles = PROTOCOL_TITLES_BY_SCHOOL[school.id]?.[year] || [];
      titles.forEach((title, index) => {
        const subject = protocolSubject(title);
        if (state.filters.subject !== "all" && subject !== state.filters.subject) return;
        const haystack = `${school.name} ${year} ${subject} ${title}`.toLowerCase();
        const titleMatch = !query || haystack.includes(query);
        const studentMatch = !query || tableMatchesQuery(schoolTables[school.id], query);
        if (query && !titleMatch && !studentMatch) return;
        items.push({
          schoolId: school.id,
          schoolName: school.name,
          year,
          index,
          title,
          subject,
        });
      });
    });
  });
  return items.map((item, listedIndex) => ({ ...item, listedIndex }));
}

function protocolEntryLabel(item) {
  return item.subject || protocolSubject(item.title);
}

function showToast(message, type) {
  const root = document.getElementById("toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.className = `toast${type === "error" ? " is-error" : ""}`;
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

function columnIndexBy(pattern) {
  return tableData.columns.findIndex((name) => pattern.test(name));
}

function activeFilterCount() {
  return Object.entries(state.filters).filter(([key, value]) => {
    if (key === "scoreValue") return false;
    if (key === "scoreOp") return isScoreFilterActive();
    return value !== "all";
  }).length;
}

function isScoreFilterActive() {
  const op = state.filters.scoreOp;
  const value = Number(state.filters.scoreValue);
  return (op === "gt" || op === "lt") && Number.isFinite(value) && state.filters.scoreValue !== "";
}

function syncScoreFilterUi() {
  const opEl = document.getElementById("filter-score-op");
  const valEl = document.getElementById("filter-score-value");
  if (!valEl) return;
  const enabled = Boolean(opEl && opEl.value !== "all");
  valEl.disabled = !enabled;
  if (!enabled) valEl.value = "";
}

function fillScoreFilterUi() {
  const opEl = document.getElementById("filter-score-op");
  const valEl = document.getElementById("filter-score-value");
  if (opEl) opEl.value = state.filters.scoreOp || "all";
  if (valEl) valEl.value = state.filters.scoreValue === "" || state.filters.scoreValue == null ? "" : String(state.filters.scoreValue);
  syncScoreFilterUi();
}

function updateFilterBadge() {
  const badge = document.getElementById("filter-badge");
  if (!badge) return;
  const count = activeFilterCount();
  badge.textContent = String(count);
  badge.classList.toggle("hidden", count === 0);
}

function fillSelect(id, values, selected) {
  const select = document.getElementById(id);
  if (!select) return;
  const current = selected ?? select.value;
  select.innerHTML = [`<option value="all">Все</option>`]
    .concat(values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`))
    .join("");
  select.value = values.includes(current) || current === "all" ? current : "all";
}

function populateFilterOptions() {
  fillSelect("filter-msu", [...new Set(SCHOOLS.map((item) => item.msu))], state.filters.msu);
  fillSelect("filter-oo", [...new Set(SCHOOLS.map((item) => item.oo))], state.filters.oo);
  fillSelect("filter-subject", SUBJECTS, state.filters.subject);
  const roomIndex = columnIndexBy(/аудитор/i);
  const rooms = roomIndex < 0 ? [] : [...new Set(tableData.rows.map((row) => String(row.cells[roomIndex] || "")).filter(Boolean))];
  fillSelect("filter-room", rooms, state.filters.room);
  const statsSchool = document.getElementById("stats-school");
  if (statsSchool && !statsSchool.dataset.ready) {
    statsSchool.innerHTML = [`<option value="all">Все школы</option>`]
      .concat(SCHOOLS.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`))
      .join("");
    statsSchool.dataset.ready = "1";
  }
}

function resetFilters() {
  state.search = "";
  state.page = 1;
  state.filters = { msu: "all", room: "all", subject: "all", oo: "all", scoreOp: "all", scoreValue: "", mark: "all" };
  const search = document.getElementById("protocol-search");
  if (search) search.value = "";
  ["filter-msu", "filter-room", "filter-subject", "filter-oo", "filter-mark"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "all";
  });
  fillScoreFilterUi();
  updateFilterBadge();
  renderProtocolHeaders();
  renderStudents();
}

function applyFiltersFromModal() {
  state.filters.msu = document.getElementById("filter-msu")?.value || "all";
  state.filters.room = document.getElementById("filter-room")?.value || "all";
  state.filters.subject = document.getElementById("filter-subject")?.value || "all";
  state.filters.oo = document.getElementById("filter-oo")?.value || "all";
  const scoreOp = document.getElementById("filter-score-op")?.value || "all";
  const scoreRaw = document.getElementById("filter-score-value")?.value ?? "";
  if (scoreOp !== "all" && scoreRaw === "") {
    showToast("Введите число баллов", "error");
    return false;
  }
  state.filters.scoreOp = scoreOp;
  state.filters.scoreValue = scoreRaw === "" ? "" : Number(scoreRaw);
  state.filters.mark = document.getElementById("filter-mark")?.value || "all";
  state.page = 1;
  updateFilterBadge();
  renderProtocolHeaders();
  renderStudents();
  showToast("Фильтры применены");
  return true;
}

const state = {
  year: "2026",
  view: "protocols",
  grade: "11",
  subject: "Русский язык",
  protocolIndex: 0,
  listedIndex: null,
  school: "1",
  scope: "all",
  search: "",
  page: 1,
  pageSize: 12,
  filters: {
    msu: "all",
    room: "all",
    subject: "all",
    oo: "all",
    scoreOp: "all",
    scoreValue: "",
    mark: "all",
  },
};

const openSchoolGroups = new Set();

function renderYearTabs(containerId, includeAll) {
  const withAll = includeAll && containerId === "year-tabs";
  const years = withAll ? ["all", ...YEARS] : includeAll ? YEARS : ["2026", "2025"];
  const root = document.getElementById(containerId);
  if (!root) return;
  const activeYear = containerId === "year-tabs" && state.scope === "all" ? "all" : state.year;
  root.innerHTML = years
    .map(
      (year) => `
        <button class="tab${year === activeYear ? " is-active" : ""}" type="button" data-year="${year}">
          <span>${year === "all" ? "Все" : year}</span>
        </button>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function schoolReportSubjects() {
  const titles = currentProtocolTitles();
  const labels = titles.map((title) => {
    const match = title.match(/[“"«]([^”"»]+)[”"»]/);
    return match ? match[1] : title;
  });
  return [...new Set(labels)];
}

function renderSubjectTabs() {
  const root = document.getElementById("report-subject-tabs");
  if (!root) return;
  const subjects = schoolReportSubjects();
  root.innerHTML = subjects
    .map(
      (subject) => `
      <button class="tab${subject === state.subject ? " is-active" : ""}" type="button" data-subject="${escapeHtml(subject)}">
        <span>${escapeHtml(subject)}</span>
      </button>
    `
    )
    .join("");
}

function renderReportSubjectNav() {
  const root = document.getElementById("report-subject-nav");
  if (!root) return;
  const subjects = schoolReportSubjects();
  root.innerHTML = subjects
    .map(
      (subject) => `
      <button class="nav-sub${subject === state.subject ? " is-active" : ""}" type="button" data-subject-nav="${escapeHtml(subject)}">${escapeHtml(subject)}</button>
    `
    )
    .join("");
}

function setSubject(subject) {
  state.subject = subject;
  document.querySelectorAll("[data-subject-nav]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.subjectNav === subject);
  });
  document.querySelectorAll("[data-subject]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.subject === subject);
  });
  const titleEl = document.getElementById("report-title-label");
  if (titleEl) {
    const current = titleEl.textContent.trim();
    const next = current.replace(/[“"]([^”"]+)[”"]/, `“${subject}”`);
    titleEl.textContent = next;
    document.querySelectorAll('[data-dropdown="report-title"] [role="option"]').forEach((option) => {
      option.setAttribute("aria-selected", String(getReportSubject(option.textContent.trim()) === subject));
    });
  }
  renderReportPreview();
}

const DEFAULT_COLUMNS = [
  "ID",
  "Код МСУ",
  "Код ОО",
  "Класс",
  "Код ППЭ",
  "Аудитория",
  "Фамилия",
  "Имя",
  "Отчество",
  "Серия",
  "Номер",
  "Задания с кратким ответом",
  "Задания с развёрнутым ответом",
  "Первичный балл",
  "Оценка",
];

const DEFAULT_ROTATED = new Set([
  "ID",
  "Код МСУ",
  "Код ОО",
  "Класс",
  "Аудитория",
  "Серия",
  "Номер",
  "Первичный балл",
  "Оценка",
]);

const DEFAULT_GRID =
  "15px 26px 41px 24px 48px 26px 71px 51px 81px 32px 44px 119px 178px 29px 24px 24px";

function studentToCells(row) {
  return [
    row.id,
    row.msu,
    row.oo,
    row.klass,
    row.ppe,
    row.room,
    row.last,
    row.first,
    row.middle,
    row.series,
    row.number,
    row.short,
    row.long,
    row.score,
    row.grade,
  ].map((value) => String(value));
}

function cloneTableData(data) {
  return {
    columns: [...data.columns],
    rows: data.rows.map((row) => ({ id: row.id, cells: [...row.cells] })),
  };
}

const tableData = {
  columns: [...DEFAULT_COLUMNS],
  rows: STUDENTS.map((row) => ({ id: row.id, cells: studentToCells(row) })),
  imported: false,
};

const schoolTables = Object.fromEntries(
  SCHOOLS.map((school, schoolIndex) => [
    school.id,
    {
      columns: [...DEFAULT_COLUMNS],
      rows: STUDENTS.map((row, rowIndex) => {
        const score = Math.max(8, Math.min(98, Number(row.score) + schoolIndex * 4 + (rowIndex % 6) * 8 - 10));
        const grade = score >= 70 ? "5" : score >= 50 ? "4" : score >= 32 ? "3" : "2";
        return {
          id: `${school.id}-${row.id}`,
          cells: studentToCells({ ...row, score: String(score), grade }),
        };
      }),
      imported: false,
    },
  ])
);

function currentSchool() {
  return SCHOOLS.find((school) => school.id === state.school) || SCHOOLS[0];
}

function bindSchoolTable() {
  const stored = schoolTables[state.school];
  if (!stored) return;
  tableData.columns = stored.columns;
  tableData.rows = stored.rows;
  tableData.imported = stored.imported;
}

function commitSchoolTable() {
  const stored = schoolTables[state.school];
  if (!stored) return;
  stored.columns = tableData.columns;
  stored.rows = tableData.rows;
  stored.imported = tableData.imported;
}

function renderSchoolSelect() {
  const menu = document.getElementById("school-select-menu");
  const label = document.getElementById("school-label");
  if (!menu || !label) return;
  const school = currentSchool();
  label.textContent = school.name;
  menu.innerHTML = SCHOOLS.map(
    (item) => `
      <li role="option" data-value="${item.id}" aria-selected="${item.id === state.school}">${escapeHtml(item.name)}</li>
    `
  ).join("");
}

function renderSchoolProtocolMenu() {
  const root = document.getElementById("school-protocol-headers");
  if (!root) return;
  const titles = currentProtocolTitles();
  root.innerHTML = titles
    .map(
      (title, index) => `
      <div class="protocol-acc" data-school-protocol="${index}">
        <button class="protocol-acc-head" type="button">
          <span class="protocol-acc-title">${escapeHtml(title)}</span>
          <span class="icon icon-12 protocol-acc-chevron">
            <img src="./assets/icons/chevron-up.svg" width="12" height="12" alt="" />
          </span>
        </button>
      </div>
    `
    )
    .join("");
}

function updateSchoolUi() {
  const school = currentSchool();
  const protocolsTitle = document.getElementById("protocols-page-title");
  const subtitle = document.getElementById("protocols-page-subtitle");
  if (protocolsTitle) {
    if (state.scope === "all") protocolsTitle.textContent = "Протоколы";
    else if (state.scope === "year") protocolsTitle.textContent = `Протоколы · ${state.year}`;
    else protocolsTitle.textContent = `Протоколы · ${school.name}`;
  }
  if (subtitle) {
    if (state.scope === "all") subtitle.textContent = "Все школы · все годы";
    else if (state.scope === "year") subtitle.textContent = `Все школы · ${state.year}`;
    else subtitle.textContent = `${school.name} · ${state.year}`;
  }
  const reportsTitle = document.getElementById("reports-page-title");
  if (reportsTitle) reportsTitle.textContent = `Отчёты · ${school.name}`;
  document.querySelectorAll("[data-school-nav]").forEach((btn) => {
    btn.classList.toggle("is-active", state.scope === "school" && btn.dataset.schoolNav === state.school);
  });
  renderSchoolSelect();
  document.querySelectorAll("#schools-body tr").forEach((row) => {
    row.classList.toggle("is-selected", row.dataset.school === state.school);
  });
  document.querySelectorAll("[data-year-nav]").forEach((btn) => {
    btn.classList.toggle("is-active", state.scope !== "all" && btn.dataset.yearNav === state.year);
  });
}

function setSchool(id) {
  commitSchoolTable();
  state.school = id;
  state.scope = "school";
  state.listedIndex = null;
  bindSchoolTable();
  updateSchoolUi();
  renderSchoolSelect();
  renderYearTabs("school-year-tabs", true);
  renderSchoolProtocolMenu();
  const subjects = schoolReportSubjects();
  if (!subjects.includes(state.subject) && subjects.length) {
    state.subject = subjects[0];
  }
  renderProtocolHeaders();
  renderStudents();
  renderDocuments();
  renderSubjectTabs();
  renderReportSubjectNav();
  renderReportPreview();
}

function openSchoolProtocol(index) {
  state.scope = "school";
  state.protocolIndex = index;
  state.listedIndex = index;
  showView("protocols");
  renderYearTabs("year-tabs", true);
  renderProtocolHeaders();
  const block = document.getElementById("protocol-block");
  block.classList.remove("is-collapsed");
  document.getElementById("protocols-toggle-label").textContent = "Скрыть";
  document.getElementById("protocols-toggle-btn").setAttribute("aria-expanded", "true");
  updateSchoolUi();
}

const importDraft = {
  fileName: "",
  schoolId: "1",
  columns: [],
  rows: [],
};

function klassColumnIndex(columns) {
  return columns.findIndex((name) => /класс/i.test(name));
}

function visibleTableRows() {
  const klassIndex = klassColumnIndex(tableData.columns);
  const scoreIndex = columnIndexBy(/балл/i);
  const markIndex = columnIndexBy(/оценк/i);
  const roomIndex = columnIndexBy(/аудитор/i);
  const msuIndex = columnIndexBy(/мсу/i);
  const ooIndex = columnIndexBy(/код оо|^оо$/i);
  const query = state.search.trim().toLowerCase();
  return tableData.rows.filter((row) => {
    if (!query && state.grade !== "all" && klassIndex >= 0 && !String(row.cells[klassIndex] || "").startsWith(state.grade)) return false;
    if (state.filters.room !== "all" && roomIndex >= 0 && String(row.cells[roomIndex] || "") !== state.filters.room) return false;
    if (state.filters.msu !== "all" && msuIndex >= 0 && String(row.cells[msuIndex] || "") !== state.filters.msu) return false;
    if (state.filters.oo !== "all" && ooIndex >= 0 && String(row.cells[ooIndex] || "") !== state.filters.oo) return false;
    if (state.filters.mark !== "all" && markIndex >= 0 && String(row.cells[markIndex] || "") !== state.filters.mark) return false;
    const score = Number(String(row.cells[scoreIndex] || "").replace(",", "."));
    if (isScoreFilterActive()) {
      const threshold = Number(state.filters.scoreValue);
      if (state.filters.scoreOp === "gt" && !(score > threshold)) return false;
      if (state.filters.scoreOp === "lt" && !(score < threshold)) return false;
    }
    if (query && !rowMatchesQuery(row, query)) return false;
    return true;
  });
}

function pagedTableRows() {
  const rows = visibleTableRows();
  const pages = Math.max(1, Math.ceil(rows.length / state.pageSize));
  if (state.page > pages) state.page = pages;
  const start = (state.page - 1) * state.pageSize;
  return rows.slice(start, start + state.pageSize);
}

function renderPagination() {
  const rows = visibleTableRows();
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / state.pageSize) || 1);
  const start = total ? (state.page - 1) * state.pageSize + 1 : 0;
  const end = Math.min(total, state.page * state.pageSize);
  const count = document.getElementById("page-count");
  const label = document.getElementById("page-label");
  if (count) count.textContent = total ? `${start}–${end} из ${total}` : "Нет записей";
  if (label) label.textContent = `${state.page} стр`;
  const prev = document.getElementById("page-prev");
  const next = document.getElementById("page-next");
  if (prev) prev.disabled = state.page <= 1;
  if (next) next.disabled = state.page >= pages;
}

function excelColName(index) {
  let n = index + 1;
  let name = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function renderExcelGridHtml(columns, rows, options = {}) {
  const withControls = Boolean(options.columnControls);
  const letterCells = columns
    .map((_, index) => {
      if (!withControls) return `<th class="excel-col">${excelColName(index)}</th>`;
      const canDelete = columns.length > 1;
      return `
        <th class="excel-col has-controls">
          <span class="excel-col-letter">${excelColName(index)}</span>
          <span class="excel-col-actions">
            <button class="excel-col-btn" type="button" data-insert-col="${index + 1}" title="Добавить столбец справа" aria-label="Добавить столбец справа">+</button>
            ${
              canDelete
                ? `<button class="excel-col-btn is-danger" type="button" data-delete-col="${index}" title="Удалить столбец" aria-label="Удалить столбец">×</button>`
                : ""
            }
          </span>
        </th>`;
    })
    .join("");
  const headerCells = columns
    .map(
      (name, col) =>
        `<td class="excel-header-cell is-editable" data-import-col="${col}">${escapeHtml(name)}</td>`
    )
    .join("");
  const body = rows
    .map(
      (row, index) => `
      <tr>
        <th class="excel-row-num">${index + 2}</th>
        ${row.cells
          .map(
            (value, col) =>
              `<td class="is-editable" data-id="${row.id}" data-col="${col}">${escapeHtml(value)}</td>`
          )
          .join("")}
      </tr>`
    )
    .join("");

  return `
    <table class="excel-grid${withControls ? " has-col-controls" : ""}">
      <thead>
        <tr>
          <th class="excel-corner">${
            withControls
              ? `<button class="excel-col-btn" type="button" data-insert-col="0" title="Добавить столбец слева" aria-label="Добавить столбец слева">+</button>`
              : ""
          }</th>
          ${letterCells}
        </tr>
        <tr>
          <th class="excel-row-num">1</th>
          ${headerCells}
        </tr>
      </thead>
      <tbody>${body}</tbody>
    </table>
  `;
}

function applyTableLayout() {
  const table = document.getElementById("protocols-table");
  if (!table) return;
  const imported = tableData.imported;
  table.classList.toggle("is-imported", imported);
  if (!imported) {
    const widths = DEFAULT_GRID.split(" ");
    const more = widths[widths.length - 1];
    const colWidths = tableData.columns.map((_, index) => widths[index] || "88px");
    table.style.setProperty("--protocol-grid", [...colWidths, more].join(" "));
  }
}

function protocolColActions(index) {
  const canDelete = tableData.columns.length > 1;
  return `
    <span class="protocol-col-actions">
      <button class="excel-col-btn" type="button" data-insert-col="${index + 1}" title="Добавить столбец справа" aria-label="Добавить столбец справа">+</button>
      ${
        canDelete
          ? `<button class="excel-col-btn is-danger" type="button" data-delete-col="${index}" title="Удалить столбец" aria-label="Удалить столбец">×</button>`
          : ""
      }
    </span>
  `;
}

function renderProtocolsHead() {
  const head = document.getElementById("protocols-head");
  if (!head) return;
  applyTableLayout();
  head.innerHTML =
    tableData.columns
      .map((name, index) => {
        if (DEFAULT_ROTATED.has(name)) {
          return `<div class="th-rot" data-protocol-col="${index}"><span class="col-title">${escapeHtml(name)}</span>${protocolColActions(index)}</div>`;
        }
        return `<div class="th" data-protocol-col="${index}"><span class="col-title">${escapeHtml(name)}</span>${protocolColActions(index)}</div>`;
      })
      .join("") +
    `<div>
      <button class="excel-col-btn" type="button" data-insert-col="0" title="Добавить столбец слева" aria-label="Добавить столбец слева">+</button>
    </div>`;
}

function renderStudents() {
  const table = document.getElementById("protocols-table");
  if (!table) return;

  if (tableData.imported) {
    applyTableLayout();
    const rows = pagedTableRows();
    table.innerHTML = rows.length
      ? renderExcelGridHtml(tableData.columns, rows, { columnControls: true })
      : `<div class="empty-state">Нет учеников по выбранным фильтрам</div>`;
    renderPagination();
    return;
  }

  if (!document.getElementById("protocols-body")) {
    table.innerHTML = `<div class="protocols-head" id="protocols-head"></div><div id="protocols-body"></div>`;
  }

  const body = document.getElementById("protocols-body");
  renderProtocolsHead();
  const rows = pagedTableRows();
  body.innerHTML = rows.length
    ? rows
        .map(
          (row) => `
      <div class="protocols-row" data-id="${row.id}">
        ${row.cells
          .map((value, col) => {
            const classes = ["cell", "is-editable"];
            if (col === 0) classes.push("is-muted");
            return `<div class="${classes.join(" ")}" data-id="${row.id}" data-col="${col}">${escapeHtml(value)}</div>`;
          })
          .join("")}
        ${moreIcon}
      </div>
    `
        )
        .join("")
    : `<div class="empty-state">Нет учеников по выбранным фильтрам</div>`;
  renderPagination();
}

function findTableRow(id) {
  return tableData.rows.find((row) => String(row.id) === String(id));
}

function insertProtocolColumn(index) {
  const at = Number.isNaN(index) ? tableData.columns.length : Math.max(0, index);
  const name = `Столбец ${tableData.columns.length + 1}`;
  tableData.columns.splice(at, 0, name);
  tableData.rows.forEach((row) => {
    row.cells.splice(at, 0, "");
  });
  commitSchoolTable();
  renderStudents();
}

function deleteProtocolColumn(index) {
  if (Number.isNaN(index) || tableData.columns.length <= 1) return;
  tableData.columns.splice(index, 1);
  tableData.rows.forEach((row) => {
    row.cells.splice(index, 1);
  });
  commitSchoolTable();
  renderStudents();
}

function activateListedProtocol(listedIndex) {
  const item = listedProtocols()[listedIndex];
  if (!item) return;
  if (state.school !== item.schoolId) {
    commitSchoolTable();
    state.school = item.schoolId;
    bindSchoolTable();
  }
  state.year = item.year;
  state.protocolIndex = item.index;
  state.listedIndex = listedIndex;
  openSchoolGroups.add(item.schoolId);
  renderStudents();
}

function protocolAccordionHtml(item, options = {}) {
  const open = item.listedIndex === state.listedIndex;
  const showSchool = options.showSchool !== false;
  return `
    <div class="protocol-acc${open ? " is-open" : ""}" data-listed="${item.listedIndex}" data-protocol="${item.index}" data-item-school="${item.schoolId}" data-item-year="${item.year}">
      <div class="protocol-acc-head">
        <div class="protocol-acc-main">
          <span class="protocol-acc-title">${escapeHtml(protocolEntryLabel(item))}</span>
          <div class="protocol-acc-meta">
            ${showSchool ? `<span class="chip">${escapeHtml(item.schoolName)}</span>` : ""}
            <span class="chip is-year">${escapeHtml(item.year)}</span>
          </div>
        </div>
        <button class="protocol-acc-delete" type="button" data-delete-protocol="${item.listedIndex}">Удалить</button>
        <button class="protocol-acc-toggle" type="button" aria-label="Свернуть протокол">
          <span class="icon icon-12 protocol-acc-chevron">
            <img src="./assets/icons/chevron-up.svg" width="12" height="12" alt="" />
          </span>
        </button>
      </div>
      <div class="protocol-acc-body"></div>
    </div>
  `;
}

function renderProtocolHeaders() {
  const root = document.getElementById("protocol-headers");
  const tableWrap = document.getElementById("protocols-table-wrap");
  const body = document.getElementById("protocol-block-body");
  const toolbar = document.querySelector(".protocol-table-toolbar");
  if (!root) return;

  if (body) {
    if (toolbar) body.appendChild(toolbar);
    if (tableWrap) body.appendChild(tableWrap);
  }

  const items = listedProtocols();
  if (toolbar) toolbar.hidden = true;
  if (tableWrap) tableWrap.hidden = true;

  if (!items.length) {
    state.listedIndex = null;
    root.innerHTML = `<div class="empty-state">Нет протоколов по выбранным фильтрам. Загрузите Excel или сбросьте поиск.</div>`;
    return;
  }

  const current = state.listedIndex != null ? items.find((item) => item.listedIndex === state.listedIndex) : null;
  if (state.search.trim()) {
    const pick = current || items[0];
    if (!current || state.school !== pick.schoolId || state.year !== pick.year) {
      activateListedProtocol(pick.listedIndex);
    }
  } else if (state.listedIndex != null && state.listedIndex >= items.length) {
    state.listedIndex = items.length ? 0 : null;
    state.protocolIndex = state.listedIndex == null ? null : items[state.listedIndex].index;
  }

  const searching = Boolean(state.search.trim()) || activeFilterCount() > 0;

  if (state.scope === "school") {
    root.innerHTML = items.map((item) => protocolAccordionHtml(item, { showSchool: false })).join("");
  } else {
    root.innerHTML = SCHOOLS.map((school) => {
      const schoolItems = items.filter((item) => item.schoolId === school.id);
      if (!schoolItems.length) return "";
      const openHere =
        searching ||
        openSchoolGroups.has(school.id) ||
        schoolItems.some((item) => item.listedIndex === state.listedIndex);
      if (openHere) openSchoolGroups.add(school.id);
      return `
        <div class="protocol-school-group${openHere ? " is-open" : ""}" data-school-group="${school.id}">
          <button class="protocol-school-head" type="button">
            <span class="protocol-school-name">${escapeHtml(school.name)}</span>
            <span class="chip is-count">${schoolItems.length}</span>
            <span class="icon icon-12 protocol-school-chevron">
              <img src="./assets/icons/chevron-up.svg" width="12" height="12" alt="" />
            </span>
          </button>
          <div class="protocol-school-body">
            ${schoolItems.map((item) => protocolAccordionHtml(item, { showSchool: false })).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  const openBody = root.querySelector(".protocol-acc.is-open .protocol-acc-body");
  if (openBody) {
    if (toolbar) {
      toolbar.hidden = false;
      openBody.appendChild(toolbar);
    }
    if (tableWrap) {
      tableWrap.hidden = false;
      openBody.appendChild(tableWrap);
    }
  }
}

function deleteListedProtocol(listedIndex) {
  const item = listedProtocols()[listedIndex];
  if (!item) return;
  if (!confirm(`Удалить протокол «${item.subject || item.title}»?`)) return;
  const list = PROTOCOL_TITLES_BY_SCHOOL[item.schoolId]?.[item.year];
  if (list) list.splice(item.index, 1);
  state.listedIndex = null;
  state.protocolIndex = null;
  renderProtocolHeaders();
  renderSchoolProtocolMenu();
  renderStats();
  showToast("Протокол удалён");
}

function collectStatRows() {
  const schoolId = document.getElementById("stats-school")?.value || "all";
  const schools = schoolId === "all" ? SCHOOLS : SCHOOLS.filter((item) => item.id === schoolId);
  const rows = [];
  schools.forEach((school) => {
    const table = schoolTables[school.id];
    if (!table) return;
    const scoreIndex = table.columns.findIndex((name) => /балл/i.test(name));
    const markIndex = table.columns.findIndex((name) => /оценк/i.test(name));
    const klassIndex = table.columns.findIndex((name) => /класс/i.test(name));
    const lastIndex = table.columns.findIndex((name) => /фамили/i.test(name));
    const firstIndex = table.columns.findIndex((name) => /^имя$/i.test(name));
    table.rows.forEach((row) => {
      rows.push({
        schoolId: school.id,
        schoolName: school.name,
        score: Number(String(row.cells[scoreIndex] || "").replace(",", ".")) || 0,
        mark: String(row.cells[markIndex] || ""),
        klass: String(row.cells[klassIndex] || ""),
        name: `${row.cells[lastIndex] || ""} ${row.cells[firstIndex] || ""}`.trim() || "Без имени",
      });
    });
  });
  return rows;
}

function protocolCountForStats() {
  const schoolId = document.getElementById("stats-school")?.value || "all";
  const year = document.getElementById("stats-year")?.value || "all";
  const schools = schoolId === "all" ? SCHOOLS : SCHOOLS.filter((item) => item.id === schoolId);
  const years = year === "all" ? YEARS : [year];
  let count = 0;
  schools.forEach((school) => {
    years.forEach((itemYear) => {
      count += (PROTOCOL_TITLES_BY_SCHOOL[school.id]?.[itemYear] || []).length;
    });
  });
  return count;
}

function renderStats() {
  const cards = document.getElementById("stats-cards");
  const schoolsBody = document.getElementById("stats-schools-body");
  const studentsBody = document.getElementById("stats-students-body");
  if (!cards || !schoolsBody || !studentsBody) return;
  populateFilterOptions();
  const rows = collectStatRows();
  const threshold = Number(document.getElementById("stats-threshold")?.value || 59);
  const avg = rows.length ? rows.reduce((sum, row) => sum + row.score, 0) / rows.length : 0;
  const passed = rows.filter((row) => Number(row.mark) >= 3 || row.score >= 32).length;
  const high = rows.filter((row) => row.score > threshold);
  cards.innerHTML = `
    <div class="stat-card"><div class="stat-value">${rows.length}</div><div class="stat-label">Участников</div></div>
    <div class="stat-card"><div class="stat-value">${new Set(rows.map((row) => row.schoolId)).size}</div><div class="stat-label">Школ</div></div>
    <div class="stat-card"><div class="stat-value">${avg ? avg.toFixed(1) : "—"}</div><div class="stat-label">Средний балл</div></div>
    <div class="stat-card"><div class="stat-value">${protocolCountForStats()}</div><div class="stat-label">Протоколов</div></div>
  `;
  const bySchool = SCHOOLS.map((school) => {
    const schoolRows = rows.filter((row) => row.schoolId === school.id);
    if (!schoolRows.length) return "";
    const schoolAvg = schoolRows.reduce((sum, row) => sum + row.score, 0) / schoolRows.length;
    const schoolPassed = schoolRows.filter((row) => Number(row.mark) >= 3 || row.score >= 32).length;
    return `<tr data-school="${school.id}">
      <td>${escapeHtml(school.name)}</td>
      <td>${schoolRows.length}</td>
      <td>${schoolAvg.toFixed(1)}</td>
      <td>${schoolPassed}</td>
      <td>${schoolRows.length - schoolPassed}</td>
    </tr>`;
  }).join("");
  schoolsBody.innerHTML = bySchool || `<tr><td colspan="5">Нет данных</td></tr>`;
  studentsBody.innerHTML = high.length
    ? high
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
        .map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.schoolName)}</td><td>${escapeHtml(row.klass)}</td><td>${row.score}</td></tr>`)
        .join("")
    : `<tr><td colspan="4">Нет учеников с баллом выше ${threshold}</td></tr>`;
}

function renderDocuments() {
  const body = document.getElementById("docs-body");
  if (!body) return;
  const docs = currentDocuments();
  if (!docs.length) {
    body.innerHTML = `<div class="docs-row"><div class="docs-col-name">Нет отчётов для этой школы</div><div class="docs-col-type"></div><div class="docs-col-date"></div><div class="docs-col-actions"></div></div>`;
    return;
  }
  body.innerHTML = docs
    .map(
      (doc) => `
      <div class="docs-row">
        <div class="docs-col-name">${escapeHtml(doc.name)}</div>
        <div class="docs-col-type">${escapeHtml(doc.type)}</div>
        <div class="docs-col-date">${escapeHtml(doc.date)}</div>
        <div class="docs-col-actions">${moreIcon}</div>
      </div>
    `
    )
    .join("");
}

function formatPreviewDate(value) {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

function getReportSubject(title) {
  const match = title.match(/[“"«]([^”"»]+)[”"»]/);
  return match ? match[1] : "Русский язык";
}

function cellByHeader(row, names) {
  const list = Array.isArray(names) ? names : [names];
  const index = tableData.columns.findIndex((col) =>
    list.some((name) => col.toLowerCase().includes(name.toLowerCase()))
  );
  return index >= 0 ? row.cells[index] || "" : "";
}

function renderReportPreview() {
  const sheet = document.getElementById("report-preview-sheet");
  if (!sheet) return;

  const title = document.getElementById("report-title-label").textContent.trim();
  const subject = getReportSubject(title);
  const date = formatPreviewDate(document.getElementById("report-date").value);
  const format = document.getElementById("report-format").value || "WORD";
  const rows = visibleTableRows().slice(0, 8);

  sheet.innerHTML = `
    <header class="preview-doc-head">
      <div class="preview-doc-kicker">${format} · предпросмотр</div>
      <h3 class="preview-doc-title">${title} в ${state.year} г.</h3>
      <div class="preview-doc-subject">«${subject}»</div>
    </header>
    <div class="preview-doc-meta">
      <div><span>Код МСУ:</span> <b>220</b></div>
      <div><span>Код ОО:</span> <b>22108</b></div>
      <div><span>Код ППЭ:</span> <b>225</b></div>
      <div><span>Дата:</span> <b>${date}</b></div>
    </div>
    <table class="preview-doc-table">
      <thead>
        <tr>
          <th>№</th>
          <th>Класс</th>
          <th>Фамилия</th>
          <th>Имя</th>
          <th>Отчество</th>
          <th>Краткий ответ</th>
          <th>Развёрнутый ответ</th>
          <th>Балл</th>
          <th>Оценка</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${cellByHeader(row, "Класс")}</td>
            <td class="is-left">${cellByHeader(row, "Фамилия")}</td>
            <td class="is-left">${cellByHeader(row, "Имя")}</td>
            <td class="is-left">${cellByHeader(row, "Отчество")}</td>
            <td>${cellByHeader(row, "кратким")}</td>
            <td>${cellByHeader(row, "развёрнутым")}</td>
            <td>${cellByHeader(row, ["Первичный", "Балл"])}</td>
            <td>${cellByHeader(row, "Оценка")}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <div class="preview-doc-sign">
      <div>
        <span>Председатель комиссии</span>
        <div class="preview-doc-line"></div>
      </div>
      <div>
        <span>Член комиссии</span>
        <div class="preview-doc-line"></div>
      </div>
      <div>
        <span>Член комиссии</span>
        <div class="preview-doc-line"></div>
      </div>
      <div>
        <span>Дата составления</span>
        <div class="preview-doc-line">${date}</div>
      </div>
    </div>
  `;
}

function setYear(year) {
  if (year === "all") {
    state.scope = "all";
    state.listedIndex = null;
    state.protocolIndex = null;
    renderYearTabs("year-tabs", true);
    renderYearTabs("school-year-tabs", true);
    document.querySelectorAll("[data-year-nav]").forEach((btn) => btn.classList.remove("is-active"));
    renderProtocolHeaders();
    renderSchoolProtocolMenu();
    renderSubjectTabs();
    renderReportSubjectNav();
    renderDocuments();
    renderReportPreview();
    updateSchoolUi();
    return;
  }
  state.year = year;
  if (state.view !== "schools" && state.scope === "all") {
    state.scope = "year";
  }
  state.listedIndex = null;
  renderYearTabs("year-tabs", true);
  renderYearTabs("school-year-tabs", true);
  document.querySelectorAll("[data-year-nav]").forEach((btn) => {
    btn.classList.toggle("is-active", state.scope !== "all" && btn.dataset.yearNav === year);
  });
  renderProtocolHeaders();
  renderSchoolProtocolMenu();
  renderSubjectTabs();
  renderReportSubjectNav();
  renderDocuments();
  renderReportPreview();
  updateSchoolUi();
}

function setGrade(grade) {
  state.grade = grade;
  document.getElementById("grade-label").textContent = grade === "all" ? "Все классы" : `${grade} класс`;
  document.querySelectorAll('[data-dropdown="grade"] [role="option"]').forEach((option) => {
    option.setAttribute("aria-selected", String(option.dataset.value === grade));
  });
  document.querySelector("[data-dropdown='grade']").classList.remove("is-open");
  renderStudents();
  renderReportPreview();
}

function showView(view) {
  state.view = view;
  ["protocols", "report", "stats", "schools", "forms", "settings"].forEach((id) => {
    const el = document.getElementById(`view-${id}`);
    if (el) el.classList.toggle("hidden", id !== view);
  });
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.nav === view);
  });
  if (view === "schools") {
    const group = document.querySelector('[data-group="schools"]');
    if (group) group.classList.remove("is-collapsed");
    renderSchoolSelect();
    renderYearTabs("school-year-tabs", true);
    renderSchoolProtocolMenu();
    updateSchoolUi();
  }
  if (view === "stats") {
    renderStats();
  }
  if (view === "protocols") {
    updateSchoolUi();
  }
  if (view === "report") {
    const group = document.querySelector('[data-group="reports"]');
    if (group) group.classList.remove("is-collapsed");
    updateSchoolUi();
    renderSubjectTabs();
    renderReportSubjectNav();
    renderDocuments();
  }
  closeSidebar();
}

function openSidebar() {
  document.getElementById("sidebar").classList.add("is-open");
  document.getElementById("sidebar-backdrop").classList.add("is-open");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("is-open");
  document.getElementById("sidebar-backdrop").classList.remove("is-open");
}

function enterApp() {
  document.getElementById("login-page").classList.add("hidden");
  document.getElementById("app-page").classList.remove("hidden");
  state.scope = "all";
  state.listedIndex = null;
  state.protocolIndex = null;
  showView("protocols");
  renderYearTabs("year-tabs", true);
  renderProtocolHeaders();
  const block = document.getElementById("protocol-block");
  block.classList.remove("is-collapsed");
  document.getElementById("protocols-toggle-label").textContent = "Скрыть";
  document.getElementById("protocols-toggle-btn").setAttribute("aria-expanded", "true");
  updateSchoolUi();
}

function exitApp() {
  document.getElementById("app-page").classList.add("hidden");
  document.getElementById("login-page").classList.remove("hidden");
  closeSidebar();
  document.getElementById("search-modal").classList.add("hidden");
}

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const login = (form.login?.value || "").trim();
  const password = (form.password?.value || "").trim();
  const error = document.getElementById("login-error");
  if (!login || !password) {
    if (error) error.classList.remove("hidden");
    return;
  }
  if (error) error.classList.add("hidden");
  enterApp();
});

document.getElementById("logout-btn").addEventListener("click", exitApp);
document.getElementById("create-report").addEventListener("click", () => showView("report"));
document.getElementById("save-document-btn").addEventListener("click", () => {
  const name = document.getElementById("report-title-label").textContent.trim();
  const format = document.getElementById("report-format").value || "WORD";
  const date = formatPreviewDate(document.getElementById("report-date").value);
  currentDocuments().unshift({
    name: `${name} · ${currentSchool().name}`,
    type: format,
    date,
  });
  renderDocuments();
  showToast("Документ сохранён");
  const list = document.getElementById("docs-body")?.closest(".uploaded-list-section");
  if (list) {
    list.classList.remove("is-collapsed");
    const btn = list.querySelector("[data-collapse-section]");
    const label = list.querySelector("[data-collapse-label]");
    if (label) label.textContent = "Скрыть";
    if (btn) btn.setAttribute("aria-expanded", "true");
  }
});
document.getElementById("back-to-protocols").addEventListener("click", () => showView("protocols"));
document.getElementById("menu-toggle").addEventListener("click", openSidebar);
document.querySelectorAll("[data-open-menu]").forEach((btn) => {
  btn.addEventListener("click", openSidebar);
});
document.getElementById("sidebar-backdrop").addEventListener("click", closeSidebar);

document.getElementById("open-search").addEventListener("click", () => {
  populateFilterOptions();
  fillScoreFilterUi();
  document.getElementById("search-modal").classList.remove("hidden");
});

document.getElementById("search-save").addEventListener("click", () => {
  if (!applyFiltersFromModal()) return;
  document.getElementById("search-modal").classList.add("hidden");
});

document.getElementById("search-cancel").addEventListener("click", () => {
  document.getElementById("search-modal").classList.add("hidden");
});

document.getElementById("search-modal").addEventListener("click", (event) => {
  if (event.target.id === "search-modal") {
    document.getElementById("search-modal").classList.add("hidden");
  }
});

document.querySelectorAll("[data-toggle-group]").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    if (event.target.closest(".nav-chevron")) {
      btn.closest(".nav-group").classList.toggle("is-collapsed");
      return;
    }
    const group = btn.closest(".nav-group");
    if (group) group.classList.remove("is-collapsed");
    if (btn.dataset.nav === "protocols") {
      state.scope = "all";
      state.listedIndex = null;
      state.protocolIndex = null;
      showView("protocols");
      renderYearTabs("year-tabs", true);
      renderProtocolHeaders();
      const block = document.getElementById("protocol-block");
      block.classList.remove("is-collapsed");
      document.getElementById("protocols-toggle-label").textContent = "Скрыть";
      document.getElementById("protocols-toggle-btn").setAttribute("aria-expanded", "true");
      updateSchoolUi();
      return;
    }
    if (btn.dataset.nav) showView(btn.dataset.nav);
  });
});

document.querySelectorAll("[data-nav]").forEach((btn) => {
  if (btn.dataset.toggleGroup) return;
  btn.addEventListener("click", () => showView(btn.dataset.nav));
});

document.querySelectorAll("[data-year-nav]").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.scope = "year";
    setYear(btn.dataset.yearNav);
    showView("protocols");
    const block = document.getElementById("protocol-block");
    block.classList.remove("is-collapsed");
    document.getElementById("protocols-toggle-label").textContent = "Скрыть";
    document.getElementById("protocols-toggle-btn").setAttribute("aria-expanded", "true");
  });
});

document.getElementById("report-subject-nav").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-subject-nav]");
  if (!btn) return;
  setSubject(btn.dataset.subjectNav);
  showView("report");
});

document.getElementById("report-subject-tabs").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-subject]");
  if (!tab) return;
  setSubject(tab.dataset.subject);
});

document.querySelectorAll("[data-school-nav]").forEach((btn) => {
  btn.addEventListener("click", () => {
    setSchool(btn.dataset.schoolNav);
    showView("schools");
  });
});

document.getElementById("school-trigger").addEventListener("click", (event) => {
  event.stopPropagation();
  const dropdown = event.currentTarget.closest(".dropdown");
  const willOpen = !dropdown.classList.contains("is-open");
  closeDropdowns();
  dropdown.classList.toggle("is-open", willOpen);
});

document.getElementById("school-select-menu").addEventListener("click", (event) => {
  const option = event.target.closest("[role='option']");
  if (!option) return;
  event.stopPropagation();
  setSchool(option.dataset.value);
  closeDropdowns();
  showView("schools");
});

document.getElementById("school-protocol-headers").addEventListener("click", (event) => {
  const item = event.target.closest("[data-school-protocol]");
  if (!item) return;
  openSchoolProtocol(Number(item.dataset.schoolProtocol));
});

document.getElementById("schools-body").addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-school]");
  if (!row) return;
  setSchool(row.dataset.school);
  showView("schools");
});

document.getElementById("grade-trigger").addEventListener("click", (event) => {
  event.stopPropagation();
  const dropdown = event.currentTarget.closest(".dropdown");
  const willOpen = !dropdown.classList.contains("is-open");
  closeDropdowns();
  dropdown.classList.toggle("is-open", willOpen);
});

document.querySelectorAll('[data-dropdown="grade"] [role="option"]').forEach((option) => {
  option.addEventListener("click", (event) => {
    event.stopPropagation();
    setGrade(option.dataset.value);
  });
});

document.getElementById("report-title-trigger").addEventListener("click", (event) => {
  event.stopPropagation();
  const dropdown = event.currentTarget.closest(".dropdown");
  const willOpen = !dropdown.classList.contains("is-open");
  closeDropdowns();
  dropdown.classList.toggle("is-open", willOpen);
});

document.querySelectorAll('[data-dropdown="report-title"] [role="option"]').forEach((option) => {
  option.addEventListener("click", (event) => {
    event.stopPropagation();
    document.getElementById("report-title-label").textContent = option.textContent.trim();
    option.closest("[data-dropdown]").querySelectorAll("[role='option']").forEach((item) => {
      item.setAttribute("aria-selected", String(item === option));
    });
    closeDropdowns();
    setSubject(getReportSubject(option.textContent.trim()));
  });
});

function closeDropdowns() {
  document.querySelectorAll(".dropdown.is-open").forEach((el) => el.classList.remove("is-open"));
}

document.addEventListener("click", () => closeDropdowns());

document.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-year]");
  if (tab) setYear(tab.dataset.year);
});

document.getElementById("protocols-toggle-btn").addEventListener("click", () => {
  const block = document.getElementById("protocol-block");
  const collapsed = block.classList.toggle("is-collapsed");
  document.getElementById("protocols-toggle-label").textContent = collapsed ? "Показать" : "Скрыть";
  document.getElementById("protocols-toggle-btn").setAttribute("aria-expanded", String(!collapsed));
});

const WORD_CHAR = /[\wА-Яа-яЁё0-9+]/;
let protocolClickTimer = null;

function selectWordAtPoint(x, y) {
  let range = null;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
  } else if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(x, y);
    if (pos) {
      range = document.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }
  }
  if (!range || range.startContainer.nodeType !== Node.TEXT_NODE) return;
  const text = range.startContainer.textContent;
  let start = range.startOffset;
  let end = range.startOffset;
  while (start > 0 && WORD_CHAR.test(text[start - 1])) start -= 1;
  while (end < text.length && WORD_CHAR.test(text[end])) end += 1;
  if (start === end) return;
  range.setStart(range.startContainer, start);
  range.setEnd(range.startContainer, end);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function startInlineEdit(el, event, onSave) {
  if (el.isContentEditable) return;
  el.dataset.prev = el.textContent;
  el.contentEditable = "true";
  el.spellcheck = false;
  el.classList.add("is-editing");
  el.focus();
  requestAnimationFrame(() => selectWordAtPoint(event.clientX, event.clientY));

  const onKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      el.blur();
    }
    if (e.key === "Escape") {
      el.textContent = el.dataset.prev;
      el.blur();
    }
  };
  const onBlur = () => {
    el.removeEventListener("keydown", onKey);
    el.removeEventListener("blur", onBlur);
    el.contentEditable = "false";
    el.classList.remove("is-editing");
    const value = el.textContent.replace(/\s+/g, " ").trim();
    el.textContent = value;
    if (value !== el.dataset.prev) onSave(value);
  };
  el.addEventListener("keydown", onKey);
  el.addEventListener("blur", onBlur);
}

document.getElementById("protocols-table-wrap").addEventListener("click", (event) => {
  const deleteBtn = event.target.closest("[data-delete-col]");
  if (deleteBtn) {
    event.preventDefault();
    event.stopPropagation();
    deleteProtocolColumn(Number(deleteBtn.dataset.deleteCol));
    return;
  }
  const insertBtn = event.target.closest("[data-insert-col]");
  if (insertBtn) {
    event.preventDefault();
    event.stopPropagation();
    insertProtocolColumn(Number(insertBtn.dataset.insertCol));
  }
});

document.getElementById("protocol-add-col").addEventListener("click", () => {
  insertProtocolColumn(tableData.columns.length);
});

document.getElementById("protocols-table-wrap").addEventListener("dblclick", (event) => {
  if (event.target.closest(".excel-col-btn, .protocol-col-actions")) return;
  const header = event.target.closest("[data-import-col]");
  if (header) {
    event.preventDefault();
    const col = Number(header.dataset.importCol);
    startInlineEdit(header, event, (value) => {
      if (Number.isNaN(col)) return;
      tableData.columns[col] = value || `Столбец ${col + 1}`;
      header.textContent = tableData.columns[col];
      commitSchoolTable();
    });
    return;
  }
  const protocolHeader = event.target.closest("[data-protocol-col]");
  if (protocolHeader) {
    event.preventDefault();
    const col = Number(protocolHeader.dataset.protocolCol);
    const label = protocolHeader.querySelector(".col-title") || protocolHeader;
    startInlineEdit(label, event, (value) => {
      if (Number.isNaN(col)) return;
      tableData.columns[col] = value || `Столбец ${col + 1}`;
      label.textContent = tableData.columns[col];
      commitSchoolTable();
    });
    return;
  }
  const cell = event.target.closest(".cell.is-editable, td.is-editable");
  if (!cell) return;
  event.preventDefault();
  startInlineEdit(cell, event, (value) => {
    const row = findTableRow(cell.dataset.id);
    const col = Number(cell.dataset.col);
    if (!row || Number.isNaN(col)) return;
    row.cells[col] = value;
    const student = STUDENTS.find((item) => String(item.id) === String(row.id));
    if (student && !tableData.imported) {
      const keys = ["id", "msu", "oo", "klass", "ppe", "room", "last", "first", "middle", "series", "number", "short", "long", "score", "grade"];
      if (keys[col]) student[keys[col]] = value;
    }
    if (/класс/i.test(tableData.columns[col] || "")) renderStudents();
  });
});

document.getElementById("protocol-headers").addEventListener("click", (event) => {
  const schoolHead = event.target.closest(".protocol-school-head");
  if (schoolHead) {
    event.preventDefault();
    event.stopPropagation();
    const group = schoolHead.closest(".protocol-school-group");
    const id = group?.dataset.schoolGroup;
    group.classList.toggle("is-open");
    if (!id) return;
    if (group.classList.contains("is-open")) openSchoolGroups.add(id);
    else openSchoolGroups.delete(id);
    return;
  }
  const deleteBtn = event.target.closest("[data-delete-protocol]");
  if (deleteBtn) {
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(protocolClickTimer);
    deleteListedProtocol(Number(deleteBtn.dataset.deleteProtocol));
    return;
  }
  if (event.target.closest(".is-editing")) return;
  if (event.detail > 1) return;
  const head = event.target.closest(".protocol-acc-head");
  if (!head) return;
  clearTimeout(protocolClickTimer);
  protocolClickTimer = setTimeout(() => {
    const acc = head.closest(".protocol-acc");
    const listed = Number(acc.dataset.listed);
    if (state.listedIndex === listed) {
      state.listedIndex = null;
      state.protocolIndex = null;
    } else {
      activateListedProtocol(listed);
    }
    renderProtocolHeaders();
  }, 280);
});

document.getElementById("protocol-headers").addEventListener("dblclick", (event) => {
  const title = event.target.closest(".protocol-acc-title");
  if (!title) return;
  clearTimeout(protocolClickTimer);
  protocolClickTimer = null;
  event.preventDefault();
  startInlineEdit(title, event, (value) => {
    const acc = title.closest(".protocol-acc");
    const schoolId = acc.dataset.itemSchool;
    const year = acc.dataset.itemYear;
    const index = Number(acc.dataset.protocol);
    const list = PROTOCOL_TITLES_BY_SCHOOL[schoolId]?.[year];
    if (list) list[index] = value;
    renderSchoolProtocolMenu();
  });
});

document.querySelectorAll("[data-collapse-section]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const section = btn.closest(".uploaded-list-section");
    const collapsed = section.classList.toggle("is-collapsed");
    const label = btn.querySelector("[data-collapse-label]");
    if (label) label.textContent = collapsed ? "Показать" : "Скрыть";
    btn.setAttribute("aria-expanded", String(!collapsed));
  });
});

document.getElementById("preview-toggle-btn").addEventListener("click", () => {
  const preview = document.getElementById("report-preview");
  const collapsed = preview.classList.toggle("is-collapsed");
  document.getElementById("preview-toggle-label").textContent = collapsed ? "Показать" : "Скрыть";
  document.getElementById("preview-toggle-btn").setAttribute("aria-expanded", String(!collapsed));
});

document.getElementById("upload-files-btn").addEventListener("click", () => {
  document.getElementById("report-file").click();
});

function todayLabel() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${now.getFullYear()}`;
}

function parseExcelTable(buffer) {
  if (typeof XLSX === "undefined") {
    throw new Error("Не удалось загрузить библиотеку Excel");
  }
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("В файле нет листов");
  const sheet = workbook.Sheets[sheetName];
  const aoa = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
    blankrows: false,
  });
  if (!aoa.length) throw new Error("Файл пустой");

  let colCount = 0;
  aoa.forEach((row) => {
    colCount = Math.max(colCount, row.length);
  });
  while (colCount > 1 && aoa.every((row) => String(row[colCount - 1] ?? "").trim() === "")) {
    colCount -= 1;
  }

  const columns = Array.from({ length: colCount }, (_, index) => {
    const name = String(aoa[0][index] ?? "").trim();
    return name || `Столбец ${index + 1}`;
  });
  const rows = aoa
    .slice(1)
    .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
    .map((row, index) => ({
      id: index + 1,
      cells: columns.map((_, col) => String(row[col] ?? "").trim()),
    }));

  if (!rows.length) throw new Error("В таблице нет строк с данными");
  return { columns, rows, sheetName };
}

function updateImportMeta() {
  const el = document.getElementById("import-modal-file");
  if (!el) return;
  const fileName = importDraft.fileName || "Таблица";
  el.textContent = `${fileName} · ${importDraft.columns.length} столбцов · ${importDraft.rows.length} строк`;
}

function renderImportTable() {
  const wrap = document.getElementById("import-table-wrap");
  wrap.innerHTML = renderExcelGridHtml(importDraft.columns, importDraft.rows, { columnControls: true });
  updateImportMeta();
}

function insertImportColumn(index) {
  const at = Number.isNaN(index) ? importDraft.columns.length : Math.max(0, index);
  const name = `Столбец ${importDraft.columns.length + 1}`;
  importDraft.columns.splice(at, 0, name);
  importDraft.rows.forEach((row) => {
    row.cells.splice(at, 0, "");
  });
  renderImportTable();
}

function deleteImportColumn(index) {
  if (Number.isNaN(index) || importDraft.columns.length <= 1) return;
  importDraft.columns.splice(index, 1);
  importDraft.rows.forEach((row) => {
    row.cells.splice(index, 1);
  });
  renderImportTable();
}

function protocolTitleFromFile(fileName) {
  return fileName.replace(/\.(xlsx|xls|xlsm|csv)$/i, "").trim() || "Загруженный протокол";
}

function renderImportSchoolSelect() {
  const menu = document.getElementById("import-school-menu");
  const label = document.getElementById("import-school-label");
  if (!menu || !label) return;
  const school = SCHOOLS.find((item) => item.id === importDraft.schoolId) || SCHOOLS[0];
  importDraft.schoolId = school.id;
  label.textContent = school.name;
  menu.innerHTML = SCHOOLS.map(
    (item) => `
      <li role="option" data-value="${item.id}" aria-selected="${item.id === school.id}">${escapeHtml(item.name)}</li>
    `
  ).join("");
}

function openImportModal(fileName, parsed) {
  importDraft.fileName = fileName;
  importDraft.schoolId = state.school;
  importDraft.columns = [...parsed.columns];
  importDraft.rows = parsed.rows.map((row) => ({ id: row.id, cells: [...row.cells] }));
  document.getElementById("import-modal-title").textContent = "Просмотр таблицы Excel";
  document.getElementById("import-title-input").value = protocolTitleFromFile(fileName);
  renderImportSchoolSelect();
  renderImportTable();
  document.getElementById("import-modal").classList.remove("hidden");
}

function closeImportModal() {
  document.getElementById("import-modal").classList.add("hidden");
  importDraft.fileName = "";
  importDraft.schoolId = state.school;
  importDraft.columns = [];
  importDraft.rows = [];
  document.getElementById("report-file").value = "";
}

function saveImportedTable() {
  const schoolId = importDraft.schoolId || state.school;
  if (!schoolTables[schoolId]) return;

  if (state.school !== schoolId) {
    commitSchoolTable();
  }

  const copied = cloneTableData(importDraft);
  schoolTables[schoolId] = {
    columns: copied.columns,
    rows: copied.rows,
    imported: true,
  };

  const titleInput = document.getElementById("import-title-input").value.trim();
  const title = titleInput || protocolTitleFromFile(importDraft.fileName);
  const byYear = PROTOCOL_TITLES_BY_SCHOOL[schoolId];
  if (byYear?.[state.year] && !byYear[state.year].includes(title)) {
    byYear[state.year].unshift(title);
  }

  if (!schoolDocuments[schoolId]) schoolDocuments[schoolId] = [];
  schoolDocuments[schoolId].unshift({
    name: title,
    type: "EXCEL",
    date: todayLabel(),
  });

  closeImportModal();
  state.school = schoolId;
  state.scope = "school";
  state.protocolIndex = 0;
  state.listedIndex = 0;
  bindSchoolTable();
  showView("protocols");
  updateSchoolUi();
  renderDocuments();
  renderStudents();
  renderProtocolHeaders();
  renderSchoolProtocolMenu();
  renderSubjectTabs();
  renderReportSubjectNav();
  renderReportPreview();

  const block = document.getElementById("protocol-block");
  block.classList.remove("is-collapsed");
  document.getElementById("protocols-toggle-label").textContent = "Скрыть";
  document.getElementById("protocols-toggle-btn").setAttribute("aria-expanded", "true");
  showToast("Протокол сохранён");
}

document.getElementById("report-file").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = parseExcelTable(new Uint8Array(reader.result));
      openImportModal(file.name, parsed);
    } catch (error) {
      alert(error.message || "Не удалось прочитать Excel-файл");
      event.target.value = "";
    }
  };
  reader.onerror = () => {
    alert("Не удалось прочитать файл");
    event.target.value = "";
  };
  reader.readAsArrayBuffer(file);
});

document.getElementById("import-table-wrap").addEventListener("click", (event) => {
  const deleteBtn = event.target.closest("[data-delete-col]");
  if (deleteBtn) {
    event.preventDefault();
    deleteImportColumn(Number(deleteBtn.dataset.deleteCol));
    return;
  }
  const insertBtn = event.target.closest("[data-insert-col]");
  if (insertBtn) {
    event.preventDefault();
    insertImportColumn(Number(insertBtn.dataset.insertCol));
  }
});

document.getElementById("import-add-col").addEventListener("click", () => {
  insertImportColumn(importDraft.columns.length);
});

document.getElementById("import-table-wrap").addEventListener("dblclick", (event) => {
  if (event.target.closest(".excel-col-btn")) return;
  const header = event.target.closest("[data-import-col]");
  if (header) {
    event.preventDefault();
    const col = Number(header.dataset.importCol);
    startInlineEdit(header, event, (value) => {
      if (Number.isNaN(col)) return;
      importDraft.columns[col] = value || `Столбец ${col + 1}`;
      header.textContent = importDraft.columns[col];
    });
    return;
  }
  const cell = event.target.closest("td.is-editable");
  if (!cell) return;
  event.preventDefault();
  startInlineEdit(cell, event, (value) => {
    const row = importDraft.rows.find((item) => String(item.id) === cell.dataset.id);
    const col = Number(cell.dataset.col);
    if (row && !Number.isNaN(col)) row.cells[col] = value;
  });
});

document.getElementById("import-save").addEventListener("click", saveImportedTable);
document.getElementById("import-cancel").addEventListener("click", closeImportModal);
document.getElementById("import-modal").addEventListener("click", (event) => {
  if (event.target.id === "import-modal") closeImportModal();
});

document.getElementById("import-school-trigger").addEventListener("click", (event) => {
  event.stopPropagation();
  const dropdown = event.currentTarget.closest(".dropdown");
  const willOpen = !dropdown.classList.contains("is-open");
  closeDropdowns();
  dropdown.classList.toggle("is-open", willOpen);
});

document.getElementById("import-school-menu").addEventListener("click", (event) => {
  const option = event.target.closest("[role='option']");
  if (!option) return;
  event.stopPropagation();
  importDraft.schoolId = option.dataset.value;
  renderImportSchoolSelect();
  closeDropdowns();
});

document.getElementById("protocol-search")?.addEventListener("input", (event) => {
  state.search = event.target.value;
  state.page = 1;
  renderProtocolHeaders();
  renderStudents();
});

document.getElementById("filter-score-op")?.addEventListener("change", syncScoreFilterUi);

document.getElementById("clear-filters")?.addEventListener("click", resetFilters);

document.getElementById("page-prev")?.addEventListener("click", () => {
  if (state.page > 1) {
    state.page -= 1;
    renderStudents();
  }
});

document.getElementById("page-next")?.addEventListener("click", () => {
  const pages = Math.max(1, Math.ceil(visibleTableRows().length / state.pageSize));
  if (state.page < pages) {
    state.page += 1;
    renderStudents();
  }
});

["stats-year", "stats-school", "stats-threshold"].forEach((id) => {
  document.getElementById(id)?.addEventListener("change", renderStats);
  document.getElementById(id)?.addEventListener("input", renderStats);
});

document.getElementById("stats-schools-body")?.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-school]");
  if (!row) return;
  setSchool(row.dataset.school);
  showView("protocols");
});

document.getElementById("settings-save")?.addEventListener("click", () => {
  const name = document.getElementById("settings-name")?.value.trim() || "Администратор";
  document.querySelector(".profile-name").textContent = name;
  showToast("Настройки сохранены");
});

bindSchoolTable();
populateFilterOptions();
renderYearTabs("year-tabs", true);
renderYearTabs("school-year-tabs", true);
renderSchoolSelect();
renderSchoolProtocolMenu();
updateSchoolUi();
renderSubjectTabs();
renderReportSubjectNav();
renderStudents();
renderProtocolHeaders();
renderDocuments();
renderReportPreview();
renderStats();
updateFilterBadge();
