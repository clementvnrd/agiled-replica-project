import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(bodyParser.json());

/**
 * GET /api/user-supabase-credentials
 * Récupère les credentials Supabase pour un utilisateur Clerk authentifié.
 */
app.get('/api/user-supabase-credentials', async (req, res) => {
  // TODO: Extraire clerkUserId du token JWT Clerk (à implémenter selon la nouvelle méthode d'auth)
  // Pour l'instant, on le prend d'un header custom pour debug
  const clerkUserId = req.headers['x-clerk-user-id'];
  if (!clerkUserId) {
    return res.status(401).json({ error: 'Clerk user id missing' });
  }
  const supabaseAdmin = createClient(process.env.SUPABASE_ADMIN_URL!, process.env.SUPABASE_ADMIN_SERVICE_ROLE_KEY!);
  const { data, error } = await supabaseAdmin
    .from('user_supabase_credentials')
    .select('supabase_url, supabase_anon_key')
    .eq('clerk_user_id', clerkUserId)
    .single();
  if (error) return res.status(404).json({ error: 'Credentials not found' });
  return res.status(200).json(data);
});

/**
 * POST /api/user-supabase-credentials
 * Enregistre ou met à jour les credentials Supabase pour un utilisateur Clerk authentifié.
 */
app.post('/api/user-supabase-credentials', async (req, res) => {
  // TODO: Extraire clerkUserId du token JWT Clerk (à implémenter selon la nouvelle méthode d'auth)
  // Pour l'instant, on le prend d'un header custom pour debug
  const clerkUserId = req.headers['x-clerk-user-id'];
  if (!clerkUserId) {
    return res.status(401).json({ error: 'Clerk user id missing' });
  }
  const { supabase_url, supabase_anon_key } = req.body;
  if (!supabase_url || !supabase_anon_key) {
    return res.status(400).json({ error: 'Missing supabase_url or supabase_anon_key' });
  }
  const supabaseAdmin = createClient(process.env.SUPABASE_ADMIN_URL!, process.env.SUPABASE_ADMIN_SERVICE_ROLE_KEY!);
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