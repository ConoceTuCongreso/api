
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
    '$2b$10$/TkUIa9Toa2vDtwHiw9LL.',
    '$2b$10$/TkUIa9Toa2vDtwHiw9LL.3s6ooPnGTDRQvyk1/Hl0elG4Opw.zxC'
);

INSERT INTO categories(id, name) VALUES (1, 'Cultura'), (2, 'Reglamentos');

INSERT INTO initiative_status(id, name) VALUES (1, 'Activa'), (2, 'Inactiva');

INSERT INTO initiatives(
    id,
    description,
    status_id,
    document_url,
    author,
    infolej_number,
    agreement_number
)
VALUES
(
    1,
    'Iniciativa número uno',
    1,
    'http://congresoweb.congresojal.gob.mx',
    'José Guadalupe Posada',
    '001',
    '001'
),
(
    2,
    'Iniciativa número 2',
    1,
    'http://congresoweb.congresojal.gob.mx',
    'José Arango Arámbula',
    '002',
    '002'
);
