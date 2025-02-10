document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
});

function closeModal() {
  let modal = document.getElementById("modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
}

function showNote(noteId) {
  let modal = document.getElementById("modal");
  let modalContent = document.getElementById("modal-content");

  if (!modal || !modalContent) {
    console.error("Error: Modal elements not found");
    return;
  }

  fetch(`/show/${noteId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch note content (HTTP ${response.status})`
        );
      }
      return response.text();
    })
    .then((html) => {
      modalContent.innerHTML = html;
      modal.classList.remove("hidden");
      modal.style.display = "flex";
    })
    .catch((error) => {
      console.error("Error loading note:", error);
      alert("Failed to load the note. Check console for details.");
    });
}

function insertElement(type) {
  let newElement;
  let editableArea = document.getElementById("editor");
  if (!editableArea) return;
  const emptyParagraph = document.createElement("p");

  switch (type) {
    case "h1":
      newElement = document.createElement("p");
      newElement.className = "text-2xl font-leelawad py-1 text-gray-900";
      newElement.textContent = "Title";
      break;
    case "h2":
      newElement = document.createElement("p");
      newElement.className = "text-xl font-leelawad py-1 pt-2 text-gray-900";
      newElement.textContent = "Subtitle";
      break;
    case "img":
      newElement =
        "<img src='' alt='Image' class='max-w-full mx-auto'/><p><br></p>";
      break;

    case "video":
      newElement = document.createElement("video");
      newElement.controls = true;
      newElement.className = "max-w-full mx-auto";
      let source = document.createElement("source");
      source.src = "";
      source.type = "video/mp4";
      newElement.appendChild(source);
      break;
    case "h3":
      newElement = document.createElement("h3");
      newElement.className = "font-didot text-gray-800 text-xl tracking-wide";
      newElement.textContent = "Paragraph Title";
      break;
    case "p":
      newElement = document.createElement("p");
      newElement.className =
        "font-didot text-gray-800 text-[0.9rem] leading-[1.75]";
      newElement.textContent = "Paragraph text...";
      break;
    case "s":
      newElement = document.createElement("p");
      newElement.className = "font-biroscript text-[2rem]";
      newElement.textContent = "Paragraph text...";
      break;
    case "a":
      newElement = document.createElement("a");
      newElement.href = "#";
      newElement.className = "text-blue-500 underline";
      newElement.textContent = "Link";
      break;
    case "blockquote":
      newElement = document.createElement("blockquote");
      newElement.className =
        "border-l-4 border-gray-500 pl-4 text-[1.3rem] text-agaramondpro";
      newElement.textContent = "Quote text...";
      break;
    case "code":
      newElement = document.createElement("pre");
      const codeBlock = document.createElement("code");
      codeBlock.className =
        "block bg-black text-white p-4 pl-6 tracking-wide rounded";
      codeBlock.textContent = ` `;
      newElement.appendChild(codeBlock);
      break;

    case "ol":
      newElement = document.createElement("ol");
      newElement.className =
        "list-decimal ml-6 font-didot text-gray-800 text-[0.9rem]";
      newElement.innerHTML = "<li>Item 1</li><li>Item 2</li>";
      break;
    case "ul":
      newElement = document.createElement("ul");
      newElement.className =
        "list-disc ml-6  font-didot text-gray-800 text-[0.9rem]";
      newElement.innerHTML = "<li>Item 1</li><li>Item 2</li>";
      break;
    case "table":
      newElement = document.createElement("table");
      newElement.className =
        "w-full border-collapse border font-janna border-gray-400";
      newElement.innerHTML = `
        <tr>
          <th class='border border-gray-400 px-2 py-1'>Header 1</th>
          <th class='border border-gray-400 px-2 py-1'>Header 2</th>
        </tr>
        <tr>
          <td class='border border-gray-400 px-2 py-1'>Data 1</td>
          <td class='border border-gray-400 px-2 py-1'>Data 2</td>
        </tr>`;
      break;
    case "checklist":
      const checklistItem = document.createElement("li");
      checklistItem.className = "checklist-item flex items-center gap-2";
      checklistItem.innerHTML = `
            <input type="checkbox" class="checklist-checkbox" /> 
            <span>Checklist item</span>
          `;

      const checkbox = checklistItem.querySelector(".checklist-checkbox");
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          checklistItem.innerHTML = `
              <input type="checkbox" class="checklist-checkbox" checked /> 
              <span>Checklist item</span>
            `;
        } else {
          checklistItem.innerHTML = `
              <input type="checkbox" class="checklist-checkbox" /> 
              <span>Checklist item</span>
            `;
        }

        const newCheckbox = checklistItem.querySelector(".checklist-checkbox");
        newCheckbox.addEventListener("change", function () {
          if (newCheckbox.checked) {
            checklistItem.innerHTML = `
                <input type="checkbox" class="checklist-checkbox" checked /> 
                <span>Checklist item</span>
              `;
          } else {
            checklistItem.innerHTML = `
                <input type="checkbox" class="checklist-checkbox" /> 
                <span>Checklist item</span>
              `;
          }
        });
      });

      checklistItem.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          const newItem = document.createElement("li");
          newItem.className = "checklist-item flex items-center gap-2";
          newItem.innerHTML = `
              <input type="checkbox" class="checklist-checkbox" /> 
              <span>New checklist item</span>
            `;
          checklistItem.insertAdjacentElement("afterend", newItem);

          const newCheckbox = newItem.querySelector(".checklist-checkbox");
          newCheckbox.focus();
        }
      });

      newElement = checklistItem;
      break;

    case "delimiter":
      newElement = document.createElement("div");
      newElement.className = "flex justify-center p-3";

      newElement.innerHTML = `
          <span class="text-xs mx-5 text-color2"><img
              src="/static/svg/dot.svg"
              alt="Edit"
              class="w-5 h-5"
            /></span>
          <span class="text-xs mx-5 text-color2"><img
              src="/static/svg/dot.svg"
              alt="Edit"
              class="w-5 h-5"
            /></span>
          <span class="text-xs mx-5 text-color2"><img
              src="/static/svg/dot.svg"
              alt="Edit"
              class="w-5 h-5"
            /></span>
        `;

      emptyParagraph.textContent = "";

      const editor = document.getElementById("editor");
      editor.appendChild(newElement);
      editor.appendChild(emptyParagraph);
      break;
  }

  if (newElement) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const editor = document.getElementById("editor");

      if (editor.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(newElement);
        newElement.focus();
      }
    }
  }
}

function showPopup(id) {
  document.getElementById(id).classList.remove("hidden");
}

function insertImage() {
  let url = document.getElementById("imageUrl").value;
  let editor = document.getElementById("editor");
  if (url) {
    editor.innerHTML += `<img src="${url}" class='max-w-full mx-auto'/>`;
  }
  document.getElementById("imagePopup").classList.add("hidden");
}

function insertVideo() {
  let url = document.getElementById("videoUrl").value;
  let editor = document.getElementById("editor");
  if (url.includes("youtube.com")) {
    let embedUrl = url.replace("watch?v=", "embed/");
    editor.innerHTML += `<iframe width='560' height='315' src='${embedUrl}' frameborder='0' allowfullscreen></iframe>`;
  }
  document.getElementById("videoPopup").classList.add("hidden");
}

function insertTable() {
  let rows = document.getElementById("tableRows").value;
  let cols = document.getElementById("tableCols").value;
  let table = `<table class='border-collapse border border-gray-400 w-full'>`;
  for (let r = 0; r < rows; r++) {
    table += "<tr>";
    for (let c = 0; c < cols; c++) {
      table += "<td class='border border-gray-400 px-2 py-1'>Cell</td>";
    }
    table += "</tr>";
  }
  table += "</table>";
  document.getElementById("editor").innerHTML += table;
  document.getElementById("tablePopup").classList.add("hidden");
}

function uploadImage() {
  let fileInput = document.getElementById("imageUpload");
  let file = fileInput.files[0];

  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  let formData = new FormData();
  formData.append("file", file);

  fetch("/upload_image", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.url) {
        insertImage(data.url);
      } else {
        alert("Upload failed: " + data.error);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function insertImage(url) {
  let editor = document.getElementById("editor");
  editor.innerHTML += `<img src="${url}" class='max-w-full mx-auto'/>`;
  document.getElementById("imagePopup").classList.add("hidden");
}

function uploadVideo() {
  let fileInput = document.getElementById("videoUpload");
  let file = fileInput.files[0];

  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  let formData = new FormData();
  formData.append("file", file);

  fetch("/upload_video", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.url) {
        insertVideo(data.url);
      } else {
        alert("Upload failed: " + data.error);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function insertVideo(url) {
  let editor = document.getElementById("editor");
  editor.innerHTML += `<video controls class='max-w-full mx-auto'><source src="${url}" type="video/mp4"></video>`;
  document.getElementById("videoPopup").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  let saveButton = document.getElementById("saveButton");
  let editor = document.getElementById("editor");
  let originalContent = editor.innerHTML;
  let isChanged = false;

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      if (!isChanged) return;

      saveButton.style.pointerEvents = "none";

      let content = editor.innerHTML;
      let noteId = saveButton.getAttribute("data-note-id");

      fetch(`/save/${noteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            originalContent = content;
            isChanged = false;
            updateSaveButtonIcon();
          } else {
            alert("Error saving note.");
          }
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => (saveButton.style.pointerEvents = "auto"));
    });
  }

  editor.addEventListener("input", () => {
    isChanged = editor.innerHTML !== originalContent;
    updateSaveButtonIcon();
  });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      if (saveButton) saveButton.click();
    }
  });

  function updateSaveButtonIcon() {
    let saveIcon = saveButton.querySelector("img");
    saveIcon.src = isChanged ? "/static/svg/save.svg" : "/static/svg/check.svg";
  }
});

function shareNote(noteId) {
  let recipientUrl = prompt("Enter recipient's app URL:");
  if (!recipientUrl) return;

  fetch(`/share/${noteId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipient_url: recipientUrl }),
  })
    .then((response) => response.json())
    .then((data) => alert(data.message || "Note shared successfully"))
    .catch((error) => alert("Failed to share note"));
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  let folderInput = document.querySelector('input[name="name"]');

  if (folderInput) {
    folderInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.form.submit();
      }
    });
  }
});

function openNotePopup() {
  let activeFolderId = localStorage.getItem("activeFolder");
  let folderSelect = document.getElementById("noteFolder");

  if (folderSelect && activeFolderId) {
    folderSelect.value = activeFolderId;
  }

  document.getElementById("notePopup").classList.remove("hidden");
}

function closeNotePopup() {
  document.getElementById("notePopup").classList.add("hidden");
}

function submitNote(event) {
  event.preventDefault();

  let title = document.getElementById("noteTitle").value;
  let folderId = document.getElementById("noteFolder").value;
  let subtitle = document.getElementById("noteSubtitle").value;

  if (!title || !folderId) {
    alert("Title and folder are required.");
    return;
  }

  fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ title, folder_id: folderId, subtitle }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        closeNotePopup();
        window.location.href = "/";
      } else {
        alert("Error creating note: " + data.error);
      }
    })
    .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  let noteForm = document.getElementById("noteForm");
  if (noteForm) {
    noteForm.addEventListener("submit", submitNote);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let activeFolderId = localStorage.getItem("activeFolder");

  if (activeFolderId) {
    let activeElement = document.querySelector(
      `[data-folder-id='${activeFolderId}']`
    );
    if (activeElement) {
      setActiveFolder(activeElement, activeFolderId);
    }
  }
});

function setActiveFolder(selectedElement, folderId) {
  document.querySelectorAll("#folderList li").forEach((folder) => {
    folder.classList.remove("bg-custom-folder", "text-gray-700");
    folder.classList.add("bg-custom-slidebar");
  });
  selectedElement.classList.remove("bg-custom-slidebar");
  selectedElement.classList.add("bg-custom-folder", "text-gray-700");
  localStorage.setItem("activeFolder", folderId);
  fetch(`/get_notes?folder_id=${folderId}`)
    .then((response) => response.json())
    .then((data) => {
      let notesList = document.getElementById("notesList");
      notesList.className = "grid grid-cols-2 gap-4";
      notesList.innerHTML = "";
      data.forEach((note) => {
        let li = document.createElement("li");
        li.className =
          "group p-6 border-b bg-custom-folder rounded-2xl transition duration-200 hover:rounded-md";
        li.innerHTML = `
          <div class="flex flex-row justify-between">
            <a href="/note/${note.id}" class="block">
              <div class="gap-2 flex flex-col">
                <span class="note-title font-europabold opacity-85 text-lg font-bold">${note.title}</span>
                <p class="note-subtitle font-nexa text-md text-gray-500">${note.subtitle}</p>
              </div>
            </a>
            <div class="flex space-x-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button onclick="editNote(${note.id})">
                <img src="/static/svg/edit.svg" alt="Edit" class="w-5 h-5">
              </button>
              <button onclick="deleteNote(${note.id})">
                <img src="/static/svg/delete.svg" alt="Delete" class="w-5 h-5">
              </button>
            </div>
          </div>
        `;
        notesList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching notes:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const notePopup = document.getElementById("notePopup");
  notePopup.addEventListener("click", (e) => {
    if (e.target === notePopup) closeNotePopup();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const noteForm = document.getElementById("noteForm");
  noteForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      noteForm.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  });
});

function editNote(noteId) {
  window.location.href = `/edit/${noteId}`;
}

let noteToDelete = null;
function deleteNote(noteId) {
  noteToDelete = noteId;
  document.getElementById("deletePopup").classList.remove("hidden");
}
function closeDeletePopup() {
  document.getElementById("deletePopup").classList.add("hidden");
  noteToDelete = null;
}
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("confirmDeleteButton")
    .addEventListener("click", () => {
      if (noteToDelete) {
        fetch(`/delete/${noteToDelete}`, { method: "POST" })
          .then(() => {
            closeDeletePopup();
            window.location.reload();
          })
          .catch((err) => {
            console.error("Error deleting note:", err);
            closeDeletePopup();
          });
      }
    });
});

function editFolder(folderId) {
  const folderLi = document.querySelector(`li[data-folder-id='${folderId}']`);
  const span = folderLi.querySelector(".folder-name");
  const currentName = span.textContent.trim();
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentName;
  input.className =
    "folder-name text-xl font-garamond font-bold bg-custom-folder mt-1 ml-4 border-none focus:border-none focus:outline-none";
  folderLi.replaceChild(input, span);
  input.focus();
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      fetch(`/edit_folder/${folderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ name: input.value }),
      })
        .then((res) => {
          if (res.ok) {
            const newSpan = document.createElement("span");
            newSpan.textContent = input.value;
            newSpan.className =
              "folder-name font-garamond text-xl font-bold mt-1 ml-4";
            folderLi.replaceChild(newSpan, input);
          } else {
            alert("Error updating folder.");
          }
        })
        .catch((err) => {
          console.error("Error updating folder:", err);
          alert("Error updating folder.");
        });
    }
  });
}

let folderToDelete = null;
function deleteFolder(folderId) {
  folderToDelete = folderId;
  document.getElementById("deleteFolderPopup").classList.remove("hidden");
}
function closeDeleteFolderPopup() {
  document.getElementById("deleteFolderPopup").classList.add("hidden");
  folderToDelete = null;
}
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("confirmDeleteFolderButton")
    .addEventListener("click", () => {
      if (folderToDelete) {
        fetch(`/delete_folder/${folderToDelete}`, { method: "POST" })
          .then(() => {
            closeDeleteFolderPopup();
            window.location.reload();
          })
          .catch((err) => {
            console.error("Error deleting folder:", err);
            closeDeleteFolderPopup();
          });
      }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("noteTitle");
  const subtitleInput = document.getElementById("noteSubtitle");

  if (titleInput) {
    titleInput.addEventListener("input", function () {
      if (this.value.length > 67) this.value = this.value.slice(0, 70);
    });
  }

  if (subtitleInput) {
    subtitleInput.addEventListener("input", function () {
      if (this.value.length > 250) this.value = this.value.slice(0, 200);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor");

  editor.addEventListener("paste", (event) => {
    let paste = (event.clipboardData || window.clipboardData).getData("text");

    if (isImageUrl(paste)) {
      event.preventDefault();
      insertImageDirectly(paste);
    } else if (isYouTubeUrl(paste)) {
      event.preventDefault();
      insertYouTubeVideo(paste);
    }
  });

  function isImageUrl(url) {
    return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
  }

  function isYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/.test(
      url
    );
  }

  function insertImageDirectly(url) {
    editor.innerHTML += `<img src="${url}" class='max-w-full rounded-xl mx-auto'/>`;
  }

  function insertYouTubeVideo(url) {
    let embedUrl = url.replace("watch?v=", "embed/");
    const div = document.createElement("div");
    div.className = "w-full flex justify-center my-4";
    div.innerHTML = `<iframe class="rounded-lg shadow-lg" width="784" height="441" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(div);
      range.collapse(false);
    } else {
      editor.appendChild(div);
    }
  }
});

function handleImageUpload(event) {
  let file = event.target.files[0];
  if (!file) return;

  let formData = new FormData();
  formData.append("file", file);

  fetch("/upload_image", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.url) {
        insertImageDirectly(data.url);
      } else {
        alert("Upload failed: " + data.error);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function insertImageDirectly(url) {
  let editor = document.getElementById("editor");
  editor.innerHTML += `<img src="${url}" class='max-w-full rounded-lg mx-auto my-4'/>`;
}

function handleVideoUpload(event) {
  let file = event.target.files[0];
  if (!file) return;

  let formData = new FormData();
  formData.append("file", file);

  fetch("/upload_video", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.url) {
        insertVideoDirectly(data.url);
      } else {
        alert("Upload failed: " + data.error);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function insertVideoDirectly(url) {
  let editor = document.getElementById("editor");

  let videoContainer = document.createElement("div");
  videoContainer.className = "w-full flex justify-center my-4";

  let videoElement = document.createElement("video");
  videoElement.className = "rounded-lg shadow-lg";
  videoElement.width = 784;
  videoElement.height = 441;
  videoElement.controls = true;

  let source = document.createElement("source");
  source.src = url;
  source.type = "video/mp4";

  videoElement.appendChild(source);
  videoContainer.appendChild(videoElement);

  let emptyParagraph = document.createElement("p");
  emptyParagraph.innerHTML = "<br>";

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.insertNode(videoContainer);
    range.insertNode(emptyParagraph);
    range.setStartAfter(emptyParagraph);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    editor.appendChild(videoContainer);
    editor.appendChild(emptyParagraph);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tableButton = document.getElementById("tableButton");
  const tableGrid = document.getElementById("tableGrid");
  const editor = document.getElementById("editor");

  let lastRange = null;

  editor.addEventListener("mouseup", saveSelection);
  editor.addEventListener("keyup", saveSelection);

  function saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      lastRange = selection.getRangeAt(0);
    }
  }

  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 10; col++) {
      let cell = document.createElement("div");
      cell.className =
        "w-5 h-5 border rounded-sm border-gray-300 bg-custom-slidebar cursor-pointer transition-colors duration-200";
      cell.dataset.row = row;
      cell.dataset.col = col;

      cell.addEventListener("mouseover", () => highlightGrid(row, col));
      cell.addEventListener("click", () => insertTable(row, col));

      tableGrid.appendChild(cell);
    }
  }

  tableButton.addEventListener("mouseenter", () => {
    tableGrid.classList.remove("hidden");
  });

  tableGrid.addEventListener("mouseenter", () => {
    tableGrid.classList.remove("hidden");
  });

  tableGrid.addEventListener("mouseleave", () => {
    tableGrid.classList.add("hidden");
  });

  tableButton.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!tableGrid.matches(":hover")) tableGrid.classList.add("hidden");
    }, 200);
  });

  function highlightGrid(rows, cols) {
    document.querySelectorAll("#tableGrid div").forEach((cell) => {
      let r = parseInt(cell.dataset.row);
      let c = parseInt(cell.dataset.col);
      cell.classList.toggle("bg-custom-color2", r <= rows && c <= cols);
    });
  }

  function insertTable(rows, cols) {
    let tableWrapper = document.createElement("div");
    tableWrapper.className = "relative w-full my-4 group";

    let table = document.createElement("table");
    table.className =
      "border-collapse border border-gray-400 w-full rounded-md text-lg font-janna";
    table.dataset.columns = cols;
    table.dataset.rows = rows;

    for (let r = 0; r < rows; r++) {
      let row = document.createElement("tr");
      for (let c = 0; c < cols; c++) {
        let cell = document.createElement("td");
        cell.className = "border border-gray-400 px-4 py-3";
        cell.textContent = "Cell";
        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    let addColButton = document.createElement("button");
    addColButton.innerHTML =
      '<span class="font-bold text-lg font-janna">+</span>';
    addColButton.className =
      "absolute -right-12 top-0 h-full bg-custom-folder text-gray-600 px-3 py-2 rounded-md text-opacity-80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center";
    addColButton.onclick = () => addColumn(table);

    let addRowButton = document.createElement("button");
    addRowButton.innerHTML =
      '<span class="font-bold text-lg font-janna">+</span>';
    addRowButton.className =
      "absolute left-0 -bottom-12 w-full h-10 bg-custom-folder text-gray-600 text-2xl text-opacity-80 rounded-md opacity-0 group-hover:opacity-100 transition flex items-center justify-center mx-auto";
    addRowButton.onclick = () => addRow(table);

    tableWrapper.appendChild(table);
    tableWrapper.appendChild(addColButton);
    tableWrapper.appendChild(addRowButton);

    if (lastRange) {
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(lastRange);

      lastRange.deleteContents();
      lastRange.insertNode(tableWrapper);

      let newRange = document.createRange();
      newRange.setStartAfter(tableWrapper);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      editor.appendChild(tableWrapper);
    }

    tableGrid.classList.add("hidden");
  }

  function addRow(table) {
    let cols = table.dataset.columns;
    let newRow = document.createElement("tr");

    for (let i = 0; i < cols; i++) {
      let cell = document.createElement("td");
      cell.className = "border border-gray-400 px-4 py-3";
      cell.textContent = "Cell";
      newRow.appendChild(cell);
    }

    table.appendChild(newRow);
    table.dataset.rows = parseInt(table.dataset.rows) + 1;
  }

  function addColumn(table) {
    let currentColumns = parseInt(table.dataset.columns) || 0;
    if (currentColumns >= 12) return;
    let rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      let cell = document.createElement("td");
      cell.className = "border border-gray-400 px-4 py-3";
      cell.textContent = "Cell";
      row.appendChild(cell);
    });
    table.dataset.columns = currentColumns + 1;
  }
});

let lastRange = null;

function saveSelection() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    lastRange = selection.getRangeAt(0);
  }
}

function insertAtCursor(node) {
  const editor = document.getElementById("editor");
  if (lastRange) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(lastRange);
    lastRange.deleteContents();
    lastRange.insertNode(node);
  } else {
    editor.appendChild(node);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("formatButton");
  if (!btn) return console.error("Format button missing");
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const codeElem = document.querySelector("#editor code");
    if (!codeElem) return;
    const formatted = await prettier.format(codeElem.textContent, {
      parser: "babel",
      plugins: prettierPlugins,
    });
    codeElem.innerHTML = formatted.replace(/\n/g, "<br>");
    hljs.highlightElement(codeElem);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.getElementById("textToolbar");
  const editor = document.getElementById("editor");

  editor.addEventListener("mouseup", () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      toolbar.style.left = `${rect.left + window.scrollX}px`;
      toolbar.style.top = `${rect.bottom + window.scrollY + 5}px`;
      toolbar.classList.remove("hidden");
    } else {
      toolbar.classList.add("hidden");
    }
  });

  document.addEventListener("click", (e) => {
    if (!editor.contains(e.target) && !toolbar.contains(e.target)) {
      toolbar.classList.add("hidden");
    }
  });
});

let isChanged = false;
function markEditorAsChanged() {
  isChanged = true;
  updateSaveButtonIcon();
}
document.addEventListener("DOMContentLoaded", () => {
  let saveButton = document.getElementById("saveButton");
  let editor = document.getElementById("editor");
  let originalContent = editor.innerHTML;

  editor.addEventListener("input", () => {
    isChanged = true;
    updateSaveButtonIcon();
  });
});

function toggleFormat(cmd) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  let commonAncestor = range.commonAncestorContainer;

  if (commonAncestor.nodeType === 3) {
    commonAncestor = commonAncestor.parentNode;
  }

  if (cmd === "highlight") {
    const existingHighlight = commonAncestor.closest("span.yellow-highlight");
    if (existingHighlight) {
      const fragment = document.createDocumentFragment();
      while (existingHighlight.firstChild) {
        fragment.appendChild(existingHighlight.firstChild);
      }
      existingHighlight.parentNode.replaceChild(fragment, existingHighlight);
    } else {
      const highlightSpan = document.createElement("span");
      highlightSpan.classList.add("yellow-highlight");
      highlightSpan.appendChild(range.extractContents());
      range.insertNode(highlightSpan);
    }
  } else if (cmd === "link") {
    const existingLink = commonAncestor.closest("a");
    if (existingLink) {
      // Remove link by replacing it with its inner content
      const fragment = document.createDocumentFragment();
      while (existingLink.firstChild) {
        fragment.appendChild(existingLink.firstChild);
      }
      existingLink.parentNode.replaceChild(fragment, existingLink);
    } else {
      const url = prompt("Enter URL:", "https://");
      if (!url || url.trim() === "https://") return;

      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.classList.add("link-color", "text-[1.1rem]", "font-link");
      link.appendChild(range.extractContents());

      range.insertNode(link);
    }
  } else {
    const styles = {
      bold: { property: "fontWeight", value: "bold" },
      italic: { property: "fontStyle", value: "italic" },
      underline: { property: "textDecoration", value: "underline" },
    };

    const style = styles[cmd];
    if (!style) return;

    const existingSpan = commonAncestor.closest("span");
    if (existingSpan && existingSpan.style[style.property] === style.value) {
      const fragment = document.createDocumentFragment();
      while (existingSpan.firstChild) {
        fragment.appendChild(existingSpan.firstChild);
      }
      existingSpan.parentNode.replaceChild(fragment, existingSpan);
    } else {
      const span = document.createElement("span");
      span.style[style.property] = style.value;
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }
  }

  selection.removeAllRanges();
}

document.addEventListener("keydown", (e) => {
  if (!e.ctrlKey) return;
  let k = e.key.toLowerCase();

  if ("biuhk".includes(k)) {
    e.preventDefault();
    toggleFormat(
      k === "b"
        ? "bold"
        : k === "i"
        ? "italic"
        : k === "u"
        ? "underline"
        : k === "h"
        ? "highlight"
        : "link"
    );
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const noteItems = document.querySelectorAll("#notesList li[data-url]");
  noteItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (!e.target.closest("button")) {
        window.location.href = item.dataset.url;
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor");
  if (editor) {
    editor.focus();
    placeCursorAtStart(editor);
  }
});

function placeCursorAtStart(element) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}
