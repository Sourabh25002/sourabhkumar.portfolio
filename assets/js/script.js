const fileMeta = {
  about: { name: "introduction.html", icon: "fa-brands fa-html5 html-icon", position: "Ln 1, Col 1" },
  experience: { name: "experience.js", icon: "fa-brands fa-js js-icon", position: "Ln 24, Col 3" },
  skills: { name: "skills.css", icon: "fa-brands fa-css3-alt css-icon", position: "Ln 12, Col 1" },
  projects: { name: "projects.jsx", icon: "fa-brands fa-react react-icon", position: "Ln 18, Col 5" },
  achievements: { name: "achievements.md", icon: "codicon codicon-markdown md-icon", position: "Ln 8, Col 1" },
  education: { name: "education.cpp", icon: "codicon codicon-code cpp-icon", position: "Ln 9, Col 3" },
  contact: { name: "contact.py", icon: "fa-brands fa-python py-icon", position: "Ln 7, Col 1" },
};

const sidebar = document.getElementById("sidebar");
const backdrop = document.querySelector(".sidebar-backdrop");
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const explorerButton = document.querySelector(".explorer-title");
const fileTree = document.querySelector(".file-tree");

function isMobile() {
  return window.matchMedia("(max-width: 800px)").matches;
}

function closeMobileSidebar() {
  sidebar.classList.remove("mobile-open");
  backdrop.classList.remove("visible");
  mobileMenuButton.setAttribute("aria-expanded", "false");
}

function toggleSidebar() {
  if (isMobile()) {
    const open = !sidebar.classList.contains("mobile-open");
    sidebar.classList.toggle("mobile-open", open);
    backdrop.classList.toggle("visible", open);
    mobileMenuButton.setAttribute("aria-expanded", String(open));
    return;
  }

  sidebar.classList.toggle("collapsed");
  document.querySelector("[data-toggle-sidebar]")?.classList.toggle("active", !sidebar.classList.contains("collapsed"));
}

function openFile(fileId, updateHash = true) {
  const meta = fileMeta[fileId];
  const panel = document.querySelector(`[data-panel="${fileId}"]`);
  if (!meta || !panel) return;

  document.querySelectorAll(".file-panel").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".file-item").forEach((item) => item.classList.remove("active"));

  panel.classList.add("active");
  document.querySelector(`[data-file="${fileId}"]`)?.classList.add("active");

  document.getElementById("tab-label").textContent = meta.name;
  document.getElementById("breadcrumb-label").textContent = meta.name;
  document.getElementById("status-position").textContent = meta.position;
  document.querySelector(".tab-icon").innerHTML = `<i class="${meta.icon}"></i>`;

  panel.scrollTop = 0;
  document.title = `${meta.name} — Sourabh Kumar`;

  if (updateHash && history.replaceState) {
    history.replaceState(null, "", `#${fileId}`);
  }

  if (isMobile()) closeMobileSidebar();
}

document.querySelectorAll("[data-file]").forEach((button) => {
  button.addEventListener("click", () => openFile(button.dataset.file));
});

document.querySelectorAll("[data-open-file]").forEach((element) => {
  element.addEventListener("click", () => openFile(element.dataset.openFile));
});

document.querySelectorAll("[data-toggle-sidebar]").forEach((button) => {
  button.addEventListener("click", toggleSidebar);
});

mobileMenuButton.addEventListener("click", toggleSidebar);
document.querySelector(".sidebar-close").addEventListener("click", closeMobileSidebar);
backdrop.addEventListener("click", closeMobileSidebar);

explorerButton.addEventListener("click", () => {
  const open = explorerButton.getAttribute("aria-expanded") === "true";
  explorerButton.setAttribute("aria-expanded", String(!open));
  fileTree.classList.toggle("closed", open);
  explorerButton.querySelector("i").className = `codicon codicon-chevron-${open ? "right" : "down"}`;
});

window.addEventListener("resize", () => {
  if (!isMobile()) closeMobileSidebar();
});

window.addEventListener("hashchange", () => {
  const fileId = location.hash.slice(1);
  if (fileMeta[fileId]) openFile(fileId, false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileSidebar();
});

const initialFile = location.hash.slice(1);
if (fileMeta[initialFile]) openFile(initialFile, false);
