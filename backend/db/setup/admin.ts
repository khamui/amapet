import { User } from '../models/user.js';
import { generateUsername } from '../../services/user.service.js';
import type { AuthProvider } from '../../types/models.js';

// env
import * as dotenv from 'dotenv';
dotenv.config();

const PLATFORM_ADMIN_EMAIL = process.env.PLATFORM_ADMIN_EMAIL;

function inferAuthProvider(email: string): AuthProvider {
  const domain = email.split('@')[1]?.toLowerCase();

  if (['outlook.com', 'hotmail.com', 'live.com'].includes(domain)) {
    return 'microsoft';
  }
  // Default to google (gmail.com, googlemail.com, etc.)
  return 'google';
}

export async function ensurePlatformAdmin(): Promise<void> {
  if (!PLATFORM_ADMIN_EMAIL) {
    console.log('[Setup] PLATFORM_ADMIN_EMAIL not set, skipping admin setup');
    return;
  }

  let user = await User.findOne({ email: PLATFORM_ADMIN_EMAIL });

  if (!user) {
    // Auto-create admin user
    const username = await generateUsername();
    const authProvider = inferAuthProvider(PLATFORM_ADMIN_EMAIL);

    user = await User.create({
      email: PLATFORM_ADMIN_EMAIL,
      username,
      authProvider,
      permLevel: 1,
      followedCircles: [],
      followedQuestions: [],
      respectPoints: 0,
    });

    console.log(`[Setup] Created platform admin: ${PLATFORM_ADMIN_EMAIL} (${authProvider})`);
    return;
  }

  // User exists, ensure permLevel=1
  if (user.permLevel !== 1) {
    await User.updateOne({ email: PLATFORM_ADMIN_EMAIL }, { $set: { permLevel: 1 } });
    console.log(`[Setup] Set permLevel=1 for: ${PLATFORM_ADMIN_EMAIL}`);
  } else {
    console.log(`[Setup] Admin already configured: ${PLATFORM_ADMIN_EMAIL}`);
  }
}
