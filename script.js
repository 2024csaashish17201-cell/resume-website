const STORAGE_KEY = "resume_website_data_v2";

function saveResumeData(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function loadResumeData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function renderPreview(data, template = 1) {
  const wrap = document.getElementById("resumeWrap");
  if (!data || !wrap) return;

  const baseInfo = `
    <h2>${data.name || ""}</h2>
    <p><strong>${data.title || ""}</strong></p>
    <p><b>Age:</b> ${data.age || ""}</p>
    <p><b>Email:</b> ${data.email || ""}</p>
    <p><b>Phone:</b> ${data.phone || ""}</p>
    <p><b>Address:</b> ${data.address || ""}</p>
  `;

  const eduInfo = `
    <h4>Education</h4>
    <p>12th: ${data.education12 || ""}</p>
    <p>10th: ${data.education10 || ""}</p>
  `;

  const proj = `
    <h4>Project</h4>
    <p><b>${data.projectTitle || ""}</b><br>${data.projectDesc || ""}</p>
  `;

  const exp = `
    <h4>Experience</h4>
    <p>${data.experience || ""}</p>
  `;

  const skills = `
    <h4>Skills</h4>
    <p>${data.skills || ""}</p>
  `;

  if (template === 1) {
    wrap.innerHTML = `
      <div class="resume-inner">
        <div class="resume-left">
          ${baseInfo}${skills}
        </div>
        <div class="resume-right">
          <h4>Profile</h4><p>${data.profile || ""}</p>${eduInfo}${proj}${exp}
        </div>
      </div>`;
  } else if (template === 2) {
    wrap.innerHTML = `
      <div style="padding:20px;">
        <h2>${data.name}</h2><h3>${data.title}</h3>
        <hr><p>${data.profile}</p>
        ${eduInfo}${proj}${skills}${exp}
      </div>`;
  } else {
    wrap.innerHTML = `
      <div style="padding:20px; border-left:6px solid #007bff;">
        <h2>${data.name}</h2><h4>${data.title}</h4>
        <p><i>${data.email}</i> | ${data.phone}</p>
        <hr><p>${data.profile}</p>
        ${eduInfo}${proj}${skills}${exp}
      </div>`;
  }
}

// Builder page load/save
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/").pop();
  if (path === "builder.html") {
    const f = (id) => document.getElementById(id);
    const data = loadResumeData();
    Object.keys(data).forEach((k) => { if (f(k)) f(k).value = data[k]; });

    f("saveBtn").onclick = () => {
      const obj = {};
      ["name","title","age","email","phone","address","profile",
       "education12","education10","skills","projectTitle","projectDesc","experience"]
      .forEach(id => obj[id] = f(id)?.value || "");
      saveResumeData(obj);
      window.location.href = "preview.html";
    };
    f("clearBtn").onclick = () => { localStorage.removeItem(STORAGE_KEY); location.reload(); };
  }
});

// XML Export
function downloadXMLFile(data) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<resume>';
  for (const [key, val] of Object.entries(data)) {
    xml += `<${key}>${val}</${key}>`;
  }
  xml += '</resume>';
  const blob = new Blob([xml], { type: "application/xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "resume.xml";
  a.click();
}
