function propSum (array, property) {
  return _.reduce(array, function (sum, e) {
    return sum + e[property];
  }, 0);
};
