import React , {useState, useEffect} from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const ManageAuthors = () => {
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    
    const [authors, setAuthors] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
      if(!adminUser) {
        navigate("/admin/login");
      } 
      else {
        fetchAuthors();
      }
    }, []);

    const fetchAuthors = async () => {
      setLoadingList(true);
      try {
        const res = await axios.get("https://library-management-system-efu0.onrender.com/api/authors/"); 
        setAuthors(res.data);
      }
      catch(err){
        console.error(err);
        toast.error("Failed to load authors")
      }
      finally{
        setLoadingList(false);
      }
    }

    const startEdit = (author) => {
      setEditId(author.id);
      setEditName(author.name);
    }

    const cancelEdit = () => {
      setEditId(null);
      setEditName("");
    }

    const handleUpdate = async(e) => {
      e.preventDefault();
      setSaving(true);

      try{
        const res = await axios.put(`https://library-management-system-efu0.onrender.com/api/update_author/${editId}/`, 
          {name:editName }
        );
        if (res.data.success) {
          toast.success(res.data.message || "Author updated")
          cancelEdit();
          fetchAuthors();

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
        setSaving(false);
      }
    }

    const handleDelete = async(id) => {
      
      const ok = window.confirm("Are you sure you wnat to delete this author?");

      if(!ok)   return;

      try{
        const res = await axios.delete(`https://library-management-system-efu0.onrender.com/api/delete_author/${id}/`);
          
       
        if (res.data.success) {
          toast.success(res.data.message || "Author deleted")
          
          setAuthors((prev)=>prev.filter((a)=>a.id !== id))

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
                <i className="fa-solid fa-layer-group text-primary"></i>Manage Authors</h4>
              <p className='text-muted small'>
                View, Edit and delete authors from the library system.
              </p>
            </div>
            <button className='btn btn-primary btn-sm'
            onClick={()=>navigate("/admin/author_add")}>
              <i className="fa-solid fa-plus me-1"></i> Add New Author
            </button>
          </div>
        </div>

        <div className='row g-4'>
          <div className='col-md-4'>
            <div className='card border-0 shadow-sm rounded-4'>
              <div className='card-body p-4'>
                <h6 className='fw-semibold mb-3'>{editId ? "Edit Author" : "Select an author to edit"}</h6>

                {editId ? (
                  <form onSubmit={handleUpdate}>
                    <div className='mb-3'>
                      <label className='form-label small fw-medium'>Author Name</label>
                      
                        <input type="text" className='form-control' placeholder='e.g. John Doe, J.K. Rowling' required
                        value={editName}
                        onChange={(e)=>setEditName(e.target.value)}/>
                      
                    </div>


                    <button type="submit" className='btn btn-primary w-100' disabled={saving}>
                      
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
                  <h6 className='fw-semibold mb-3'>Authors Listing</h6>

                  {loadingList ? (
                    <div className='text-center py-4'>
                      <div className='spinner-border text-primary'>
                      </div>
                    </div>
                  ) : authors.length === 0 ? (

                        <p className='text-muted small'>No Authors found. Try adding an author first</p>

                    ) : (
                     
                      <div className='table-responsive'>
                        <table className='table table-striped table-hover'>
                          <thead className='small text-muted'>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Created</th>
                              <th>Updated</th>
                              <th className='text-center'>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {authors.map((author, index) => (
                            <tr key={author.id}>
                              <td>{index+1}</td>
                              <td>{author.name}</td>
                              
                              <td className='small text-muted'>{new Date(author.created_at).toLocaleDateString()}</td>
                              <td className='small text-muted'>{new Date(author.updated_at).toLocaleDateString()}</td>
                              <td className='text-center d-flex'>
                                <button className='btn btn-sm btn-outline-primary me-2'
                                onClick={()=>startEdit(author)}>
                                  <i className='fa-solid fa-pen-to-square'></i> Edit
                                </button>
                                <button className='btn btn-sm btn-outline-danger' onClick={()=>handleDelete(author.id)}>
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

export default ManageAuthors;