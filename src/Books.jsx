import './Books.css'
import Box from './Box'
import Panel from './Panel'

function Books({setPanel}) {
    const books = [
    {
        ISBN: "978-0131103627",
        title: "The C Programming Language",
        authors: ["Brian W. Kernighan", "Dennis M. Ritchie"],
        publisher: "Prentice Hall",
        year: 1988,
        categories: ["Programming", "Computer Science"],
        description: "A classic book that introduces the C programming language and its core concepts."
    },
    {
        ISBN: "978-0201633610",
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        authors: ["Erich Gamma", "Richard Helm", "Ralph Johnson", "John Vlissides"],
        publisher: "Addison-Wesley",
        year: 1994,
        categories: ["Software Engineering", "Design Patterns"],
        description: "A foundational book describing common solutions to recurring software design problems."
    },
    {
        ISBN: "978-0132350884",
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        authors: ["Robert C. Martin"],
        publisher: "Prentice Hall",
        year: 2008,
        categories: ["Software Engineering", "Best Practices"],
        description: "A guide to writing readable, maintainable, and efficient code."
    },
    {
        ISBN: "978-0131103627",
        title: "The C Programming Language",
        authors: ["Brian W. Kernighan", "Dennis M. Ritchie"],
        publisher: "Prentice Hall",
        year: 1988,
        categories: ["Programming", "Computer Science"],
        description: "A classic book that introduces the C programming language and its core concepts."
    },
    {
        ISBN: "978-0201633610",
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        authors: ["Erich Gamma", "Richard Helm", "Ralph Johnson", "John Vlissides"],
        publisher: "Addison-Wesley",
        year: 1994,
        categories: ["Software Engineering", "Design Patterns"],
        description: "A foundational book describing common solutions to recurring software design problems."
    },
    {
        ISBN: "978-0132350884",
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        authors: ["Robert C. Martin"],
        publisher: "Prentice Hall",
        year: 2008,
        categories: ["Software Engineering", "Best Practices"],
        description: "A guide to writing readable, maintainable, and efficient code."
    },
    {
        ISBN: "978-0131103627",
        title: "The C Programming Language",
        authors: ["Brian W. Kernighan", "Dennis M. Ritchie"],
        publisher: "Prentice Hall",
        year: 1988,
        categories: ["Programming", "Computer Science"],
        description: "A classic book that introduces the C programming language and its core concepts."
    },
    {
        ISBN: "978-0201633610",
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        authors: ["Erich Gamma", "Richard Helm", "Ralph Johnson", "John Vlissides"],
        publisher: "Addison-Wesley",
        year: 1994,
        categories: ["Software Engineering", "Design Patterns"],
        description: "A foundational book describing common solutions to recurring software design problems."
    },
    {
        ISBN: "978-0132350884",
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        authors: ["Robert C. Martin"],
        publisher: "Prentice Hall",
        year: 2008,
        categories: ["Software Engineering", "Best Practices"],
        description: "A guide to writing readable, maintainable, and efficient code."
    }
    ];
    return (
        <Panel setPanel={setPanel}>
            <div className='books_content'>
                {books.map((book, index) => (
                    <Box key={index} className="book">
                        <div>
                            <h1>{book.title}</h1>
                            <p>{book.ISBN}</p>
                            <p>{book.authors.join(", ")}</p>
                        </div>
                    </Box>
                ))}
            </div>
        </Panel>
    )
}

export default Books
