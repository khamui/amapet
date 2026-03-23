import mongoose, { Schema, Document } from 'mongoose';

export interface IMigration {
  version: string;
  name: string;
  appliedAt: Date;
}

export interface IMigrationDocument extends IMigration, Document {}

const migrationSchema = new Schema<IMigrationDocument>({
  version: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
});

export const Migration = mongoose.model<IMigrationDocument>(
  'Migration',
  migrationSchema,
  '_migrations'
);

export async function isApplied(version: string): Promise<boolean> {
  const existing = await Migration.findOne({ version });
  return !!existing;
}

export async function markApplied(version: string, name: string): Promise<void> {
  await Migration.create({ version, name, appliedAt: new Date() });
}

export async function getAppliedMigrations(): Promise<IMigration[]> {
  return Migration.find().sort({ version: 1 }).lean();
}
