function showPastaAdvanced(button) {
  let content = document.getElementById("advancedPastaOptions");

  if (content.style.display == "none") {
    content.style.display = "";
    button.innerHTML = "Hide advanced options";
  } else {
    content.style.display = "none";
    button.innerHTML = "Show advanced options";
  }
}

function submitForm() {
  eggsWeight = Number(document.getElementById("eggsWeight").value);
  flourWeightRatio = Number(document.getElementById("flourWeightRatio").value);
  semolinaWeightRatio = Number(document.getElementById("semolinaWeightRatio").value);

  computeAmounts(
    eggsWeight,
    flourWeightRatio,
    semolinaWeightRatio,
  );
}

function computeAmounts(
  eggsWeight,
  flourWeightRatio,
  semolinaWeightRatio,
) {

  if (semolinaWeightRatio > 100) {
    semolinaWeightRatioWarning = "semolina ratio cannot be over 100%";
  } else {
    semolinaWeightRatioWarning = "";
  }

  // total flour desired in the pasta dough
  let totalFlour = eggsWeight * flourWeightRatio;
  // total water desired in the bread
  let finalSemolina = semolinaWeightRatio * totalFlour / 100;
  let finalAp = totalFlour - finalSemolina;

  finalAp = Math.round(finalAp);
  finalSemolina = Math.round(finalSemolina);

  updateAmounts(
    eggsWeight,
    finalAp,
    finalSemolina,
    semolinaWeightRatioWarning,
  );
}

function updateAmounts(
  eggsWeight,
  finalAp,
  finalSemolina,
  semolinaWeightRatioWarning,
) {
  document.getElementById("eggsOut").innerHTML = eggsWeight;
  document.getElementById("apFlour").innerHTML = finalAp;
  document.getElementById("semolinaFlour").innerHTML = finalSemolina;

  if (semolinaWeightRatioWarning) {
    document.getElementById("semolinaWeightRatioWarning").style.display = "";
    document.getElementById("semolinaWeightRatioWarningText").innerHTML =
      semolinaWeightRatioWarning;
  } else {
    document.getElementById("semolinaWeightRatioWarning").style.display = "none";
  }
}


function handleDecimalInput(el) {
  var raw = el.value;
  if (raw === "") { submitForm(); return; }
  var start = typeof el.selectionStart === 'number' ? el.selectionStart : null;
  // normalize comma to dot and remove leading minus
  var norm = raw.replace(/,/g, ".");
  if (norm.charAt(0) === "-") norm = norm.slice(1);

  // allow only digits and at most one dot (including a trailing dot while typing)
  if (!/^[0-9]*\.?[0-9]*$/.test(norm)) {
    el.value = "";
    submitForm();
    return;
  }

  // single dot -> treat as 0.
  if (norm === ".") {
    el.value = "0.";
    try { el.setSelectionRange(2, 2); } catch (e) { }
    submitForm();
    return;
  }

  // keep a trailing dot while the user is typing (e.g. "0.")
  if (norm.charAt(norm.length - 1) === ".") {
    if (norm.length === 1) el.value = "0.";
    else el.value = norm;
    try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) { }
    submitForm();
    return;
  }

  if (norm === "") { el.value = ""; submitForm(); return; }

  var v = parseFloat(norm);
  if (isNaN(v)) {
    el.value = "";
    submitForm();
    return;
  }

  var newVal = String(Math.abs(v));
  if (el.value !== newVal) {
    el.value = newVal;
    try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) { }
  }
  submitForm();
}

window.onload = submitForm;
