import React , {useState, useEffect} from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const ManageCategories = () => {
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editStatus, setEditStatus] = useState("1");
    const [loadingList, setLoadingList] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
      if(!adminUser) {
        navigate("/admin/login");
      } 
      else {
        fetchCategories();
      }
    }, []);

    const fetchCategories = async () => {
      setLoadingList(true);
      try {
        const res = await axios.get("https://library-management-system-efu0.onrender.com/api/categories/"); 
        setCategories(res.data);
      }
      catch(err){
        console.error(err);
        toast.error("Failed to load categories")
      }
      finally{
        setLoadingList(false);
      }
    }

    const startEdit = (cat) => {
      setEditId(cat.id);
      setEditName(cat.name);
      setEditStatus(cat.is_active ? "1" : "0");
    }

    const cancelEdit = () => {
      setEditId(null);
      setEditName("");
      setEditStatus("1");
    }

    const handleUpdate = async(e) => {
      e.preventDefault();
      setSaving(true);

      try{
        const res = await axios.put(`https://library-management-system-efu0.onrender.com/api/update_category/${editId}/`, 
          {name:editName, status:editStatus }
        );
        if (res.data.success) {
          toast.success(res.data.message || "Category updated")
          cancelEdit();
          fetchCategories();

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
      
      const ok = window.confirm("Are you sure you wnat to delete this category?");

      if(!ok)   return;

      try{
        const res = await axios.delete(`https://library-management-system-efu0.onrender.com/api/delete_category/${id}/`);
          
       
        if (res.data.success) {
          toast.success(res.data.message || "Category deleted")
          
          setCategories((prev)=>prev.filter((c)=>c.id !== id))

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
                <i className="fa-solid fa-layer-group text-primary"></i>Manage Category</h4>
              <p className='text-muted small'>
                View, Edit and delete categories from the library
              </p>
            </div>
            <button className='btn btn-primary btn-sm'
            onClick={()=>navigate("/admin/category_add")}>
              <i className="fa-solid fa-plus me-1"></i>Add New Category
            </button>
          </div>
        </div>

        <div className='row g-4'>
          <div className='col-md-4'>
            <div className='card border-0 shadow-sm rounded-4'>
              <div className='card-body p-4'>
                <h6 className='fw-semibold mb-3'>{editId ? "Edit Category" : "Select a category to edit"}</h6>

                {editId ? (
                  <form onSubmit={handleUpdate}>
                    <div className='mb-3'>
                      <label className='form-label small fw-medium'>Category Name</label>
                      
                        <input type="text" className='form-control' placeholder='e.g. Programming, Science, Novel' required
                        value={editName}
                        onChange={(e)=>setEditName(e.target.value)}/>
                      
                    </div>

                    <div className='mb-3'>
                      <label className='form-label small fw-medium'>Status</label>
                      
                        <div className='d-flex gap-3'>
                          <div className='form-check'>
                            <input type="radio" className='form-check-input'
                            value="1"
                            checked={editStatus==="1"}
                            onChange={(e)=>setEditStatus(e.target.value)}
                            id="status-active"
                            name='status'
                            />
                            <label className='form-check-label small' htmlFor='status-active'>Active</label>
                          </div>

                          <div className='form-check'>
                            <input type="radio" className='form-check-input'
                            value="0"
                            checked={editStatus==="0"}
                            onChange={(e)=>setEditStatus(e.target.value)}
                            id="status-inactive"
                            name='status'
                            />
                            <label className='form-check-label small' htmlFor='status-inactive'>Inactive</label>
                          </div>
                        </div>
                      
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
                    Click on the <strong>Edit</strong> button in the table to modify a category
                  </p>
                )}
                
              </div>
            </div>
          </div>

          <div className='col-md-8'>
              <div className='card border-0 shadow-sm rounded-4'>
                <div className='card-body p-4'>
                  <h6 className='fw-semibold mb-3'>Categories Listing</h6>

                  {loadingList ? (
                    <div className='text-center py-4'>
                      <div className='spinner-border text-primary'>
                      </div>
                    </div>
                  ) : categories.length === 0 ? (

                        <p className='text-muted small'>No Categories found. Create a category first</p>

                    ) : (
                     
                      <div className='table-responsive'>
                        <table className='table table-striped table-hover'>
                          <thead className='small text-muted'>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Status</th>
                              <th>Created</th>
                              <th>Updated</th>
                              <th className='text-center'>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((cat, index) => (
                            <tr key={cat.id}>
                              <td>{index+1}</td>
                              <td>{cat.name}</td>
                              <td>{cat.is_active ? 
                                    (
                                      <span className='badge bg-success-subtle text-success border border-success-subtle'>Active</span>
                                    ) : 
                                    (
                                      <span className='badge bg-secondary-subtle text-secondary border border-secondary-subtle'>Inactive</span>
                                    )}</td>
                              <td className='small text-muted'>{new Date(cat.created_at).toLocaleDateString()}</td>
                              <td className='small text-muted'>{new Date(cat.updated_at).toLocaleDateString()}</td>
                              <td className='text-center d-flex'>
                                <button className='btn btn-sm btn-outline-primary me-2'
                                onClick={()=>startEdit(cat)}>
                                  <i className='fa-solid fa-pen-to-square'></i> Edit
                                </button>
                                <button className='btn btn-sm btn-outline-danger' onClick={()=>handleDelete(cat.id)}>
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

export default ManageCategories