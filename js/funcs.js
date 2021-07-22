const count = (char, string) => {
  return string.split("").reduce((acc, ch) => (ch === char ? acc + 1 : acc), 0);
};

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};
