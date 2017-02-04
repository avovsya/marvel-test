Set.prototype.union = function(setB) {
  for (var elem of setB) {
    this.add(elem);
  }
  return this;
};
