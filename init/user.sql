INSERT INTO user_roles.user (id, name, email, email_verified) VALUES (gen_random_uuid (), 'User', 'user@domain.com', NOW())
INSERT INTO meta_data.workspace (id, workspace_owner) VALUES (gen_random_uuid (), 'user@domain.com')
