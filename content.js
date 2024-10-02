// Listen for any answer choices being added after runtime
const strikeStyle =
  "background-color: transparent; right: 10px; font-size: 30px; position: absolute; text-decoration: none !important; color: red; border: none; z-index: 2";

const bodyElement = document.body;
const config = { childList: true, subtree: true };

const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "DIV") {
          if (isValid(node)) {
            initChoice(node);
          }
        }
      });
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(bodyElement, config);

const answerDivs = document.querySelectorAll(".answer");
answerDivs.forEach((element) => {
  if (isValid(element)) initChoice(element);
});

/**
 * FUNCTIONS
 */

function initChoice(element) {
  const button = document.createElement("button");
  button.setAttribute("type", "button"); // Prevents button from submitting since form is an ancestor
  button.id = "strikethrough";
  button.textContent = "-";
  button.style = strikeStyle;

  element.style.display = "flex";
  element.appendChild(button);

  let striked = false;

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!striked) {
      element.style.textDecoration = "line-through";
      element.style.color = "gray";
    } else {
      element.style.textDecoration = "initial";
      element.style.color = "initial";
    }

    analyticSend(!striked);

    striked = !striked;
  });
}

function isValid(element) {
  return (
    element.classList.contains("answer") &&
    element.parentElement.nodeName == "FIELDSET"
  );
}

function analyticSend(data) {
  chrome.runtime.sendMessage(data);
}

console.log("Loaded Canvas Quiz Strikethrough");
