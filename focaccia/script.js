function showFocacciaAdvanced(button) {
  let content = document.getElementById("advancedFocacciaOptions");

  if (content.style.display == "none") {
    content.style.display = "";
    button.innerHTML = "Nascondi opzioni avanzate";
  } else {
    content.style.display = "none";
    button.innerHTML = "Mostra opzioni avanzate";
  }
}

function submitForm() {
  total = Number(document.getElementById("total").value);
  hydration = Number(document.getElementById("hydration").value / 100);
  saltRatio = Number(document.getElementById("saltRatio").value / 100);
  oliveOilRatio = Number(document.getElementById("oliveOilRatio").value / 100);
  yeastRatio = Number(document.getElementById("yeastRatio").value / 100);

  computeAmounts(
    total,
    hydration,
    saltRatio,
    oliveOilRatio,
    yeastRatio
  );
}

function computeAmounts(
  total,
  hydration,
  saltRatio,
  oliveOilRatio,
  yeastRatio
) {


  // total flour desired in the bread
  let finalAp = total / (1 + hydration + saltRatio + yeastRatio + oliveOilRatio);
  // total water desired in the bread
  let finalWater = hydration * finalAp;
  // total salt desired in the bread
  let finalSalt = saltRatio * finalAp;

  let finalYeast = yeastRatio * finalAp;

  let finalOliveOil = oliveOilRatio * finalAp;

  // actual ingredients

  // console.log(
  //   "flour",
  //   finalWw,
  //   finalAp,
  //   totalFlourInLeavenUsed,
  //   finalWw + finalAp + totalFlourInLeavenUsed
  // );
  // console.log(
  //   "water",
  //   finalWater,
  //   totalWaterInLeavenUsed,
  //   finalWater + totalWaterInLeavenUsed
  // );

  // console.log(
  //   "hydration",
  //   (finalWater + totalWaterInLeavenUsed) /
  //     (finalWw + finalAp + totalFlourInLeavenUsed)
  // );


  console.assert(
    Math.abs(finalAp + finalWater + finalSalt + finalYeast + finalOliveOil - total) <
    1,
    "Ingredients do not add up. Total:", finalAp, finalWater, finalSalt, finalYeast, finalOliveOil,
    'AP:', finalAp, 'water:', finalWater, 'salt:', finalSalt, 'yeast:', finalYeast, 'olive oil:', finalOliveOil
  );

  finalAp = Math.round(finalAp);
  finalWater = Math.round(finalWater);
  if (finalSalt < 10) {
    finalSalt = Math.round(finalSalt * 10) / 10;
  } else {
    finalSalt = Math.round(finalSalt);
  }

  if (finalYeast < 10) {
    finalYeast = Math.round(finalYeast * 10) / 10;
  } else {
    finalYeast = Math.round(finalYeast);
  }
  finalOliveOil = Math.round(finalOliveOil);

  updateAmounts(
    finalAp,
    finalWater,
    finalSalt,
    finalYeast,
    finalOliveOil,
  );
}

function updateAmounts(
  apFlour,
  water,
  salt,
  yeast,
  oliveOil
) {
  document.getElementById("apFlour").innerHTML = apFlour;
  document.getElementById("water").innerHTML = water;
  document.getElementById("salt").innerHTML = salt;
  document.getElementById("yeast").innerHTML = yeast;
  document.getElementById("oliveOil").innerHTML = oliveOil;
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
