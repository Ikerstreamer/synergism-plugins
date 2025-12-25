// ==UserScript==
// @name         Ambrosia Loadout Quickbar
// @namespace    https://github.com/Ikerstreamer/synergism-plugins
// @version      0.1
// @description  A simple script for the game synergism that allows you to import ambrosia loadouts via clipboard.
// @author       IkerStream
// @match        https://synergism.cc/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=synergism.cc
// @grant        none
// ==/UserScript==

(() => {
    const callback = (elem) => () => {
        const okButton = document.getElementById("ok_alert");

        const loadoutSlots = Array.from(document.getElementsByClassName("blueberryLoadoutSlot"))
            .filter((elem) => elem.id.match(/^blueberryLoadout[1-8]$/))
            .toSorted((elem1, elem2) => elem1.id[-1] - elem2.id[-1]);
        const toggleButton = document.getElementById("blueberryToggleMode");
        const cssFile = document.createElement("link");
        cssFile.rel = "stylesheet";
        cssFile.href = "https://raw.githubusercontent.com/Ikerstreamer/synergism-plugins/refs/heads/main/loadoutStyles.css";

        document.getElementsByTagName("head").item(0)
            .insertAdjacentElement("beforeend", cssFile);

        const container = document.createElement("div");
        container.classList.add("ambrosia-quick-bar-loadout-container");
        /**
         *
         * @param {HTMLElement} elem
         */
        function setActiveBorder(elem) {
            elem.classList.add("ambrosia-quick-bar-active");
        }
        /**
        *
        * @param {HTMLElement} elem
        */
        function removeActiveBorder(elem) {
            elem.classList.remove("ambrosia-quick-bar-active");
        }

        let selectedLoadout = -1;
        const quickButtons = [];
        for (let i = 0; i < 8; i++) {
            const newButton = document.createElement("button");
            newButton.classList.add("blueberryLoadoutSlot");

            newButton.addEventListener("click", () => {
                const swapBack = false;
                if (toggleButton.textContent != "MODE: LOAD LOADOUT") {
                    toggleButton.click();
                    swapBack = true;
                }

                loadoutSlots.at(i).click();
                okButton.click();
                if (selectedLoadout > -1) {
                    removeActiveBorder(quickButtons.at(selectedLoadout));
                    removeActiveBorder(loadoutSlots.at(selectedLoadout));
                }
                setActiveBorder(newButton);
                setActiveBorder(loadoutSlots.at(i));
                selectedLoadout = i;

                if (swapBack) {
                    toggleButton.click();
                }
            });
            newButton.style.display = "flex";
            newButton.textContent = i + 1;
            quickButtons.push(newButton);
            container.insertAdjacentElement("beforeend", newButton);
        }

        document.querySelector("header div.subHeader").insertAdjacentElement("afterend", container);

        // Ensure the listener gets detached
        elem.removeEventListener("click", callback);
    };

    function setup() {
        const elem = document.getElementById("exitOffline");
        if (!elem) {
            setTimeout(setup, 250);
            return;
        }
        elem.addEventListener("click", callback(elem));
    }
    setup();
})();