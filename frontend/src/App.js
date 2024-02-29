import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

function App() {
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaType, setCaptchaType] = useState('text'); // Initialize captcha type as 'text'

  // Style object
  const styles = {
    appContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
    },
    appHeader: {
      textAlign: 'center',
      maxWidth: '320px',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      background: '#ffffff',
    },
    captchaImage: {
      height:200,
      width:300,
      margin: '20px 0',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    inputField: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonDisabled: {
      backgroundColor: '#cccccc',
    },
    message: {
      color: '#007bff',
      marginBottom: '15px',
    },
  };

  useEffect(() => {
    fetchCaptcha(captchaType); // Fetch a CAPTCHA when the component mounts or captchaType changes
  }, [captchaType]);

  const fetchCaptcha = async (type) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/generate_captcha?type=${type}`);
      setCaptchaId(data.captcha_id);
      const imageResponse = await axios.get(`${apiUrl}/captcha_image/${data.captcha_id}`, { responseType: 'blob' });
      setCaptchaUrl(URL.createObjectURL(imageResponse.data));
    } catch (error) {
      toast.error('Failed to load CAPTCHA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCaptcha = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${apiUrl}/verify_captcha`, { captcha_id: captchaId, captcha: userInput });
      toast.success(data.message);
      setUserInput(''); // Clear input on success
      fetchCaptcha(captchaType); // Fetch new CAPTCHA of the same type
    } catch (error) {
      toast.error(error.response && error.response.data.message ? error.response.data.message : 'CAPTCHA verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <ToastContainer />
      <div style={{ textAlign: 'center', maxWidth: '320px', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', background: '#ffffff' }}>
        {isLoading ? (
          <p>Loading CAPTCHA...</p>
        ) : (
          <>
            <img src={captchaUrl} alt="CAPTCHA" style={{ height: 200, width: 300, margin: '20px 0', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} disabled={isLoading} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Enter CAPTCHA" />
            <button onClick={verifyCaptcha} disabled={isLoading || !userInput} style={{ width: '100%', padding: '10px', marginBottom: '10px', color: '#fff', backgroundColor: '#007bff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Verify</button>
            <div>
              <button onClick={() => setCaptchaType('text')} style={{ marginRight: '5px' }}>Text CAPTCHA</button>
              <button onClick={() => setCaptchaType('numeric')}>Numeric CAPTCHA</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;