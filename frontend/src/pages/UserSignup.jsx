import React , {useState} from 'react'
import api from "../api";   
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';


const UserSignup = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async(e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) { 
        toast.error("password and confirm password do not match");
        return;
      }

      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
      
      setLoading(true);

      try{
       
        const res = await api.post("/api/user_signup/", formData); 
        if (res.data.success) {
          toast.success(`Registration successful! Your Student ID is 
            ${res.data.student_id}`);

          setFormData({
            full_name: "",
            mobile: "",
            email: "",
            password: "",
            confirmPassword: ""
          });
          
          
        }
        else{
          toast.error(res.data.message || "Registration failed.");
        }
        
      }
      catch(err) {
        console.error(err);
        
        toast.error(err.response?.data?.message || "An error occurred during registration.");
      }

      finally {
        setLoading(false);
      }
    }
  return (
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        <div className="row mb-3">
          <div className="col-md-8 mx-auto">
            <div className="mb-2 text-center">
              <h4 className="fw-semibold mb-1">
                <i className="fa-solid fa-user-plus text-primary"></i> User Signup</h4>
              <p className='text-muted small'>
                 Create your account to get started. Fill in the details below to sign up.
              </p>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-6 mx-auto'>
            <div className='card border-0 shadow-sm rounded-4'>
              <div className='card-body p-4'>
                <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                    <label className='form-label small fw-medium'>Full Name</label>
                    
                    <input type="text" name="full_name" className='form-control' placeholder='Enter your full name' required
                    value={formData.full_name} onChange={handleChange} />
                    
                  </div>

                  <div className='mb-3'>
                    <label className='form-label small fw-medium'>Mobile Number</label>
                    
                    <input type="number" name="mobile" className='form-control' placeholder='Enter your mobile number' required
                    value={formData.mobile} onChange={handleChange} />
                    
                  </div>

                  <div className='mb-3'>
                    <label className='form-label small fw-medium'>Email</label>
                    
                    <input type="email" name="email" className='form-control' placeholder='Enter your email address' required
                    value={formData.email} onChange={handleChange} />
                    
                  </div>

                  <div className='mb-3'>
                    <label className='form-label small fw-medium'>Password</label>
                    
                    <input type="password" name="password" className='form-control' placeholder='Enter your password' required
                    value={formData.password} onChange={handleChange} />
                    
                  </div>

                  <div className='mb-3'>
                    <label className='form-label small fw-medium'>Confirm Password</label>
                    
                    <input type="password" name="confirmPassword" className='form-control' placeholder='Confirm your password' required
                    value={formData.confirmPassword} onChange={handleChange} />
                    
                  </div>


                  <button type="submit" className='btn btn-primary w-100' disabled={loading}>
                    
                    {loading ? (
                      <>
                      <span className='spinner-border spinner-border-sm me-2'></span>Registering...
                      </>
                    ) : (
                      <>
                      <i className='fa-solid fa-user-plus'></i>Register Now
                      </>
                    )}
                    
                  </button>

                  <p className='text-center text-muted small mt-2'>Already have an account? <Link to="/user/login">Login here</Link></p>
                </form>
              </div>
            </div>
          </div>

          
        </div>
          
        
      </div>
    </div>
  )
}

export default UserSignup