import { retrieveModel, updateModel } from "../dbaccess.js";
import { Settings } from "../db/models/settings.js";

export const controllerSettings = {
  readValuesByKey: async (req, res) => {
    const { key } = req.params;
    try {
      const settings = await retrieveModel(Settings, { key });
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).send("couldn't retrieve model");
    }
  },
  readSettings: async (req, res) => {
    try {
      const settings = await retrieveModel(Settings);
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).send("couldn't retrieve model");
    }
  },
  updateSetting: async (req, res) => {
    try {
      const { id, value } = req.body;
      const filter = { _id: id };
      const updateExpr = { value };
      const setting = await updateModel(Settings, filter, updateExpr);
      res.status(200).json(setting);
    } catch (error) {
      res.status(500).send("couldn't retrieve model");
    }
  },
};
