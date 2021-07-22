var ROUND_DIGITS = 2;
var ROUND_VALUE = Math.pow(10, ROUND_DIGITS);
// var DEGREE_THRESHOLD = 1;
var DEG2RAD = Math.PI / 180;
var RAD2DEG = 180 / Math.PI;
class RctComplex {
  // this ==> the left side Complex
  // that ==> the right side Complex
  constructor(real, imag) {
    this.real = real;
    this.imag = imag;
  }

  //this + that
  addRct(that) {
    return new RctComplex(
      Math.round((this.real + that.real) * ROUND_VALUE) / ROUND_VALUE,
      Math.round((this.imag + that.imag) * ROUND_VALUE) / ROUND_VALUE
    );
  }

  //this - that
  subRct(that) {
    return this.addRct(new RctComplex(-that.real, -that.imag));
  }

  //this * that
  mulRct(that) {
    return new RctComplex(
      Math.round(
        (this.real * that.real - this.imag * that.imag) * ROUND_VALUE
      ) / ROUND_VALUE,
      Math.round(
        (this.real * that.imag + this.imag * that.real) * ROUND_VALUE
      ) / ROUND_VALUE
    );
  }

  //this / that
  devRct(that) {
    let denominator = Math.pow(that.imag, 2) + Math.pow(that.real, 2); //مخرج
    let mulThisAndNegativeThat = this.mulRct(
      new RctComplex(that.real, -that.imag)
    );
    return new RctComplex(
      Math.round((mulThisAndNegativeThat.real / denominator) * ROUND_VALUE) /
        ROUND_VALUE,
      Math.round((mulThisAndNegativeThat.imag / denominator) * ROUND_VALUE) /
        ROUND_VALUE
    );
  }

  //this ^ that
  powRct(p) {
    let savePow = this;
    p = p.constructor.name == "RctComplex" ? p.real : p;
    console.log("p", p);
    if (p == 0) return new RctComplex(1, 0);
    while (p > 1) {
      savePow = this.mulRct(savePow);
      p--;
    }
    return savePow;
  }

  addTri(that) {
    //
  }
  subTri(that) {
    //
  }
  mulTri(that) {
    //
  }
  devTri(that) {
    //
  }
  powTri(that) {
    //
  }

  add(that) {
    return that.constructor.name == "RctComplex"
      ? this.addRct(that)
      : this.addTri(that);
  }
  sub(that) {
    return that.constructor.name == "RctComplex"
      ? this.subRct(that)
      : this.subTri(that);
  }
  mul(that) {
    return that.constructor.name == "RctComplex"
      ? this.mulRct(that)
      : this.mulTri(that);
  }
  dev(that) {
    return that.constructor.name == "RctComplex"
      ? this.devRct(that)
      : this.devTri(that);
  }
  pow(p) {
    return this.constructor.name == "RctComplex"
      ? this.powRct(p)
      : this.powTri(p);
  }

  toTri() {
    let radius =
      Math.round(
        Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imag, 2)) * ROUND_VALUE
      ) / ROUND_VALUE;
    let theta =
      Math.round(Math.atan2(this.imag, this.real) * RAD2DEG * ROUND_VALUE) /
      ROUND_VALUE;
    return new TriComplex(radius, theta);
  }

  print() {
    // console.log(this.real + " " + this.imag + "i");
    if (this.real && this.imag > 0) {
      return this.real + "+" + this.imag + "i";
    } else if (this.real && this.imag < 0) {
      return this.real + "" + this.imag + "i";
    } else if (this.real && !this.imag) {
      return `${this.real}`;
    } else if (!this.real && !this.imag) {
      return "0";
    } else {
      return this.imag + "i";
    }
    // (this.real ? this.real + " " : "") + (this.imag ? this.imag + "i" : "")
  }
}

class TriComplex {
  constructor(radius, theta) {
    this.radius = radius;
    this.theta = theta;
  }

  mulTri(that) {
    return new TriComplex(
      Math.round(this.radius * that.radius * ROUND_VALUE) / ROUND_VALUE,
      Math.round((this.theta + that.theta) * ROUND_VALUE) / ROUND_VALUE
    );
  }
  devTri(that) {
    return new TriComplex(
      Math.round((this.radius / that.radius) * ROUND_VALUE) / ROUND_VALUE,
      Math.round((this.theta - that.theta) * ROUND_VALUE) / ROUND_VALUE
    );
  }

  toRct() {
    let real =
      Math.round(this.radius * Math.cos(this.theta * DEG2RAD) * ROUND_VALUE) /
      ROUND_VALUE;
    let imag =
      Math.round(this.radius * Math.sin(this.theta * DEG2RAD) * ROUND_VALUE) /
      ROUND_VALUE;
    return new RctComplex(real, imag);
  }
  print() {
    if (this.radius && this.theta > 0) {
      return this.radius + "e<sup>" + this.theta + "i</sup>";
    } else if (this.radius && this.theta < 0) {
      return this.radius + "e<sup>" + this.theta + "i</sup>";
    } else if (this.radius && !this.theta) {
      return `${this.radius}`;
    } else if (!this.radius && !this.theta) {
      return "0";
    } else {
      return "e<sup>" + this.theta + "i</sup>";
    }
  }
}

function makeComplex(str) {
  str = str.replaceAll(" ", "");
  let first;
  let second;
  if (str.includes("e") && str.includes("i")) {
    str = str
      .replaceAll("i", "")
      .replaceAll("^", "")
      .replaceAll("e", "")
      .replaceAll(")", "")
      .replaceAll("(", "");
    str = str == "" ? "1" : str;
    console.log("here", str);
    return new TriComplex(1, str).toRct();
  }
  if (count("(", str) == count(")", str)) {
    str = str.replace("(", "").replace(")", "");
    if (str.includes("i")) {
      if (count("+", str) == 2) {
        // +1+2i
        str = str.slice(1, str.length);
        [first, second] = str.split("+");
        [first, second] = second.includes("i")
          ? [first, second.replace("i", "")]
          : [second, first.replace("i", "")];
      } else if (count("-", str) == 2) {
        //-1-2i
        str = str.slice(1, str.length);
        [first, second] = str.split("-");
        second = "-" + second;
        first = "-" + first;
        [first, second] = second.includes("i")
          ? [first, second.replace("i", "")]
          : [second, first.replace("i", "")];
      } else if (count("+", str) == 1 && count("-", str) == 1) {
        //+1-2i or -1+2i
        if (str[0] == "-") {
          str = str.slice(1, str.length);
          [first, second] = str.split("+"); //1 , 2i
          first = "-" + first;
        } else if (str[0] == "+") {
          str = str.slice(1, str.length);
          [first, second] = str.split("-"); //1 , 2i
          second = "-" + second;
        } else {
          console.log("SOME SEROUS PROBLEM :')");
        }
        [first, second] = second.includes("i")
          ? [first, second.replace("i", "")]
          : [second, first.replace("i", "")];
      } else if (
        (count("+", str) == 1 && count("-", str) == 0) ||
        (count("+", str) == 0 && count("-", str) == 1)
      ) {
        // 1+2i or 1-2i or +2i or - 2i
        if (str[0] == "+" || str[0] == "-") {
          //+2i or - 2i
          first = "0";
          second = str.replace("i", "");
        } else {
          // 1+2i or 1-2i
          if (count("+", str)) {
            [first, second] = str.split("+");
            [first, second] = second.includes("i")
              ? [first, second.replace("i", "")]
              : [second, first.replace("i", "")];
          } else {
            [first, second] = str.split("-");
            [first, second] = second.includes("i")
              ? [first, second.replace("i", "")]
              : [second, first.replace("i", "")];
            second = "-" + second;
          }
        }
      } else {
        //2i or i
        first = "0";
        second = str.replace("i", "");
        second = second == "" ? 1 : second;
      }
    } else {
      first = str;
      second = 0;
    }
  } else {
    console.log("PARENTHESIS NOT MATCH");
    console.log("here", str);

    first = 0;
    second = 0;
  }
  return new RctComplex(parseFloat(first), parseFloat(second));
}
