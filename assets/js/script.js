const files = [
  { id: "about", name: "introduction.html", icon: "fa-brands fa-html5 html-icon", language: "HTML", label: "About me" },
  { id: "experience", name: "experience.js", icon: "fa-brands fa-js js-icon", language: "JavaScript", label: "Work experience" },
  { id: "skills", name: "skills.css", icon: "fa-brands fa-css3-alt css-icon", language: "CSS", label: "Technical skills" },
  { id: "projects", name: "projects.jsx", icon: "fa-brands fa-react react-icon", language: "React", label: "Projects & research" },
  { id: "achievements", name: "achievements.md", icon: "codicon codicon-markdown md-icon", language: "Markdown", label: "Achievements" },
  { id: "education", name: "education.cpp", icon: "codicon codicon-code cpp-icon", language: "C++", label: "Education" },
  { id: "contact", name: "contact.py", icon: "fa-brands fa-python py-icon", language: "Python", label: "Contact" },
];
const fileById = Object.fromEntries(files.map((file) => [file.id, file]));
const defaultTitle = document.title;

const sidebar = document.getElementById("sidebar");
const backdrop = document.querySelector(".sidebar-backdrop");
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const explorerButton = document.querySelector(".explorer-title");
const fileTree = document.getElementById("file-tree");
const breadcrumbLabel = document.getElementById("breadcrumb-label");
const statusLanguage = document.getElementById("status-language");
const statusPosition = document.getElementById("status-position");
const palette = document.getElementById("palette");
const paletteInput = document.getElementById("palette-input");
const paletteItems = [...palette.querySelectorAll(".palette-item")];
const paletteEmpty = palette.querySelector(".palette-empty");

const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
document.querySelectorAll("[data-shortcut]").forEach((kbd) => { kbd.textContent = isMac ? "⌘ K" : "Ctrl K"; });

function isMobile() {
  return window.matchMedia("(max-width: 800px)").matches;
}

function setMobileSidebar(open) {
  sidebar.classList.toggle("mobile-open", open);
  backdrop.classList.toggle("visible", open);
  mobileMenuButton.setAttribute("aria-expanded", String(open));
}

function toggleSidebar() {
  if (isMobile()) {
    setMobileSidebar(!sidebar.classList.contains("mobile-open"));
    return;
  }
  const collapsed = sidebar.classList.toggle("collapsed");
  document.querySelector("[data-toggle-sidebar]").classList.toggle("active", !collapsed);
}

function updatePosition(panel) {
  statusPosition.textContent = `Ln ${Math.floor(panel.scrollTop / 22) + 1}, Col 1`;
}

function openFile(id, { updateHash = true } = {}) {
  const file = fileById[id];
  const panel = document.getElementById(`panel-${id}`);
  if (!file || !panel) return;

  document.querySelectorAll(".file-panel").forEach((item) => item.classList.toggle("active", item === panel));
  document.querySelectorAll(".file-item, .tab").forEach((item) => {
    const active = item.dataset.file === id;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  breadcrumbLabel.textContent = file.name;
  statusLanguage.textContent = file.language;
  panel.scrollTop = 0;
  updatePosition(panel);
  document.title = id === "about" ? defaultTitle : `${file.label} — Sourabh Kumar`;
  document.querySelector(`.tab[data-file="${id}"]`).scrollIntoView({ block: "nearest", inline: "nearest" });

  if (updateHash) history.replaceState(null, "", id === "about" ? location.pathname : `#${id}`);
  if (isMobile()) setMobileSidebar(false);
}

files.forEach((file, index) => {
  const panel = document.getElementById(`panel-${file.id}`);
  const pager = document.createElement("nav");
  pager.className = "panel-pager";
  pager.setAttribute("aria-label", "Previous and next section");

  const addLink = (target, direction) => {
    const link = document.createElement("button");
    link.type = "button";
    link.className = `pager-link ${direction}`;
    link.dataset.file = target.id;
    const arrow = direction === "prev" ? "codicon-arrow-left" : "codicon-arrow-right";
    const text = `<span>${direction === "prev" ? `<i class="codicon ${arrow}"></i>` : ""}${target.label}${direction === "next" ? `<i class="codicon ${arrow}"></i>` : ""}</span>`;
    link.innerHTML = `<small>${direction === "prev" ? "Previous" : "Next"} · ${target.name}</small>${text}`;
    pager.append(link);
  };

  if (files[index - 1]) addLink(files[index - 1], "prev");
  if (files[index + 1]) addLink(files[index + 1], "next");
  panel.append(pager);
  panel.addEventListener("scroll", () => updatePosition(panel), { passive: true });
});

let selectedIndex = 0;

function visiblePaletteItems() {
  return paletteItems.filter((item) => !item.hidden);
}

function selectPaletteItem(index) {
  const visible = visiblePaletteItems();
  selectedIndex = visible.length ? (index + visible.length) % visible.length : 0;
  paletteItems.forEach((item) => item.classList.remove("selected"));
  const item = visible[selectedIndex];
  if (item) {
    item.classList.add("selected");
    item.scrollIntoView({ block: "nearest" });
  }
}

function filterPalette(query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  paletteItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    item.hidden = !terms.every((term) => text.includes(term));
  });
  palette.querySelectorAll(".palette-group").forEach((group) => {
    group.hidden = !group.querySelector(".palette-item:not([hidden])");
  });
  paletteEmpty.hidden = visiblePaletteItems().length > 0;
  selectPaletteItem(0);
}

function openPalette() {
  if (palette.open) return;
  if (isMobile()) setMobileSidebar(false);
  paletteInput.value = "";
  filterPalette("");
  palette.showModal();
  paletteInput.focus();
}

paletteInput.addEventListener("input", () => filterPalette(paletteInput.value));
paletteInput.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    selectPaletteItem(selectedIndex + (event.key === "ArrowDown" ? 1 : -1));
  } else if (event.key === "Enter") {
    event.preventDefault();
    visiblePaletteItems()[selectedIndex]?.click();
  }
});
paletteItems.forEach((item) => {
  item.addEventListener("mousemove", () => {
    const index = visiblePaletteItems().indexOf(item);
    if (index !== selectedIndex) selectPaletteItem(index);
  });
});
palette.addEventListener("click", (event) => {
  if (event.target === palette || event.target.closest("a.palette-item")) palette.close();
});

document.addEventListener("click", (event) => {
  const fileTrigger = event.target.closest("[data-file]");
  if (fileTrigger) {
    openFile(fileTrigger.dataset.file);
    if (palette.open) palette.close();
    return;
  }
  if (event.target.closest("[data-command-open]")) openPalette();
  else if (event.target.closest("[data-toggle-sidebar]")) toggleSidebar();
});

mobileMenuButton.addEventListener("click", toggleSidebar);
document.querySelector(".sidebar-close").addEventListener("click", () => setMobileSidebar(false));
backdrop.addEventListener("click", () => setMobileSidebar(false));

explorerButton.addEventListener("click", () => {
  const open = explorerButton.getAttribute("aria-expanded") === "true";
  explorerButton.setAttribute("aria-expanded", String(!open));
  fileTree.classList.toggle("closed", open);
  explorerButton.querySelector("i").className = `codicon codicon-chevron-${open ? "right" : "down"}`;
});

window.addEventListener("resize", () => {
  if (!isMobile()) setMobileSidebar(false);
});

window.addEventListener("hashchange", () => {
  const id = location.hash.slice(1) || "about";
  if (fileById[id]) openFile(id, { updateHash: false });
});

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    if (palette.open) palette.close();
    else openPalette();
  } else if (event.key === "Escape") {
    setMobileSidebar(false);
  }
});

const initialFile = location.hash.slice(1);
openFile(fileById[initialFile] ? initialFile : "about", { updateHash: false });
