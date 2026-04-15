import { useEffect, useState } from "react";
import Book from './Book';
import './Books.css'
import Box from './Box'
import Panel from './Panel'

function Books({setPanel, user}) {
    const [book, setBook] = useState(0)
    const [books, setBooks] = useState([]);

    const [filter, setFilter] = useState("title");
    const [search, setSearch] = useState("");
    
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
            <Panel type={0} setPanel={setPanel}>
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
                        <Box onClick={() => setBook(index + 1)} key={index} borderColor={book.disponibilidad !== "disponible" ? "var(--color-5)" : "var(--color-1)"} className="book">
                            <div>
                                <h1>{book.titulo}</h1>
                                <p>{book.isbn}</p>
                                <p>{book.descripcion}</p>
                                <p>{book.autores}</p>
                                <p>{book.categorias}</p>
                                {book.disponibilidad !== "disponible" &&
                                <div className="unavailable_note">
                                    <h2>No disponible</h2>
                                </div>
                                }
                            </div>
                        </Box>
                    ))}
                </div>
            </Panel>
            {
                books.map((_book, index) => (
                    book == index + 1 ? <Book
                    loadBooks={loadBooks}
                    key={index}
                    user={user}
                    title={_book.titulo}
                    isbn={_book.isbn}
                    editorial={_book.editorial}
                    year={_book.anio}
                    description={_book.descripcion}
                    id_book={_book.id_libro}
                    autores={_book.autores}
                    categorias={_book.categorias}
                    disponibilidad={_book.disponibilidad}
                    setBook={setBook} /> : null
                ))
            }
        </>
    )
}

export default Books
