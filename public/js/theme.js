const selector = document.getElementById("themeSelector");

if(selector){
  selector.addEventListener("change", function () {
    const theme = this.value;

    document.body.classList.remove(
      "default",
      "gryffindor",
      "slytherin",
      "ravenclaw",
      "hufflepuff"
    );

    document.body.classList.add(theme);

    localStorage.setItem("theme", theme);
  });
}

window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "default";

  document.body.classList.add(savedTheme);

  if(selector){
    selector.value = savedTheme;
  }
};