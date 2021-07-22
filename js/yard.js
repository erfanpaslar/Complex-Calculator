//* https://en.wikipedia.org/wiki/Shunting-yard_algorithm
const yard = (infix) => {
  let ops = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
  let peek = (a) => a[a.length - 1];
  let stack = [];
  return count(" ", infix) == 1
    ? infix
    : infix
        .split(" ")
        .reduce((output, token) => {
          if (token && !(token in ops) && token != "(" && token != ")") {
            output.push(token);
          }
          if (token in ops) {
            while (peek(stack) in ops && ops[token] <= ops[peek(stack)])
              output.push(stack.pop());
            stack.push(token);
          }
          if (token == "(") {
            stack.push(token);
          }
          if (token == ")") {
            while (peek(stack) != "(" && stack.length) {
              output.push(stack.pop());
            }
            stack.pop();
          }
          return output;
        }, [])
        .concat(stack.reverse())
        .join(" ");
};

let idealString = (str) => {
  str = str.replace(/\s+/g, "");
  str = str.replaceAll("exp", "e^");
  let newStr = "";
  let i = 0;

  while (i < str.length) {
    if (
      (str[i] >= "0" && str[i] <= "9") ||
      str[i] == "." ||
      str[i] == "i" ||
      str[i] == "e"
    ) {
      newStr += str[i];
      while ((str[i + 1] >= "0" && str[i + 1] <= "9") || str[i + 1] == ".") {
        newStr += str[i + 1];
        i++;
      }
      if (str[i] >= "0" && str[i] <= "9" && str[i + 1] == "i") {
        //
      } else if (str[i] == "e" && str[i + 1] == "^") {
        //e^(2) not e^2
        i += 1;
        while (str[i] != ")") {
          newStr += str[i++];
        }
        newStr += ") ";
      } else {
        newStr += " ";
      }
    } else if (i == 0 && str[0] == "(") {
      newStr += str[i];
      newStr += " ";
    } else {
      if (str[i - 1] == "(" && "-+".includes(str[i])) {
        newStr += str[i];
      } else {
        newStr += str[i];
        if (i != 0) newStr += " ";
      }
    }
    i++;
  }
  return newStr;
};

var areComplex = {}; //This is steps
var steps = []; //This is steps
var areComplexLen = 0;

const solveIt = (first, second, operator) => {
  let firstC;
  let secondC;
  if (areComplex[first]) {
    firstC = areComplex[first];
  } else {
    firstC = makeComplex(first);
    areComplex["ID" + areComplexLen] = firstC;
    areComplexLen++;
  }
  if (areComplex[second]) {
    secondC = areComplex[second];
  } else {
    secondC = makeComplex(second);
    areComplex["ID" + areComplexLen] = secondC;
    areComplexLen++;
  }

  let theRes;
  if (operator == "+") {
    theRes = firstC.add(secondC);
  } else if (operator == "-") {
    theRes = firstC.sub(secondC);
  } else if (operator == "*") {
    theRes = firstC.mul(secondC);
  } else if (operator == "/") {
    theRes = firstC.dev(secondC);
  } else if (operator == "^") {
    theRes = firstC.pow(secondC);
  }

  steps.push({
    first: firstC,
    operator: operator,
    second: secondC,
    res: theRes,
    humanReadable: (
      "(" +
      firstC.print() +
      ")" +
      operator +
      "(" +
      secondC.print() +
      ")" +
      "=" +
      theRes.print()
    ).replaceAll(" ", ""),
  }); // you can use it for steps
  let thisID = "ID" + areComplexLen;
  areComplex[thisID] = theRes;
  areComplexLen++;
  return thisID;
};

const solve = (res) => {
  res = res.split(" ");
  let operators = "-+*/^";
  let i = 0;
  while (1) {
    let len = res.length;
    for (let j = 0; j < len; j++) {
      if (
        !operators.includes(res[j]) &&
        !operators.includes(res[j + 1]) &&
        operators.includes(res[j + 2])
      ) {
        let ans = solveIt(res[j], res[j + 1], res[j + 2]);
        res.splice(j, 1);
        res.splice(j, 1);
        res.splice(j, 1);
        res.insert(j, ans);
        break;
      } else if (len <= 2) {
        let ans = solveIt(res[j], "0", "+");
        res.splice(j, 1);
        res.splice(j, 1);
        res.insert(j, ans);
        break;
      } else {
      }
    }
    if (res.length == 1 || i == 100) {
      return res[0];
    }
    i++;
  }
};
