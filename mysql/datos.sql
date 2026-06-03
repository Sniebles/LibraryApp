use lab;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Devolucion;
TRUNCATE TABLE Prestamo;
TRUNCATE TABLE Reserva;
TRUNCATE TABLE Libro_Categoria;
TRUNCATE TABLE Libro_Autor;
TRUNCATE TABLE Ejemplar;
TRUNCATE TABLE Bibliotecario;
TRUNCATE TABLE Docente;
TRUNCATE TABLE Estudiante;
TRUNCATE TABLE Usuario;
TRUNCATE TABLE Categoria;
TRUNCATE TABLE Autor;
TRUNCATE TABLE Libro;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO Libro VALUES
(1,  "9780307474278", "Cien años de soledad",               "Sudamericana",               1967, "Novela emblematica del realismo magico latinoamericano",       8),
(2,  "9780439554930", "Harry Potter y la piedra filosofal", "Salamandra",                 1997, "Inicio de la saga del joven mago Harry Potter",               8),
(3,  "9788445073804", "Don Quijote de la Mancha",           "Espasa",                     1605, "Clasico de la literatura española de Miguel de Cervantes",     8),
(4,  "9780140449136", "La Odisea",                          "Penguin Classics",           800,  "Viaje epico de Odiseo tras la guerra de Troya",                1),
(5,  "9780061120084", "Matar a un ruisenor",                "HarperCollins",              1960, "Historia sobre justicia racial en Estados Unidos",             8),
(6,  "9780451524935", "1984",                               "Signet Classics",            1949, "Distopia sobre vigilancia y control estatal",                  8),
(7,  "9780307277671", "El codigo Da Vinci",                 "Doubleday",                  2003, "Thriller sobre conspiraciones religiosas",                     8),
(8,  "9788497592208", "La sombra del viento",               "Planeta",                    2001, "Misterio literario ambientado en Barcelona",                   8),
(9,  "9786070708561", "Pedro Paramo",                       "Fondo de Cultura Economica", 1955, "Novela clave del realismo magico mexicano",                    1),
(10, "9789588886213", "El olvido que seremos",              "Planeta",                    2006, "Memoria familiar y social colombiana",                         8),
(11, "9780307949486", "Inferno",                            "Doubleday",                  2013, "Novela de misterio protagonizada por Robert Langdon",          8),
(12, "9786073113133", "Como agua para chocolate",           "Planeta",                    1989, "Historia romantica con elementos magicos",                     8),
(13, "9788401337208", "La catedral del mar",                "Grijalbo",                   2006, "Novela historica ambientada en Barcelona medieval",            8),
(14, "9788466332129", "El principito",                      "Salamandra",                 1943, "Relato filosofico sobre la vida y la amistad",                 1),
(15, "9789500428400", "Rayuela",                            "Sudamericana",               1963, "Novela experimental de Julio Cortazar",                        8),
(16, "9786071138497", "Los detectives salvajes",            "Anagrama",                   1998, "Historia de jovenes poetas latinoamericanos",                  8),
(17, "9788420471839", "Ensayo sobre la ceguera",            "Alfaguara",                  1995, "Novela sobre una epidemia de ceguera colectiva",               8),
(18, "9788437604947", "Crimen y castigo",                   "Catedra",                    1866, "Novela psicologica de Fiodor Dostoyevski",                     8),
(19, "9788491050292", "El alquimista",                      "Planeta",                    1988, "Historia espiritual sobre seguir los suenos",                  8),
(20, "9788467033667", "Juego de tronos",                    "Plaza & Janes",              1996, "Primera entrega de Cancion de hielo y fuego",                  8),
(21, "9788408172178", "Patria",                             "Tusquets",                   2016, "Relato sobre el conflicto vasco en España",                    8),
(22, "9789584249319", "Delirio",                            "Alfaguara",                  2004, "Historia psicologica ambientada en Colombia",                  8),
(23, "9786070728767", "Aura",                               "Era",                        1962, "Novela corta de misterio y simbolismo",                        1),
(24, "9780307389732", "Angeles y demonios",                 "Pocket Books",               2000, "Thriller sobre ciencia y religion",                            8),
(25, "9788490328729", "El nombre de la rosa",               "Lumen",                      1980, "Novela historica con misterio medieval",                       8),
(26, "9788466351106", "La ladrona de libros",               "Debolsillo",                 2005, "Historia de una nina en la Alemania nazi",                     8),
(27, "9786073155867", "Arrancame la vida",                  "Planeta",                    1985, "Relato sobre poder y relaciones personales",                   8),
(28, "9788432217449", "Fahrenheit 451",                     "Minotauro",                  1953, "Distopia sobre censura de libros",                             8),
(29, "9788466348427", "El psicoanalista",                   "Debolsillo",                 2002, "Thriller psicologico intenso",                                 8),
(30, "9789500434021", "La voragine",                        "Panamericana",               1924, "Novela sobre la selva amazonica colombiana",                   8);

INSERT INTO Autor VALUES
(1,  "Gabriel Garcia Marquez"),
(2,  "J.K. Rowling"),
(3,  "Miguel de Cervantes"),
(4,  "Homero"),
(5,  "Harper Lee"),
(6,  "George Orwell"),
(7,  "Dan Brown"),
(8,  "Carlos Ruiz Zafon"),
(9,  "Juan Rulfo"),
(10, "Hector Abad Faciolince"),
(11, "Laura Esquivel"),
(12, "Ildefonso Falcones"),
(13, "Antoine de Saint-Exupery"),
(14, "Julio Cortazar"),
(15, "Roberto Bolano");

INSERT INTO Categoria VALUES
(1, "Novela"),
(2, "Fantasia"),
(3, "Clasico"),
(4, "Historia"),
(5, "Distopia"),
(6, "Misterio"),
(7, "Romance"),
(8, "Realismo Magico");

INSERT INTO Libro_Autor VALUES
(1,  1), (2,  2), (3,  3), (4,  4), (5,  5),
(6,  6), (7,  7), (8,  8), (9,  9), (10, 10),
(12, 11),(13, 12),(14, 13),(15, 14),(16, 15);

INSERT INTO Libro_Categoria VALUES
(1,  8), (2,  2), (3,  3), (4,  3),
(5,  1), (6,  5), (7,  6), (8,  6),
(9,  8), (10, 1);

INSERT INTO Usuario VALUES
(1, "U001", "1001", "Carlos Perez", "carlos@mail.com", "activo",    NOW(), NOW()),
(2, "U002", "1002", "Ana Gomez",    "ana@mail.com",    "activo",    NOW(), NOW()),
(3, "U003", "1003", "Luis Torres",  "luis@mail.com",   "activo",    NOW(), NOW()),
(4, "U004", "1004", "Maria Lopez",  "maria@mail.com",  "activo",    NOW(), NOW()),
(5, "U005", "1005", "Pedro Ruiz",   "pedro@mail.com",  "activo",    NOW(), NOW()),
(6, "U006", "1006", "Laura Diaz",   "laura@mail.com",  "activo",    NOW(), NOW()),
(7, "U007", "1007", "Jorge Blanco", "jorge@mail.com",  "bloqueado", NOW(), NOW());

INSERT INTO Estudiante  VALUES (1, "Ingenieria"), (2, "Medicina"), (3, "Derecho");
INSERT INTO Docente     VALUES (4), (5);
INSERT INTO Bibliotecario VALUES (6);

INSERT INTO Ejemplar VALUES
(6,  "CB006", "Estante A3", "disponible", 1),
(7,  "CB007", "Estante A4", "disponible", 1),
(8,  "CB008", "Estante A5", "disponible", 1),
(9,  "CB009", "Estante B3", "disponible", 2),
(10, "CB010", "Estante B4", "disponible", 2),
(11, "CB011", "Estante B5", "disponible", 2),
(12, "CB012", "Estante C2", "disponible", 3),
(13, "CB013", "Estante C3", "disponible", 4),
(14, "CB014", "Estante C4", "disponible", 4),
(15, "CB015", "Estante D1", "disponible", 5),
(16, "CB016", "Estante D2", "disponible", 6),
(17, "CB017", "Estante D3", "disponible", 6),
(18, "CB018", "Estante D4", "disponible", 6),
(19, "CB019", "Estante E1", "disponible", 7),
(20, "CB020", "Estante E2", "disponible", 7),
(21, "CB021", "Estante E3", "disponible", 8),
(22, "CB022", "Estante E4", "disponible", 8),
(23, "CB023", "Estante E5", "disponible", 8),
(24, "CB024", "Estante F1", "disponible", 9),
(25, "CB025", "Estante F2", "disponible", 10),
(26, "CB026", "Estante F3", "disponible", 10),
(27, "CB027", "Estante F4", "disponible", 11),
(28, "CB028", "Estante F5", "disponible", 11),
(29, "CB029", "Estante G1", "disponible", 12),
(30, "CB030", "Estante G2", "disponible", 13),
(31, "CB031", "Estante G3", "disponible", 13),
(32, "CB032", "Estante G4", "disponible", 13),
(33, "CB033", "Estante H1", "disponible", 14),
(34, "CB034", "Estante H2", "disponible", 15),
(35, "CB035", "Estante H3", "disponible", 15),
(36, "CB036", "Estante H4", "disponible", 16),
(37, "CB037", "Estante I1", "disponible", 17),
(38, "CB038", "Estante I2", "disponible", 17),
(39, "CB039", "Estante I3", "disponible", 18),
(40, "CB040", "Estante I4", "disponible", 18),
(41, "CB041", "Estante I5", "disponible", 18),
(42, "CB042", "Estante J1", "disponible", 19),
(43, "CB043", "Estante J2", "disponible", 20),
(44, "CB044", "Estante J3", "disponible", 20),
(45, "CB045", "Estante J4", "disponible", 20),
(46, "CB046", "Estante J5", "disponible", 20),
(47, "CB047", "Estante K1", "disponible", 21),
(48, "CB048", "Estante K2", "disponible", 22),
(49, "CB049", "Estante K3", "disponible", 22),
(50, "CB050", "Estante K4", "disponible", 23),
(51, "CB051", "Estante L1", "disponible", 24),
(52, "CB052", "Estante L2", "disponible", 24),
(53, "CB053", "Estante L3", "disponible", 25),
(54, "CB054", "Estante L4", "disponible", 25),
(55, "CB055", "Estante L5", "disponible", 25),
(56, "CB056", "Estante M1", "disponible", 26),
(57, "CB057", "Estante M2", "disponible", 27),
(58, "CB058", "Estante M3", "disponible", 27),
(59, "CB059", "Estante M4", "disponible", 28),
(60, "CB060", "Estante M5", "disponible", 28),
(61, "CB061", "Estante N1", "disponible", 29),
(62, "CB062", "Estante N2", "disponible", 30),
(63, "CB063", "Estante N3", "disponible", 30),
(64, "CB064", "Estante N4", "disponible", 30);

INSERT INTO Prestamo VALUES
(3, '2026-04-06', '2026-04-15', '2026-04-06 08:00:00', 3, 6,  6, 'aprobado'),
(4, '2026-04-06', '2026-04-16', '2026-04-06 08:30:00', 1, 7,  6, 'aprobado'),
(5, '2026-04-07', '2026-04-17', '2026-04-07 09:00:00', 2, 9,  6, 'aprobado'),
(6, '2026-04-07', '2026-04-18', '2026-04-07 09:15:00', 4, 10, 6, 'aprobado'),
(7, '2026-04-08', '2026-04-20', NULL,                  5, 12, NULL, 'pendiente'),
(8, '2026-03-01', '2026-03-09', '2026-03-01 10:00:00', 3, 8,  6, 'devuelto');

UPDATE Ejemplar SET estado = 'prestado'   WHERE id_ejemplar IN (6, 7, 9, 10);
UPDATE Ejemplar SET estado = 'pendiente'  WHERE id_ejemplar = 12;
UPDATE Ejemplar SET estado = 'disponible' WHERE id_ejemplar = 8;

INSERT INTO Devolucion VALUES
(1, '2026-03-09', 0.00, 'Sin novedades', 8, 6, 'aprobado');

INSERT INTO Reserva VALUES
(1, '2026-06-10', '2026-06-18', 1, 11),
(2, '2026-06-15', '2026-06-23', 2, 16),
(3, '2026-07-01', '2026-07-09', 5, 34);