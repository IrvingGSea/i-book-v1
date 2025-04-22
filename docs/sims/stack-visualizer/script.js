let stack = [];
let counter = 1;

function renderStack() {
  const stackDiv = document.getElementById("stack");
  stackDiv.innerHTML = "<strong>Call Stack (Top = Most Recent):</strong><br>";
  for (let i = stack.length - 1; i >= 0; i--) {
    const div = document.createElement("div");
    div.className = "stack-item";
    div.textContent = stack[i];
    stackDiv.appendChild(div);
  }
}

function callFunction() {
  stack.push("Function Call " + counter++);
  renderStack();
}

function returnFunction() {
  if (stack.length > 0) {
    stack.pop();
  }
  renderStack();
}

function resetStack() {
  stack = [];
  counter = 1;
  renderStack();
}

window.onload = renderStack;
