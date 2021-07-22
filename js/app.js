
const showSteps = () => {};

const input = document.getElementById("input");
const stepsElement = document.getElementById("steps");
const result = document.getElementById("res");
const allowedChars = " 01234567890()/*-+^ezi=.";

const solveThisInput = (equation) => {
  areComplex = {}; //This is steps
  steps = []; //This is steps
  areComplexLen = 0;
  solve(yard(idealString(equation)));
  let stepsStr = "<ul>";
  for (let step of steps) {
    stepsStr += `<li>${step.humanReadable}</li>`;
  }
  stepsStr += "</ul>";
  stepsElement.innerHTML = "Steps" + stepsStr;
  return areComplex["ID" + (areComplexLen - 1)].print();
};

const solveThisEquation = (equation, show = "rct") => {
  equation = equation.replace("z", "").replace("^(", "").replace(")=", "=");
  equation = equation.split("=");
  if (equation.length > 2) {
    result.innerText = "Bad Equation";
  } else {
    solve(yard(idealString(equation[0])));
    let leftSide = areComplex["ID" + (areComplexLen - 1)];
    solve(yard(idealString(equation[1])));
    let rightSide = areComplex["ID" + (areComplexLen - 1)].toTri();

    result.innerHTML = "";
    for (let k = 0; k < leftSide.real; k++) {
      //
      let sqrtOfR = Math.pow(
        rightSide.radius,
        1 / leftSide.real ? 1 / leftSide.real : 0
      );
      let oneOfTheAnswers = new RctComplex(
        Math.round(
          sqrtOfR *
            Math.cos(
              (rightSide.theta * DEG2RAD + 2 * k * Math.PI) / leftSide.real
            ) *
            ROUND_VALUE
        ) / ROUND_VALUE,
        Math.round(
          sqrtOfR *
            Math.sin(
              (rightSide.theta * DEG2RAD + 2 * k * Math.PI) / leftSide.real
            ) *
            ROUND_VALUE
        ) / ROUND_VALUE
      );
      oneOfTheAnswers =
        show == "rct" ? oneOfTheAnswers : oneOfTheAnswers.toTri();
      result.innerHTML +=
        `Z<sub>${k}</sub>=` + oneOfTheAnswers.print() + "<br/>";
    }
  }
};


const calculate = () => {
  let inpVal = input.value;
  if (count("(", inpVal) != count(")", inpVal)) {
    result.innerText = "Bad Input );";
  } else if (inpVal.length <= 0) {
    result.innerText = "";
  } else if (count("z", inpVal)) {
    result.innerText = "Zzz";
    solveThisEquation(inpVal);
  } else if (inpVal.split("e^").length - 1) {
    // e^1 => error
    if (inpVal.split("e^").length - 1 == inpVal.split("e^(").length - 1) {
      result.innerText = solveThisInput(inpVal);
    } else {
      result.innerText = "Something bad happened!";
      return;
    }
  } else {
    result.innerText = solveThisInput(inpVal);
  }
};

const convertToTri = () => {
  if (input.value.includes("z")) {
    solveThisEquation(input.value, "tri");
  } else {
    let tri = steps[`${steps.length - 1}`].res.toTri();

    result.innerHTML = tri.print();
  }
};

const convertToRct = () => {
  if (input.value.includes("z")) {
    solveThisEquation(input.value, "rct");
  } else {
    result.innerHTML = steps[`${steps.length - 1}`].res.print();
  }
};

const validateInput = (pressed) => {
  if (pressed == "Backspace") {
    input.value = input.value.slice(0, -1);
    calculate();
  } else if (pressed == "Enter") {
    calculate();
  } else if (pressed == "tri") {
    convertToTri();
  } else if (pressed == "h" || pressed == "H") {
    toggleHint();
  } else if (pressed.split("rct").length - 1) {
    convertToRct();
  } else if (count(pressed, allowedChars)) {
    input.value += pressed;
    calculate();
  } else if (pressed == "Space") {
    input.value += pressed;
  } else if (pressed == "c" || pressed == "C") {
    input.value="";
  }
};

//comment below if you want to use none readonly input field.
document.addEventListener("keydown", (event) => {
  let pressed = event.key;
  validateInput(pressed);
});

const toggleHint = () => {
  document.getElementById("hint").classList.toggle("hide");
};