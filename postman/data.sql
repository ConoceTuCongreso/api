
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
    'Iniciativa número dos',
    1,
    'http://congresoweb.congresojal.gob.mx',
    'José Arango Arámbula',
    '002',
    '002'
);

INSERT INTO initiatives_categories(category_id, initiatives_id) VALUES (1, 1), (1, 2);

INSERT INTO vote_values(id, name) VALUES (1, 'A favor'), (2, 'En contra');

INSERT INTO congresspeople(id, name) VALUES
(1, 'Marcos Martínez'),
(2, 'Pedro Fernández'),
(3, 'Juan Pérez'),
(4, 'Marta López'),
(5, 'Mark Zuckerberg');

INSERT INTO initiative_votes(value_id, initiative_id, congressperson_id) VALUES
(1, 1, 3),
(1, 1, 4),
(1, 1, 5),
(2, 1, 1),
(2, 1, 2);
