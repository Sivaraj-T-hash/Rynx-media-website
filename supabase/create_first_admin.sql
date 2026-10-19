-- ==============================================================================
-- INSTRUCTIONS TO CREATE YOUR FIRST ADMINISTRATOR
-- ==============================================================================
-- 1. Sign up or create a user in Supabase Auth (Dashboard -> Authentication -> Users -> Add User).
-- 2. Copy the newly created User UUID.
-- 3. Run the query below in the Supabase SQL Editor, replacing 'YOUR-USER-UUID-HERE'
--    and 'your-admin-email@example.com' with the actual user details:

INSERT INTO public.admin_users (id, email, role, is_active)
VALUES (
    'YOUR-USER-UUID-HERE', 
    'ramankandhan11@gmail.com', 
    'super_admin', 
    true
)
ON CONFLICT (id) DO UPDATE SET 
    role = 'super_admin', 
    is_active = true;
