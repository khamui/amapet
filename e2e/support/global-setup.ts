import * as fs from 'fs';
import * as path from 'path';

async function globalSetup() {
  const timestamp = Date.now();
  const stateFile = path.join(__dirname, '.test-state.json');
  fs.writeFileSync(stateFile, JSON.stringify({ startTimestamp: timestamp }));
  console.log(`[Global Setup] Test run started at timestamp: ${timestamp}`);
}

export default globalSetup;
