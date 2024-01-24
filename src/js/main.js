import "../css/style.css";
import { darkModuleHandle } from "./utils";
import { startGame } from "./game";

darkModuleHandle();

const startGameButton = document.getElementById("startGame");

startGameButton.addEventListener("click", startGame);
