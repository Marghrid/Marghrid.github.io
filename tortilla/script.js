function showTortillaAdvanced(button) {
  let content = document.getElementById("advancedTortillaOptions");

  if (content.style.display == "none") {
    content.style.display = "";
    button.innerHTML = "Hide advanced options";
  } else {
    content.style.display = "none";
    button.innerHTML = "Show advanced options";
  }
}

function submitForm() {
  numberTortillas = Number(document.getElementById("numberTortillas").value);
  flourPerTortilla = Number(document.getElementById("flourPerTortilla").value);
  hydration = Number(document.getElementById("hydration").value);
  butterRatio = Number(document.getElementById("butterRatio").value);
  saltRatio = Number(document.getElementById("saltRatio").value);
  bakingPowderRatio = Number(document.getElementById("bakingPowderRatio").value);

  computeAmounts(
    numberTortillas,
    flourPerTortilla,
    hydration,
    butterRatio,
    saltRatio,
    bakingPowderRatio

  );
}

function computeAmounts(
  numberTortillas,
  flourPerTortilla,
  hydration,
  butterRatio,
  saltRatio,
  bakingPowderRatio
) {

  // total flour desired in the pasta dough
  let totalFlour = Math.round(numberTortillas * flourPerTortilla);
  let totalWater = Math.round((hydration / 100) * totalFlour);
  let totalButter = Math.round((butterRatio / 100) * totalFlour);
  let totalSalt = Math.round((saltRatio / 10) * totalFlour) / 10;
  let totalBakingPowder = Math.round((bakingPowderRatio / 10) * totalFlour) / 10;

  updateAmounts(
    numberTortillas,
    totalFlour,
    totalWater,
    totalButter,
    totalSalt,
    totalBakingPowder
  );
}


function updateAmounts(
  numberTortillas,
  totalFlour,
  totalWater,
  totalButter,
  totalSalt,
  totalBakingPowder
) {
  document.getElementById("flour").innerHTML = totalFlour;
  document.getElementById("water").innerHTML = totalWater;
  document.getElementById("butter").innerHTML = totalButter;
  document.getElementById("salt").innerHTML = totalSalt;
  document.getElementById("bakingPowder").innerHTML = totalBakingPowder;
  document.getElementById("numberTortillasOut").innerHTML = numberTortillas;
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
