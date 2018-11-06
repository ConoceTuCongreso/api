INSERT INTO users(
    user_id,
    first_name,
    last_name,
    middle_name,
    username,
    email,
    password_hash,
    password_salt
) VALUES (
    (SELECT uuid_generate_v4()),
    'Laura',
    'Pérez',
    'López',
    'lperez1',
    'lperez@gmail.com',
    '2410046aa1a858c6719f6a0c54b6cafbd67831f0facfb6d20469990a460e64f0',
    '12ab7852'
);
