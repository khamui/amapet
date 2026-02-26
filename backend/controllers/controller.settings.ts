import { Request, Response } from 'express';
import { retrieveModel, updateModel } from '../dbaccess.js';
import { Settings } from '../db/models/settings.js';

export const controllerSettings = {
  readValuesByKey: async (req: Request, res: Response): Promise<void> => {
    const { key } = req.params;
    try {
      const settings = await retrieveModel(Settings, { key });
      res.status(200).json(settings);
    } catch {
      res.status(500).send("couldn't retrieve model");
    }
  },
  readSettings: async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await retrieveModel(Settings);
      res.status(200).json(settings);
    } catch {
      res.status(500).send("couldn't retrieve model");
    }
  },
  updateSetting: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, value } = req.body;
      const filter = { _id: id };
      const updateExpr = { value };
      const setting = await updateModel(Settings, filter, updateExpr);
      res.status(200).json(setting);
    } catch {
      res.status(500).send("couldn't retrieve model");
    }
  },
};
