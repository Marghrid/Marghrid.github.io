function showBreadAdvanced(button) {
  let content = document.getElementById("advancedBreadOptions");

  if (content.style.display == "none") {
    content.style.display = "";
    button.innerHTML = "Hide bread options";
  } else {
    content.style.display = "none";
    button.innerHTML = "Show bread options";
  }
}

function showLeavenAdvanced(button) {
  let content = document.getElementById("advancedLeavenOptions");

  if (content.style.display == "none") {
    content.style.display = "";
    button.innerHTML = "Hide leaven composition";
  } else {
    content.style.display = "none";
    button.innerHTML = "Show leaven composition";
  }
}

function submitForm() {
  leaven = Number(document.getElementById("leavenIn").value);
  total = Number(document.getElementById("total").value);
  hydration = Number(document.getElementById("hydration").value / 100);
  wwRatio = Number(document.getElementById("wwRatio").value / 100);
  saltRatio = Number(document.getElementById("saltRatio").value / 100);
  leavenWater = Number(document.getElementById("leavenWater").value);
  leavenAP = Number(document.getElementById("leavenAP").value);
  leavenStarter = Number(document.getElementById("leavenStarter").value);
  starterHydration = Number(
    document.getElementById("starterHydration").value / 100
  );

  computeAmounts(
    leaven,
    total,
    hydration,
    wwRatio,
    saltRatio,
    leavenWater,
    leavenAP,
    leavenStarter,
    starterHydration
  );
}

function computeAmounts(
  leavenUsed,
  total,
  hydration,
  wwRatio,
  saltRatio,
  waterInLeavenPrep,
  apInLeavenPrep,
  starterInLeavenPrep,
  starterHydration
) {
  if (leavenUsed > 0.25 * total) {
    leavenTotalWarning =
      "Too much leaven (" +
      leavenUsed +
      "g) for the amount of bread (" +
      total +
      "g). Recommended <25% (" +
      0.25 * total +
      "g).";
  } else {
    leavenTotalWarning = "";
  }

  let saltRatioPercent = saltRatio * 100;
  if (saltRatioPercent < 1) {
    saltRatioWarning = saltRatioPercent.toFixed(1) + "% is very little salt!";
  } else if (saltRatioPercent > 4.9) {
    saltRatioWarning = saltRatioPercent.toFixed(1) + "% salt is very salty!";
  } else {
    saltRatioWarning = "";
  }

  // console.log(
  //   "Computing amounts for",
  //   leavenUsed,
  //   "g of leaven with",
  //   starterInLeavenPrep,
  //   "g of starter with",
  //   starterHydration,
  //   "hydration,",
  //   apInLeavenPrep,
  //   "g of AP flour, and",
  //   waterInLeavenPrep,
  //   "g of water in the leaven prep."
  // );

  // flour in starter used for leaven prep
  let flourInStarter = starterInLeavenPrep / (1 + starterHydration);
  // water in starter used for leaven prep
  let waterInStarter = starterInLeavenPrep - flourInStarter;
  //  console.log("Flour in starter:", flourInStarter);
  //  console.log("Water in starter:", waterInStarter);

  // total leaven prep weight. This is all that goes in the jar the day before
  let totalLeavenPrep =
    waterInLeavenPrep + apInLeavenPrep + starterInLeavenPrep;

  if (totalLeavenPrep < leavenUsed) {
    leavenCompWarning =
      "Leaven prep (" +
      totalLeavenPrep +
      "g) is smaller than leaven used (" +
      leavenUsed +
      "g).";
  } else {
    leavenCompWarning = "";
  }
  // total amount of flour in the leaven that was actually used for the bread
  let totalFlourInLeavenUsed =
    ((apInLeavenPrep + flourInStarter) * leavenUsed) / totalLeavenPrep;
  // total amount of water in the leaven that was actually used for the bread
  let totalWaterInLeavenUsed =
    ((waterInLeavenPrep + waterInStarter) * leavenUsed) / totalLeavenPrep;

  console.assert(
    Math.abs(totalFlourInLeavenUsed + totalWaterInLeavenUsed - leavenUsed) < 1
  );
  //  console.log("Flour in leaven used:", totalFlourInLeavenUsed);
  //  console.log("Water in leaven used:", totalWaterInLeavenUsed);

  // total flour desired in the bread
  let totalDesiredFlour = total / (1 + hydration + saltRatio);
  // total water desired in the bread
  let totalDesiredWater = hydration * totalDesiredFlour;
  // total salt desired in the bread
  let finalSalt = saltRatio * totalDesiredFlour;

  // flour desired in the bread
  let finalWw = wwRatio * totalDesiredFlour;
  let totalDesiredApFlour = totalDesiredFlour - finalWw;

  // actual ingredients
  let finalWater = totalDesiredWater - totalWaterInLeavenUsed;
  let finalAp = totalDesiredApFlour - totalFlourInLeavenUsed;

  let wwRatioPercent = wwRatio * 100;
  if (wwRatioPercent > 100) {
    wwRatioWarning = "WW ratio cannot be " + wwRatioPercent + "%.";
  } else if (finalAp < 0) {
    wwRatioWarning = "The ratio of WW flour (" + wwRatioPercent + "%) is too high to account for the AP flour in the leaven.";
  }
  else {
    wwRatioWarning = "";
  }

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
    Math.abs(finalWw + finalAp + finalWater + finalSalt + leavenUsed - total) <
    1,
    "Ingredients do not add up.",
    finalWw,
    finalAp,
    finalWater,
    finalSalt,
    leavenUsed,
    total
  );

  finalLeaven = Math.round(leavenUsed);
  finalAp = Math.round(finalAp);
  finalWw = Math.round(finalWw);
  finalWater = Math.round(finalWater);
  if (finalSalt < 10) {
    finalSalt = Math.round(finalSalt * 10) / 10;
  } else {
    finalSalt = Math.round(finalSalt);
  }


  updateAmounts(
    finalLeaven,
    finalAp,
    finalWw,
    finalWater,
    finalSalt,
    leavenTotalWarning,
    leavenCompWarning,
    saltRatioWarning,
    wwRatioWarning
  );
}

function updateAmounts(
  leaven,
  apFlour,
  wwFlour,
  remainingWater,
  salt,
  leavenTotalWarning,
  leavenCompWarning,
  saltRatioWarning,
  wwRatioWarning
) {
  document.getElementById("leavenOut").innerHTML = leaven;
  document.getElementById("apFlour").innerHTML = apFlour;
  document.getElementById("wwFlour").innerHTML = wwFlour;
  document.getElementById("water").innerHTML = remainingWater;
  document.getElementById("salt").innerHTML = salt;

  if (leavenTotalWarning) {
    document.getElementById("leavenTotalWarning").style.display = "";
    document.getElementById("leavenTotalWarningText").innerHTML =
      leavenTotalWarning;
  } else {
    document.getElementById("leavenTotalWarning").style.display = "none";
  }

  if (leavenCompWarning) {
    document.getElementById("leavenCompWarning").style.display = "";
    document.getElementById("leavenCompWarningText").innerHTML =
      leavenCompWarning;
  } else {
    document.getElementById("leavenCompWarning").style.display = "none";
  }

  if (saltRatioWarning) {
    document.getElementById("saltRatioWarning").style.display = "";
    document.getElementById("saltRatioWarningText").innerHTML =
      saltRatioWarning;
  } else {
    document.getElementById("saltRatioWarning").style.display = "none";
  }

  if (wwRatioWarning) {
    document.getElementById("wwRatioWarning").style.display = "";
    document.getElementById("wwRatioWarningText").innerHTML =
      wwRatioWarning;
  } else {
    document.getElementById("wwRatioWarning").style.display = "none";
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

function handleIntegerInput(el) {
  var raw = el.value;
  if (raw === "") { submitForm(); return; }
  // preserve caret position if possible
  var start = typeof el.selectionStart === 'number' ? el.selectionStart : null;
  // strip any non-digit characters (no dots allowed)
  var norm = raw.replace(/[^0-9]/g, "");

  if (norm === "") { el.value = ""; submitForm(); return; }

  var v = parseInt(norm, 10);
  if (isNaN(v)) { el.value = ""; submitForm(); return; }

  var newVal = String(Math.abs(v));
  if (el.value !== newVal) {
    el.value = newVal;
    try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) { }
  }
  submitForm();
}


window.onload = submitForm;
