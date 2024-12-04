export const renderToDocument = (day: number, onClickHandler: any) => {
  const getStartedButton = document.createElement("input");
  getStartedButton.type = "button";
  getStartedButton.value = "BOOM";
  getStartedButton.onclick = onClickHandler;

  document.getElementById(
    "app"
  ).innerHTML = `<h1>Day ${day} of Advent of Code</h1>`;

  document.getElementById("app")?.appendChild(getStartedButton);
};
