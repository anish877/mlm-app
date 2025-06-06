
import Accordion from '@/components/coi/Accordion';
import VideoPopup from '@/components/video/VideoPopup';
import { useAuth } from '@/utils/AuthContext';
import { Dot } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface FormData {
  fullName: string;
  email: string;
  website: string;
  phone: string;
  privacy: boolean;
}

interface Section {
  id: string;
  number: string;
  title: string;
  content?: React.ReactNode;
}

interface PasswordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifyNow: (password: string, confirmPassword: string) => void;
  onVerifyLater: () => void;
  loading: boolean;
  error: string;
}

interface CountryCode {
    code: string;
    country: string;
    flag: string;
    digits: number;
    format?: string;
  }

  const countryCodes: CountryCode[] = [
    { code: '+1', country: 'United States', flag: '🇺🇸', digits: 10 },
    { code: '+1', country: 'Canada', flag: '🇨🇦', digits: 10 },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧', digits: 10 },
    { code: '+33', country: 'France', flag: '🇫🇷', digits: 10 },
    { code: '+49', country: 'Germany', flag: '🇩🇪', digits: 11 },
    { code: '+39', country: 'Italy', flag: '🇮🇹', digits: 10 },
    { code: '+34', country: 'Spain', flag: '🇪🇸', digits: 9 },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱', digits: 9 },
    { code: '+46', country: 'Sweden', flag: '🇸🇪', digits: 9 },
    { code: '+47', country: 'Norway', flag: '🇳🇴', digits: 8 },
    { code: '+45', country: 'Denmark', flag: '🇩🇰', digits: 8 },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭', digits: 9 },
    { code: '+43', country: 'Austria', flag: '🇦🇹', digits: 10 },
    { code: '+32', country: 'Belgium', flag: '🇧🇪', digits: 9 },
    { code: '+351', country: 'Portugal', flag: '🇵🇹', digits: 9 },
    { code: '+353', country: 'Ireland', flag: '🇮🇪', digits: 9 },
    { code: '+358', country: 'Finland', flag: '🇫🇮', digits: 9 },
    { code: '+91', country: 'India', flag: '🇮🇳', digits: 10 },
    { code: '+86', country: 'China', flag: '🇨🇳', digits: 11 },
    { code: '+81', country: 'Japan', flag: '🇯🇵', digits: 10 },
    { code: '+82', country: 'South Korea', flag: '🇰🇷', digits: 10 },
    { code: '+65', country: 'Singapore', flag: '🇸🇬', digits: 8 },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾', digits: 10 },
    { code: '+66', country: 'Thailand', flag: '🇹🇭', digits: 9 },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳', digits: 9 },
    { code: '+63', country: 'Philippines', flag: '🇵🇭', digits: 10 },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩', digits: 11 },
    { code: '+61', country: 'Australia', flag: '🇦🇺', digits: 9 },
    { code: '+64', country: 'New Zealand', flag: '🇳🇿', digits: 9 },
    { code: '+7', country: 'Russia', flag: '🇷🇺', digits: 10 },
    { code: '+380', country: 'Ukraine', flag: '🇺🇦', digits: 9 },
    { code: '+48', country: 'Poland', flag: '🇵🇱', digits: 9 },
    { code: '+420', country: 'Czech Republic', flag: '🇨🇿', digits: 9 },
    { code: '+36', country: 'Hungary', flag: '🇭🇺', digits: 9 },
    { code: '+40', country: 'Romania', flag: '🇷🇴', digits: 10 },
    { code: '+359', country: 'Bulgaria', flag: '🇧🇬', digits: 9 },
    { code: '+385', country: 'Croatia', flag: '🇭🇷', digits: 9 },
    { code: '+381', country: 'Serbia', flag: '🇷🇸', digits: 9 },
    { code: '+55', country: 'Brazil', flag: '🇧🇷', digits: 11 },
    { code: '+52', country: 'Mexico', flag: '🇲🇽', digits: 10 },
    { code: '+54', country: 'Argentina', flag: '🇦🇷', digits: 10 },
    { code: '+56', country: 'Chile', flag: '🇨🇱', digits: 9 },
    { code: '+57', country: 'Colombia', flag: '🇨🇴', digits: 10 },
    { code: '+51', country: 'Peru', flag: '🇵🇪', digits: 9 },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪', digits: 10 },
    { code: '+27', country: 'South Africa', flag: '🇿🇦', digits: 9 },
    { code: '+234', country: 'Nigeria', flag: '🇳🇬', digits: 10 },
    { code: '+254', country: 'Kenya', flag: '🇰🇪', digits: 9 },
    { code: '+20', country: 'Egypt', flag: '🇪🇬', digits: 10 },
    { code: '+212', country: 'Morocco', flag: '🇲🇦', digits: 9 },
    { code: '+213', country: 'Algeria', flag: '🇩🇿', digits: 9 },
    { code: '+216', country: 'Tunisia', flag: '🇹🇳', digits: 8 },
    { code: '+218', country: 'Libya', flag: '🇱🇾', digits: 9 },
    { code: '+971', country: 'UAE', flag: '🇦🇪', digits: 9 },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', digits: 9 },
    { code: '+974', country: 'Qatar', flag: '🇶🇦', digits: 8 },
    { code: '+973', country: 'Bahrain', flag: '🇧🇭', digits: 8 },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼', digits: 8 },
    { code: '+968', country: 'Oman', flag: '🇴🇲', digits: 8 },
    { code: '+961', country: 'Lebanon', flag: '🇱🇧', digits: 8 },
    { code: '+962', country: 'Jordan', flag: '🇯🇴', digits: 9 },
    { code: '+98', country: 'Iran', flag: '🇮🇷', digits: 10 },
    { code: '+90', country: 'Turkey', flag: '🇹🇷', digits: 10 },
    { code: '+972', country: 'Israel', flag: '🇮🇱', digits: 9 }
  ];
  

// Updated PasswordPopup component with cross icon and validation
const PasswordPopup: React.FC<PasswordPopupProps> = ({
    isOpen,
    onClose,
    onVerifyNow,
    onVerifyLater,
    loading,
    error
  }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');
  
    const handleVerifyNow = () => {
      setValidationError('');
      
      if (!password || !confirmPassword) {
        setValidationError('Both password fields are required');
        return;
      }
      
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return;
      }
      
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
      
      onVerifyNow(password, confirmPassword);
    };
  
    const handleVerifyLater = () => {
      setValidationError('');
      
      if (!password || !confirmPassword) {
        setValidationError('Both password fields are required');
        return;
      }
      
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return;
      }
      
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
      
      onVerifyLater();
    };
  
    const resetForm = () => {
      setPassword('');
      setConfirmPassword('');
      setValidationError('');
    };
  
    useEffect(() => {
      if (!isOpen) {
        resetForm();
      }
    }, [isOpen]);
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
          {/* Cross icon */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-900 hover:text-gray-700"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <h2 className="text-xl font-semibold mb-4">Set Your Password</h2>
          
          {(error || validationError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error || validationError}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Enter password (min 6 characters)"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleVerifyNow}
              disabled={loading}
              className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Verify Now'}
            </button>
            <button
              onClick={handleVerifyLater}
              disabled={loading}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Later
            </button>
          </div>
        </div>
      </div>
    );
  };

interface OTPPopupProps {
  isOpen: boolean;
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onClose: () => void;
  loading: boolean;
  error: string;
}

const OTPPopup: React.FC<OTPPopupProps> = ({
  isOpen,
  email,
  onVerify,
  onResend,
  onClose,
  loading,
  error
}) => {
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (!otp || otp.length !== 6) {
      return;
    }
    onVerify(otp);
  };

  useEffect(() => {
    if (!isOpen) {
      setOtp('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
        <p className="text-gray-600 mb-4">
          We've sent a 6-digit OTP to <strong>{email}</strong>
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength={6}
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            onClick={onResend}
            disabled={loading}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend OTP
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-3 text-gray-600 hover:text-gray-800"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

const COI: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    website: '',
    phone: '',
    privacy: false
  });
  
  const [openSection, setOpenSection] = useState<string>('01');
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [popupInterval, setPopupInterval] = useState<NodeJS.Timeout | null>(null);
  const {login} = useAuth()
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
const [websiteError, setWebsiteError] = useState('');
const [phoneError, setPhoneError] = useState('');

const ok = async ()=>{
    const response = await fetch('https://intern-project-final-1.onrender.com' + '/category-statistics/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const response2 = await fetch('https://intern-project-final-1.onrender.com' + '/category-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    const data = await response.json()
    const data2 = await response2.json()
    console.log(data)
    console.log(data2)
}

  // Check for stored form data on component mount
  useEffect(() => {
    ok()
    const storedFormData = localStorage.getItem('coiFormData');
    if (storedFormData) {
      try {
        const parsedData = JSON.parse(storedFormData);
        setFormData(parsedData);
        setShowPasswordPopup(true);
        
        // Start interval to show popup every 30 seconds if closed
        const interval = setInterval(() => {
          setShowPasswordPopup(true);
        }, 30000); // 30 seconds
        
        setPopupInterval(interval);
      } catch (err) {
        console.error('Error parsing stored form data:', err);
        localStorage.removeItem('coiFormData');
      }
    }

    // Cleanup interval on component unmount
    return () => {
      if (popupInterval) {
        clearInterval(popupInterval);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'website') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Enhanced website validation for all common domains
      if (value) {
        // Check if it contains a valid domain pattern
        const domainPattern = /\.[a-zA-Z]{2,}$/;
        const hasValidDomain = domainPattern.test(value);
        
        if (!hasValidDomain) {
          setWebsiteError('Website should include a valid domain extension (e.g., .com, .org, .net, etc.)');
        } else {
          setWebsiteError('');
        }
      } else {
        setWebsiteError('');
      }

    } else if (name === 'phone') {
      // Remove non-digit characters and apply length limit based on selected country
      const digitsOnly = value.replace(/\D/g, '');
      const selectedCountry = countryCodes.find(country => country.code === selectedCountryCode);
      const maxDigits = selectedCountry?.digits || 10;
      
      const limitedValue = digitsOnly.slice(0, maxDigits);
      
      setFormData(prev => ({
        ...prev,
        [name]: limitedValue
      }));
      
      // Phone validation
      if (limitedValue && limitedValue.length !== maxDigits) {
        setPhoneError(`Phone number should be exactly ${maxDigits} digits for ${selectedCountry?.country || 'selected country'}`);
      } else {
        setPhoneError('');
      }
    } else if (name === 'countryCode') {
      setSelectedCountryCode(value);
      // Reset phone error when country changes
      setPhoneError('');
      // Clear phone number when country changes to avoid confusion
      setFormData(prev => ({
        ...prev,
        phone: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!formData.privacy) {
      setError('Please accept the privacy policy');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Website validation
    if (formData.website && websiteError) {
      setError('Please enter a valid website URL');
      return;
    }
    
    // Phone validation
    if (phoneError) {
      setError('Please enter a valid phone number');
      return;
    }
    
    try {
      setLoading(true);
      
      // Save form data to database first
      const saveResponse = await fetch('https://intern-project-final-1.onrender.com/save-coi-form/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.fullName,
          phone_number: formData.phone,
          website_name: formData.website
        })
      });
  
      const saveResult = await saveResponse.json();
      
      if (!saveResponse.ok) {
        throw new Error(saveResult.message || 'Failed to save form data');
      }
      
      // Register user with temporary password and log them in immediately
      await registerUser('temp_password_' + Date.now()); // Use timestamp to make it unique
      
      // Store form data in localStorage for popup flow
      localStorage.setItem('coiFormData', JSON.stringify(formData));
      
      // Show password popup after successful login
      setShowPasswordPopup(true);
      
      // Start interval to show popup every 30 seconds if closed
      const interval = setInterval(() => {
        setShowPasswordPopup(true);
      }, 30000); // 30 seconds
      
      setPopupInterval(interval);
      
    } catch (err) {
      console.error('Error during form submission:', err);
      setError(err.message || 'Failed to process form submission');
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (password?: string) => {
    setLoading(true);
    setError('');
    
    try {
      const registrationData = {
        email: formData.email,
        password: password || 'temp_password', // Temporary password for "verify later"
        full_name: formData.fullName,
        phone_number: formData.phone,
        website_name: formData.website,
        no_linkedin: true
      };

      const response = await fetch('https://intern-project-final-1.onrender.com/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (data.tokens) {
        await login(data.tokens);
        console.log('Registration successful with tokens:', data.message);
      } else {
        // Fallback to localStorage if auth context is not available
        if (data.tokens) {
          localStorage.setItem('access_token', data.tokens.access);
          localStorage.setItem('refresh_token', data.tokens.refresh);
        }
      }

      if (!response.ok) {
        if (data.user_exists) {
          throw new Error('User with this email already exists. Please try logging in.');
        }
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendEmailOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://intern-project-final-1.onrender.com/send_email_otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.is_verified) {
          throw new Error('Email already verified. Please login.');
        }
        if (!data.user_exists) {
          throw new Error('Please register first.');
        }
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (err) {
      console.error('Send OTP error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOTP = async (otp: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://intern-project-final-1.onrender.com/verify_email_otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email,
          otp: otp 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      return data;
    } catch (err) {
      console.error('OTP verification error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Updated handleVerifyNow to clear interval
  const handleVerifyNow = async (password: string, confirmPassword: string) => {
    try {
      // Update user password (you'll need to create this endpoint)
      const response = await fetch('https://intern-project-final-1.onrender.com/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Use stored token
        },
        body: JSON.stringify({
          email: formData.email,
          new_password: password
        })
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update password');
      }
      
      // Send OTP for email verification
      await sendEmailOTP();
      
      // Clear interval
      if (popupInterval) {
        clearInterval(popupInterval);
        setPopupInterval(null);
      }
      
      setShowPasswordPopup(false);
      setShowOTPPopup(true);
    } catch (err) {
      setError(err.message || 'An error occurred during password update');
    }
  };

  // Updated handleVerifyLater to use actual password
  const handleVerifyLater = async (password: string) => {
    try {
      await registerUser(password); // Use the actual password instead of temp_password
      
      // Clear interval and localStorage
      if (popupInterval) {
        clearInterval(popupInterval);
        setPopupInterval(null);
      }
      localStorage.removeItem('coiFormData');
      setShowPasswordPopup(false);
      setSuccessMessage('Registration successful! You can verify your email later.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        website: '',
        phone: '',
        privacy: false
      });
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      await verifyEmailOTP(otp);
      
      // Clear localStorage and close popup
      localStorage.removeItem('coiFormData');
      setShowOTPPopup(false);
      setSuccessMessage('Email verified successfully! Welcome aboard!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        website: '',
        phone: '',
        privacy: false
      });
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    }
  };

  const handleOTPResend = async () => {
    try {
      await sendEmailOTP();
      setSuccessMessage('OTP resent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  const handleOTPClose = () => {
    localStorage.removeItem('coiFormData');
    setShowOTPPopup(false);
    setFormData({
      fullName: '',
      email: '',
      website: '',
      phone: '',
      privacy: false
    });
  };

  const handlePasswordPopupClose = () => {
    setShowPasswordPopup(false);
    setError(''); // Clear any errors when closing
  };

  const categories = [
    "All",
    "Are You Ready to Exit?",
    "Planning & Strategy",
    "Choosing the Right Exit Path",
    "Market, Timing & Advisors"
  ];

  const sections: Section[] = [
    {
      id: '01',
      number: '01',
      title: 'Exit planning',
      content: (
        <div className="flex justify-between items-start gap-8 bg-neutral-100 px-8 py-6 max-sm:flex-col max-sm:gap-4 max-sm:p-4">
          <div className="text-gray-600 text-base leading-relaxed flex-1 space-y-3">
            <p className='flex'><Dot size={30}/>75% of business owners want to exit their businesses within the next ten years.</p>
            <p className='flex'><Dot size={40}/>73% of privately held companies in the U.S. plan to transition within the next 10 years, which will be representing a $14 trillion opportunity.</p>
            <p className='flex'><Dot size={30}/>79% of business owners plan to exit their businesses in the next 10 years or less.</p>
            <p className='flex'><Dot size={30}/>48% of business owners who want to sell have no formal exit strategy.</p>
            <p className='flex'><Dot size={30}/>74% to 57% of business owners, depending on the deal size, did no exit planning.</p>
          </div>
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-24 h-20 bg-gray-600 rounded-lg flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 8h20v16H6V8zm2 2v12h16V10H8zm6 4h8v2h-8v-2zm0 4h6v2h-6v-2z" fill="white"/>
              </svg>
            </div>
            <div className="text-blue-600 text-xs font-medium">report.pdf</div>
          </div>
        </div>
      )
    },
    { 
      id: '02', 
      number: '02', 
      title: 'Lack of planning',
      content: (
        <div className="bg-neutral-100 px-8 py-6 max-sm:p-4">
          <div className="text-gray-600 text-base leading-relaxed space-y-3">
            <p className='flex'><Dot size={30}/>73% of privately held companies in the U.S. plan to transition within the next 10 years, which will be representing a $14 trillion opportunity.</p>
          </div>
        </div>
      )
    },
    { 
      id: '03', 
      number: '03', 
      title: 'Importance of early planning',
      content: (
        <div className="flex justify-between items-start gap-8 bg-neutral-100 px-8 py-6 max-sm:flex-col max-sm:gap-4 max-sm:p-4">
          <div className="text-gray-600 text-base leading-relaxed flex-1 space-y-3">
            <p className='flex'><Dot size={30}/>73% of privately held companies in the U.S. plan to transition within the next 10 years, which will be representing a $14 trillion opportunity.</p>
          </div>
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-24 h-20 bg-gray-600 rounded-lg flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 8h20v16H6V8zm2 2v12h16V10H8zm6 4h8v2h-8v-2zm0 4h6v2h-6v-2z" fill="white"/>
              </svg>
            </div>
            <div className="text-blue-600 text-xs font-medium">report.pdf</div>
          </div>
        </div>
      )
    },
    { 
      id: '04', 
      number: '04', 
      title: 'Exit strategies preferred',
      content: (
        <div className="bg-neutral-100 px-8 py-6 max-sm:p-4">
          <div className="text-gray-600 text-base leading-relaxed space-y-3">
            <p>Strategic acquisitions, management buyouts, and family succession are among the most preferred exit strategies.</p>
            <p>Each strategy requires different preparation timelines and approaches to maximize value.</p>
          </div>
        </div>
      )
    },
    { 
      id: '05', 
      number: '05', 
      title: 'Reasons for exiting',
      content: (
        <div className="bg-neutral-100 px-8 py-6 max-sm:p-4">
          <div className="text-gray-600 text-base leading-relaxed space-y-3">
            <p>Common reasons include retirement, pursuing new ventures, health concerns, and capitalizing on market opportunities.</p>
            <p>Understanding the motivation helps determine the optimal timing and exit strategy.</p>
          </div>
        </div>
      )
    },
    { 
      id: '06', 
      number: '06', 
      title: 'Family Involvement',
      content: (
        <div className="flex justify-between items-start gap-8 bg-neutral-100 px-8 py-6 max-sm:flex-col max-sm:gap-4 max-sm:p-4">
          <div className="text-gray-600 text-base leading-relaxed flex-1 space-y-3">
            <p className='flex'><Dot size={30}/>75% of business owners want to exit their businesses within the next ten years.</p>
            <p className='flex'><Dot size={30}/>73% of privately held companies in the U.S. plan to transition within the next 10 years, which will be representing a $14 trillion opportunity.</p>
            <p className='flex'><Dot size={30}/>79% of business owners plan to exit their businesses in the next 10 years or less.</p>
          </div>
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-24 h-20 bg-gray-600 rounded-lg flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 8h20v16H6V8zm2 2v12h16V10H8zm6 4h8v2h-8v-2zm0 4h6v2h-6v-2z" fill="white"/>
              </svg>
            </div>
            <div className="text-blue-600 text-xs font-medium">report.pdf</div>
          </div>
        </div>
      )
    },
    { 
      id: '07', 
      number: '07', 
      title: 'Market and timing',
      content: (
        <div className="flex justify-between items-start gap-8 bg-neutral-100 px-8 py-6 max-sm:flex-col max-sm:gap-4 max-sm:p-4">
          <div className="text-gray-600 text-base leading-relaxed flex-1 space-y-3">
            <p className='flex'><Dot size={30}/>75% of business owners want to exit their businesses within the next ten years.</p>
            <p className='flex'><Dot size={30}/>73% of privately held companies in the U.S. plan to transition within the next 10 years, which will be representing a $14 trillion opportunity.</p>
          </div>
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-24 h-20 bg-gray-600 rounded-lg flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 8h20v16H6V8zm2 2v12h16V10H8zm6 4h8v2h-8v-2zm0 4h6v2h-6v-2z" fill="white"/>
              </svg>
            </div>
            <div className="text-blue-600 text-xs font-medium">report.pdf</div>
          </div>
        </div>
      )
    },
    { 
      id: '08', 
      number: '08', 
      title: 'Emotional and personal readiness',
      content: (
        <div className="bg-neutral-100 px-8 py-6 max-sm:p-4">
          <div className="text-gray-600 text-base leading-relaxed space-y-3">
            <p>Emotional readiness is often overlooked but crucial for a successful exit experience.</p>
            <p>Preparing mentally for life after the business helps ensure long-term satisfaction with the exit decision.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen relative">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
      <section className="w-full flex justify-center items-center px-0 py-20">
  <div className="w-full max-w-[1000px] px-5 text-center">
    <h1 className="text-[#D02C31] text-7xl max-md:text-5xl max-sm:text-[32px] font-walbaum font-light mb-5">
      Your value and wealth is at risk,
    </h1>
    <h2 className="text-[#D02C31] text-7xl max-md:text-5xl max-sm:text-[32px] font-walbaum mb-5">
      more and more each day
    </h2>
    <h2 className="text-[#D02C31] text-7xl max-md:text-5xl max-sm:text-[32px]">
      as your exit nears.
    </h2>
  </div>
</section>

        
       {/* Value Proposition */}
<section className="flex flex-col justify-center items-center gap-6 max-w-[1036px] w-full mx-auto px-0 py-10 max-sm:p-5 font-linear">
  <h3 className="text-black text-2xl text-center max-w-[800px] w-full max-sm:text-lg">
    When 84% of your business value is locked inside your intangible assets
  </h3>
  <p className="text-[#6f6f6f] text-center text-2xl font-normal max-w-[1036px] w-full max-sm:text-lg">
    (your brand, goodwill, strategic advantage, growth potential, intellectual property, human capital etc)
  </p>
  <div className="text-black text-center text-2xl max-w-[900px] w-full max-sm:text-lg">
    <p>your business value and generational wealth is at risk – unless you unlock that value. ..</p>
    <p>maximize it, and monetize it tax effectively, and</p>
    <p>have ALL YOUR PEOPLE help you do that</p>
  </div>
  <p className="text-black text-2xl text-center max-w-[300px] w-full max-sm:text-lg">
    (you will see why here)
  </p>
</section>

<section className="w-full flex flex-col justify-center items-center px-0 py-20">
  <div className="w-full max-w-[900px] text-center">
    <h2 className="text-[#777] text-7xl font-normal max-md:text-5xl max-sm:text-[32px] font-walbaum">
      You didn't get into business
    </h2>
    <h2 className="text-[#777] text-7xl font-normal mt-5 max-w-[492px] mx-auto max-md:text-5xl max-sm:text-[32px] font-walbaum">
      to LOSE...right?
    </h2>
  </div>
</section>

<section className="w-full flex flex-col justify-center items-center px-0 py-20">
  <div className="w-full max-w-[900px] text-center">
    <h2 className="text-[#777] text-7xl font-normal max-md:text-5xl max-sm:text-[32px] font-walbaum">
      But here's why it's easier to
    </h2>
    <h2 className="text-[#777] text-7xl font-normal mt-5 max-w-[736px] mx-auto max-md:text-5xl max-sm:text-[32px] font-walbaum">
      <span className='text-[#D02C31]'>LOSE</span> than it is to <span className='text-[#007C7A]'>WIN.</span>
    </h2>
  </div>
</section>

{/* Video Player */}
<div className="w-full flex justify-center items-center px-0 py-10">
      <iframe 
        width="1078" 
        height="513" 
        src="https://imagekit.io/player/embed/je0rl3nnt/63Qa3wVBkJ-qVzDq5dBmY-360p.mp4/ik-video.mp4?updatedAt=1748407955162&thumbnail=https%3A%2F%2Fik.imagekit.io%2Fje0rl3nnt%2F63Qa3wVBkJ-qVzDq5dBmY-360p.mp4%2Fik-video.mp4%2Fik-thumbnail.jpg%3FupdatedAt%3D1748407955162&updatedAt=1748407955162" 
        title="ImageKit video player" 
        frameBorder="0" 
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        style={{
          width: '100%', 
          maxWidth: '1078px', 
          height: 'auto',
          aspectRatio: '1078/513'
        }}
      />
    </div>

<h2 className="text-[#777] text-7xl font-normal text-center px-0 py-20 max-md:text-5xl max-sm:text-[32px] font-walbaum">
  The truth is in the data.
</h2>


        {/* Main Content Layout */}
        <div className="flex gap-8 justify-center items-start max-lg:flex-col max-lg:items-center py-20">
  {/* Registration Form - Now Sticky */}
  <div className="sticky top-[86px] w-full max-w-sm bg-white p-8 px-3 rounded-3xl border-4 border-gray-300 shadow-lg flex-shrink-0 self-start">
    <h2 className="text-[#2B2B2B] text-center tracking-wide mb-6 font-walbaum fill-white">
      WIN a Private Webinar and Q&A with Jeff
    </h2>
    
    {/* Features List */}
    <div className="space-y-3 mb-6 pl-2">
      {[
        'Exited with Double-Digit Multiples',
        'Achieved 25%+ Profit Margins',
        'Tax Smart Generational Wealth',
        'And more...'
      ].map((feature, index) => (
        <div key={index} className="flex items-center gap-3 text-gray-800 text-sm">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
            <path d="M4.07573 11.8036L0.175729 7.44535C-0.0585762 7.18351 -0.0585762 6.75898 0.175729 6.49711L1.02424 5.54888C1.25854 5.28702 1.63846 5.28702 1.87277 5.54888L4.5 8.48478L10.1272 2.19638C10.3615 1.93454 10.7415 1.93454 10.9758 2.19638L11.8243 3.14461C12.0586 3.40645 12.0586 3.83098 11.8243 4.09285L4.92426 11.8036C4.68994 12.0655 4.31004 12.0655 4.07573 11.8036Z" fill="black"/>
          </svg>
          <span className='font-linear text-xs text-[#2B2B2B]'>{feature}</span>
        </div>
      ))}
    </div>
    
    <div className="text-gray-800 text-center text-sm font-semibold mb-6 rounded-lg font-walbaum">
      *11am EST, May 22/25 - Only 33 Spots Available
    </div>
    
    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
        {error}
      </div>
    )}
    
    <form onSubmit={handleFormSubmit} className="space-y-4 font-linear">
      <div>
        <label className="block text-black text-sm font-medium mb-2">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          className="w-full h-10 border border-gray-400 text-sm px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
      </div>
      
      <div>
        <label className="block text-black text-sm font-medium mb-2">Business Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your business email"
          className="w-full h-10 border border-gray-400 text-sm px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
      </div>
      
      <div>
        <label className="block text-black text-sm font-medium mb-2">Business Website</label>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="Enter your website URL (e.g., example.com)"
          className={`w-full h-10 border text-sm px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
            websiteError ? 'border-red-400' : 'border-gray-400'
          }`}
        />
        {websiteError && (
          <p className="text-red-500 text-xs mt-1">{websiteError}</p>
        )}
      </div>
      
      <div>
        <label className="block text-black text-sm font-medium mb-2">Phone Number</label>
        <div className="flex gap-2">
          <select 
            name="countryCode"
            value={selectedCountryCode}
            onChange={handleInputChange}
            className="w-24 h-10 border border-gray-400 rounded-lg text-xs px-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {countryCodes.map((country, index) => (
              <option key={`${country.code}-${index}`} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
          <div className="flex-1">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={`Enter ${countryCodes.find(c => c.code === selectedCountryCode)?.digits || 10} digit number`}
              className={`w-full h-10 border text-sm px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                phoneError ? 'border-red-400' : 'border-gray-400'
              }`}
              required
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-start gap-3 py-4 items-center">
        <input
          type="checkbox"
          id="privacy"
          name="privacy"
          checked={formData.privacy}
          onChange={handleInputChange}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-black border"
          required
        />
        <label htmlFor="privacy" className="text-xs text-gray-500 leading-relaxed">
          I agree to opt-in and accept the privacy policy.
        </label>
      </div>
      
      <button
        type="submit"
        disabled={websiteError !== '' || phoneError !== ''}
        className="w-full text-white text-base font-semibold bg-black py-4 px-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none font-linear disabled:opacity-50 disabled:cursor-not-allowed"
      >
        I want a chance to WIN !!
      </button>
    </form>
  </div>
  
  {/* Accordion Sections */}
  <div>
    <Accordion/>  
  </div>
  
</div>
      </main>
      <VideoPopup />
      <aside className="absolute right-4 top-4 z-10">
      <div className="flex flex-col items-end">
        <img
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/53e157ea9e6912d2bf3a95839b06656d5dc44abc'
          alt="Side Logo"
          className="w-[140px] h-[35px]"
        />
        <div className="-rotate-90 text-black text-[18px] mt-5 origin-center whitespace-nowrap pt-40 font-linear">
          <span>Grow Smarter. <span className="font-bold">Exit Richer™</span></span>
        </div>
      </div>
    </aside>

      {/* Password Popup */}
      <PasswordPopup
        isOpen={showPasswordPopup}
        onClose={handlePasswordPopupClose}
        onVerifyNow={handleVerifyNow}
        onVerifyLater={handleVerifyLater}
        loading={loading}
        error={error}
      />

      {/* OTP Popup */}
      <OTPPopup
        isOpen={showOTPPopup}
        email={formData.email}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onClose={handleOTPClose}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default COI;