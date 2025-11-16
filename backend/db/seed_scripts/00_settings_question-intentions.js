// MongoDB seed script for platform_settings collection
// Run this script using: mongosh <database_name> seed.js

db = db.getSiblingDB('helpaws'); // Replace with your actual database name

// Insert the platform_settings document
db.platform_settings.insertOne({
  key: "question_intentions",
  values: [
    { id: "question", label: "Question" },
    { id: "discussion", label: "Discussion" },
    { id: "advice", label: "Advice" },
    { id: "information", label: "Information" }
  ]
});

print("✓ Successfully seeded platform_settings collection");
print("Document inserted:", db.platform_settings.findOne({ key: "question_intentions" }));
