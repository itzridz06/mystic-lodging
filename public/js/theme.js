const selector = document.getElementById("themeSelector");

if(selector){
  selector.addEventListener("change", function () {
    const theme = this.value;

    document.body.className = theme;

    localStorage.setItem("theme", theme);
  });
}

window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "default";

  document.body.className = savedTheme;

  const selector = document.getElementById("themeSelector");

  if(selector){
    selector.value = savedTheme;
  }
};