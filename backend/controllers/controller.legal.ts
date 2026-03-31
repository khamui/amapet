import { Request, Response } from 'express';

export const controllerLegal = {
  getLegalInfo: async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      name: process.env.LEGAL_NAME || '',
      street: process.env.LEGAL_STREET || '',
      city: process.env.LEGAL_CITY || '',
      country: process.env.LEGAL_COUNTRY || '',
      email: process.env.LEGAL_EMAIL || '',
      website: process.env.LEGAL_WEBSITE || '',
    });
  },
};
