import React from 'react';
import aboutimg from'../../assets/images/aboutimg.jpg'
import { Helmet } from 'react-helmet';

const AboutUs = () => {
  return (
    <>
    <Helmet>
  <title>About Us</title>
</Helmet>
    <div className="font-sans">
      {/* Page Title */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto flex flex-col md:flex-row items-center py-4 px-4">
  {/* Image */}
  <div className="md:w-1/2 text-center">
  <img
    src={aboutimg}
    alt="About Us"
    className="rounded-lg shadow-lg max-w-full md:max-w-md mx-auto block"
  />
</div>

  {/* Text Content */}
  <div className="md:w-1/2 py-4 md:py-0 md:pl-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
    <p className="text-gray-700 leading-relaxed mb-4">
      Our mission is to revolutionize healthcare by providing an AI-powered platform that simplifies appointment booking for patients and doctors. We aim to connect users with the right medical professionals, making healthcare more accessible, efficient, and personalized through innovative technology.
    </p>
    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Our Vision</h2>
    <p className="text-gray-700 leading-relaxed">
      Our vision is to create a world where healthcare is easily accessible to everyone. By leveraging artificial intelligence, we seek to empower patients to make informed decisions about their health, while supporting doctors with efficient tools for managing consultations, appointments, and patient care.
    </p>
  </div>
</div>


      {/* Stats Section */}
      <div className="relative py-12 mt-16 bg-blue-100">
        {/* SVG Shape */}
        <div className="absolute inset-0 flex justify-center items-center top-[-200px] -z-10">
          
        </div>

        {/* Stats Content */}
        <div className="relative z-10">
          <h2 className="text-center font-bold text-3xl mb-8 text-gray-800">
            Our Stats
          </h2>

          {/* Stat Cards */}
          <div className="flex justify-center gap-6 flex-wrap">
            {/* Stat Card 1 */}
            <div className="bg-white shadow-lg rounded-xl p-6 w-40 md:w-48 text-center hover:scale-105 transition duration-300">
            <div className="bg-blue-50 text-white p-4 rounded-full inline-flex items-center justify-center mb-4">
            <i className="fa-solid fa-hand-holding-heart text-3xl text-blue-500" />
                </div>
              <div className="text-blue-500 text-3xl md:text-4xl font-bold">5000+</div>
              <p className="text-gray-500 text-sm md:text-base">Happy Patients</p>
            </div>

            {/* Stat Card 2 */}
           
            <div className="bg-white shadow-lg rounded-xl p-6 w-40 md:w-48 text-center hover:scale-105 transition duration-300">
            <div className="bg-green-100 text-white py-4 px-5 rounded-full inline-flex items-center justify-center mb-4">
            <i className="fa-solid fa-user-doctor text-3xl text-green-500" />
                </div>
              <div className="text-green-500 text-3xl md:text-4xl font-bold">700+</div>
              <p className="text-gray-500 text-sm md:text-base">Expert Doctors</p>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white shadow-lg rounded-xl p-6 w-40 md:w-48 text-center hover:scale-105 transition duration-300">
            <div className="bg-red-100 text-white p-4 rounded-full inline-flex items-center justify-center mb-4">
                    <i className="fa-solid fa-hospital text-3xl text-red-500" />
                </div>
              <div className="text-red-500 text-3xl md:text-4xl font-bold">200+</div>
              <p className="text-gray-500 text-sm md:text-base">Different Cities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AboutUs;