import React, { useState } from 'react';
import Style from './Contact.module.css'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';
function Contact() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://mostafa3mad.pythonanywhere.com/api/contact-us/', values);
      toast.success('Your message has been sent successfully!');
      resetForm();
    } 
    catch (error) {
      console.log(error);      
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(150, "Name must be at most 150 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    subject: Yup.string()
      .required("Subject is required")
      .min(3, "Subject must be at least 3 characters")
      .max(150, "Subject must be at most 150 characters"),
    message: Yup.string()
      .required("Message is required")
      .min(10, "Message must be at least 10 characters")
      .max(500, "Message must be at most 500 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  return (
    <>
    <Helmet>
  <title>Contact Us</title>
</Helmet>
    <div className="container mx-auto px-6 py-10 md:w-11/12">
      {/* Contact Heading */}
      <h1 className={`${Style.ContactHeading} text-center text-[48px] font-[600] text-[#011632] mb-8 poppins`}>Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-10 py-12">
        {/* Left Side - Contact Information & Social Icons */}
        <div>
          <div className="">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 poppins text-[40px]">Let&apos;s Talk</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste et cupiditate tempore veritatis! Amet, libero.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-8">
            {['facebook-f', 'instagram', 'tiktok'].map((icon, index) => (
              <span key={index} className="border-2 border-[#1376F8] rounded-full p-3 transition hover:bg-[#1376F8] hover:text-white">
                <i className={`fa-brands fa-${icon} fa-xl`} aria-hidden="true"></i>
              </span>
            ))}
          </div>

          {/* Contact Cards */}
          <div className="space-y-4 mt-8">
            {[
              { icon: 'at', title: 'Email Address', detail: 'Curai@gmail.com' },
              { icon: 'phone', title: 'Phone Number', detail: '(434) 546-4356' },
              { icon: 'comments', title: 'Live Chatbot', detail: 'View >' }
            ].map((item, index) => (
              <div key={index} className="flex items-center shadow-md p-4 rounded-lg bg-white hover:scale-105 transition duration-250">
                <span className="bg-[#0558E2] rounded-full p-3 text-white">
                  <i className={`fa-solid fa-${item.icon} fa-lg`} aria-hidden="true"></i>
                </span>
                <div className="ml-3">
                  <span className="text-[#011632]  font-medium poppins text-[18px]">{item.title}</span>
                  <p className="text-[#3C4959]">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-md">
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Name */}
            <div>
              <input 
                type="text" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                name='name' 
                value={formik.values.name} 
                placeholder="Name" 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1376F8]" 
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
              ) : null}
            </div>

            {/* Email */}
            <div>
              <input 
                type="email" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                name='email' 
                value={formik.values.email} 
                placeholder="Email" 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1376F8]" 
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              ) : null}
            </div>

            {/* Subject */}
            <div>
              <input 
                type="text" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                name='subject' 
                value={formik.values.subject} 
                placeholder="Subject" 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1376F8]" 
              />
              {formik.touched.subject && formik.errors.subject ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.subject}</div>
              ) : null}
            </div>

            {/* Message */}
            <div>
              <textarea 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                name='message' 
                value={formik.values.message} 
                placeholder="Leave a message" 
                rows="4" 
                className="w-full p-3 resize-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1376F8]"
              ></textarea>
              {formik.touched.message && formik.errors.message ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>
              ) : null}
            </div>

            {/* Send Button */}
            <button 
              type='submit' 
              disabled={isLoading}
              className="w-full p-3 bg-[#1376F8] text-white rounded-md hover:bg-[#131bf8] transition flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Contact;