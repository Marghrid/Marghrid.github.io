function toggleDarkMode() {
  document.body.classList.toggle("dark-theme");
  // const isDarkMode = document.body.classList.contains("dark-theme");
  // localStorage.setItem("darkMode", isDarkMode);
}
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  toggleDarkMode();
  document.getElementById("darkmode-toggle").checked = true;
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    const newColorScheme = event.matches ? "dark" : "light";
    toggleDarkMode();
    document.getElementById("darkmode-toggle").checked =
      newColorScheme === "dark";
  });
