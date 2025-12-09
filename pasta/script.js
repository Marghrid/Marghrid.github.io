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
  );
}

function updateAmounts(
  eggsWeight,
  finalAp,
  finalSemolina,
) {
  document.getElementById("eggsOut").innerHTML = eggsWeight;
  document.getElementById("apFlour").innerHTML = finalAp;
  document.getElementById("semolinaFlour").innerHTML = finalSemolina;
}

window.onload = submitForm;
