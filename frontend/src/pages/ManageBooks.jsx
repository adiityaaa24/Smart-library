import React , {useState, useEffect} from 'react'
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editAuthor, setEditAuthor] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editQuantity, setEditQuantity] = useState("");
    
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    
    const [loadingList, setLoadingList] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
      if(!adminUser) {
        navigate("/admin/login");
      } 
      else {
        fetchAll();
      }
    }, []);

    const fetchAll = async () => {
      setLoadingList(true);
      try {
        const [booksRes, categoriesRes, authorsRes] = await Promise.all([
          api.get("/api/books/"),
          api.get("/api/categories/"),
          api.get("/api/authors/")
        ]);
        setBooks(booksRes.data);
        setCategories(categoriesRes.data);
        setAuthors(authorsRes.data);
      }
      catch(err){
        console.error(err);
        toast.error("Failed to load data")
      }
      finally{
        setLoadingList(false);
      }
    }

    const getCoverUrl = (coverImage) => {
      if (!coverImage) return null;
      return coverImage.startsWith("http") 
        ? coverImage 
        : `https://library-management-system-efu0.onrender.com${coverImage}`;
    };

    const startEdit = (book) => {
      setEditId(book.id);
      setEditTitle(book.title);
      setEditCategory(book.category);
      setEditAuthor(book.author);
      setEditPrice(book.price);
      setEditQuantity(book.quantity);
      setEditImagePreview(getCoverUrl(book.cover_image));
      setEditImageFile(null);
    }

    const cancelEdit = () => {
      setEditId(null);
      setEditTitle("");
      setEditCategory("");
      setEditAuthor("");
      setEditPrice("");
      setEditQuantity("");
      setEditImageFile(null);
      setEditImagePreview(null);
    }

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setEditImageFile(file);
        setEditImagePreview(URL.createObjectURL(file));   // Create a temporary URL for the selected image file to show a preview on frontend before uploading it to the server. This allows users to see the image they selected before submitting the form.
      }
    }

    const handleUpdate = async(e) => {
      e.preventDefault();
      setSaving(true);

      try{
        const formData = new FormData();
        formData.append("title", editTitle);
        formData.append("category", editCategory);
        formData.append("author", editAuthor);
        formData.append("price", editPrice);
        formData.append("quantity", editQuantity);
        if (editImageFile) {
          formData.append("cover_image", editImageFile);
        }
        
        const res = await api.put(`/api/update_book/${editId}/`, 
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
        if (res.data.success) {
          toast.success(res.data.message || "Book updated")
          cancelEdit();
          fetchAll();

        }
        else{
          toast.error(res.data.message || "Update failed")
        }
        
      }
      catch(err) {
        console.error(err);
        
        toast.error("Something went wrong");
        
      }

      finally {
        setSaving(false); // Reset the saving state to false after the update operation is complete, regardless of whether it was successful or not. This ensures that the UI reflects the correct state and allows further interactions.
      }
    }

    const handleDelete = async(id) => {
      
      const ok = window.confirm("Are you sure you wnat to delete this book?");

      if(!ok)   return;

      try{
        const res = await api.delete(`/api/delete_book/${id}/`);
          
       
        if (res.data.success) {
          toast.success(res.data.message || "Book deleted")
          
          setBooks((prev)=>prev.filter((b)=>b.id !== id))
          if(editId === id){
            cancelEdit(); 
          }  // Cancel the edit mode if the deleted book was being edited. This ensures that the UI does not show the edit form for a book that no longer exists, preventing potential errors or confusion for the user.   
          
        }
        else{
          toast.error(res.data.message || "Deletion failed")
        }
        
      }
      catch(err) {
        console.error(err);
        
        toast.error("Something went wrong");
        
      }

      
    }
  return (
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8 mx-auto d-flex justify-content-between align-items-center">
            <div className="mb-4 text-center">
              <h4 className="fw-semibold mb-1">
                <i className="fa-solid fa-book text-primary"></i>Manage Books</h4>
              <p className='text-muted small'>
                View, Edit and Delete books from the library system.
              </p>
            </div>
            <button className='btn btn-primary btn-sm'
            onClick={()=>navigate("/admin/book_add")}>
              <i className="fa-solid fa-plus me-1"></i> Add New Book
            </button>
          </div>
        </div>

        <div className='row g-4'>
          <div className='col-md-4'>
            <div className='card border-0 shadow-sm rounded-4'>
              <div className='card-body p-4'>
                <h6 className='fw-semibold mb-3'>{editId ? "Edit Book" : "Select a book to edit"}</h6>

                {editId ? (
                  <form onSubmit={handleUpdate}>
                    <div className='row g-3'>
                        <div className='col-md-12'>
                          <label className='form-label small fw-medium'>Book Name</label>
                          
                            <input type="text" className='form-control' placeholder='e.g. Python for Beginners' required
                            value={editTitle}
                            onChange={(e)=>setEditTitle(e.target.value)}/>
                          
                        </div>

                        <div className='col-md-6'>
                          <label className='form-label small fw-medium'>Category</label>
                          
                            <select className='form-select' required
                            value={editCategory}
                            onChange={(e)=>setEditCategory(e.target.value)}
                            >
                            <option value="">--Select a category--</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                            </select>
                          
                        </div>

                        <div className='col-md-6'>
                          <label className='form-label small fw-medium'>Author</label>
                          
                            <select className='form-select' required
                            value={editAuthor}
                            onChange={(e)=>setEditAuthor(e.target.value)}
                            >
                            <option value="">--Select an author--</option>
                            {authors.map((auth) => (
                              <option key={auth.id} value={auth.id}>
                                {auth.name}
                              </option>
                            ))}
                            </select>
                          
                        </div>

                        <div className='col-md-6'>
                          <label className='form-label small fw-medium'>Price</label>
                          
                            <input type="number" className='form-control' 
                            min="0" step="0.01" 
                            placeholder='e.g. 99.99'
                            required
                            value={editPrice}
                            onChange={(e)=>setEditPrice(e.target.value)}/>
                          
                        </div>

                        <div className='col-md-6'>
                          <label className='form-label small fw-medium'>Quantity</label>
                          
                            <input type="number" className='form-control' 
                            min="0" 
                            step="1"
                            placeholder='e.g. 10'
                            required
                            value={editQuantity}
                            onChange={(e)=>setEditQuantity(e.target.value)}/>
                          
                        </div>

                        <div className='col-md-12'>
                          <label className='form-label small fw-medium'>Book Cover</label>

                            {editImagePreview && (
                              <div className='mb-2'>
                                <img src={editImagePreview} alt="Book Cover Preview" className='img-fluid rounded' style={{maxHeight: "100px", height: "100px", width: "100px"}}/>
                              </div>
                            )}
                          
                            <input type="file" className='form-control' accept="image/*"
                            onChange={handleImageChange}/>
                          
                        </div>
                      </div>


                    <div className='d-flex gap-2 align-items-center mt-4'>
                      <button type="submit" className='btn btn-primary w-50 mt-3' disabled={saving}>
                        
                        {saving ? (
                          <>
                          <span className='spinner-border spinner-border-sm me-2'></span>Updating...
                          </>
                        ) : (
                          <>
                          <i className='fa-solid fa-plus'></i>Update
                          </>
                        )}
                        
                      </button>

                      <button type="button" className='btn btn-secondary mt-3' onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className='text-muted small'>
                    Click on the <strong>Edit</strong> button in the table to modify an author's name. You can also delete an author using the <strong>Delete</strong> button.
                  </p>
                )}
                
              </div>
            </div>
          </div>

          <div className='col-md-8'>
              <div className='card border-0 shadow-sm rounded-4'>
                <div className='card-body p-4'>
                  <h6 className='fw-semibold mb-3'>Books Listing</h6>

                  {loadingList ? (
                    <div className='text-center py-4'>
                      <div className='spinner-border text-primary'>
                      </div>
                    </div>
                  ) : books.length === 0 ? (

                        <p className='text-muted small'>No Books found. Try adding a book first</p>

                    ) : (
                     
                      <div className='table-responsive'>
                        <table className='table table-striped table-hover align-middle'>
                          <thead className='small text-muted'>
                            <tr>
                              <th>#</th>
                              <th>Book</th>
                              <th>Category</th>
                              <th>Author</th>
                              <th>ISBN</th>
                              <th>Price</th>
                              <th>Qty</th>
                              <th className='text-center'>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {books.map((book, index) => (
                            <tr key={book.id}>
                              <td>{index+1}</td>
                              <td style={{maxWidth:"200px"}}>
                                
                                <img src={getCoverUrl(book.cover_image)} alt={book.title} className='img-fluid rounded' style={{maxHeight: "100px", height: "70px", marginBottom: "4px"}}/>

                                <div className='fw-bold small'>{book.title}</div>

                              </td>
                              <td className='small text-muted'>{book.category_name}</td>
                              <td className='small text-muted'>{book.author_name}</td>
                              <td className='small text-muted'>{book.isbn}</td>
                              <td className='small text-muted'>{book.price}</td>
                              <td className='small text-muted'>{book.quantity}</td>
                              
                              <td className='text-centerx'>
                                <button className='btn btn-sm btn-outline-primary me-2'
                                onClick={()=>startEdit(book)}>
                                  <i className='fa-solid fa-pen-to-square'></i> Edit
                                </button>
                                <button className='btn btn-sm btn-outline-danger' onClick={()=>handleDelete(book.id)}>
                                  <i className='fa-solid fa-trash-can'></i> Delete
                                </button>
                                
                              </td>

                            </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  
                  
                </div>
              </div>
          </div>
        </div>
          
        
      </div>
    </div>
  )
}

export default ManageBooks;