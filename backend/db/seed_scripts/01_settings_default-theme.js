// MongoDB seed script for platform_settings collection
// Run this script using: mongosh <database_name> seed.js

db = db.getSiblingDB('helpaws'); // Replace with your actual database name

db.platform_settings.insertOne({
  key: 'defaultTheme',
  value: { name: 'standard' },
});

print('✓ Successfully seeded defaultTheme setting');
print('Document inserted:', db.platform_settings.findOne({ key: 'defaultTheme' }));
