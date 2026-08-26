import React , {useState, useEffect} from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';


const StudentBooks = () => {
    const [books, setBooks] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));


    useEffect(() => {
      if(!studentUser){
        navigate("/user/login");
        return;
      }

        const fetchBooks = async () => {
            setLoading(true);     //api call start hone wala h
            try {
                const res = await axios.get("https://library-management-system-efu0.onrender.com/api/user/books/");
                setBooks(res.data.books);
                setFiltered(res.data.books);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch books.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);
           
    useEffect(() => {
      const term = search.trim().toLowerCase();
      if(!term){
        setFiltered(books);
        return;
      }
        
        const filteredBooks = books.filter((book) =>
            book.title.toLowerCase().includes(term) || 
            book.author_name.toLowerCase().includes(term) ||
            book.category_name.toLowerCase().includes(term) ||
            book.isbn.toLowerCase().includes(term)
        );
        setFiltered(filteredBooks);
    }, [search, books]);

    
  const getCoverUrl = (book) => {
      if(!book.cover_image){
        return null
      }
      if(book.cover_image.startsWith("http://")){
        return book.cover_image;
      }
      return `https://library-management-system-efu0.onrender.com${book.cover_image}`;
  }

  return (
    <div>
      <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h3 className='mb-1 d-flex align-items-center gap-2'>
              <span className='d-inline-flex align-items-center justify-content-center rounded-3' style={{width: "40px", height:"40px", background:"#0f766e1a"}}>
                <i className='fa-solid fa-book text-primary'></i>
              </span>
              <span>Available Books</span>
            </h3>

            <p className='text-muted'>Explore all books in the library catalogue with quantity and availability</p>
          </div>

          <div className='mt-3'>
            <div className='input-group'>
              <span className='input-group-text bg-white border-end-0'>
                <i className='fa-solid fa-magnifying-glass text-muted'></i>
              </span>
              <input type="text" className='form-control border-start-0' placeholder='Search by title, author, category, ISBN' 
              value={search} onChange={(e) => setSearch(e.target.value)} style={{width: "300px"}}/>
            </div>
          </div>

        </div>

        {loading && (
          <div className='text-center my-5'>
            <div className='spinner-border text-primary' role="status"></div>
              <span className='mt-3 text-muted'>Loading...</span>
            
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className='col-12 text-center py-5'>
            <i className='fa-solid fa-book-open-reader text-muted' style={{fontSize: "3rem"}}></i>
            <h4 className='mt-3'>No books found</h4>
                <p className='text-muted'>Try adjusting your search terms.</p>
              </div>
            )}



        {!loading && filtered.length > 0 && (
          <div className='row g-4'>
            {filtered.map((book) => (
              
              <div className='col-md-4 col-lg-4' key={book.id}>
                <div className='card border-0 shadow-sm h-100 rounded-4'>

                  <div className="bg-light d-flex align-items-center justify-content-center" style={{height: "200px"}}>
                    {/* <img src={`https://library-management-system-efu0.onrender.com${book.cover_image}`} alt={book.title} className="img-fluid" style={{maxHeight: "180px", objectFit: "contain"}} /> */}
                    {getCoverUrl(book) ? (
                      <img src={getCoverUrl(book)} alt={book.title} className="img-fluid" style={{maxHeight: "180px", objectFit: "contain"}} />
                    ) : (
                      <div className='text-muted text-center'>
                        <i className='fa-solid fa-book text-muted'></i>
                        <p className='small'>No Cover Image</p>
                      </div>
                    )}
                  </div>
                   
                  

                  <div className='card-body d-flex flex-column'>
                    
                      <h6 className='mb-1 text-truncate'>{book.title}</h6>
                      <p className='mb-2 text-muted small'>
                        <i className='fa-solid fa-user-pen text-muted'></i>
                        {book.author_name}</p>
                      <p className='small mb-1'>
                        <span className='badge text-primary border border-primary-subtle'>
                          <i className='fa-solid fa-tag'></i> {book.category_name}
                        </span>
                      </p>
                      <p className='mb-1 small text-muted'>
                        <i className='fa-solid fa-barcode'></i> ISBN: {book.isbn}
                      </p>

                      <div className='d-flex justify-content-between align-items-center mt-2'>
                        <span className="fw-semibold text-success">
                          ₹ {book.price}
                        </span>
                        <span className={`badge px-3 py-2 rounded-pill ${book.available_quantity > 0 ? "bg-success-subtle text-success border border-success-subtle" : "bg-danger-subtle text-danger border border-danger-subtle"}`}>
                          {book.available_quantity > 0 ? `Available: ${book.available_quantity}` : "Not Available"}
                        </span>
                      </div>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        
          
        
      </div>
    </div>
    </div>
  )
}

export default StudentBooks;