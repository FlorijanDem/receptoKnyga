const {
  getCharacteristicsById,
  updateCharacteristic,
} = require("../models/characteristicsModel");


exports.getUserCharacteristicsMy = async (req, res, next) => {
  try {
    const characteristics = await getCharacteristicsById(req.user?.id);
    if (characteristics === undefined) {
      res.status(404).json({
        message: "You do not have characteristics",
      });
    }
    res.status(200).json({
      status: "success",
      data: characteristics,
    });
  } catch (error) {
    next(error);
  }
};


exports.updateCharacteristic = async (req, res, next) => {
  const data = req.body;
  const id = req.user?.id;
  try {
    const characteristic = await updateCharacteristic(data, id);

    res.status(200).json({
      status: "success",
      data: characteristic,
    });
  } catch (error) {
    next(error);
  }
};

