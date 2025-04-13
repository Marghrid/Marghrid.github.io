// Saves the index of the currently displayed photo
currentPreviewPhotoIndex = 0;

// Last loaded photo index
lastLoadedPhotoIndex = 0;

function loadNewImages() {
  const gallery = document.getElementById("gallery-photos");
  const previousLoadedPhotoIndex = lastLoadedPhotoIndex;
  lastLoadedPhotoIndex += 60; // Load 60 at a time
  photoFiles
    .slice(previousLoadedPhotoIndex, lastLoadedPhotoIndex)
    .forEach(([image_src, thumbnail_src, metadata_src]) => {
      // Each photo in the gallery is a div with a background image, to make them square.
      const img = document.createElement("div");
      img.style.background = "url('" + thumbnail_src + "')";
      img.style.backgroundSize = "cover";
      img.style.backgroundPosition = "center";

      img.onclick = function () {
        openPreview(image_src, metadata_src);
      };
      img.classList.add("photo-thumbnail");

      gallery.appendChild(img);
    });

  openPreviewFromURL();

  window.addEventListener("popstate", function () {
    openPreviewFromURL();
  });
  window.addEventListener("pushstate", function () {
    openPreviewFromURL();
  });

  window.addEventListener("scroll", function () {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      loadNewImages();
    }
  });
}

function populateMetadataDiv(meta_src) {
  const metadata = JSON.parse(meta_src);
  // console.log(metadata);
  const info = document.getElementById("preview-info");
  info.innerHTML = "";
  if (metadata.title) {
    let h2 = document.createElement("h2");
    h2.innerHTML = metadata.title;
    info.appendChild(h2);
    const currImg = document.getElementById("preview-curr-img");
    currImg.alt = "Preview of " + metadata.title;
  }

  if (metadata.description) {
    let p = document.createElement("p");
    p.classList.add("photo-description");
    let em = document.createElement("em");
    em.innerHTML = metadata.description;
    p.appendChild(em);
    info.appendChild(p);
  }

  if (metadata.location) {
    let p = document.createElement("p");
    let i = document.createElement("i");
    i.classList.add("fas", "fa-location-dot");
    p.appendChild(i);
    p.innerHTML += "&nbsp" + metadata.location;
    info.appendChild(p);
  }

  if (metadata.fileInfo) {
    // console.log(metadata.fileInfo);
    if (metadata.fileInfo.date) {
      let p = document.createElement("p");
      let i = document.createElement("i");
      i.classList.add("fa-solid", "fa-calendar-days");
      p.appendChild(i);
      p.innerHTML += "&nbsp" + metadata.fileInfo.date;
      info.appendChild(p);
    }

    let more_info = [];
    if (metadata.fileInfo.camera) {
      more_info.push(metadata.fileInfo.camera);
    }
    if (metadata.fileInfo.aperture) {
      more_info.push(metadata.fileInfo.aperture);
    }
    if (metadata.fileInfo.shutterSpeed) {
      more_info.push(metadata.fileInfo.shutterSpeed);
    }
    if (metadata.fileInfo.focalLength) {
      more_info.push(metadata.fileInfo.focalLength);
    }
    if (metadata.fileInfo.iso) {
      more_info.push("ISO&nbsp" + metadata.fileInfo.iso);
    }

    if (more_info.length > 0) {
      let p = document.createElement("p");
      let i = document.createElement("i");
      i.classList.add("fas", "fa-camera");
      p.appendChild(i);
      p.innerHTML += "&nbsp" + more_info.join(", ");
      info.appendChild(p);
    }
  }
}

function loadMetadata(src) {
  // load metadata from the json file in src and populate the preview info
  const request = new XMLHttpRequest();
  request.open("GET", src);
  request.send();

  request.onload = function () {
    if (request.status === 200) {
      populateMetadataDiv(request.responseText);
    } else {
      console.log("Error loading metadata: " + request.status);
    }
  };
}

// Event handlers
function previewKeyHandler(event) {
  if (event.key == "Escape") {
    closePreview();
  } else if (event.key == "ArrowLeft") {
    displayPrevPreview();
  } else if (event.key == "ArrowRight") {
    displayNextPreview();
  }
}

// Touch events for mobile swipe detection
let touchstartX = 0;
let touchendX = 0;

function previewTouchStartHandler(e) {
  if (e.touches.length == 1) {
    touchstartX = e.changedTouches[0].screenX;
  } else {
    touchstartX = null;
  }
}

function previewTouchEndHandler(e) {
  if (!touchstartX) {
    return; // touchstartX is null, do nothing
  }
  if (window.visualViewport.scale > 1) {
    // if the viewport is zoomed in, don't do anything
    return;
  }
  touchendX = e.changedTouches[0].screenX;
  checkDirection();
}

function checkDirection() {
  if (touchendX < touchstartX - 15) {
    displayNextPreview();
  }
  if (touchendX > touchstartX + 15) {
    displayPrevPreview();
  }
}

function updateURL(image_src) {
  const url = new URL(window.location);
  url.searchParams.set(
    "img",
    image_src.replace("images/previews/", "").replace("_preview.jpg", "")
  );
  window.history.pushState({}, "", url);
}

function clearURL() {
  const url = new URL(window.location);
  url.searchParams.delete("img");
  window.history.pushState({}, "", url);
}

function displayPrevPreview() {
  const preview = document.getElementById("preview");
  const oldImgPreview = document.getElementById("img-preview");
  oldImgPreview.id = "old-img-preview";
  oldImgPreview.classList.add("leave-right");
  window.setTimeout(function () {
    // remove child once animation is done
    preview.removeChild(oldImgPreview);
  }, 290);

  // compute the next image index
  const nextIndex =
    (currentPreviewPhotoIndex - 1 + photoFiles.length) % photoFiles.length;
  const previewImg = createPreviewImg(
    photoFiles[nextIndex][0],
    photoFiles[nextIndex][2]
  );
  previewImg.classList.add("enter-left");
  preview.insertBefore(previewImg, preview.firstChild);

  window.setTimeout(function () {
    // remove class once animation is done
    previewImg.classList.remove("enter-left");
  }, 290);

  currentPreviewPhotoIndex = nextIndex;
  updateURL(photoFiles[nextIndex][0]);
}

function displayNextPreview() {
  const preview = document.getElementById("preview");
  const oldImgPreview = document.getElementById("img-preview");
  oldImgPreview.id = "old-img-preview";
  oldImgPreview.classList.add("leave-left");
  window.setTimeout(function () {
    // remove child once animation is done
    preview.removeChild(oldImgPreview);
  }, 290);

  // compute the next image index
  const nextIndex = (currentPreviewPhotoIndex + 1) % photoFiles.length;
  const previewImg = createPreviewImg(
    photoFiles[nextIndex][0],
    photoFiles[nextIndex][2]
  );
  previewImg.classList.add("enter-right");
  preview.insertBefore(previewImg, preview.firstChild);

  window.setTimeout(function () {
    // remove class once animation is done
    previewImg.classList.remove("enter-right");
  }, 290);

  currentPreviewPhotoIndex = nextIndex;

  updateURL(photoFiles[nextIndex][0]);
}

function closePreview() {
  const preview = document.getElementById("preview");
  // Remove image preview
  const previewImg = document.getElementById("img-preview");
  if (previewImg) {
    preview.removeChild(previewImg);
  }

  // Disable event listeners
  window.removeEventListener("keydown", previewKeyHandler);
  document.removeEventListener("touchstart", previewTouchStartHandler);
  document.removeEventListener("touchend", previewTouchEndHandler);

  // Re-enable scrolling in body
  document.body.classList.remove("no-scroll");

  // Hide preview softly
  preview.style.opacity = "0";
  window.setTimeout(function removethis() {
    preview.style.display = "none";
  }, 290);

  clearURL();
}

function openPreview(image_src, metadata_src) {
  // open preview
  const old_preview = document.getElementById("img-preview");
  if (old_preview) {
    document.getElementById("preview").removeChild(old_preview);
  }
  const previewImg = createPreviewImg(image_src, metadata_src);
  const preview = document.getElementById("preview");
  preview.insertBefore(previewImg, preview.firstChild);
  // Show preview softly
  preview.style.opacity = "0";
  preview.style.display = "block";

  window.setTimeout(function addthis() {
    preview.style.opacity = "1";
  }, 1);

  // Disable scrolling in body
  document.body.classList.add("no-scroll");

  // Set current phot index and enable event listeners
  currentPreviewPhotoIndex = photoFiles.findIndex((i) => i[0] == image_src);
  window.addEventListener("keydown", previewKeyHandler);
  document.addEventListener("touchstart", previewTouchStartHandler);
  document.addEventListener("touchend", previewTouchEndHandler);

  updateURL(image_src);
}

function openPreviewFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.get("img")) {
    closePreview();
    return; // no image to preview
  }
  // This may fail if naming convention is not followed
  const image_src = "images/previews/" + urlParams.get("img") + "_preview.jpg";
  const meta_src = "images/metadata/" + urlParams.get("img") + "_metadata.json";
  openPreview(image_src, meta_src);
}

// Creates the img-preview div populated with the image and metadata
function createPreviewImg(image_src, metadata_src) {
  const imgPreview = document.createElement("div");
  imgPreview.id = "img-preview";
  const img = document.createElement("img");
  img.src = image_src;
  img.id = "preview-curr-img";
  img.onclick = function (event) {
    event.stopPropagation();
  };
  imgPreview.appendChild(img);

  const info = document.createElement("div");
  info.id = "preview-info";
  info.onclick = function (event) {
    event.stopPropagation();
  };
  imgPreview.appendChild(info);
  loadMetadata(metadata_src);

  return imgPreview;
}

// Load gallery view on page load
window.onload = loadNewImages;
