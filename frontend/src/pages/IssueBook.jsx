import React , {useState, useEffect} from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const IssueBook = () => {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [bookQuery, setBookQuery] = useState("");
  const [book, setBook] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [remark, setRemark] = useState("");
  const navigate = useNavigate();
  const adminUser = localStorage.getItem("adminUser");

  useEffect(() => {
    if(!adminUser) {
      navigate("/admin/login");
    }
  }, []);

  const handleFetchStudent = async () => {
    if (!studentId) {
      toast.error("Please enter a student ID.");
      return;
    }
    setStudent(null);
    setStudentLoading(true);

    try {
      const res = await axios.get(`http://localhost:8000/api/students/by-id/?student_id=${studentId}`);
      setStudent(res.data.student);
    } catch (error) {
      toast.error("Student not found.");
    } finally {
      setStudentLoading(false);
    }
  };

  const handleFetchBook = async () => {
    if (!bookQuery) {
      toast.error("Please enter a book ID or title.");
      return;
    }
    setBook(null);
    setBookLoading(true);

    try {
      const res = await axios.get(`http://localhost:8000/api/books/lookup/?q=${bookQuery}`);
      setBook(res.data.book);
    } catch (error) {
      toast.error("Book not found.");
    } finally {
      setBookLoading(false);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    if (!student || !book || !remark) {
      toast.error("Please select both a student and a book.");
      return;
    }

    if(book.quantity <= 0){
      toast.error("Book is out of stock.");
      return;
    }

    setIssuing(true);

    try {
      const res = await axios.post("http://localhost:8000/api/issue_book/", {
        student_id: student.student_id,
        book_id: book.id,
        remark: remark
      });
      toast.success("Book issued successfully.");
      //navigate("/admin/issued_books");
      setStudent(null);
      setBook(null);
      setRemark("");
      setStudentId("");
      setBookQuery("");
    } catch (error) {
      toast.error("Failed to issue book.");
    } finally {
      setIssuing(false);
    }
  };

  const getBookCoverUrl = book && book.cover_image ? 
    (book.cover_image.startsWith("http://") ? book.cover_image : `http://localhost:8000${book.cover_image}`)
    : null;


  return (
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8 mx-auto d-flex justify-content-between align-items-center">
            <div className="mb-4 text-center">
              <h4 className="fw-semibold mb-1">
                <i className="fa-solid fa-layer-group text-primary"></i>Issue a new book</h4>
              <p className='text-muted small'>
                Search student and book, then issue the book with a remark.
              </p>
            </div>
            <button className='btn btn-primary btn-sm'
            onClick={()=>navigate("/admin/manage_issued_books")}>
              <i className="fa-solid fa-book"></i>Manage Issued Books
            </button>
          </div>
        </div>

        <div className="row g-4">
          <div className='col-md-7'>
            <div className='card border-0 shadow-sm rounded-4'>
              <div className='card-body p-4'>
                <form onSubmit={handleIssueBook}>
                  
                  <div className='mb-4 '>
                    <label className='form-label small fw-medium'>
                      Student ID <span className='text-danger'>*</span>
                    </label>
                    <div className='input-group'>
                      <input type='text' className='form-control' placeholder='e.g. 1001' value={studentId} 
                      onChange={(e)=>setStudentId(e.target.value)}
                      onBlur={handleFetchStudent} required />
                      <button type='button' className='btn btn-outline-secondary' onClick={handleFetchStudent}>
                        {studentLoading ? (
                          <span className='spinner-border spinner-border-sm'></span>
                        ) : (
                          <>
                          <i className='fa-solid fa-magnifying-glass me-1'></i>
                          Find
                          </>
                        )}
                      </button>
                    </div>
                    <div className='mt-1 small'>
                        {student ? (
                          <span className='text-success fw-bold'>
                            {student.full_name} ({student.email}) - {student.mobile}
                          </span>
                        ) : (
                          <span className='text-muted'>
                            Enter Student ID and click Find
                          </span>
                        )}
                    </div>
                  </div>

                  <div className='mb-4 '>
                    <label className='form-label small fw-medium'>
                      ISBN Number or Book Title <span className='text-danger'>*</span>
                    </label>
                    <div className='input-group'>
                      <input type='text' className='form-control' placeholder='e.g. Enter ISBN or title' value={bookQuery} 
                      onChange={(e)=>setBookQuery(e.target.value)}
                      onBlur={handleFetchBook} required />
                      <button type='button' className='btn btn-outline-secondary' onClick={handleFetchBook}>
                        {bookLoading ? (
                          <span className='spinner-border spinner-border-sm'></span>
                        ) : (
                          <>
                          <i className='fa-solid fa-magnifying-glass me-1'></i>
                          Find
                          </>
                        )}
                      </button>
                    </div>
                    <div className='mt-1 small'>
                        {book ? (
                          <span className='text-success fw-bold'>
                            {book.title} (ISBN: {book.isbn}) - Qty: {book.quantity}
                          </span>
                        ) : (
                          <span className='text-muted'>
                            Enter ISBN/title to find
                          </span>
                        )}
                    </div>
                  </div>

                  <div className='mt-4'>
                    <label className='form-label small fw-medium'>
                      Remark <span className='text-danger'>*</span>
                    </label>

                    <textarea className='form-control' placeholder='e.g. Issued for 7 days, handle with care etc.' rows="3" value={remark} onChange={(e) => setRemark(e.target.value)} required>
                    </textarea>
                  </div>

                  <button type='submit' className='btn btn-primary mt-4' disabled={issuing}>
                    {issuing ? (
                      <>
                      <span className='spinner-border spinner-border-sm'></span>
                        Issuing...
                      </>
                    ) : (
                      <>
                        <i className='fa-solid fa-book-open me-1'></i>
                        Issue Book
                      </>
                    )}

                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className='col-md-5'>
            <div className='card border-0 shadow-sm rounded-4 mb-3'>
              <div className='card-body p-3'>
                <div className='d-flex align-items-center'>
                    <div 
                    className='rounded-circle d-inline-flex align-items-center justify-content-center me-3'
                    style={{
                      width: "50px", height: "50px", background: "#eef2ff", color: "#4f46e5"
                    }}
                    >
                      <i className='fa-solid fa-user-graduate'></i>
                    </div>

                    <div>
                      <div className='small text-muted'>Student</div>
                      <div className='fw-semibold'>
                        {student ? student.full_name : "No Student selected"}
                      </div>
                      {student && (
                        <div className='small text-muted'>
                          {student.student_id} {student.email}
                        </div>
                      )}
                      
                    </div>
                </div>
              </div>
            </div>

            <div className='card border-0 shadow-sm rounded-4 mb-3'>
              <div className='card-body p-3'>
                <div className='d-flex'>
                    { getBookCoverUrl ? (
                      <img src={getBookCoverUrl} alt={book.title} className='rounded me-3'
                      style={{width: "70px", height: "70px", objectFit: "cover"}} />
                    ) : (
                      <div className='rounded me-3 d-flex align-items-center justify-content-center'
                      style={{width: "50px", height: "50px", background: "#eef2ff"}}>
                        <i className='fa-solid fa-book text-muted'></i>
                      </div>
                    )}
                    <div>
                      <div className='small text-muted'>Book</div>
                      <div className='fw-semibold'>
                        {book ? book.title : "No Book selected"}
                      </div>
                      {book && (
                        <div className='small text-muted'>
                          ISBN: {book.isbn} by {book.author_name} (Qty : {book.quantity})
                        </div>
                      )}
                      
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
              
          
        
      </div>
    </div>
  )
}

export default IssueBook;