"use strict";
const STORAGE_KEY = "sciaticaDailyRecordsV1";
let records = loadRecords();
let editingDate = "";
let activeAudience = "student";

function loadRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidRecord) : [];
  } catch (error) {
    return [];
  }
}
function isValidRecord(record) {
  return record && /^\d{4}-\d{2}-\d{2}$/.test(record.date) &&
    Number.isFinite(Number(record.pain)) && Number(record.pain) >= 0 && Number(record.pain) <= 10 &&
    Number.isFinite(Number(record.study)) && Number(record.study) >= 0 && Number(record.study) <= 24 &&
    Number.isFinite(Number(record.breaks)) && Number(record.breaks) >= 0 &&
    Number.isFinite(Number(record.walking)) && Number(record.walking) >= 0 &&
    typeof record.notes === "string" &&
    (record.studySessions === undefined || (Array.isArray(record.studySessions) && record.studySessions.every(x => x && typeof x.subject === "string" && typeof x.topic === "string" && Number.isFinite(x.planned) && Number.isFinite(x.actual)))) &&
    (record.exercises === undefined || (Array.isArray(record.exercises) && record.exercises.every(x => x && typeof x.name === "string" && Number.isFinite(x.duration) && Number.isFinite(x.actual))));
}
function saveRecords() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    showStatus("formStatus", "Could not save. Browser storage may be full or unavailable.", true);
    return false;
  }
}
function showStatus(id, message, isError) {
  const element = document.getElementById(id);
  element.textContent = message;
  element.className = isError ? "status error" : "status";
}
function sortedRecords() {
  return records.slice().sort((a,b) => b.date.localeCompare(a.date));
}
function render() {
  const ordered = sortedRecords();
  const count = ordered.length;
  const painTotal = records.reduce((sum,item) => sum + Number(item.pain), 0);
  const studyTotal = records.reduce((sum,item) => sum + Number(item.study), 0);
  const walkTotal = records.reduce((sum,item) => sum + Number(item.walking), 0);
  document.getElementById("totalDays").textContent = count;
  document.getElementById("avgPain").textContent = count ? (painTotal / count).toFixed(1) + " / 10" : "—";
  document.getElementById("totalStudy").textContent = studyTotal.toFixed(2).replace(/\.00$/,"");
  document.getElementById("totalWalk").textContent = walkTotal;
  renderRows(ordered);
  renderInsights(ordered);
  renderMonthReport();
  renderPlanner();
}

function filteredRecords() {
  const query = document.getElementById("search").value.toLowerCase().trim();
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
  const mode = document.getElementById("sortRecords").value;
  const shown = records.filter(item =>
    (item.date.includes(query) || item.notes.toLowerCase().includes(query)) &&
    (!from || item.date >= from) && (!to || item.date <= to)
  );
  shown.sort((a,b) => {
    if (mode === "oldest") return a.date.localeCompare(b.date);
    if (mode === "pain-high") return Number(b.pain)-Number(a.pain) || b.date.localeCompare(a.date);
    if (mode === "study-high") return Number(b.study)-Number(a.study) || b.date.localeCompare(a.date);
    return b.date.localeCompare(a.date);
  });
  return shown;
}
function renderMonthReport() {
  const month = document.getElementById("reportMonth").value;
  const selected = month ? records.filter(item => item.date.startsWith(month)) : [];
  const count = selected.length;
  const avg = count ? (selected.reduce((sum,item)=>sum+Number(item.pain),0)/count).toFixed(1) : "—";
  const study = selected.reduce((sum,item)=>sum+Number(item.study),0);
  const walking = selected.reduce((sum,item)=>sum+Number(item.walking),0);
  document.getElementById("monthStats").innerHTML = [
    ["Days recorded",count],["Average pain rating",avg],["Study hours",study.toFixed(2)],["Walking minutes",walking],
    ["Walking breaks",selected.reduce((sum,item)=>sum+Number(item.breaks),0)],["Entries this month",count]
  ].map(([label,value])=>'<div class="report-cell"><span>'+label+'</span><strong>'+value+'</strong></div>').join("");
  document.getElementById("monthCaption").textContent = month ? (count ? "Based on "+count+" saved "+(count===1?"entry":"entries")+" for "+month+". These are records, not a medical assessment." : "No entries have been saved for "+month+".") : "Choose a month to see its report.";
}

function renderRows(ordered) {
  const shown = filteredRecords();
  const body = document.getElementById("recordRows");
  body.textContent = "";
  shown.forEach(item => {
    const row = document.createElement("tr");
    [item.date, item.pain, item.study, item.breaks, item.walking].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    const actions = document.createElement("td");
    actions.className = "actions-cell";
    const edit = document.createElement("button");
    edit.type = "button"; edit.textContent = "Edit"; edit.addEventListener("click", () => editRecord(item.date));
    const remove = document.createElement("button");
    remove.type = "button"; remove.textContent = "Delete"; remove.className = "danger";
    remove.addEventListener("click", () => deleteRecord(item.date));
    actions.append(edit, remove); row.appendChild(actions); body.appendChild(row);
  });
  document.getElementById("entryCount").textContent = shown.length + (shown.length === 1 ? " ENTRY" : " ENTRIES");
  document.getElementById("emptyState").hidden = shown.length !== 0;
  document.querySelector("#history table").hidden = shown.length === 0;
}
function renderInsights(ordered) {
  const recent = ordered.slice(0,7).reverse();
  const chart = document.getElementById("painChart");
  const activity = document.getElementById("activitySummary");
  chart.textContent = ""; activity.textContent = "";
  if (!recent.length) {
    chart.innerHTML = '<div class="empty">Add entries to see your chart.</div>';
    activity.innerHTML = '<div class="empty">Your activity summary will appear here.</div>';
    return;
  }
  recent.forEach(item => {
    const line = document.createElement("div"); line.className = "bar-row";
    const date = document.createElement("span"); date.textContent = item.date.slice(5);
    const track = document.createElement("div"); track.className = "track";
    const fill = document.createElement("div"); fill.className = "fill";
    fill.style.width = (Number(item.pain) * 10) + "%"; track.appendChild(fill);
    const value = document.createElement("strong"); value.textContent = item.pain;
    line.append(date,track,value); chart.appendChild(line);
  });
  const totalStudy = recent.reduce((sum,item) => sum + Number(item.study),0);
  const totalWalk = recent.reduce((sum,item) => sum + Number(item.walking),0);
  const totalBreaks = recent.reduce((sum,item) => sum + Number(item.breaks),0);
  [["Days included",recent.length],["Study hours",totalStudy.toFixed(2)],["Walking minutes",totalWalk],["Walking breaks",totalBreaks]].forEach(pair => {
    const line = document.createElement("div"); line.className = "bar-row";
    const label = document.createElement("span"); label.textContent = pair[0];
    const track = document.createElement("div"); track.className = "track";
    const fill = document.createElement("div"); fill.className = "fill";
    const max = pair[0] === "Days included" ? 7 : pair[0] === "Study hours" ? 56 : pair[0] === "Walking minutes" ? 420 : 70;
    fill.style.width = Math.min(100, Number(pair[1]) / max * 100) + "%"; track.appendChild(fill);
    const value = document.createElement("strong"); value.textContent = pair[1];
    line.append(label,track,value); activity.appendChild(line);
  });
}
function plannerRecord() {
  const date = document.getElementById("plannerDate").value;
  return records.find(item => item.date === date);
}
function renderPlanner() {
  const date = document.getElementById("plannerDate");
  if (!date.value) date.value = document.getElementById("date").value || new Date().toLocaleDateString("en-CA");
  const record = plannerRecord();
  document.getElementById("plannerStatusText").value = record ? "Daily record found" : "Save a daily entry for this date first";
  const sessions = record && Array.isArray(record.studySessions) ? record.studySessions : [];
  const exercises = record && Array.isArray(record.exercises) ? record.exercises : [];
  const makeList = (id, items, type) => {
    const host = document.getElementById(id); host.textContent = "";
    if (!items.length) { const empty = document.createElement("div"); empty.className = "empty"; empty.textContent = type === "study" ? "No sessions recorded for this date." : "No exercises recorded for this date."; host.appendChild(empty); return; }
    items.forEach((item,index) => {
      const line = document.createElement("div"); line.className = "notice";
      const detail = document.createElement("div");
      if (type === "study") detail.textContent = item.subject + " · " + item.topic + " · planned " + item.planned + " min · actual " + item.actual + " min";
      else detail.textContent = item.name + " · advised " + item.duration + " min · reps " + (item.reps ?? "—") + " · sets " + (item.sets ?? "—") + " · actual " + item.actual + " min" + (item.timing ? " · " + item.timing : "");
      const remove = document.createElement("button"); remove.type = "button"; remove.className = "danger"; remove.textContent = "Remove";
      remove.addEventListener("click", () => { const current = plannerRecord(); if (!current) return; current[type === "study" ? "studySessions" : "exercises"].splice(index,1); if (saveRecords()) render(); });
      line.append(detail,remove); host.appendChild(line);
    });
  };
  makeList("studySessionList",sessions,"study"); makeList("exerciseList",exercises,"exercise");
  const planned = sessions.reduce((sum,x)=>sum+Number(x.planned),0), actual = sessions.reduce((sum,x)=>sum+Number(x.actual),0);
  const exerciseTime = exercises.reduce((sum,x)=>sum+Number(x.actual),0);
  const summaryItems = [["Study sessions",sessions.length],["Planned study",planned+" min"],["Actual study",actual+" min"],["Exercises recorded",exercises.length],["Exercise time logged",exerciseTime+" min"],["Walking breaks",record ? record.breaks : 0]];
  const visibleSummaryItems = document.body.dataset.audience === "adult"
    ? summaryItems.filter(([label]) => !["Study sessions","Planned study","Actual study"].includes(label))
    : summaryItems;
  document.getElementById("plannerSummary").innerHTML = visibleSummaryItems.map(([label,value])=>'<div class="report-cell"><span>'+label+'</span><strong>'+value+'</strong></div>').join("");
}
function savePlannerItem(type,item) {
  const record = plannerRecord();
  if (!record) { showStatus("plannerStatus","Save a daily entry for the selected date before adding planner items.",true); return; }
  const key = type === "study" ? "studySessions" : "exercises";
  if (!Array.isArray(record[key])) record[key] = [];
  record[key].push(item);
  if (saveRecords()) { render(); showStatus("plannerStatus",type === "study" ? "Study session saved." : "Exercise record saved.",false); }
}
document.getElementById("plannerDate").addEventListener("change",renderPlanner);
document.getElementById("addStudySession").addEventListener("click",() => {
  const subject=document.getElementById("studySubject").value.trim(), topic=document.getElementById("studyTopic").value.trim();
  const planned=Number(document.getElementById("plannedMinutes").value), actual=Number(document.getElementById("actualMinutes").value);
  if (!subject || !topic || !Number.isInteger(planned) || planned<1 || planned>1440 || !Number.isInteger(actual) || actual<0 || actual>1440) { showStatus("plannerStatus","Enter a subject, topic and valid study times.",true); return; }
  savePlannerItem("study",{subject,topic,planned,actual});
  document.getElementById("studySubject").value=""; document.getElementById("studyTopic").value=""; document.getElementById("plannedMinutes").value=""; document.getElementById("actualMinutes").value="";
});
document.getElementById("addExercise").addEventListener("click",() => {
  const name=document.getElementById("exerciseName").value.trim(), duration=Number(document.getElementById("exerciseDuration").value), actual=Number(document.getElementById("exerciseActual").value);
  const reps=document.getElementById("exerciseReps").value===""?null:Number(document.getElementById("exerciseReps").value);
  const sets=document.getElementById("exerciseSets").value===""?null:Number(document.getElementById("exerciseSets").value);
  if (!name || !Number.isInteger(duration) || duration<0 || duration>1440 || !Number.isInteger(actual) || actual<0 || actual>1440 || (reps!==null && (!Number.isInteger(reps)||reps<0||reps>1000)) || (sets!==null && (!Number.isInteger(sets)||sets<0||sets>100))) { showStatus("plannerStatus","Enter an exercise name and valid values from your clinician's advice.",true); return; }
  savePlannerItem("exercise",{name,duration,reps,sets,actual,timing:document.getElementById("exerciseTiming").value.trim(),notes:document.getElementById("exerciseNotes").value.trim()});
  ["exerciseName","exerciseDuration","exerciseReps","exerciseSets","exerciseTiming","exerciseNotes"].forEach(id=>document.getElementById(id).value="");
  document.getElementById("exerciseActual").value="0";
});
function resetForm() {
  document.getElementById("recordForm").reset();
  document.getElementById("date").value = new Date().toLocaleDateString("en-CA");
  document.getElementById("breaks").value = "0";
  document.getElementById("walking").value = "0";
  editingDate = "";
  document.getElementById("formTitle").textContent = "Add a daily entry";
  document.getElementById("saveButton").textContent = "Save entry";
  document.getElementById("cancelEdit").hidden = true;
}

function setAudience(mode) {
  const student = mode === "student";
  document.body.dataset.audience = mode;
  const studyHoursField = document.getElementById("study-hours-field");
  const studyHoursInput = document.getElementById("study");
  studyHoursField.hidden = !student;
  studyHoursInput.required = student;
  if (!student) studyHoursInput.value = "0";
  const studySection = document.getElementById("study-planner");
  const studyCard = document.getElementById("study-session-card");
  const exerciseCard = document.getElementById("exercise-card");
  const heading = studySection.querySelector("h2");
  const hint = studySection.querySelector(".hint");

  studySection.hidden = false;
  // Hide the complete study-session card in Adult view. Keep saved sessions
  // in local storage so switching back to Student view restores them.
  studyCard.hidden = !student;
  studyCard.style.display = student ? "" : "none";
  studyCard.setAttribute("aria-hidden", String(!student));
  exerciseCard.hidden = false;
  heading.textContent = student ? "Study & movement planner" : "Movement planner";
  hint.textContent = student
    ? "Plan subject-wise study sessions and record movement exactly as advised by your healthcare professional."
    : "Review daily movement records and record exercises exactly as advised by your healthcare professional.";

  document.getElementById("introDescription").textContent = student
    ? "A study-friendly view for organising subjects, study sessions, walking breaks and clinician-advised movement notes."
    : "A daily wellbeing view for reviewing symptoms, activity and clinician-advised movement notes.";
  document.getElementById("audienceStatus").textContent = student
    ? "Student section selected."
    : "Adult section selected.";
  document.getElementById("studentView").classList.toggle("primary", student);
  document.getElementById("adultView").classList.toggle("primary", !student);
  renderPlanner();
}

document.getElementById("studentView").addEventListener("click", () => setAudience("student"));
document.getElementById("adultView").addEventListener("click", () => setAudience("adult"));
setAudience("student");

function editRecord(date) {
  const item = records.find(record => record.date === date);
  if (!item) return;
  editingDate = date;
  ["date","pain","study","breaks","walking","notes"].forEach(key => document.getElementById(key).value = item[key]);
  document.getElementById("formTitle").textContent = "Edit daily entry";
  document.getElementById("saveButton").textContent = "Update entry";
  document.getElementById("cancelEdit").hidden = false;
  document.getElementById("entry").scrollIntoView({behavior:"smooth"});
}
function deleteRecord(date) {
  if (!confirm("Delete the entry for " + date + "? This cannot be undone.")) return;
  records = records.filter(item => item.date !== date);
  if (saveRecords()) { render(); showStatus("fileStatus","Entry deleted.",false); }
}
document.getElementById("recordForm").addEventListener("submit", event => {
  event.preventDefault();
  const item = {
    date:document.getElementById("date").value,
    pain:Number(document.getElementById("pain").value),
    study:Number(document.getElementById("study").value),
    breaks:Number(document.getElementById("breaks").value),
    walking:Number(document.getElementById("walking").value),
    notes:document.getElementById("notes").value.trim(),
    studySessions:(records.find(record => record.date === editingDate || record.date === document.getElementById("date").value) || {}).studySessions || [],
    exercises:(records.find(record => record.date === editingDate || record.date === document.getElementById("date").value) || {}).exercises || []
  };
  if (!isValidRecord(item)) { showStatus("formStatus","Please check the date and number ranges.",true); return; }
  const duplicate = records.some(record => record.date === item.date && record.date !== editingDate);
  if (duplicate && !confirm("An entry already exists for this date. Replace it?")) return;
  if (editingDate) records = records.filter(record => record.date !== editingDate);
  records = records.filter(record => record.date !== item.date);
  records.push(item);
  if (saveRecords()) { render(); resetForm(); showStatus("formStatus","Entry saved in this browser.",false); }
});
document.getElementById("cancelEdit").addEventListener("click",resetForm);
["search","fromDate","toDate","sortRecords"].forEach(id => document.getElementById(id).addEventListener(id==="search"?"input":"change",() => renderRows(sortedRecords())));
document.getElementById("clearFilters").addEventListener("click",() => {
  ["search","fromDate","toDate"].forEach(id=>document.getElementById(id).value="");
  document.getElementById("sortRecords").value="newest"; renderRows(sortedRecords());
});
document.getElementById("reportMonth").value = new Date().toLocaleDateString("en-CA").slice(0,7);
document.getElementById("reportMonth").addEventListener("change",renderMonthReport);
document.getElementById("printReport").addEventListener("click",()=>window.print());
document.getElementById("reviewSymptoms").addEventListener("click",()=>{
  const checked=document.querySelectorAll(".pattern-check:checked").length;
  const result=document.getElementById("symptomResult");
  result.textContent=checked
    ? "You selected "+checked+" observation(s). Some overlap with symptoms people report with sciatica, but this cannot identify the cause. Please discuss them with a doctor."
    : "No observations selected. This does not rule out a health condition. If you are concerned or symptoms continue, speak with a doctor.";
  result.className="status";
});
document.getElementById("clearSymptoms").addEventListener("click",()=>{
  document.querySelectorAll(".pattern-check").forEach(item=>item.checked=false);
  showStatus("symptomResult","Checklist cleared. No answers are saved.",false);
});
function csvCell(value) {
  const text = String(value ?? "");
  return '"' + text.replace(/"/g,'""') + '"';
}
document.getElementById("exportCsv").addEventListener("click",() => {
  const headings = ["date","pain","study","breaks","walking","notes","studySessions","exercises"];
  const lines = [headings.join(","),...sortedRecords().map(item => headings.map(key => csvCell(item[key])).join(","))];
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")],{type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = "sciatica-tracker-backup.csv"; link.click();
  URL.revokeObjectURL(url); showStatus("fileStatus","CSV backup exported.",false);
});
document.getElementById("importButton").addEventListener("click",() => document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change",async event => {
  const file = event.target.files[0]; if (!file) return;
  try {
    const text = await file.text();
    const lines = text.replace(/^\uFEFF/,"").split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) throw new Error("The CSV file has no records.");
    const parseLine = line => {
      const cells = []; let value = ""; let quoted = false;
      for (let i=0;i<line.length;i++) {
        const char = line[i];
        if (char === '"' && quoted && line[i+1] === '"') { value += '"'; i++; }
        else if (char === '"') quoted = !quoted;
        else if (char === "," && !quoted) { cells.push(value); value = ""; }
        else value += char;
      }
      cells.push(value); return cells;
    };
    const headings = parseLine(lines[0]).map(value => value.trim().toLowerCase());
    const required = ["date","pain","study","breaks","walking","notes"];
    if (!required.every(key => headings.includes(key))) throw new Error("CSV columns must be: date, pain, study, breaks, walking, notes.");
    const imported = lines.slice(1).map(line => {
      const cells = parseLine(line); const item = {};
      required.forEach(key => item[key] = cells[headings.indexOf(key)] ?? "");
      ["pain","study","breaks","walking"].forEach(key => item[key] = Number(item[key]));
      ["studySessions","exercises"].forEach(key => { const index=headings.indexOf(key); item[key]=index>=0 && cells[index] ? JSON.parse(cells[index]) : []; });
      return item;
    });
    if (!imported.every(isValidRecord)) throw new Error("One or more rows contain invalid values.");
    if (!confirm("Import " + imported.length + " entries? Existing dates will be replaced.")) return;
    imported.forEach(item => { records = records.filter(record => record.date !== item.date); records.push(item); });
    if (saveRecords()) { render(); showStatus("fileStatus",imported.length + " entries imported.",false); }
  } catch (error) { showStatus("fileStatus",error.message || "Could not read this CSV file.",true); }
  finally { event.target.value = ""; }
});
document.getElementById("date").value = new Date().toLocaleDateString("en-CA");
document.getElementById("recordRows").closest("table").hidden = true;
render();
