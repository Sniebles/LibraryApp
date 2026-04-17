import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import { ca } from "date-fns/locale";

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

app.get("/books/most_borrowed", async (req, res) => {

    const { startDate, endDate } = req.query;

    try {
        const [rows] = await db.execute(`
            SELECT 
                l.*,
                GROUP_CONCAT(DISTINCT a.nombre SEPARATOR ', ') AS autores,
                GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ', ') AS categorias,
                CASE 
                    WHEN MAX(e.estado = 'disponible') = 1 THEN 'disponible'
                    ELSE 'no disponible'
                END AS disponibilidad,
                COUNT(DISTINCT p.id_prestamo) AS prestamos
            FROM libro l
            LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
            LEFT JOIN autor a ON la.id_autor = a.id_autor
            LEFT JOIN libro_categoria lc ON l.id_libro = lc.id_libro
            LEFT JOIN categoria c ON lc.id_categoria = c.id_categoria
            LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
            LEFT JOIN prestamo p ON p.id_ejemplar = e.id_ejemplar
            WHERE p.fecha_prestamo between ? and ?
            GROUP BY l.id_libro
            ORDER BY prestamos desc
        `, [startDate, endDate]);

        res.json(rows);
    } catch (error) {
        console.error("Error fetching most borrowed books:", error);
        res.status(500).json({ error: "Internal server error" });
    }
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
            u.id_usuario,
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

    let { identificacion, nombres, correo, rol, carrera } = req.body;
    
    try {
        const [usersCodes] = await db.execute(
            "SELECT codigo FROM Usuario"
        );
        let codigo = 1;
        for (let i = 0; i < usersCodes.length; i++) {
            const code = usersCodes[i].codigo;
            const num = parseInt(code.replace("U00", ""));
            if (num >= parseInt(codigo)) {
                codigo = num + 1;
            }
        }
        codigo = "U00" + codigo;

        if (!identificacion || !nombres || !correo || !rol) {
            return res.status(400).json({
                error: `Faltan campo: ${!identificacion ? 'identificacion' : !nombres ? 'nombres' : !correo ? 'correo' : 'rol'}`
            });
        }

        const [result] = await db.execute(`
            INSERT INTO Usuario (codigo, identificacion, nombres, correo)
            VALUES (?, ?, ?, ?)
        `, [codigo, identificacion, nombres, correo]);

        const id_usuario = result.insertId;

        if (rol === "estudiante") {

            if (!carrera)
                carrera = null;

            await db.execute(`
                INSERT INTO Estudiante (id_usuario, carrera)
                VALUES (?, ?)
            `, [id_usuario, carrera]);

        } else if (rol === "docente") {

            await db.execute(`
                INSERT INTO Docente (id_usuario)
                VALUES (?)
            `, [id_usuario]);

        } else if (rol === "bibliotecario") {

            await db.execute(`
                INSERT INTO Bibliotecario (id_usuario)
                VALUES (?)
            `, [id_usuario]);

        } else {
            return res.status(400).json({
                error: "Rol inválido"
            });
        }

        res.json({
            message: "Usuario creado correctamente",
            id_usuario
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: error.message
        });

    }
});

app.get("/users/pending" , async (req, res) => {
    try {
        const [rows] = await db.execute(`
            select u.*, count(id_prestamo) as p_pendientes, if(count(id_prestamo) = 0, "no","si") as pendiente
            from usuario u
            left join (
                select p.* from prestamo p
                left join devolucion d on d.id_prestamo = p.id_prestamo
                where p.aprobado_por is null or (d.recibido_por is null and d.id_devolucion is not null)
                ) p on p.id_usuario = u.id_usuario
            group by id_usuario
            order by p_pendientes desc
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});

app.post("/Borrow", async (req, res) => {

    const { id_usuario, id_ejemplar } = req.body;
    try {
        await db.execute(`
            INSERT INTO Prestamo (id_usuario, id_ejemplar, fecha_prestamo, fecha_vencimiento, fecha_aprobacion, aprobado_por)
            VALUES (?, ?, NOW(), NOW() + INTERVAL 14 DAY, NULL, NULL)
        `, [id_usuario, id_ejemplar]);
        await db.execute(`
            UPDATE ejemplar
            SET estado = 'prestado'
            WHERE id_ejemplar = ?
        `, [id_ejemplar]);
        res.json({ message: "Préstamo registrado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar el préstamo" });
    }
});

app.get("/borrowed/:id_usuario", async (req, res) => {

    const { id_usuario } = req.params;

    try {
        const [rows] = await db.execute(`
            SELECT 
                p.id_prestamo,
                l.titulo,
                e.codigo_barras,
                p.fecha_prestamo,
                p.fecha_vencimiento,
                p.aprobado_por,
                d.id_devolucion,
                d.multa
            FROM Prestamo p
            LEFT JOIN devolucion d ON p.id_prestamo = d.id_prestamo
            JOIN ejemplar e ON p.id_ejemplar = e.id_ejemplar
            LEFT JOIN libro l ON l.id_libro = e.id_libro
            WHERE p.id_usuario = ? AND (d.id_prestamo IS NULL OR d.recibido_por IS NULL OR d.multa > 0)
        `, [id_usuario]);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los préstamos" });
    }
});

app.post("/return", async (req, res) => {

    const { id_prestamo } = req.body;

    try {

        await db.beginTransaction();

        await db.execute(`
            INSERT INTO devolucion (
                id_prestamo,
                fecha_devolucion,
                multa,
                observaciones,
                recibido_por
            )
            SELECT
                p.id_prestamo,
                CURRENT_DATE,
                GREATEST(DATEDIFF(CURRENT_DATE, p.fecha_vencimiento), 0) * 1000,
                NULL,
                NULL
            FROM prestamo p
            WHERE p.id_prestamo = ?
        `, [id_prestamo]);

        await db.execute(`
            UPDATE ejemplar e
            INNER JOIN prestamo p 
                ON e.id_ejemplar = p.id_ejemplar
            SET e.estado = 'prestado'
            WHERE p.id_prestamo = ?
        `, [id_prestamo]);

        await db.commit();

        res.json({
            message: "Devolución registrada correctamente"
        });

    } catch (error) {

        await db.rollback();

        console.error(error);

        res.status(500).json({
            error: "Error al registrar la devolución"
        });
    }

});

app.post("/return/approve", async (req, res) => {

    const { id_prestamo, id_usuario, observaciones = null } = req.body;

    try {

        await db.beginTransaction();

        const [result] = await db.execute(`
            UPDATE devolucion
            SET recibido_por = ?, observaciones = ?
            WHERE id_prestamo = ?
        `, [id_usuario, observaciones, id_prestamo]);

        if (result.affectedRows === 0) {

            await db.rollback();

            return res.status(404).json({
                error: "Devolución no encontrada"
            });
        }

        await db.execute(`
            UPDATE ejemplar e
            INNER JOIN prestamo p
                ON e.id_ejemplar = p.id_ejemplar
            SET e.estado = 'disponible'
            WHERE p.id_prestamo = ?
        `, [id_prestamo]);

        await db.commit();

        res.json({
            message: "Devolución aprobada correctamente"
        });

    } catch (error) {

        await db.rollback();

        console.error(error);

        res.status(500).json({
            error: "Error al aprobar la devolución"
        });
    }

});

app.post("/cancel", async (req, res) => {

    const { id_prestamo } = req.body;

    try {
        await db.execute(`
            update ejemplar e
            inner join prestamo p on e.id_ejemplar = p.id_ejemplar
            set e.estado = 'disponible'
            where p.id_prestamo = ?
        `, [id_prestamo]);
        await db.execute(`
            delete from prestamo where id_prestamo = ?
        `, [id_prestamo]);

        res.json({ message: "Préstamo cancelado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al cancelar el préstamo" });
    }
});

app.delete("/users/delete/:id_usuario", async (req, res) => {

    const { id_usuario } = req.params;

    try {
        await db.beginTransaction();

        await db.execute(`
            update ejemplar e
            inner join prestamo p on e.id_ejemplar = p.id_ejemplar
            set e.estado = 'disponible'
            where p.id_usuario = ?
        `, [id_usuario]);

        await db.execute(`
            delete from devolucion
            where id_prestamo in (
                select id_prestamo
                from prestamo
                where id_usuario = ?
            )
        `, [id_usuario]);
        await db.execute(`
            delete from prestamo
            where id_usuario = ?
        `, [id_usuario]);
        await db.execute(`
            delete from estudiante
            where id_usuario = ?
        `, [id_usuario]);
        await db.execute(`
            delete from docente
            where id_usuario = ?
        `, [id_usuario]);
        await db.execute(`
            delete from bibliotecario
            where id_usuario = ?
        `, [id_usuario]);
        await db.execute(`
            delete from usuario
            where id_usuario = ?
        `, [id_usuario]);

        await db.commit();

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        await db.rollback();
        console.error(error);
        res.status(500).json({
            error: "Error al eliminar el usuario"
        });
    }
});

app.post("/users/update", async (req, res) => {

    const { id_usuario, identificacion, nombres, correo, rol, carrera } = req.body;

    try {
        await db.beginTransaction();

        let prevRol = await db.execute(`
            SELECT 
                CASE
                    WHEN e.id_usuario IS NOT NULL THEN 'estudiante'
                    WHEN d.id_usuario IS NOT NULL THEN 'docente'
                    WHEN b.id_usuario IS NOT NULL THEN 'bibliotecario'
                END AS rol_anterior
            FROM usuario u
            LEFT JOIN estudiante e ON u.id_usuario = e.id_usuario
            LEFT JOIN docente d ON u.id_usuario = d.id_usuario
            LEFT JOIN bibliotecario b ON u.id_usuario = b.id_usuario
            WHERE u.id_usuario = ?
        `, [id_usuario]);
        prevRol = prevRol[0][0].rol_anterior;

        if (prevRol !== rol) {
            if (prevRol === "estudiante") {
                await db.execute(`
                    delete from estudiante
                    where id_usuario = ?
                `, [id_usuario]);
            }
            if (prevRol === "docente") {
                await db.execute(`
                    delete from docente
                    where id_usuario = ?
                `, [id_usuario]);
            }
            if (prevRol === "bibliotecario") {
                await db.execute(`
                    delete from bibliotecario
                    where id_usuario = ?
                `, [id_usuario]);
            }
            if (rol === "estudiante") {

                if (!carrera)
                    carrera = null;

                await db.execute(`
                    INSERT INTO Estudiante (id_usuario, carrera)
                    VALUES (?, ?)
                `, [id_usuario, carrera]);

            } else if (rol === "docente") {

                await db.execute(`
                    INSERT INTO Docente (id_usuario)
                    VALUES (?)
                `, [id_usuario]);

            } else if (rol === "bibliotecario") {

                await db.execute(`
                    INSERT INTO Bibliotecario (id_usuario)
                    VALUES (?)
                `, [id_usuario]);

            } else {
                await db.rollback();
                throw new Error("Rol inválido");
            }
        }

        await db.execute(`
            UPDATE Estudiante
            SET carrera = ?
            WHERE id_usuario = ?
        `, [carrera, id_usuario, id_usuario]);

        await db.execute(`
            UPDATE usuario
            SET identificacion = ?, nombres = ?, correo = ?, updated_at = NOW()
            WHERE id_usuario = ?
        `, [identificacion, nombres, correo, id_usuario]);
        
        await db.commit();

        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        await db.rollback();
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
});

app.post("/borrowed/approve", async (req, res) => {
    const { id_prestamo, id_usuario } = req.body;

    try {
        await db.execute(`
            UPDATE prestamo
            SET aprobado_por = ?
            WHERE id_prestamo = ?
        `, [id_usuario, id_prestamo]);

        res.json({ message: "Préstamo aprobado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al aprobar el préstamo" });
    }
});

app.post("/books/add", async (req, res) => {

    const { isbn, titulo, editorial, anio, descripcion, autores, categorias } = req.body;

    try {
        await db.beginTransaction();

        await db.execute(`
            INSERT INTO libro (isbn, titulo, editorial, anio, descripcion)
            VALUES (?, ?, ?, ?, ?)
        `, [isbn, titulo, editorial, anio, descripcion]);

        const autoresSplit = autores
            .split(",")
            .map(a => a.trim())
            .filter(a => a.length > 0);

        const categoriasSplit = categorias
            .split(",")
            .map(c => c.trim())
            .filter(c => c.length > 0);

        if (autoresSplit.length > 0) {
            await db.execute(`
                INSERT INTO autor (nombre)
                SELECT *
                FROM (
                    SELECT ? AS nombre
                    ${autoresSplit.slice(1).map(() => "UNION SELECT ?").join("\n")}
                ) AS nuevos
                WHERE nombre NOT IN (SELECT nombre FROM autor)
            `, autoresSplit);
        }

        if (categoriasSplit.length > 0) {
            await db.execute(`
                INSERT INTO categoria (nombre)
                SELECT *
                FROM (
                    SELECT ? AS nombre
                    ${categoriasSplit.slice(1).map(() => "UNION SELECT ?").join("\n")}
                ) AS nuevas
                WHERE nombre NOT IN (SELECT nombre FROM categoria)
            `, categoriasSplit);
        }

        if (autoresSplit.length > 0) {
            await db.execute(`
                INSERT INTO libro_autor (id_libro, id_autor)
                SELECT l.id_libro, a.id_autor
                FROM libro l, autor a
                WHERE l.isbn = ? 
                AND a.nombre IN (${autoresSplit.map(() => "?").join(", ")})
            `, [isbn, ...autoresSplit]);
        }

        if (categoriasSplit.length > 0) {
            await db.execute(`
                INSERT INTO libro_categoria (id_libro, id_categoria)
                SELECT l.id_libro, c.id_categoria
                FROM libro l, categoria c
                WHERE l.isbn = ? 
                AND c.nombre IN (${categoriasSplit.map(() => "?").join(", ")})
            `, [isbn, ...categoriasSplit]);
        }

        await db.commit();

        res.json({ message: "Libro agregado correctamente" });

    } catch (error) {

        await db.rollback();

        console.error(error);

        res.status(500).json({ error: "Error al agregar el libro" });
    }
});

app.post("/books/update", async (req, res) => {

    const { id_libro, isbn, titulo, editorial, anio, descripcion, autores, categorias } = req.body;

    try {
        await db.beginTransaction();

        const autoresSplit = autores.split(",")
            .map(a => a.trim())
            .filter(a => a.length > 0);
        const categoriasSplit = categorias.split(",")
            .map(c => c.trim())
            .filter(c => c.length > 0);

        await db.execute(`
            UPDATE libro
            SET isbn = ?, titulo = ?, editorial = ?, anio = ?, descripcion = ?
            WHERE id_libro = ?
        `, [isbn, titulo, editorial, anio, descripcion, id_libro]);

        await db.execute(`
            DELETE FROM libro_autor
            WHERE id_libro = ?
        `, [id_libro]);

        await db.execute(`
            DELETE FROM libro_categoria
            WHERE id_libro = ?
        `, [id_libro]);

        await db.execute(`
            INSERT INTO autor (nombre)
            SELECT *
            FROM (
                SELECT ? AS nombre
                ${autoresSplit.slice(1).map(() => "UNION SELECT ?").join("\n")}
            ) AS nuevos
            WHERE nombre NOT IN (SELECT nombre FROM autor)
        `, autoresSplit);
        
        await db.execute(`
            INSERT INTO categoria (nombre)
            SELECT *
            FROM (
                SELECT ? AS nombre
                ${categoriasSplit.slice(1).map(() => "UNION SELECT ?").join("\n")}
            ) AS nuevas
            WHERE nombre NOT IN (SELECT nombre FROM categoria)
        `, categoriasSplit);

        await db.execute(`
            INSERT INTO libro_autor (id_libro, id_autor)
            SELECT ?, a.id_autor
            FROM autor a
            WHERE a.nombre IN (${autoresSplit.map(() => "?").join(", ")})
        `, [id_libro, ...autoresSplit]);

        await db.execute(`
            INSERT INTO libro_categoria (id_libro, id_categoria)
            SELECT ?, c.id_categoria
            FROM categoria c
            WHERE c.nombre IN (${categoriasSplit.map(() => "?").join(", ")})
        `, [id_libro, ...categoriasSplit]);

        await db.commit();

        res.json({ message: "Libro actualizado correctamente" });

    } catch (error) {

        await db.rollback();

        console.error(error);

        res.status(500).json({ error: "Error al actualizar el libro" });
    }
});

app.get("/users/top_borrowers", async (req, res) => {

    try {
        const [rows] = await db.execute(`
            SELECT 
                u.*,
                COUNT(p.id_prestamo) AS total_prestamos
            FROM usuario u
            JOIN prestamo p ON u.id_usuario = p.id_usuario
            WHERE p.aprobado_por IS NOT NULL
            GROUP BY u.id_usuario, u.nombres
            ORDER BY total_prestamos DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los usuarios con más préstamos" });
    }
});

app.delete("/books/delete/:id_libro", async (req, res) => {

    const { id_libro } = req.params;

    try {

        await db.execute(`
            DELETE FROM libro
            WHERE id_libro = ?
        `, [id_libro]);

        res.json({ message: "Libro eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el libro" });
    }
});

app.post("/copies/add", async (req, res) => {

    const { codigo_barras, ubicacion, estado = "disponible", id_libro } = req.body;

    try {

        const [result] = await db.execute(`
            INSERT INTO ejemplar (codigo_barras, ubicacion, estado, id_libro)
            VALUES (?, ?, ?, ?)
        `, [codigo_barras, ubicacion, estado, id_libro]);

        res.json({
            message: "Ejemplar creado correctamente",
            id_ejemplar: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al crear el ejemplar"
        });
    }
});

app.put("/copies/update/:id_ejemplar", async (req, res) => {

    const { id_ejemplar } = req.params;

    const {
        codigo_barras,
        ubicacion,
        id_libro
    } = req.body;

    try {

        const [result] = await db.execute(`
            UPDATE ejemplar
            SET
                codigo_barras = ?,
                ubicacion = ?,
                id_libro = ?
            WHERE id_ejemplar = ?
        `, [codigo_barras, ubicacion, id_libro, id_ejemplar]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                error: "Ejemplar no encontrado"
            });
        }

        res.json({
            message: "Ejemplar actualizado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al actualizar ejemplar"
        });
    }
});

app.delete("/copies/delete/:id_ejemplar", async (req, res) => {

    const { id_ejemplar } = req.params;

    try {

        await db.beginTransaction();

        await db.execute(`
            DELETE d
            FROM devolucion d
            INNER JOIN prestamo p
                ON d.id_prestamo = p.id_prestamo
            WHERE p.id_ejemplar = ?
        `, [id_ejemplar]);

        await db.execute(`
            DELETE FROM prestamo
            WHERE id_ejemplar = ?
        `, [id_ejemplar]);

        const [result] = await db.execute(`
            DELETE FROM ejemplar
            WHERE id_ejemplar = ?
        `, [id_ejemplar]);

        if (result.affectedRows === 0) {

            await db.rollback();

            return res.status(404).json({
                error: "Ejemplar no encontrado"
            });
        }

        await db.commit();

        res.json({
            message: "Ejemplar eliminado correctamente (incluyendo préstamos asociados)"
        });

    } catch (error) {

        await db.rollback();

        console.error(error);

        res.status(500).json({
            error: "Error al eliminar ejemplar"
        });
    }
});

app.put("/users/block/:id_usuario", async (req, res) => {

    const { id_usuario } = req.params;

    try {

        const [result] = await db.execute(`
            UPDATE usuario
            SET estado = 'bloqueado'
            WHERE id_usuario = ?
        `, [id_usuario]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        res.json({
            message: "Usuario bloqueado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al bloquear usuario"
        });
    }
});

app.put("/users/unblock/:id_usuario", async (req, res) => {

    const { id_usuario } = req.params;

    try {

        const [result] = await db.execute(`
            UPDATE usuario
            SET estado = 'activo'
            WHERE id_usuario = ?
        `, [id_usuario]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        res.json({
            message: "Usuario activado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al activar usuario"
        });
    }
});

app.patch("/copies/toggle-lost/:id_ejemplar", async (req, res) => {

    const { id_ejemplar } = req.params;

    try {

        const [result] = await db.execute(`
            UPDATE ejemplar
            SET estado = CASE
                WHEN estado = 'perdido' THEN 'disponible'
                WHEN estado = 'disponible' THEN 'perdido'
            END
            WHERE id_ejemplar = ?
            AND estado IN ('disponible','perdido')
        `, [id_ejemplar]);

        if (result.affectedRows === 0) {

            return res.status(400).json({
                message: "No se puede cambiar el estado del ejemplar (puede estar prestado o eliminado)"
            });

        }

        res.json({
            message: "Estado del ejemplar actualizado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al actualizar el estado del ejemplar"
        });

    }

});

startServer();