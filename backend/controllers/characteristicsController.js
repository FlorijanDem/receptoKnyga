const AppError = require("../utils/appError");
const { getCharacteristics, getCharacteristicsById, postCharacteristic, updateCharacteristic, deleteCharacteristic } = require("../models/characteristicsModel");

exports.getUserCharacteristics = async (req, res, next) => {
    try {
        const characteristics = await getCharacteristics();
        res.status(200).json({
            status: "success",
            data: characteristics,
          });
    } catch (error) {
        next(error);
    }
}

exports.getUserCharacteristicsById = async (req, res, next) => {
  try {
        const characteristics = await getCharacteristicsById(req.params.id);

        res.status(200).json({
            status: "success",
            data: characteristics,
          });
    } catch (error) {
        next(error);
    }
}

exports.postCharacteristic = async (req, res, next) => {
    try {
      const characteristics = await postCharacteristic({
        ...req.body,
        user_id: req.user?.id,
      });

      res.status(201).json({
        status: "success",
        data: characteristics,
      });
    } catch (error) {
      next(error);
    }
  };

exports.updateCharacteristic = async (req, res, next) => {
    try {
        const characteristic = await updateCharacteristic(req.body, req.params.id);

        res.status(200).json({
            status: "success",
            data: characteristic,
          });
    } catch (error) {
        next(error);
    }
}

exports.deleteCharacteristic = async (req, res, next) => {
    try {
        const characteristic = await deleteCharacteristic(req.params.id);

        res.status(200).json({
            status: "success",
            data: characteristic,
          });
    } catch (error) {
        next(error);
    }
  
}