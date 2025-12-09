function showPizzaAdvanced(button) {
  let content = document.getElementById("advancedPizzaOptions");

  if (content.style.display == "none") {
    content.style.display = "";
    button.innerHTML = "Hide advanced options";
  } else {
    content.style.display = "none";
    button.innerHTML = "Show advanced options";
  }
}

function submitForm() {
  servings = Number(document.getElementById("servings").value);
  ballWeight = Number(document.getElementById("ballWeight").value);
  hydration = Number(document.getElementById("hydration").value / 100);
  saltRatio = Number(document.getElementById("saltRatio").value / 100);
  yeastRatio = Number(document.getElementById("yeastRatio").value / 100);

  computeAmounts(
    servings * ballWeight,
    hydration,
    saltRatio,
    yeastRatio
  );

  document.getElementById("totalDough").innerHTML = Math.round(servings * ballWeight);
  // document.getElementById("ballWeightOut").innerHTML = ballWeight;
  document.getElementById("servingsOut").innerHTML = servings;
}

function computeAmounts(
  total,
  hydration,
  saltRatio,
  yeastRatio,
) {


  // total flour desired in the bread
  let finalAp = total / (1 + hydration + saltRatio + yeastRatio);
  // total water desired in the bread
  let finalWater = hydration * finalAp;
  // total salt desired in the bread
  let finalSalt = saltRatio * finalAp;

  let finalYeast = yeastRatio * finalAp;

  console.assert(
    Math.abs(finalAp + finalWater + finalSalt + finalYeast - total) <
    1,
    "Ingredients do not add up. Total:", finalAp, finalWater, finalSalt, finalYeast,
    'AP:', finalAp, 'water:', finalWater, 'salt:', finalSalt, 'yeast:', finalYeast
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

  updateAmounts(
    finalAp,
    finalWater,
    finalSalt,
    finalYeast,
  );
}

function updateAmounts(
  apFlour,
  water,
  salt,
  yeast,
) {
  document.getElementById("apFlour").innerHTML = apFlour;
  document.getElementById("water").innerHTML = water;
  document.getElementById("salt").innerHTML = salt;
  document.getElementById("yeast").innerHTML = yeast;
}

window.onload = submitForm;
