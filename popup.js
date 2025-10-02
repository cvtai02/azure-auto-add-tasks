(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      // helper functions must be inside this block
      const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      const enterTitles = (text) => {
        const inputs = document.querySelectorAll('input[aria-label="Title field"]');
        inputs.forEach(element => {
          element.value = text;
          element.dispatchEvent(new Event("input", { bubbles: true }));
          element.dispatchEvent(new Event("change", { bubbles: true }));
        });
      };

      const assignPeople = async (name) => {
        const inputs = document.querySelectorAll('input[aria-label="Assigned To"]');
        if (inputs.length === 0) {
          return;
        }
        for (const input of inputs) {
          input.value = name;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));

        }
        await wait(1000);
        
        const selections = document.querySelectorAll('div[id="__bolt-sug-row-0"]');
        selections.forEach(selection => selection.firstChild.firstChild.click());
      }; 

      const selectActivity = (activity) => {
        const inputs = document.querySelectorAll('input[aria-labelledby="__bolt-Activity"]');
        if (inputs.length === 0) {
          return;
        }
        inputs.forEach(input => {
          input.value = activity;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        });
      };

      const fillOriginEstimateAndRemainingWork = (hour) => {
        const firstInputs = document.querySelectorAll('input[aria-labelledby="__bolt-Original-Estimate"]');
        if (firstInputs.length === 0) {
          return;
        }
        firstInputs.forEach(input => {
          input.value = hour;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        });

        const secondInputs = document.querySelectorAll('input[aria-labelledby="__bolt-Remaining-Work"]');
        if (secondInputs.length === 0) {
          return;
        }
        secondInputs.forEach(input => {
          input.value = hour;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        });
      };

      async function clickAllSaveButtons() {
        const saveButtons = [...document.querySelectorAll('button.bolt-split-button-main')]
          .filter(btn => btn.textContent.includes("Save and Close"));

        saveButtons.forEach(btn => btn.click());
      }

      const tasks = [
        {
          name: "Dev - Implement Frontend and Backend",
          estimate: 5,
        },

        {
          name: "Dev - Write Unit Tests",
          estimate: 1,
        },
        {
          name: "Dev - Code Review",
          estimate: 1,
        },
        {
          name: "Dev - Smoke Test",
          estimate: 1,
        },
        {
          name: "Dev - Research V1",
          estimate: 1,
        }
      ]

      for (const task of tasks) {
        const buttons = document.querySelectorAll('button[aria-label="Add: Task"]');
        buttons.forEach(btn => btn.click());
        await wait(2000 + 300 * tasks.length);
        enterTitles(task.name);
        selectActivity("Development");
        fillOriginEstimateAndRemainingWork(task.estimate);
        await assignPeople("Tai Chu Van");
        await wait(1000);
        clickAllSaveButtons();
        await wait(2000 + 1000 * tasks.length);
      }
    }
  });
})();


