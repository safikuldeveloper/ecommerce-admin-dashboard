
document.addEventListener("DOMContentLoaded", () => {

  const preloader = document.getElementById("preloader");
  const mainWrapper = document.getElementById("main-wrapper");
  const collapseSidebar = document.querySelector(".collapse-sidebar");
  const collapseMainContent = document.querySelector(".content-wrapper");
  const sidebar = document.querySelector(".sidebar");
  const submenuParents = document.querySelectorAll(".submenu-parent");
  const icon = document.querySelector(".collapse-sidebar i");
  const menuToggle = document.querySelector(".menu-toggle");
  const selectAllCheckbox = document.getElementById('select-all');
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  const editor = document.querySelector('#editor');
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const preview = document.getElementById("preview");
  const browseButton = document.getElementById("browseButton");
  const variantsTable = document.getElementById("variants-table");
  const addVariantButton = document.getElementById("add-variant");
  
  // Preloader for first-time visitors
//   const isFirstVisit = !localStorage.getItem("visited");
//   if (isFirstVisit) {
//       setTimeout(() => {
//           preloader.style.display = "none";
//           mainWrapper.style.display = "block";
//           localStorage.setItem("visited", "true");
//       }, 3000);
//   } else {
//       preloader.style.display = "none";
//       mainWrapper.style.display = "block";
//   }

setTimeout(() => {
    preloader.style.display = "none";
    mainWrapper.style.display = "block";
}, 100)

  // Submenu toggle
  submenuParents.forEach((parent) => {
      parent.addEventListener("click", (e) => {
          e.preventDefault();
          const submenu = parent.nextElementSibling;
          const rightIcon = parent.querySelector(".right-icon");

          parent.classList.toggle("active");
          submenu.classList.toggle("open");
          rightIcon.classList.toggle("rotate");
      });
  });

  // Sidebar collapse logic
  let isCollapsedManually = false;
  let collapseClickCount = 0;

  collapseSidebar.addEventListener("click", () => {
      collapseClickCount++;
      if (collapseClickCount === 2) {
          collapseClickCount = 0;
          isCollapsedManually = false;
          sidebar.classList.remove("collapsed");
          icon.style.transform = "rotate(0deg)";
          collapseMainContent.style.marginLeft = "18rem"; 
      } else {
          isCollapsedManually = true;
          sidebar.classList.add("collapsed");
          icon.style.transform = "rotate(180deg)";
          collapseMainContent.style.marginLeft = "5rem"; 
      }
  });

  sidebar.addEventListener("mouseenter", () => {
      if (sidebar.classList.contains("collapsed")) {
          sidebar.classList.remove("collapsed");
          icon.style.transform = "rotate(0deg)";
          collapseMainContent.style.marginLeft = "18rem"; 
      }
  });

  sidebar.addEventListener("mouseleave", () => {
      if (!sidebar.classList.contains("collapsed") && isCollapsedManually) {
          sidebar.classList.add("collapsed");
          icon.style.transform = "rotate(180deg)";
          collapseMainContent.style.marginLeft = "5rem"; 
      }
  });





// Create overlay element
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
overlay.style.zIndex = "9998";
overlay.style.display = "none";
document.body.appendChild(overlay);

let mobileOverlayVisible = false;

// Handle sidebar toggle
menuToggle.addEventListener("click", () => {
  if (!mobileOverlayVisible) {
    // Open sidebar
    sidebar.style.width = "18rem";
    sidebar.style.display = "block";
    sidebar.style.zIndex = "9999";
    overlay.style.display = "block";
    mobileOverlayVisible = true;
  } else {
    // Close sidebar
    closeSidebar();
  }
});


overlay.addEventListener("click", () => {
  if (mobileOverlayVisible) {
    closeSidebar();
  }
});

// Function to close the sidebar
function closeSidebar() {
  sidebar.style.width = "0";
  sidebar.style.display = "none";
  sidebar.style.zIndex = "0";
  overlay.style.display = "none";
  mobileOverlayVisible = false;
}



if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener('change', function () {
    rowCheckboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });
}


if (rowCheckboxes) {
  rowCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      const allChecked = Array.from(rowCheckboxes).every((checkbox) => checkbox.checked);
      selectAllCheckbox.checked = allChecked;
    });
  });
}



// Initialize CKEditor 5
if (editor) {
  ClassicEditor.create(editor)
    .then(editorInstance => {
      const editableElement = editorInstance.ui.view.editable.element;

      editableElement.style.minHeight = '300px';

      editableElement.addEventListener('focus', () => {
        editableElement.style.minHeight = '300px';
      });

      editableElement.addEventListener('blur', () => {
        editableElement.style.minHeight = '300px';
      });

      document.addEventListener('click', (event) => {
        if (!editableElement.contains(event.target)) {
          editableElement.style.minHeight = '300px';
        }
      });

    })
    .catch(error => {
      console.error('Error initializing CKEditor 5', error);
    });
}



  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#6c63ff";
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "#d3d3d3";
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#d3d3d3";
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  });

  browseButton.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files);
    handleFiles(files);
  });

  function handleFiles(files) {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewItem = document.createElement("div");
          previewItem.className = "preview-item";

          const img = document.createElement("img");
          img.src = e.target.result;

          const actions = document.createElement("div");
          actions.className = "actions";

          const deleteBtn = document.createElement("button");
          deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i>";
          deleteBtn.onclick = () => previewItem.remove();

          actions.appendChild(deleteBtn);

          previewItem.appendChild(img);
          previewItem.appendChild(actions);
          preview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
      }
    });
  }


let variants = [
  {
    size: "Choose Size",
    color: "Choose Color",
    price: "210.10",
    quantity: 2,
    image: "./assets/icons/image-icon.svg",
  }
];

// Render table rows using append
const renderVariants = () => {
  // Clear the table
  variantsTable.innerHTML = '';
  
  // Loop through the variants array and append rows
  variants.forEach((variant, index) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <label>
          <img src="${variant.image}" class="image-preview" style="width: 50px; height: 50px; object-fit: cover;" alt="Preview">
          <input type="file" class="file-input" multiple data-index="${index}" accept="image/*" style="display: none;">
        </label>
      </td>
      <td>
        <select class="form-select" data-index="${index}" data-field="size">
          <option ${variant.size === "Choose Size" ? "selected" : ""}>Choose Size</option>
          <option ${variant.size === "S" ? "selected" : ""}>S</option>
          <option ${variant.size === "M" ? "selected" : ""}>M</option>
          <option ${variant.size === "L" ? "selected" : ""}>L</option>
        </select>
      </td>
      <td>
        <select class="form-select" data-index="${index}" data-field="color">
          <option ${variant.color === "Choose Color" ? "selected" : ""}>Choose Color</option>
          <option ${variant.color === "Red" ? "selected" : ""}>Red</option>
          <option ${variant.color === "Blue" ? "selected" : ""}>Blue</option>
          <option ${variant.color === "Green" ? "selected" : ""}>Green</option>
        </select>
      </td>
      <td width="200px"><input type="text" class="form-control" value="${variant.price}" data-index="${index}" data-field="price"></td>
      <td>
        <div class="d-flex">
          <div class="counter-container">
            <input type="number" class="counter-input" value="${variant.quantity}" readonly>
            <div>
              <a href="javascript:void(0)" class="counter-btn" data-action="decrease" data-index="${index}">-</a>
              <a href="javascript:void(0)" class="counter-btn" data-action="increase" data-index="${index}">+</a>
            </div>
          </div>
          <a href="javascript:void(0)" class="btn btn-sm text-danger" data-index="${index}"><i class="fa-solid fa-trash"></i></a>
        </div>
      </td>
    `;

    variantsTable.append(row);
  });
};

// Add new variant
addVariantButton.addEventListener("click", () => {
  variants.push({
    size: "Choose Size",
    color: "Choose Color",
    price: "0.00",
    quantity: 0,
    image: "./assets/icons/image-icon.svg",
  });
  renderVariants();
});

// Delete a variant
variantsTable.addEventListener("click", (e) => {
  const deleteButton = e.target.closest("[data-index]");
  if (deleteButton && deleteButton.querySelector("i.fa-trash")) {
    const index = deleteButton.dataset.index;
    variants.splice(index, 1);
    renderVariants();
  }
});

// Adjust quantity
variantsTable.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (e.target.matches("[data-action='increase']")) {
    variants[index].quantity++;
    renderVariants();
  } else if (e.target.matches("[data-action='decrease']") && variants[index].quantity > 0) {
    variants[index].quantity--;
    renderVariants();
  }
});

// Handle file upload and preview
variantsTable.addEventListener("change", (e) => {
  if (e.target.matches(".file-input")) {
    const index = e.target.dataset.index;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        variants[index].image = reader.result;
        renderVariants();
      };
      reader.readAsDataURL(file);
    }
  }
});

// Handle changes to inputs/selects
variantsTable.addEventListener("input", (e) => {
  const index = e.target.dataset.index;
  const field = e.target.dataset.field;
  if (index !== undefined && field) {
    variants[index][field] = e.target.value;
  }
});

// Initial render
renderVariants();



var inputTags = document.querySelector('#inputTags');

// initialize Tagify on the above input node reference
new Tagify(inputTags)

});




