use lab;
 
-- =========================================================
-- DROP TABLES (orden correcto por dependencias)
-- =========================================================
DROP TABLE IF EXISTS Devolucion;
DROP TABLE IF EXISTS Prestamo;
DROP TABLE IF EXISTS Reserva;
DROP TABLE IF EXISTS Libro_Categoria;
DROP TABLE IF EXISTS Libro_Autor;
DROP TABLE IF EXISTS Ejemplar;
DROP TABLE IF EXISTS Bibliotecario;
DROP TABLE IF EXISTS Docente;
DROP TABLE IF EXISTS Estudiante;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Categoria;
DROP TABLE IF EXISTS Autor;
DROP TABLE IF EXISTS Libro;
DROP TABLE IF EXISTS Configuracion;
 
-- =========================================================
-- USUARIO
-- =========================================================
CREATE TABLE Usuario (
    id_usuario     INT PRIMARY KEY AUTO_INCREMENT,
    codigo         VARCHAR(20)  UNIQUE NOT NULL,
    identificacion VARCHAR(20)  UNIQUE NOT NULL,
    nombres        VARCHAR(150) NOT NULL,
    correo         VARCHAR(100) UNIQUE NOT NULL,
    estado         ENUM('activo','bloqueado') DEFAULT 'activo',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
 
CREATE TABLE Estudiante (
    id_usuario INT PRIMARY KEY,
    carrera    VARCHAR(100),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);
 
CREATE TABLE Docente (
    id_usuario INT PRIMARY KEY,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);
 
CREATE TABLE Bibliotecario (
    id_usuario INT PRIMARY KEY,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);
 
-- =========================================================
-- LIBROS
-- =========================================================
CREATE TABLE Libro (
    id_libro      INT PRIMARY KEY AUTO_INCREMENT,
    isbn          VARCHAR(20)  UNIQUE NOT NULL,
    titulo        VARCHAR(255) NOT NULL,
    editorial     VARCHAR(100),
    anio          INT,
    descripcion   TEXT,
    dias_prestamo INT NOT NULL DEFAULT 8
);
 
CREATE TABLE Autor (
    id_autor INT PRIMARY KEY AUTO_INCREMENT,
    nombre   VARCHAR(150) NOT NULL
);
 
CREATE TABLE Libro_Autor (
    id_libro INT,
    id_autor INT,
    PRIMARY KEY (id_libro, id_autor),
    FOREIGN KEY (id_libro) REFERENCES Libro(id_libro) ON DELETE CASCADE,
    FOREIGN KEY (id_autor) REFERENCES Autor(id_autor) ON DELETE CASCADE
);
 
CREATE TABLE Categoria (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre       VARCHAR(100) UNIQUE NOT NULL
);
 
CREATE TABLE Libro_Categoria (
    id_libro     INT,
    id_categoria INT,
    PRIMARY KEY (id_libro, id_categoria),
    FOREIGN KEY (id_libro)     REFERENCES Libro(id_libro)         ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria) ON DELETE CASCADE
);
 
-- =========================================================
-- EJEMPLAR
-- =========================================================
CREATE TABLE Ejemplar (
    id_ejemplar   INT PRIMARY KEY AUTO_INCREMENT,
    codigo_barras VARCHAR(50) UNIQUE NOT NULL,
    ubicacion     VARCHAR(100),
    estado        ENUM('disponible','pendiente','prestado','perdido') DEFAULT 'disponible',
    id_libro      INT,
    FOREIGN KEY (id_libro) REFERENCES Libro(id_libro) ON DELETE CASCADE
);
 
-- =========================================================
-- RESERVA
-- =========================================================
-- Efecto inmediato al insertar: no requiere aprobacion ni estado.
-- Garantiza que solo el usuario que reservo pueda prestar
-- el ejemplar en ese intervalo de fechas.
-- No tienen overlap entre si ni con prestamos activos (ver triggers).
-- =========================================================
CREATE TABLE Reserva (
    id_reserva   INT  PRIMARY KEY AUTO_INCREMENT,
    fecha_inicio DATE NOT NULL,
    fecha_fin    DATE NOT NULL,
    id_usuario   INT  NOT NULL,
    id_ejemplar  INT  NOT NULL,
 
    FOREIGN KEY (id_usuario)  REFERENCES Usuario(id_usuario)   ON DELETE RESTRICT,
    FOREIGN KEY (id_ejemplar) REFERENCES Ejemplar(id_ejemplar) ON DELETE RESTRICT,
 
    CONSTRAINT chk_reserva_fechas CHECK (fecha_fin >= fecha_inicio)
);
 
-- =========================================================
-- PRESTAMO
-- =========================================================
CREATE TABLE Prestamo (
    id_prestamo       INT PRIMARY KEY AUTO_INCREMENT,
    fecha_prestamo    DATE     NOT NULL,
    fecha_vencimiento DATE     NOT NULL,
    fecha_aprobacion  DATETIME NULL,
    id_usuario        INT      NOT NULL,
    id_ejemplar       INT      NOT NULL,
    aprobado_por      INT      NULL,
    estado            ENUM('pendiente','aprobado','devuelto') DEFAULT 'pendiente',
 
    FOREIGN KEY (id_usuario)   REFERENCES Usuario(id_usuario)       ON DELETE RESTRICT,
    FOREIGN KEY (id_ejemplar)  REFERENCES Ejemplar(id_ejemplar)     ON DELETE RESTRICT,
    FOREIGN KEY (aprobado_por) REFERENCES Bibliotecario(id_usuario) ON DELETE SET NULL,
 
    CONSTRAINT chk_fecha_vencimiento CHECK (fecha_vencimiento > fecha_prestamo)
);
 
-- =========================================================
-- DEVOLUCION
-- =========================================================
-- El ejemplar solo vuelve a 'disponible' cuando el bibliotecario
-- aprueba la devolucion (recibido_por IS NOT NULL).
-- =========================================================
CREATE TABLE Devolucion (
    id_devolucion    INT PRIMARY KEY AUTO_INCREMENT,
    fecha_devolucion DATE NOT NULL,
    multa            DECIMAL(10,2) DEFAULT 0,
    observaciones    TEXT,
    id_prestamo      INT UNIQUE,
    recibido_por     INT NULL,
    estado           ENUM('pendiente','aprobado') DEFAULT 'pendiente',
    FOREIGN KEY (id_prestamo)  REFERENCES Prestamo(id_prestamo)     ON DELETE RESTRICT,
    FOREIGN KEY (recibido_por) REFERENCES Bibliotecario(id_usuario) ON DELETE SET NULL,
    CONSTRAINT chk_multa CHECK (multa >= 0)
);
 
-- =========================================================
-- CONFIGURACION
-- =========================================================
CREATE TABLE Configuracion (
    id_configuracion INT PRIMARY KEY,
    multa_por_dia    DECIMAL(10,2) NOT NULL
);
 
INSERT INTO Configuracion VALUES (1, 1000.00);
 
-- =========================================================
-- TRIGGERS
-- =========================================================
