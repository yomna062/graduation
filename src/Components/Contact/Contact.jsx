import React from 'react';
import Style from './Contact.module.css'
import { Helmet } from 'react-helmet';
function Contact() {
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
          <form className="space-y-4">
            {/* First & Last Name */}
            <div className="flex space-x-4">
              <input type="text" placeholder="First Name" className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1376F8]" />
              <input type="text" placeholder="Last Name" className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1376F8]" />
            </div>

            {/* Email */}
            <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1376F8]" />

            {/* Phone Number */}
            <input type="tel" placeholder="Phone Number" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1376F8]" />

            {/* Leave a Message */}
            <textarea placeholder="Leave a message" rows="4" className="w-full p-3 resize-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1376F8]"></textarea>

            {/* Send Button */}
            <button className="w-full p-3 bg-[#1376F8] text-white rounded-md hover:bg-[#131bf8] transition">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Contact;
