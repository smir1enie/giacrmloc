const YEARS = ["2026", "2025", "2024"];

const moreIcon = `
  <button class="more-actions" type="button" aria-label="Действия">
    <span class="icon icon-16">
      <img src="./assets/icons/more-vertical.svg" width="16" height="16" alt="" />
    </span>
  </button>
`;

const SUBJECTS = [];
const SCHOOLS = [];
const schoolDocuments = {};

function formatDocDate(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value || todayLabel();
  return `${match[3]}.${match[2]}.${match[1]}`;
}

function currentDocuments() {
  if (!schoolDocuments[state.school]) schoolDocuments[state.school] = [];
  return schoolDocuments[state.school];
}

function protocolTitleForSubject(subject) {
  return `Протокол проверки результатов государственной итоговой аттестации “${subject}”`;
}

const PROTOCOL_TITLES_BY_YEAR = {
  "2026": [],
  "2025": [],
  "2024": [],
};

function copyTitlesByYear() {
  return {
    "2026": [],
    "2025": [],
    "2024": [],
  };
}

const PROTOCOL_TITLES_BY_SCHOOL = {};

function currentProtocolTitles() {
  const byYear = PROTOCOL_TITLES_BY_SCHOOL[state.school] || PROTOCOL_TITLES_BY_YEAR;
  return byYear[state.year] || [];
}

const API_BASE = "";
let apiReady = false;
let protocolCatalog = [];
let importFileBase64 = "";

async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || response.statusText);
  return response.json();
}

async function apiSend(path, method, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || response.statusText);
  return data;
}

async function refreshCatalog() {
  if (!apiReady) return;
  const params = new URLSearchParams();
  if (state.scope === "year" || state.scope === "school") params.set("year", state.year);
  if (state.scope === "school") params.set("school", state.school);
  if (state.search.trim()) params.set("q", state.search.trim());
  protocolCatalog = await apiGet(`/api/protocols?${params.toString()}`);
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
  if (apiReady) {
    return protocolCatalog
      .filter((item) => {
        if (state.scope === "school" && item.school_id !== state.school) return false;
        if (state.scope === "year" && String(item.year) !== String(state.year)) return false;
        if (state.filters.subject !== "all" && item.subject !== state.filters.subject) return false;
        return true;
      })
      .map((item, listedIndex) => ({
        listedIndex,
        protocolId: item.id,
        schoolId: item.school_id,
        schoolName: item.school_name,
        year: String(item.year),
        index: listedIndex,
        title: item.title,
        subject: item.subject,
        studentCount: item.student_count,
      }));
  }
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
  fillSelect(
    "filter-subject",
    [...new Set([...(apiReady ? protocolCatalog.map((item) => item.subject) : []), ...SUBJECTS].filter(Boolean))],
    state.filters.subject
  );
  const roomIndex = columnIndexBy(/аудитор/i);
  const rooms = roomIndex < 0 ? [] : [...new Set(tableData.rows.map((row) => String(row.cells[roomIndex] || "")).filter(Boolean))];
  fillSelect("filter-room", rooms, state.filters.room);
  const statsSchool = document.getElementById("stats-school");
  if (statsSchool) {
    const current = statsSchool.value || "all";
    statsSchool.innerHTML = [`<option value="all">Все школы</option>`]
      .concat(SCHOOLS.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`))
      .join("");
    statsSchool.value = [...statsSchool.options].some((opt) => opt.value === current) ? current : "all";
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
  if (apiReady) refreshCatalog().then(() => {
    renderProtocolHeaders();
    renderStudents();
  });
  else {
    renderProtocolHeaders();
    renderStudents();
  }
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
  subject: "",
  protocolIndex: 0,
  listedIndex: null,
  school: "1",
  scope: "all",
  search: "",
  protocolId: null,
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
  const yearList = [...new Set([...YEARS, ...protocolCatalog.map((item) => String(item.year))])].sort().reverse();
  const years = withAll ? ["all", ...yearList] : includeAll ? yearList : ["2026", "2025"];
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
  if (apiReady) {
    const labels = protocolCatalog
      .filter((item) => state.scope !== "school" || item.school_id === state.school)
      .map((item) => item.subject)
      .filter(Boolean);
    return [...new Set(labels.length ? labels : SUBJECTS)];
  }
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
  renderReportTitleOptions();
}

function renderReportTitleOptions() {
  const menu = document.querySelector('[data-dropdown="report-title"] .dropdown-menu');
  const label = document.getElementById("report-title-label");
  if (!menu || !label) return;
  const subjects = schoolReportSubjects();
  if (!subjects.length) {
    menu.innerHTML = "";
    label.textContent = "Нет протоколов";
    return;
  }
  if (!subjects.includes(state.subject)) state.subject = subjects[0];
  menu.innerHTML = subjects
    .map((subject) => {
      const title = protocolTitleForSubject(subject);
      return `<li role="option" aria-selected="${subject === state.subject}">${escapeHtml(title)}</li>`;
    })
    .join("");
  label.textContent = protocolTitleForSubject(state.subject);
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

function cloneTableData(data) {
  return {
    columns: [...data.columns],
    rows: data.rows.map((row) => ({ id: row.id, cells: [...row.cells] })),
  };
}

const tableData = {
  columns: [],
  rows: [],
  imported: true,
};

const schoolTables = {};

function currentSchool() {
  return SCHOOLS.find((school) => school.id === state.school) || SCHOOLS[0] || { id: "", name: "Школа", oo: "", msu: "", city: "", ppe: "" };
}

function bindSchoolTable() {
  if (!schoolTables[state.school]) {
    schoolTables[state.school] = apiReady
      ? { columns: [], rows: [], imported: true }
      : { columns: [...DEFAULT_COLUMNS], rows: [], imported: false };
  }
  const stored = schoolTables[state.school];
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

function renderSchoolNav() {
  const root = document.querySelector('[data-group="schools"] .nav-subs');
  if (!root) return;
  const allActive = state.scope !== "school";
  root.innerHTML = [
    `<button class="nav-sub${allActive ? " is-active" : ""}" type="button" data-school-nav="all">Все школы</button>`,
    ...SCHOOLS.map(
      (school) =>
        `<button class="nav-sub${state.scope === "school" && state.school === school.id ? " is-active" : ""}" type="button" data-school-nav="${school.id}">${escapeHtml(school.name)}</button>`
    ),
  ].join("");
}

function renderSchoolsTable() {
  const body = document.getElementById("schools-body");
  if (!body) return;
  if (!SCHOOLS.length) {
    body.innerHTML = `<tr><td colspan="5">Нет школ</td></tr>`;
    return;
  }
  body.innerHTML = SCHOOLS.map((school) => {
    const status = !school.status || school.status === "active" ? "Активна" : school.status;
    const selected = state.scope === "school" && school.id === state.school;
    return `<tr data-school="${school.id}"${selected ? " class=\"is-selected\"" : ""}>
      <td>${escapeHtml(school.oo || "")}</td>
      <td>${escapeHtml(school.ppe || "—")}</td>
      <td>${escapeHtml(school.name)}</td>
      <td>${escapeHtml(school.city || "")}</td>
      <td>${escapeHtml(status)}</td>
    </tr>`;
  }).join("");
}

function renderSchoolSelect() {
  const menu = document.getElementById("school-select-menu");
  const label = document.getElementById("school-label");
  if (!menu || !label) return;
  const allSelected = state.scope !== "school";
  const school = currentSchool();
  label.textContent = allSelected ? "Все школы" : school.name;
  menu.innerHTML = [`<li role="option" data-value="all" aria-selected="${allSelected}">Все школы</li>`]
    .concat(
      SCHOOLS.map(
        (item) => `
      <li role="option" data-value="${item.id}" aria-selected="${!allSelected && item.id === state.school}">${escapeHtml(item.name)}</li>
    `
      )
    )
    .join("");
}

function renderSchoolProtocolMenu() {
  const root = document.getElementById("school-protocol-headers");
  if (!root) return;
  const items = apiReady
    ? protocolCatalog.filter((item) => state.scope !== "school" || item.school_id === state.school)
    : currentProtocolTitles().map((title, index) => ({ title, index }));
  root.innerHTML = items
    .map(
      (item, index) => `
      <div class="protocol-acc" data-school-protocol="${item.id || index}">
        <button class="protocol-acc-head" type="button">
          <span class="protocol-acc-title">${escapeHtml(item.subject || item.title)}</span>
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
  if (reportsTitle) {
    reportsTitle.textContent = state.scope === "school" ? `Отчёты · ${school.name}` : "Отчёты · Все школы";
  }
  const schoolsTitle = document.getElementById("schools-page-title");
  if (schoolsTitle) schoolsTitle.textContent = state.scope === "school" ? school.name : "Школы";
  document.querySelectorAll("[data-school-nav]").forEach((btn) => {
    btn.classList.toggle("is-active", state.scope === "school" && btn.dataset.schoolNav === state.school);
  });
  renderSchoolSelect();
  renderSchoolNav();
  renderSchoolsTable();
  document.querySelectorAll("[data-year-nav]").forEach((btn) => {
    btn.classList.toggle("is-active", state.scope !== "all" && btn.dataset.yearNav === state.year);
  });
}

async function setSchool(id) {
  commitSchoolTable();
  if (id === "all") {
    state.scope = state.scope === "all" ? "all" : "year";
    state.listedIndex = null;
    state.protocolId = null;
    if (apiReady) await refreshCatalog();
    updateSchoolUi();
    renderYearTabs("school-year-tabs", true);
    renderSchoolProtocolMenu();
    const subjects = schoolReportSubjects();
    if (!subjects.includes(state.subject) && subjects.length) state.subject = subjects[0];
    renderProtocolHeaders();
    renderStudents();
    renderDocuments();
    renderSubjectTabs();
    renderReportSubjectNav();
    renderReportPreview();
    return;
  }
  state.school = id;
  state.scope = "school";
  state.listedIndex = null;
  bindSchoolTable();
  if (apiReady) await refreshCatalog();
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
  schoolId: "all",
  columns: [],
  rows: [],
};

function klassColumnIndex(columns) {
  return columns.findIndex((name) => /класс/i.test(name));
}

function visibleTableRows() {
  const klassIndex = klassColumnIndex(tableData.columns);
  const scoreIndex = (() => {
    const test = columnIndexBy(/тестов/i);
    return test >= 0 ? test : columnIndexBy(/балл/i);
  })();
  const markIndex = columnIndexBy(/оценк/i);
  const roomIndex = columnIndexBy(/аудитор/i);
  const msuIndex = columnIndexBy(/мсу/i);
  const ooIndex = columnIndexBy(/код оо|^оо$/i);
  const query = state.search.trim().toLowerCase();
  return tableData.rows.filter((row) => {
    const klass = String(row.cells[klassIndex] || "");
    if (!query && state.grade !== "all" && klassIndex >= 0 && klass && !klass.startsWith(state.grade)) return false;
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

async function loadProtocolTable(protocolId) {
  const data = await apiGet(`/api/protocols/${protocolId}`);
  tableData.columns = data.columns || [];
  tableData.rows = (data.students || []).map((row) => ({ id: row.id, cells: row.cells || [] }));
  tableData.imported = true;
  const schoolId = data.school_id;
  schoolTables[schoolId] = {
    columns: tableData.columns,
    rows: tableData.rows,
    imported: true,
  };
  return data;
}

async function activateListedProtocol(listedIndex) {
  const item = listedProtocols()[listedIndex];
  if (!item) return;
  if (state.school !== item.schoolId) {
    commitSchoolTable();
    state.school = item.schoolId;
    bindSchoolTable();
  }
  state.year = String(item.year);
  state.protocolIndex = item.index;
  state.listedIndex = listedIndex;
  state.protocolId = item.protocolId || null;
  openSchoolGroups.add(item.schoolId);
  if (item.protocolId && apiReady) {
    try {
      await loadProtocolTable(item.protocolId);
    } catch (error) {
      showToast(error.message || "Не удалось открыть протокол", "error");
    }
  }
  renderStudents();
}

function protocolAccordionHtml(item, options = {}) {
  const open = item.listedIndex === state.listedIndex;
  const showSchool = options.showSchool !== false;
  return `
    <div class="protocol-acc${open ? " is-open" : ""}" data-listed="${item.listedIndex}" data-protocol="${item.index}" data-protocol-id="${item.protocolId || ""}" data-item-school="${item.schoolId}" data-item-year="${item.year}">
      <div class="protocol-acc-head">
        <div class="protocol-acc-main">
          <span class="protocol-acc-title">${escapeHtml(protocolEntryLabel(item))}</span>
          <div class="protocol-acc-meta">
            ${showSchool ? `<span class="chip">${escapeHtml(item.schoolName)}</span>` : ""}
            <span class="chip is-year">${escapeHtml(item.year)}</span>
            ${item.studentCount != null ? `<span class="chip is-count">${item.studentCount}</span>` : ""}
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

async function deleteListedProtocol(listedIndex) {
  const item = listedProtocols()[listedIndex];
  if (!item) return;
  if (!confirm(`Удалить протокол «${item.subject || item.title}»?`)) return;
  if (item.protocolId && apiReady) {
    try {
      await apiSend(`/api/protocols/${item.protocolId}`, "DELETE");
      await refreshCatalog();
    } catch (error) {
      showToast(error.message || "Не удалось удалить протокол", "error");
      return;
    }
  } else {
    const list = PROTOCOL_TITLES_BY_SCHOOL[item.schoolId]?.[item.year];
    if (list) list.splice(item.index, 1);
  }
  state.listedIndex = null;
  state.protocolIndex = null;
  state.protocolId = null;
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

async function renderStats() {
  const cards = document.getElementById("stats-cards");
  const schoolsBody = document.getElementById("stats-schools-body");
  const studentsBody = document.getElementById("stats-students-body");
  if (!cards || !schoolsBody || !studentsBody) return;
  populateFilterOptions();
  const threshold = Number(document.getElementById("stats-threshold")?.value || 59);
  let rows = collectStatRows();
  let protocolCount = protocolCountForStats();
  if (apiReady) {
    try {
      const data = await apiGet(
        `/api/stats?year=${encodeURIComponent(document.getElementById("stats-year")?.value || "all")}&school=${encodeURIComponent(document.getElementById("stats-school")?.value || "all")}&threshold=${threshold}`
      );
      rows = data.rows || [];
      protocolCount = data.protocolCount || 0;
    } catch (error) {
      showToast(error.message || "Не удалось загрузить статистику", "error");
    }
  }
  const avg = rows.length ? rows.reduce((sum, row) => sum + row.score, 0) / rows.length : 0;
  const passed = rows.filter((row) => Number(row.mark) >= 3 || row.score >= 32).length;
  const high = rows.filter((row) => row.score > threshold);
  cards.innerHTML = `
    <div class="stat-card"><div class="stat-value">${rows.length}</div><div class="stat-label">Участников</div></div>
    <div class="stat-card"><div class="stat-value">${new Set(rows.map((row) => row.schoolId)).size}</div><div class="stat-label">Школ</div></div>
    <div class="stat-card"><div class="stat-value">${avg ? avg.toFixed(1) : "—"}</div><div class="stat-label">Средний балл</div></div>
    <div class="stat-card"><div class="stat-value">${protocolCount}</div><div class="stat-label">Протоколов</div></div>
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

async function renderDocuments() {
  const body = document.getElementById("docs-body");
  if (!body) return;
  let docs = currentDocuments();
  if (apiReady) {
    try {
      const items = await apiGet(`/api/documents?school=${encodeURIComponent(state.school)}`);
      docs = items.map((doc) => ({
        name: doc.name,
        type: doc.format || "EXCEL",
        date: formatDocDate(doc.created_at),
      }));
    } catch {
      docs = [];
    }
  }
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

async function renderAllStudents() {
  const body = document.getElementById("students-body");
  const subtitle = document.getElementById("students-page-subtitle");
  if (!body) return;
  const query = document.getElementById("students-search")?.value.trim() || "";
  let rows = [];
  if (apiReady) {
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      rows = await apiGet(`/api/students?${params.toString()}`);
    } catch (error) {
      showToast(error.message || "Не удалось загрузить учеников", "error");
    }
  }
  if (subtitle) {
    subtitle.textContent = rows.length ? `${rows.length} учеников · все школы` : "Нет загруженных учеников";
  }
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="11">Нет учеников. Загрузите Excel-файл в протоколы.</td></tr>`;
    return;
  }
  body.innerHTML = rows
    .map(
      (row, index) => `
      <tr data-protocol-id="${row.protocol_id || ""}" data-school-id="${row.school_id || ""}">
        <td>${index + 1}</td>
        <td>${escapeHtml(row.last_name || "")}</td>
        <td>${escapeHtml(row.first_name || "")}</td>
        <td>${escapeHtml(row.middle_name || "")}</td>
        <td>${escapeHtml(row.klass || "")}</td>
        <td>${escapeHtml(row.school_name || "")}</td>
        <td>${escapeHtml(row.oo || "")}</td>
        <td>${escapeHtml(row.subject || "")}</td>
        <td>${escapeHtml(row.year || "")}</td>
        <td>${row.primary_score ?? "—"}</td>
        <td>${row.test_score ?? "—"}</td>
      </tr>
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
  const match = String(title || "").match(/[“"«]([^”"»]+)[”"»]/);
  return match ? match[1] : state.subject || "";
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
      <div><span>Код ОО:</span> <b>${escapeHtml(currentSchool().oo || "—")}</b></div>
      <div><span>Код ППЭ:</span> <b>${escapeHtml(currentSchool().ppe || cellByHeader(rows[0] || { cells: [] }, "ППЭ") || "—")}</b></div>
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

async function setYear(year) {
  if (year === "all") {
    state.scope = "all";
    state.listedIndex = null;
    state.protocolIndex = null;
    if (apiReady) await refreshCatalog();
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
  if (apiReady) await refreshCatalog();
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
  ["protocols", "report", "stats", "schools", "students", "forms", "settings"].forEach((id) => {
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
  if (view === "students") {
    renderAllStudents();
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

document.querySelector('[data-group="schools"] .nav-subs')?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-school-nav]");
  if (!btn) return;
  setSchool(btn.dataset.schoolNav);
  showView("schools");
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

document.querySelector('[data-dropdown="report-title"] .dropdown-menu')?.addEventListener("click", (event) => {
  const option = event.target.closest("[role='option']");
  if (!option) return;
  event.stopPropagation();
  document.getElementById("report-title-label").textContent = option.textContent.trim();
  option.closest("[data-dropdown]").querySelectorAll("[role='option']").forEach((item) => {
    item.setAttribute("aria-selected", String(item === option));
  });
  closeDropdowns();
  setSubject(getReportSubject(option.textContent.trim()));
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

function bytesToBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return btoa(binary);
}

function todayLabel() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${now.getFullYear()}`;
}

function sheetToAoa(sheet) {
  const cells = Object.keys(sheet).filter((key) => key[0] !== "!");
  if (!cells.length) return [];
  let range = sheet["!ref"] ? XLSX.utils.decode_range(sheet["!ref"]) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
  cells.forEach((key) => {
    const cell = XLSX.utils.decode_cell(key);
    if (cell.r > range.e.r) range.e.r = cell.r;
    if (cell.c > range.e.c) range.e.c = cell.c;
  });
  sheet["!ref"] = XLSX.utils.encode_range(range);
  return XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
    blankrows: true,
  });
}

function firstNonEmpty(row) {
  return (row || []).map((cell) => String(cell || "").trim()).find((cell) => cell) || "";
}

function fillDownExcelRows(columns, rows) {
  const fillIdx = columns
    .map((name, index) => (/код оо|^оо$|мсу|ппэ|класс/i.test(name) ? index : -1))
    .filter((index) => index >= 0);
  if (!fillIdx.length) return rows;
  const prev = columns.map(() => "");
  return rows.map((row) => {
    const cells = columns.map((_, index) => String(row.cells[index] ?? "").trim());
    fillIdx.forEach((index) => {
      if (cells[index]) prev[index] = cells[index];
      else if (prev[index]) cells[index] = prev[index];
    });
    return { ...row, cells };
  });
}

function parseExcelTable(buffer) {
  if (typeof XLSX === "undefined") {
    throw new Error("Не удалось загрузить библиотеку Excel");
  }
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("В файле нет листов");
  const aoa = sheetToAoa(workbook.Sheets[sheetName]);
  if (!aoa.length) throw new Error("Файл пустой");

  const isHeader = (row) => {
    const joined = (row || []).map((cell) => String(cell || "")).join(" ").toLowerCase();
    return joined.includes("фамил") && (joined.includes("мсу") || joined.includes("код оо") || joined.includes("аудитор"));
  };
  const isFooter = (row) => /^(средние|минимальная граница|всего участников|дата создания)/i.test(firstNonEmpty(row));

  const blocks = [];
  let current = null;
  let title = "";
  let pendingSubject = "";
  let pendingDate = "";
  let year = state.year;

  const flush = () => {
    if (!current) return;
    current.rows = fillDownExcelRows(current.columns, current.rows);
    if (current.rows.length) blocks.push(current);
    current = null;
  };

  aoa.forEach((row) => {
    const cells = (row || []).map((cell) => String(cell ?? "").trim());
    const line = cells.filter(Boolean).join(" ");
    if (!line) return;
    if (!title && /протокол/i.test(line)) title = line;
    const subjectMatch = line.match(/\d+\s*-\s*(.+?)\s+(\d{4}[.\-]\d{2}[.\-]\d{2})\s*$/);
    if (subjectMatch) {
      pendingSubject = subjectMatch[1].trim();
      pendingDate = subjectMatch[2].replace(/-/g, ".");
      return;
    }
    const yearMatch = line.match(/\b(20\d{2})\b/);
    if (yearMatch) year = yearMatch[1];
    if (isHeader(cells)) {
      flush();
      const keep = cells.map((name, index) => (name ? index : -1)).filter((index) => index >= 0);
      current = {
        columns: keep.map((index) => cells[index]),
        keep,
        rows: [],
        subject: pendingSubject,
        examDate: pendingDate,
      };
      return;
    }
    if (!current || isFooter(cells)) return;
    const rowCells = current.keep.map((col) => cells[col] || "");
    if (rowCells.some((cell) => cell) && rowCells[0].toLowerCase() !== "№" && !rowCells.some((cell) => cell.toLowerCase() === "фамилия")) {
      current.rows.push({ id: current.rows.length + 1, cells: rowCells });
    }
  });
  flush();
  if (!blocks.length) throw new Error("В таблице нет строк с данными");

  const columns = blocks[0].columns;
  const rows = blocks.flatMap((block, blockIndex) =>
    block.rows.map((row, index) => ({ id: `${blockIndex + 1}-${index + 1}`, cells: row.cells }))
  );
  const rawRows = aoa.map((row) => (row || []).map((cell) => String(cell ?? "").trim()));
  return {
    columns,
    rows,
    sheetName,
    title,
    subject: blocks[0].subject || pendingSubject,
    examDate: blocks[0].examDate || pendingDate,
    year,
    rawRows,
    tableCount: blocks.length,
  };
}

function updateImportMeta() {
  const el = document.getElementById("import-modal-file");
  if (!el) return;
  const fileName = importDraft.fileName || "Таблица";
  const tables = importDraft.tableCount > 1 ? ` · ${importDraft.tableCount} таблиц в файле` : "";
  el.textContent = `${fileName} · ${importDraft.columns.length} столбцов · ${importDraft.rows.length} строк${tables}`;
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
  const allSelected = !importDraft.schoolId || importDraft.schoolId === "all";
  if (allSelected) importDraft.schoolId = "all";
  const school = SCHOOLS.find((item) => item.id === importDraft.schoolId);
  label.textContent = allSelected ? "Все школы" : school?.name || "Школа";
  menu.innerHTML = [`<li role="option" data-value="all" aria-selected="${allSelected}">Все школы</li>`]
    .concat(
      SCHOOLS.map(
        (item) => `
      <li role="option" data-value="${item.id}" aria-selected="${!allSelected && item.id === importDraft.schoolId}">${escapeHtml(item.name)}</li>
    `
      )
    )
    .join("");
  const split = document.getElementById("import-split-schools");
  if (split) split.checked = allSelected;
  const hint = document.getElementById("import-split-hint");
  if (hint) {
    hint.textContent = allSelected
      ? "Файл будет разложен по школам по коду ОО"
      : "Весь файл сохранится в выбранную школу";
  }
}

function openImportModal(fileName, parsed) {
  importDraft.fileName = fileName;
  importDraft.schoolId = state.scope === "school" ? state.school : "all";
  importDraft.columns = [...parsed.columns];
  importDraft.rows = parsed.rows.map((row) => ({ id: row.id, cells: [...row.cells] }));
  importDraft.subject = parsed.subject || "";
  importDraft.examDate = parsed.examDate || "";
  importDraft.year = parsed.year || state.year;
  importDraft.rawRows = parsed.rawRows || [];
  importDraft.tableCount = parsed.tableCount || 1;
  document.getElementById("import-modal-title").textContent = "Просмотр таблицы Excel";
  document.getElementById("import-title-input").value = parsed.title || protocolTitleFromFile(fileName);
  renderImportSchoolSelect();
  renderImportTable();
  document.getElementById("import-modal").classList.remove("hidden");
}

function closeImportModal() {
  document.getElementById("import-modal").classList.add("hidden");
  importDraft.fileName = "";
  importFileBase64 = "";
  importDraft.schoolId = state.school;
  importDraft.columns = [];
  importDraft.rows = [];
  importDraft.rawRows = [];
  importDraft.tableCount = 1;
  document.getElementById("report-file").value = "";
}

async function saveImportedTable() {
  const titleInput = document.getElementById("import-title-input").value.trim();
  const title = titleInput || protocolTitleFromFile(importDraft.fileName);
  const splitBySchool = importDraft.schoolId === "all";
  const schoolId = splitBySchool ? undefined : importDraft.schoolId || state.school;

  if (apiReady) {
    try {
      const result = await apiSend("/api/imports", "POST", {
        schoolId,
        year: importDraft.year || state.year,
        subject: importDraft.subject || protocolSubject(title),
        title,
        exam_date: importDraft.examDate || "",
        fileName: importDraft.fileName,
        fileBase64: importFileBase64 || undefined,
        splitBySchool,
        columns: importDraft.columns,
        rows: importDraft.rows.map((row) => row.cells),
        rawRows: importDraft.rawRows?.length ? importDraft.rawRows : undefined,
      });
      const schools = await apiGet("/api/schools");
      if (schools?.length) SCHOOLS.splice(0, SCHOOLS.length, ...schools);
      await refreshCatalog();
      closeImportModal();
      const first = result.protocols?.[0];
      if (first) {
        state.school = first.schoolId;
        state.scope = splitBySchool ? "year" : "school";
        state.year = String(importDraft.year || state.year);
        state.listedIndex = 0;
        state.protocolId = first.protocolId;
        await loadProtocolTable(first.protocolId);
      }
      showView("protocols");
      updateSchoolUi();
      renderDocuments();
      renderStudents();
      renderProtocolHeaders();
      renderSchoolProtocolMenu();
      renderSubjectTabs();
      renderReportSubjectNav();
      renderReportPreview();
      renderStats();
      const block = document.getElementById("protocol-block");
      block.classList.remove("is-collapsed");
      document.getElementById("protocols-toggle-label").textContent = "Скрыть";
      document.getElementById("protocols-toggle-btn").setAttribute("aria-expanded", "true");
      showToast(`Сохранено в базу: ${result.protocols?.length || 0} протоколов`);
      return;
    } catch (error) {
      showToast(error.message || "Не удалось сохранить в базу", "error");
      return;
    }
  }

  if (splitBySchool) {
    showToast("Чтобы разложить файл по школам, откройте CRM через сервер", "error");
    return;
  }
  if (!schoolId) return;
  if (!schoolTables[schoolId]) {
    schoolTables[schoolId] = { columns: [], rows: [], imported: true };
  }
  if (state.school !== schoolId) commitSchoolTable();
  const copied = cloneTableData(importDraft);
  schoolTables[schoolId] = {
    columns: copied.columns,
    rows: copied.rows,
    imported: true,
  };
  if (!PROTOCOL_TITLES_BY_SCHOOL[schoolId]) PROTOCOL_TITLES_BY_SCHOOL[schoolId] = copyTitlesByYear();
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
      const bytes = new Uint8Array(reader.result);
      importFileBase64 = bytesToBase64(bytes);
      const parsed = parseExcelTable(bytes);
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

let searchTimer = null;
document.getElementById("protocol-search")?.addEventListener("input", (event) => {
  state.search = event.target.value;
  state.page = 1;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (apiReady) await refreshCatalog();
    renderProtocolHeaders();
    renderStudents();
  }, 200);
});

let studentsSearchTimer = null;
document.getElementById("students-search")?.addEventListener("input", () => {
  clearTimeout(studentsSearchTimer);
  studentsSearchTimer = setTimeout(() => renderAllStudents(), 200);
});

document.getElementById("students-body")?.addEventListener("click", async (event) => {
  const row = event.target.closest("tr[data-protocol-id]");
  if (!row || !row.dataset.protocolId) return;
  const protocolId = Number(row.dataset.protocolId);
  const schoolId = row.dataset.schoolId;
  if (schoolId) {
    state.school = schoolId;
    state.scope = "school";
  }
  if (apiReady) {
    await refreshCatalog();
    const item = listedProtocols().find((protocol) => protocol.protocolId === protocolId);
    if (item) await activateListedProtocol(item.listedIndex);
    else await loadProtocolTable(protocolId);
  }
  showView("protocols");
  const block = document.getElementById("protocol-block");
  if (block) {
    block.classList.remove("is-collapsed");
    document.getElementById("protocols-toggle-label").textContent = "Скрыть";
    document.getElementById("protocols-toggle-btn")?.setAttribute("aria-expanded", "true");
  }
  updateSchoolUi();
  renderProtocolHeaders();
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

document.getElementById("settings-wipe-db")?.addEventListener("click", async () => {
  if (!confirm("Очистить все протоколы, таблицы и учеников? Справочник школ останется. Сначала будет сохранена копия базы.")) return;
  if (!apiReady) {
    showToast("Откройте CRM через сервер, чтобы очистить базу", "error");
    return;
  }
  try {
    const result = await apiSend("/api/reset", "POST", {});
    protocolCatalog = [];
    Object.keys(schoolTables).forEach((id) => {
      schoolTables[id] = { columns: [], rows: [], imported: true };
    });
    tableData.columns = [];
    tableData.rows = [];
    tableData.imported = true;
    state.listedIndex = null;
    state.protocolId = null;
    await refreshCatalog();
    renderProtocolHeaders();
    renderStudents();
    renderAllStudents();
    renderDocuments();
    renderStats();
    renderSchoolProtocolMenu();
    showToast(`База очищена. Копия: ${result.backup || "сохранена"}`);
  } catch (error) {
    showToast(error.message || "Не удалось очистить базу", "error");
  }
});

document.getElementById("settings-wipe-uploads")?.addEventListener("click", async () => {
  if (!confirm("Удалить все загруженные Excel кроме последнего?")) return;
  if (!apiReady) {
    showToast("Откройте CRM через сервер, чтобы очистить uploads", "error");
    return;
  }
  try {
    const result = await apiSend("/api/reset-uploads", "POST", {});
    const kept = result.kept ? `Оставлен: ${result.kept}` : "Папка uploads пуста";
    showToast(`${kept}. Удалено: ${result.deleted ?? 0}`);
  } catch (error) {
    showToast(error.message || "Не удалось очистить uploads", "error");
  }
});

document.getElementById("settings-wipe-backups")?.addEventListener("click", async () => {
  if (!confirm("Удалить все бэкапы базы кроме двух последних?")) return;
  if (!apiReady) {
    showToast("Откройте CRM через сервер, чтобы очистить backups", "error");
    return;
  }
  try {
    const result = await apiSend("/api/reset-backups", "POST", {});
    const kept = Array.isArray(result.kept) && result.kept.length
      ? `Оставлены: ${result.kept.join(", ")}`
      : "Папка backups пуста";
    showToast(`${kept}. Удалено: ${result.deleted ?? 0}`);
  } catch (error) {
    showToast(error.message || "Не удалось очистить backups", "error");
  }
});

async function bootstrapFromApi() {
  try {
    const data = await apiGet("/api/bootstrap");
    if (data.schools?.length) SCHOOLS.splice(0, SCHOOLS.length, ...data.schools);
    protocolCatalog = data.protocols || [];
    apiReady = true;
    if (SCHOOLS.length && !SCHOOLS.some((item) => item.id === state.school)) {
      state.school = SCHOOLS[0].id;
    }
    const subjects = [...new Set(protocolCatalog.map((item) => item.subject).filter(Boolean))];
    if (subjects.length && !subjects.includes(state.subject)) state.subject = subjects[0];
    SCHOOLS.forEach((school) => {
      schoolTables[school.id] = { columns: [], rows: [], imported: true };
    });
    tableData.columns = [];
    tableData.rows = [];
    tableData.imported = true;
  } catch {
    apiReady = false;
  }
}

function renderApp() {
  bindSchoolTable();
  populateFilterOptions();
  renderYearTabs("year-tabs", true);
  renderYearTabs("school-year-tabs", true);
  renderSchoolSelect();
  renderSchoolNav();
  renderSchoolsTable();
  renderSchoolProtocolMenu();
  updateSchoolUi();
  renderSubjectTabs();
  renderReportSubjectNav();
  renderReportTitleOptions();
  renderStudents();
  renderProtocolHeaders();
  renderDocuments();
  renderReportPreview();
  renderStats();
  updateFilterBadge();
}

bootstrapFromApi().finally(renderApp);
