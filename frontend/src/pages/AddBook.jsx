import React , {useState, useEffect} from 'react'
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setIsbn] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [coverFile, setCoverFile] = useState(null);

    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [loadingDropdowns, setLoadingDropdowns] = useState(false);
    
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
      if(!adminUser) {
        navigate("/admin/login");
      } 
      else {
        fetchDropdownData();
      }
    }, []);

    const fetchDropdownData = async () => {
      setLoadingDropdowns(true);
      try {
        const [authRes, catRes] = await Promise.all([
          api.get("/api/authors/"),
          api.get("/api/categories/")
        ]);
        const activeCats = (catRes.data).filter((c) => c.is_active);
        setCategories(activeCats);
        setAuthors(authRes.data);
        
      }
      catch(err){
        console.error(err);
        toast.error("Failed to load authors/categories")
      }
      finally{
        setLoadingDropdowns(false);
      } 
    }


    const handleSubmit = async(e) => {
      e.preventDefault();   // Prevent default form submission

      const formData = new FormData();  // Create a new FormData object to handle file uploads // formData image aur string data ko ek sath bhejne ke liye use hota hai bundle banake form sirf json string ko bhej sakta image ko nahi isliye formData use karte hai
      formData.append("title", title);
      formData.append("category", category);
      formData.append("author", author);
      formData.append("isbn", isbn);
      formData.append("price", price);
      formData.append("quantity", quantity);
      if (coverFile) {
        formData.append("cover_image", coverFile);
      }

      setLoading(true);
      try{
        const res = await api.post("/api/books/add/", 
          formData, { headers: { "Content-Type": "multipart/form-data", }  // Set the content type to multipart/form-data for file uploads // Default hota hai hata bhi sakte hai axios automatically set kar deta hai
        }); 
        if (res.data.success) {
          toast.success(res.data.message || "Book added successfully")
          setTitle("");
          setCategory("");
          setAuthor("");
          setIsbn("");
          setPrice("");
          setQuantity("");
          setCoverFile(null);
          fetchDropdownData();  // Refresh the dropdown data after adding a new book
        }

        else{
          toast.error(res.data.message || "Failed to create book")
        }
        
      }
      catch(err) {
        console.error(err);
        
        toast.error("Something went wrong");
        
      }

      finally {
        setLoading(false);
      }
    }
  return (
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8 mx-auto">
            <div className="mb-4 text-center">
              <h4 className="fw-semibold mb-1">
                <i className="fa-solid fa-book text-primary"></i>Add Book</h4>
              <p className='text-muted small'>
                Create new books and fill their information
              </p>
            </div>
          </div>
        </div>

        <div className='row justify-content-center'>
          <div className='col-md-10'>
            <div className='card border-0 shadow-sm rounded-4'>
              <div className='card-body p-4'>
                {loadingDropdowns ? (
                  <div className='text-center my-5'>
                    <span className='spinner-border text-primary'></span>
                  </div>
                    ) : (
                    <form onSubmit={handleSubmit}>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <label className='form-label small fw-medium'>Book Name</label>
                          
                            <input type="text" className='form-control' placeholder='e.g. Python for Beginners' required
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}/>
                          
                        </div>

                        <div className='col-md-6'>
                          <label className='form-label small fw-medium'>Category</label>
                          
                            <select className='form-select' required
                            value={category}
                            onChange={(e)=>setCategory(e.target.value)}
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
                            value={author}
                            onChange={(e)=>setAuthor(e.target.value)}
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
                          <label className='form-label small fw-medium'>ISBN Number</label>
                          
                            <input type="text" className='form-control' placeholder='Unique ISBN' required
                            value={isbn}
                            onChange={(e)=>setIsbn(e.target.value)}/>
                          <p className='small text-muted mb-0'>ISBN must be unique for each book</p>
                        </div>

                        <div className='col-md-4'>
                          <label className='form-label small fw-medium'>Price</label>
                          
                            <input type="number" className='form-control' 
                            min="0" step="0.01" 
                            placeholder='e.g. 99.99'
                            required
                            value={price}
                            onChange={(e)=>setPrice(e.target.value)}/>
                          
                        </div>

                        <div className='col-md-4'>
                          <label className='form-label small fw-medium'>Quantity</label>
                          
                            <input type="number" className='form-control' 
                            min="0" 
                            step="1"
                            placeholder='e.g. 10'
                            required
                            value={quantity}
                            onChange={(e)=>setQuantity(e.target.value)}/>
                          
                        </div>

                        <div className='col-md-4'>
                          <label className='form-label small fw-medium'>Book Cover</label>
                          
                            <input type="file" className='form-control' accept="image/*"
                            required
                            onChange={(e)=>setCoverFile(e.target.files[0])}/>
                          
                        </div>
                      </div>


                      <div className='mt-4'>
                        <button type="submit" className='btn btn-primary w-100' disabled={loading}>
                          
                          {loading ? (
                            <>
                            <span className='spinner-border spinner-border-sm me-2'></span>Submitting...
                            </>
                          ) : (
                            <>
                            <i className='fa-solid fa-plus'></i> Add Book
                            </>
                          )}
                          
                        </button>
                      </div>
                    </form>
                )}
              </div>
            </div>
          </div>

          
        </div>
          
        
      </div>
    </div>
  )
}

export default AddBook;