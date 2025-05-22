import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { vi } from 'vitest';

import api from '../user-supabase-credentials';

const app = express();
app.use(bodyParser.json());
app.use(api);

// Mock du client Supabase pour éviter les appels réels
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ single: () => ({ data: { supabase_url: 'url', supabase_anon_key: 'key' }, error: null }) }) }),
      upsert: () => ({ error: null })
    })
  })
}));

describe('API /api/user-supabase-credentials', () => {
  it('GET retourne les credentials', async () => {
    const res = await request(app)
      .get('/api/user-supabase-credentials')
      .set('x-clerk-user-id', 'test-user');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ supabase_url: 'url', supabase_anon_key: 'key' });
  });

  it('POST enregistre les credentials', async () => {
    const res = await request(app)
      .post('/api/user-supabase-credentials')
      .set('x-clerk-user-id', 'test-user')
      .send({ supabase_url: 'url', supabase_anon_key: 'key' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  it('GET retourne 401 si pas de user id', async () => {
    const res = await request(app).get('/api/user-supabase-credentials');
    expect(res.status).toBe(401);
  });

  it('POST retourne 400 si champs manquants', async () => {
    const res = await request(app)
      .post('/api/user-supabase-credentials')
      .set('x-clerk-user-id', 'test-user')
      .send({});
    expect(res.status).toBe(400);
  });
});
