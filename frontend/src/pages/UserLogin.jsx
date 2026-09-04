import React , {useState} from 'react'
import api from "../api";   
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const UserLogin = () => {
    const [formData, setFormData] = useState({
        login_id: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async(e) => {
      e.preventDefault();
      
      setLoading(true);

      try{
       
        const res = await api.post("/api/user_login/", formData); 
        
        if (res.data.success) {
          localStorage.setItem("studentUser", JSON.stringify(res.data));
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);


          toast.success(`Login successful! Welcome ${res.data.full_name}`);
          navigate("/user/dashboard");

          setFormData({
            login_id: "",
            password: "",
          });
          
          
        }
        else{
          toast.error(res.data.message || "Login failed.");
        }
        
      }
      catch(err) {
        console.error(err);
        
        toast.error(err.response?.data?.message || "Invalid credentials. Please check your login ID and password.");
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
                <i className="fa-solid fa-user text-primary"></i> User Login</h4>
              <p className='text-muted small'>
                 Please enter your login credentials to access your account.
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
                    <label className='form-label small fw-medium'>Email or Student ID</label>
                    
                    <input type="text" name="login_id" className='form-control' placeholder='Enter your email or Student ID' required
                    value={formData.login_id} onChange={handleChange} />
                    
                  </div>

                  <div className='mb-3'>
                    <label className='form-label small fw-medium'>Password</label>
                    
                    <input type="password" name="password" className='form-control' placeholder='Enter your password' required
                    value={formData.password} onChange={handleChange} />
                    
                  </div>


                  <button type="submit" className='btn btn-primary w-100' disabled={loading}>
                    
                    {loading ? (
                      <>
                      <span className='spinner-border spinner-border-sm me-2'></span>Logging in...
                      </>
                    ) : (
                      <>
                      <i className='fa-solid fa-sign-in-alt'></i>Login
                      </>
                    )}
                    
                  </button>

                  <p className='text-center text-muted small mt-2'>New User? <Link to="/user/signup">Register here</Link></p>
                </form>
              </div>
            </div>
          </div>

          
        </div>
          
        
      </div>
    </div>
  )
}

export default UserLogin