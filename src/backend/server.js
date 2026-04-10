import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

let db;

async function startServer() {

    db = await mysql.createConnection({
        host: "localhost",
        user: "root2",
        password: "123456",
        database: "lab"
    });

    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
}

app.get("/books", async (req, res) => {

    const [rows] = await db.execute(`
        SELECT 
            l.*,
            GROUP_CONCAT(DISTINCT a.nombre SEPARATOR ', ') AS autores,
            GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ', ') AS categorias,
            CASE 
                WHEN MAX(e.estado = 'disponible') = 1 THEN 'disponible'
                ELSE 'no disponible'
            END AS disponibilidad
        FROM libro l
        LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
        LEFT JOIN autor a ON la.id_autor = a.id_autor
        LEFT JOIN libro_categoria lc ON l.id_libro = lc.id_libro
        LEFT JOIN categoria c ON lc.id_categoria = c.id_categoria
        LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
        GROUP BY l.id_libro
    `);

    res.json(rows);
});

app.get("/books/title/:title", async (req, res) => {

    const { title } = req.params;

    const [rows] = await db.execute(`
        SELECT 
            l.*,
            GROUP_CONCAT(DISTINCT a.nombre SEPARATOR ', ') AS autores,
            GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ', ') AS categorias,
            CASE 
                WHEN MAX(e.estado = 'disponible') = 1 THEN 'disponible'
                ELSE 'no disponible'
            END AS disponibilidad
        FROM libro l
        LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
        LEFT JOIN autor a ON la.id_autor = a.id_autor
        LEFT JOIN libro_categoria lc ON l.id_libro = lc.id_libro
        LEFT JOIN categoria c ON lc.id_categoria = c.id_categoria
        LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
        WHERE l.titulo LIKE ?
        GROUP BY l.id_libro
    `, [`%${title}%`]);

    res.json(rows);
});

app.get("/books/author/:author", async (req, res) => {

    const { author } = req.params;

    const [rows] = await db.execute(`
        SELECT 
            l.*,
            GROUP_CONCAT(DISTINCT a.nombre SEPARATOR ', ') AS autores,
            GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ', ') AS categorias,
            CASE 
                WHEN MAX(e.estado = 'disponible') = 1 THEN 'disponible'
                ELSE 'no disponible'
            END AS disponibilidad
        FROM libro l
        JOIN libro_autor la ON l.id_libro = la.id_libro
        JOIN autor a ON la.id_autor = a.id_autor
        LEFT JOIN libro_categoria lc ON l.id_libro = lc.id_libro
        LEFT JOIN categoria c ON lc.id_categoria = c.id_categoria
        LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
        WHERE a.nombre LIKE ?
        GROUP BY l.id_libro
    `, [`%${author}%`]);

    res.json(rows);
});

app.get("/books/isbn/:isbn", async (req, res) => {

    const { isbn } = req.params;

    const [rows] = await db.execute(`
        SELECT 
            l.*,
            GROUP_CONCAT(DISTINCT a.nombre SEPARATOR ', ') AS autores,
            GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ', ') AS categorias,
            CASE 
                WHEN MAX(e.estado = 'disponible') = 1 THEN 'disponible'
                ELSE 'no disponible'
            END AS disponibilidad
        FROM libro l
        LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
        LEFT JOIN autor a ON la.id_autor = a.id_autor
        LEFT JOIN libro_categoria lc ON l.id_libro = lc.id_libro
        LEFT JOIN categoria c ON lc.id_categoria = c.id_categoria
        LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
        WHERE l.isbn LIKE ?
        GROUP BY l.id_libro
    `, [`%${isbn}%`]);

    res.json(rows);
});

app.get("/books/category/:category", async (req, res) => {

    const { category } = req.params;

    const [rows] = await db.execute(`
        SELECT 
            l.*,
            GROUP_CONCAT(DISTINCT a.nombre SEPARATOR ', ') AS autores,
            GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ', ') AS categorias,
            CASE 
                WHEN MAX(e.estado = 'disponible') = 1 THEN 'disponible'
                ELSE 'no disponible'
            END AS disponibilidad
        FROM libro l
        LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
        LEFT JOIN autor a ON la.id_autor = a.id_autor
        JOIN libro_categoria lc ON l.id_libro = lc.id_libro
        JOIN categoria c ON lc.id_categoria = c.id_categoria
        LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
        WHERE c.nombre LIKE ?
        GROUP BY l.id_libro
    `, [`%${category}%`]);

    res.json(rows);
});

app.get("/books/disponivility/:disponivility", async (req, res) => {

    const { disponivility } = req.params;

    const estado = disponivility === 'true'
        ? "MAX(e.estado = 'disponible') = 1"
        : "MAX(e.estado = 'disponible') = 0";

    const [rows] = await db.execute(`
        SELECT 
            l.*,
            GROUP_CONCAT(DISTINCT a.nombre SEPARATOR ', ') AS autores,
            GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ', ') AS categorias,
            CASE 
                WHEN MAX(e.estado = 'disponible') = 1 THEN 'disponible'
                ELSE 'no disponible'
            END AS disponibilidad
        FROM libro l
        LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
        LEFT JOIN autor a ON la.id_autor = a.id_autor
        LEFT JOIN libro_categoria lc ON l.id_libro = lc.id_libro
        LEFT JOIN categoria c ON lc.id_categoria = c.id_categoria
        LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
        GROUP BY l.id_libro
        HAVING ${estado}
    `);

    res.json(rows);
});

app.get("/copies/:id_book", async (req, res) => {

    try {

        const { id_book } = req.params;

        const [rows] = await db.execute(
            "SELECT * FROM ejemplar WHERE id_libro = ?",
            [id_book]
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error retrieving copies"
        });

    }

});

app.get("/user/mail/:mail", async (req, res) => {

    const { mail } = req.params;

    const [rows] = await db.execute(`
        SELECT 
            u.codigo,
            u.identificacion,
            u.nombres,
            u.correo,
            CASE
                WHEN e.id_usuario IS NOT NULL THEN 'estudiante'
                WHEN d.id_usuario IS NOT NULL THEN 'docente'
                WHEN b.id_usuario IS NOT NULL THEN 'bibliotecario'
                ELSE 'sin rol'
            END AS rol,
            e.carrera,
            u.estado
        FROM Usuario u
        LEFT JOIN Estudiante e ON u.id_usuario = e.id_usuario
        LEFT JOIN Docente d ON u.id_usuario = d.id_usuario
        LEFT JOIN Bibliotecario b ON u.id_usuario = b.id_usuario
        WHERE u.correo = ?
    `, [mail]);

    res.json(rows);
});

app.post("/users", async (req, res) => {

    const { identificacion, nombres, correo, rol, carrera } = req.body;

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [lastUser] = await connection.execute(`
            SELECT IFNULL(MAX(id_usuario),0)+1 AS next_id FROM Usuario
        `);

        const nextId = lastUser[0].next_id;
        const codigo = `U${String(nextId).padStart(3, "0")}`;

        const [result] = await connection.execute(`
            INSERT INTO Usuario (codigo, identificacion, nombres, correo)
            VALUES (?, ?, ?, ?)
        `, [codigo, identificacion, nombres, correo]);

        const id_usuario = result.insertId;

        if (rol === "Estudiante") {

            if (!carrera)
                throw new Error("Carrera es obligatoria para estudiantes");

            await connection.execute(`
                INSERT INTO Estudiante (id_usuario, carrera)
                VALUES (?, ?)
            `, [id_usuario, carrera]);

        }
        else if (rol === "Docente") {

            await connection.execute(`
                INSERT INTO Docente (id_usuario)
                VALUES (?)
            `, [id_usuario]);

        }
        else if (rol === "Bibliotecario") {

            await connection.execute(`
                INSERT INTO Bibliotecario (id_usuario)
                VALUES (?)
            `, [id_usuario]);

        }
        else {
            throw new Error("Rol inválido");
        }

        await connection.commit();

        res.json({
            message: "Usuario creado correctamente",
            id_usuario
        });

    }
    catch (error) {

        await connection.rollback();

        res.status(500).json({
            error: error.message
        });

    }
    finally {

        connection.release();

    }

});

startServer();