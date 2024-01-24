export const darkModuleHandle = () => {
	const htmlElement = document.documentElement;
	const darkModeSwitcher = document.getElementById("toggleDarkMode");

	if (localStorage.getItem("mode") === "dark") {
		htmlElement.classList.add("dark");
		darkModeSwitcher.checked = true;
	}

	darkModeSwitcher.addEventListener("input", () => {
		htmlElement.classList.toggle("dark");

		if (htmlElement.classList.contains("dark")) {
			localStorage.setItem("mode", "dark");
		} else {
			localStorage.setItem("mode", "light");
		}
	});
};
