import { useEffect, useState } from "react";
import Book from './Book';
import './Books.css'
import Box from './Box'

function Books({close, user, addPopup}) {

    const [books, setBooks] = useState([]);

    const [filter, setFilter] = useState("title");
    const [search, setSearch] = useState("");

    const setBook = (index) => {
        const book = books[index - 1]
        addPopup(
            <Book
                addPopup={addPopup}
                loadBooks={loadBooks}
                key={index}
                user={user}
                title={book.titulo}
                isbn={book.isbn}
                editorial={book.editorial}
                year={book.anio}
                description={book.descripcion}
                id_book={book.id_libro}
                autores={book.autores}
                categorias={book.categorias}
                disponibilidad={book.disponibilidad}
                dias_prestamo={book.dias_prestamo}
                setBook={setBook} />,
            '30rem', '70%'
        )
    }
    
    useEffect(() => {
        loadBooks();
    }, [search, filter]);

    const loadBooks = () => {
        const fetchBooks = async () => {
            try {
                let url = "http://localhost:3001/books";
                if (search.trim() !== "" || filter === "available") {
                    switch (filter) {
                        case "title":
                            url = `http://localhost:3001/books/title/${encodeURIComponent(search)}`;
                            break;
                        case "author":
                            url = `http://localhost:3001/books/author/${encodeURIComponent(search)}`;
                            break;
                        case "ISBN":
                            url = `http://localhost:3001/books/isbn/${encodeURIComponent(search)}`;
                            break;
                        case "category":
                            url = `http://localhost:3001/books/category/${encodeURIComponent(search)}`;
                            break;
                        case "available":
                            url = `http://localhost:3001/books/disponivility/${encodeURIComponent(true)}`;
                            break;
                        default:
                            break;
                    }
                }
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setBooks(data);
            } catch (error) {
                console.error("Error fetching books:", error);
                setBooks([]);
            }
        };

        fetchBooks();
    }

    return (
        <>
            <div className="books_topbar">
                <div className="search_input_wrapper">
                    <label htmlFor="bookSearch">Buscar</label>
                    <input
                        id="bookSearch"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por término..."
                    />
                </div>
                <div className="search_options">
                    {[
                        {value: "title", label: "titulo"},
                        {value: "author", label: "autor"},
                        {value: "ISBN", label: "ISBN"},
                        {value: "category", label: "categoría"},
                        {value: "available", label: "disponible"}
                    ].map((option) => (
                        <label className="search_option" key={option.value}>
                            <input
                                type="radio"
                                name="searchField"
                                value={option.value}
                                checked={filter === option.value}
                                onChange={() => setFilter(option.value)}
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className='books_content'>
                {books.map((book, index) => (
                    <Box onClick={() => setBook(index + 1)} key={index} borderColor={book.disponibilidad !== "disponible" ? "var(--warning-color)" : "transparent"} className="book">
                        <div>
                            <h1>{book.titulo}</h1>
                            <p>{book.isbn}</p>
                            <p>{book.descripcion}</p>
                            <p>{book.autores}</p>
                            <p>{book.categorias}</p>
                            <p>dias de prestamo: {book.dias_prestamo} dias</p>
                            {book.disponibilidad !== "disponible" &&
                            <div className="unavailable_note">
                                <h2>No disponible</h2>
                            </div>
                            }
                        </div>
                    </Box>
                ))}
            </div>
        </>
    )
}

export default Books
