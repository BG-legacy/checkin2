-- Allow reads so the /#/results dashboard (gated by VITE_ANALYTICS_PASSWORD)
-- can load responses with the anon key.
--
-- NOTE: the password check happens in the browser, so this is convenience
-- protection, not hard security: anyone with the (public) anon key could read
-- the table directly via the API. Acceptable for anonymous course-project
-- data. If you need real access control, gate reads behind Supabase Auth
-- instead of this policy.
create policy "anon read for results dashboard" on responses
  for select to anon using (true);
