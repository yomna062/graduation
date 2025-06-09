import React, { useState, useRef } from 'react';
import registerImage from '../../assets/Register.jfif';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';

const Register = () => {
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const profilePictureRef = useRef(null);
  const certificateRef = useRef(null);
  const navigate = useNavigate();

  const specializations = [
    { id: 2, name: "Allergist", doctor_count: 1 },
    { id: 3, name: "Andrologists", doctor_count: 0 },
    { id: 4, name: "Anesthesiologist", doctor_count: 0 },
    { id: 1, name: "Audiologist", doctor_count: 1 },
    { id: 5, name: "Cardiologist", doctor_count: 0 },
    { id: 7, name: "Dentist", doctor_count: 0 },
    { id: 8, name: "Gynecologist", doctor_count: 0 },
    { id: 9, name: "Internists", doctor_count: 0 },
    { id: 10, name: "Orthopedist", doctor_count: 0 },
    { id: 11, name: "Pediatrician", doctor_count: 0 },
  ];

  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const userregex = /^[a-zA-Z0-9]+$/;
  
  const validateScheme = yup.object({
    username: yup
      .string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required')
      .max(150, 'Username must be 150 characters or fewer')
      .matches(userregex, 'Username must contain only letters and numbers without spaces'),
    first_name: yup
      .string()
      .max(150, 'First name must be 150 characters or fewer')
      .required('First name is required')
      .min(3, 'First name must be at least 3 characters'),
    last_name: yup
      .string()
      .max(150, 'Last name must be 150 characters or fewer')
      .required('Last name is required')
      .min(3, 'Last name must be at least 3 characters'),
    phone_number: yup
      .string()
      .required('Phone number is required')
      .matches(phoneRegex, 'Phone number is invalid'),
    email: yup
      .string()
      .email('Email is invalid')
      .required('Email is required'),
    age: yup
      .number()
      .required('Age is required')
      .min(12, 'Age must be at least 12'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(150, 'Password must be 150 characters or fewer'),
    password_confirm: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Password confirmation is required'),
    role: yup.string().required('Role is required'),
    gender: yup.string().required('Gender is required'),
    profile_picture: yup.mixed(),
    bio: yup.string().nullable().when('role', {
      is: 'doctor',
      then: () => yup.string().required('Bio is required'),
    }),
    location: yup.string().nullable().when('role', {
      is: 'doctor',
      then: () => yup.string().required('Location is required'),
    }),
    latitude: yup.number().nullable().when('role', {
      is: 'doctor',
      then: () => yup.number().required('Latitude is required'),
    }),
    longitude: yup.number().nullable().when('role', {
      is: 'doctor',
      then: () => yup.number().required('Longitude is required'),
    }),
    specialization: yup.number().nullable().when('role', {
      is: 'doctor',
      then: () => yup.string().required('Specialization is required'),
    }),
    consultation_price: yup.number().nullable().when('role', {
      is: 'doctor',
      then: () => yup.number().required('Consultation price is required'),
    }),
    profile_certificate: yup.mixed().when('role', {
      is: 'doctor',
      then: () => yup.mixed().required('Certificate is required'),
    }),
  });

  const handleSubmit = async (values) => {
    setisLoading(true);
    setErrorMessage(null);
  
    // Create FormData object to handle file uploads
    const formData = new FormData();
    
    // Add all values to formData
    Object.keys(values).forEach(key => {
      // Skip doctor-specific fields if role is not 'doctor'
      if (values.role !== 'doctor' && 
          ['location', 'specialization', 'consultation_price', 'bio', 
           'latitude', 'longitude', 'profile_certificate', 'is_approved'].includes(key)) {
        return;
      }
      
      // Handle file fields separately
      if (key === 'profile_picture' && values.profile_picture) {
        formData.append('profile_picture', values.profile_picture);
      } else if (key === 'profile_certificate' && values.profile_certificate) {
        formData.append('profile_certificate', values.profile_certificate);
      } else if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });
  
    try {
      const response = await axios.post(
        'https://mostafa3mad.pythonanywhere.com/api/register/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      toast.success('Account created successfully! Please login to continue.');
      navigate('/login');
      console.log(response.data);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        // Extract the first error message from the response
        const errorKey = Object.keys(error.response.data)[0];
        const errorMessage = error.response.data[errorKey][0];
        setErrorMessage(errorMessage);
        toast.error(errorMessage);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setisLoading(false);
    }
  };

  // Handle file input changes
  const handleFileChange = (event, field, previewSetter) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        previewSetter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Formik initialization
  const formik = useFormik({
    initialValues: {
      username: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      gender: '',
      email: '',
      age: '',
      password: '',
      password_confirm: '',
      role: '',
      bio: '',
      location: '',
      latitude: '',
      longitude: '', 
      specialization: '',
      consultation_price: '',
      profile_picture: null,
      profile_certificate: null,
      is_approved: false,
    },
    validationSchema: validateScheme,
    onSubmit: handleSubmit,
  });

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          formik.setFieldValue('latitude', position.coords.latitude);
          formik.setFieldValue('longitude', position.coords.longitude);
        },
        (error) => {
          toast.error("Error getting location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
    <Helmet>
      <title>Register</title>
    </Helmet>
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center w-full max-w-5xl mb-5 mt-5">
        <div className="flex flex-wrap bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Register Form */}
          <div className="w-full md:w-7/12 p-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 poppins">
                Create an account
              </h2>
              {errorMessage && (<p className='text-red-500 text-lg mb-5 text-center border-2 rounded-2xl py-2'>{errorMessage}</p>)}
              <form onSubmit={formik.handleSubmit}>
                {/* First Name */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.first_name}
                    name="first_name"
                  />
                  {formik.touched.first_name && formik.errors.first_name && (
                    <div className="text-red-500 text-sm">{formik.errors.first_name}</div>
                  )}
                </div>

                {/* Last Name */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.last_name}
                    name="last_name"
                  />
                  {formik.touched.last_name && formik.errors.last_name && (
                    <div className="text-red-500 text-sm">{formik.errors.last_name}</div>
                  )}
                </div>

                {/* Username */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    name="username"
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="text-red-500 text-sm">{formik.errors.username}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    name="email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm">{formik.errors.email}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    name="password"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password_confirm}
                    name="password_confirm"
                  />
                  {formik.touched.password_confirm && formik.errors.password_confirm && (
                    <div className="text-red-500 text-sm">{formik.errors.password_confirm}</div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone_number}
                    name="phone_number"
                  />
                  {formik.touched.phone_number && formik.errors.phone_number && (
                    <div className="text-red-500 text-sm">{formik.errors.phone_number}</div>
                  )}
                </div>

                {/* Age */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="age">
                    Age
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.age}
                    name="age"
                  />
                  {formik.touched.age && formik.errors.age && (
                    <div className="text-red-500 text-sm">{formik.errors.age}</div>
                  )}
                </div>

                {/* Gender */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="gender"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <div className="text-red-500 text-sm">{formik.errors.gender}</div>
                  )}
                </div>

                {/* Role (Doctor/Patient) */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="role">
                    Role
                  </label>
                  <select
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="role"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.role}
                    name="role"
                  >
                    <option value="">Select role</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                  {formik.touched.role && formik.errors.role && (
                    <div className="text-red-500 text-sm">{formik.errors.role}</div>
                  )}
                </div>

                {/* Profile Picture (Available for both Doctor and Patient) */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="profilePicture">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      ref={profilePictureRef}
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'profile_picture', setProfileImagePreview)}
                    />
                    <button
                      type="button"
                      onClick={() => profilePictureRef.current.click()}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Choose File
                    </button>
                    <span className="text-sm text-gray-500">
                      {formik.values.profile_picture 
                        ? formik.values.profile_picture.name 
                        : "No file chosen"}
                    </span>
                  </div>
                  {profileImagePreview && (
                    <div className="mt-2">
                      <img 
                        src={profileImagePreview} 
                        alt="Profile Preview" 
                        className="h-24 w-24 object-cover rounded-full border"
                      />
                    </div>
                  )}
                </div>

                {/* Doctor-specific Fields */}
                {formik.values.role === 'doctor' && (
                  <>
                    {/* Bio Field */}
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="bio">
                        Bio
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        id="bio"
                        rows="3"
                        placeholder="Enter your professional bio"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.bio}
                        name="bio"
                      />
                      {formik.touched.bio && formik.errors.bio && (
                        <div className="text-red-500 text-sm">{formik.errors.bio}</div>
                      )}
                    </div>

                    {/* Location */}
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="location">
                        Location
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        id="location"
                        type="text"
                        placeholder="Enter your location"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.location}
                        name="location"
                      />
                      {formik.touched.location && formik.errors.location && (
                        <div className="text-red-500 text-sm">{formik.errors.location}</div>
                      )}
                    </div>

                    {/* Coordinates (Latitude & Longitude) */}
                    <div className="mb-2 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="latitude">
                          Latitude
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          id="latitude"
                          type="number"
                          step="0.000001"
                          placeholder="Latitude"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.latitude}
                          name="latitude"
                        />
                        {formik.touched.latitude && formik.errors.latitude && (
                          <div className="text-red-500 text-sm">{formik.errors.latitude}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="longitude">
                          Longitude
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          id="longitude"
                          type="number"
                          step="0.000001"
                          placeholder="Longitude"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.longitude}
                          name="longitude"
                        />
                        {formik.touched.longitude && formik.errors.longitude && (
                          <div className="text-red-500 text-sm">{formik.errors.longitude}</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Get Current Location Button */}
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Get Current Location
                      </button>
                    </div>

                    {/* Certificate Upload */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="profileCertificate">
                        Certificate
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          id="profileCertificate"
                          accept="image/*,.pdf"
                          ref={certificateRef}
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'profile_certificate', setCertificatePreview)}
                        />
                        <button
                          type="button"
                          onClick={() => certificateRef.current.click()}
                          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Choose File
                        </button>
                        <span className="text-sm text-gray-500">
                          {formik.values.profile_certificate 
                            ? formik.values.profile_certificate.name 
                            : "No file chosen"}
                        </span>
                      </div>
                      {certificatePreview && formik.values.profile_certificate?.type.startsWith('image/') && (
                        <div className="mt-2">
                          <img 
                            src={certificatePreview} 
                            alt="Certificate Preview" 
                            className="h-32 object-contain border rounded"
                          />
                        </div>
                      )}
                      {formik.touched.profile_certificate && formik.errors.profile_certificate && (
                        <div className="text-red-500 text-sm">{formik.errors.profile_certificate}</div>
                      )}
                    </div>

                    {/* Specialization */}
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="specialization">
                        Specialization
                      </label>
                      <select
                        className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        id="specialization"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.specialization}
                        name="specialization"
                      >
                        <option value="">Select Specialization</option>
                        {specializations.map((specialization) => (
                          <option key={specialization.id} value={specialization.id}>
                            {specialization.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.specialization && formik.errors.specialization && (
                        <div className="text-red-500 text-sm">{formik.errors.specialization}</div>
                      )}
                    </div>

                    {/* Consultation Price */}
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="consultationPrice">
                        Consultation Price
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        id="consultationPrice"
                        type="number"
                        placeholder="Enter consultation price"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.consultation_price}
                        name="consultation_price"
                      />
                      {formik.touched.consultation_price && formik.errors.consultation_price && (
                        <div className="text-red-500 text-sm">{formik.errors.consultation_price}</div>
                      )}
                    </div>
                  </>
                )}

                {/* Terms and Conditions */}
                <p className="text-sm text-gray-600 mb-6 poppins">
                  By creating an account, you agree to the{' '}
                  <a href="" className="text-blue-500 hover:underline">
                    terms of use
                  </a>{' '}
                  and{' '}
                  <a href="" className="text-blue-500 hover:underline">
                    privacy policy
                  </a>
                  .
                </p>

                {/* Create Account Button */}
                <div className="flex items-center justify-between">
                  <button
                    className="w-full bg-[#c3c3c3] text-white font-bold py-3 px-4 rounded-lg poppins hover:scale-105 transition-transform duration-300"
                    type="submit"
                  >
                    {isLoading ? <>
                        <BeatLoader color="#ffffff" size={10} /> 
                      </> : 'Create Account'}
                  </button>
                </div>

                {/* Login Link */}
                <p className="mt-4 text-sm text-gray-600 text-center poppins">
                  Already have an account?{' '}
                  <Link to="/Login" className="text-blue-500 hover:underline">
                    Login Now
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden md:block md:w-5/12 relative">
            <img
              src={registerImage}
              alt="Register"
              className="w-full h-full object-center rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;