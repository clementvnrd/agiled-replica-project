const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { verifyToken } = require('./src/lib/clerkJwt');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.get('/api/user-supabase-credentials', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  let clerkUserId;
  try {
    clerkUserId = await verifyToken(authHeader.replace('Bearer ', ''));
  } catch {
    return res.status(401).json({ error: 'Invalid Clerk token' });
  }
  const supabaseAdmin = createClient(process.env.SUPABASE_ADMIN_URL, process.env.SUPABASE_ADMIN_SERVICE_ROLE_KEY);
  const { data, error } = await supabaseAdmin
    .from('user_supabase_credentials')
    .select('supabase_url, supabase_anon_key')
    .eq('clerk_user_id', clerkUserId)
    .single();
  if (error) return res.status(404).json({ error: 'Credentials not found' });
  return res.status(200).json(data);
});

app.post('/api/user-supabase-credentials', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  let clerkUserId;
  try {
    clerkUserId = await verifyToken(authHeader.replace('Bearer ', ''));
  } catch {
    return res.status(401).json({ error: 'Invalid Clerk token' });
  }
  const { supabase_url, supabase_anon_key } = req.body;
  if (!supabase_url || !supabase_anon_key) {
    return res.status(400).json({ error: 'Missing supabase_url or supabase_anon_key' });
  }
  const supabaseAdmin = createClient(process.env.SUPABASE_ADMIN_URL, process.env.SUPABASE_ADMIN_SERVICE_ROLE_KEY);
  const { error } = await supabaseAdmin
    .from('user_supabase_credentials')
    .upsert({
      clerk_user_id: clerkUserId,
      supabase_url,
      supabase_anon_key,
    }, { onConflict: 'clerk_user_id' });
  if (error) return res.status(500).json({ error: 'Failed to save credentials' });
  return res.status(200).json({ success: true });
});

app.listen(4000, () => console.log('API running on http://localhost:4000'));
