const validateAddWeight = (weight, res) => {
  if (!weight) {
    res.status(400).json({
      status: "fail",
      message: "Weight is required",
    });
    return false;
  }
  return true;
};

const validateUpdateWeight = (entryId, weight, res) => {
  if (!entryId || !weight) {
    res.status(400).json({
      status: "fail",
      message: "Entry ID and weight are required",
    });
    return false;
  }
  return true;
};

module.exports = {
  validateAddWeight,
  validateUpdateWeight,
};
