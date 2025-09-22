import { retrieveModel } from "../dbaccess.js";
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
}
