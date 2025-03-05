const {
  getCharacteristics,
  getCharacteristicsById,
  postCharacteristic,
  updateCharacteristic,
  deleteCharacteristic,
} = require("../models/characteristicsModel");

exports.getUserCharacteristicsAll = async (req, res, next) => {
  try {
    const characteristics = await getCharacteristics();
    res.status(200).json({
      status: "success",
      data: characteristics,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserCharacteristicsMy = async (req, res, next) => {
  try {
    const characteristics = await getCharacteristicsById(req.user?.id);

    res.status(200).json({
      status: "success",
      data: characteristics,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCharacteristic = async (req, res, next) => {
  try {
    const characteristic = await updateCharacteristic(req.body, req.user?.id);
    // Update if exist
    if (characteristic) {
      res.status(200).json({
        status: "success",
        data: characteristic,
      });
    } else {
      // If not exist - create
      const newCharacteristic = await postCharacteristic({
        ...req.body,
        user_id: req.user?.id,
      });
      res.status(201).json({
        status: "success",
        data: newCharacteristic,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteCharacteristic = async (req, res, next) => {
  try {
    const characteristic = await deleteCharacteristic(req.user?.id);

    res.status(200).json({
      status: "success",
      data: characteristic,
    });
  } catch (error) {
    next(error);
  }
};
