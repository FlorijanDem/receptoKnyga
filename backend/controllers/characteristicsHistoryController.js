const {
  getWeightHistoryByUserId,
  addWeightEntry,
  updateWeightEntry,
} = require("../models/characteristicsHistoryModel");

const {
  validateAddWeight,
  validateUpdateWeight,
} = require("../validators/checkCharacteristicsHistoryBody");

exports.getWeightHistory = async (req, res, next) => {
  try {
    const history = await getWeightHistoryByUserId(req.user?.id);
    res.status(200).json({
      status: "success",
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

exports.addWeight = async (req, res, next) => {
  try {
    const { weight, date } = req.body;
    if (!validateAddWeight(weight, res)) return;

    const entry = await addWeightEntry(req.user?.id, weight, date);
    res.status(201).json({
      status: "success",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateWeight = async (req, res, next) => {
  try {
    const { entryId, weight, date } = req.body;
    if (!validateUpdateWeight(entryId, weight, res)) return;

    const entry = await updateWeightEntry(entryId, req.user?.id, weight, date);
    if (!entry) {
      return res.status(404).json({
        status: "fail",
        message: "Weight entry not found or not owned by user",
      });
    }

    res.status(200).json({
      status: "success",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};
