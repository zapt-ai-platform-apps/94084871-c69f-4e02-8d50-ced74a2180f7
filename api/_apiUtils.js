import { initializeZapt } from '@zapt/zapt-js';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

const { supabase } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);

export async function authenticateUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) {
    console.error('Authentication error:', error.message);
    Sentry.captureException(error);
    throw new Error('Invalid token');
  }

  return user;
}

export function handleApiError(error, res) {
  console.error('API Error:', error.message, error.stack);
  Sentry.captureException(error);
  
  return res.status(500).json({ 
    error: 'Internal Server Error',
    message: error.message 
  });
}