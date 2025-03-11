import React from 'react'
import style from './Footer.module.css'

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <footer className="relative py-10 bg-[#133E87] text-white flex justify-center">
        <div className="absolute top-8 right-10">
          <span
            onClick={handleScrollTop}
            className="border border-white px-4 py-6 cursor-pointer rounded-full bg-white flex items-center justify-center"
          >
            <i className="fa-solid fa-arrow-up fa-lg" style={{ color: '#133E87' }}></i>
          </span>
        </div>

        {/* Footer Content */}
        <div className="flex flex-col items-center text-center md:text-start md:flex-row md:justify-between md:items-center md:w-11/12">
          <div>
            <p>(434) 546-4356</p>
            <a className="">Contact@Curai.com</a>
          </div>

          <div className="services mt-3">
            <p className="text-2xl">Services</p>
            <ul className="list-none text-[#ccc] mt-5">
              <li className="py-2 hover:text-white transition duration-200">Primary Care</li>
              <li className="py-2 hover:text-white transition duration-200">Specialist Care</li>
              <li className="py-2 hover:text-white transition duration-200">Mental Health Services</li>
              <li className="py-2 hover:text-white transition duration-200">Tele-health</li>
            </ul>
          </div>

          <div className="Doctors mt-3">
            <p className="text-2xl">Find a doctor</p>
            <ul className="list-none text-[#ccc] mt-5">
              <li className="py-2 hover:text-white transition duration-200">Top Rated Doctors</li>
              <li className="py-2 hover:text-white transition duration-200">Appointment Scheduling</li>
              <li className="py-2 hover:text-white transition duration-200">Patient Reviews</li>
              <li className="py-2 hover:text-white transition duration-200">Doctors profile</li>
            </ul>
          </div>

          <div className="About mt-3 p-4">
            <p className="text-2xl">About us</p>
            <ul className="list-none text-[#ccc] mt-5">
              <li className="py-2 hover:text-white transition duration-200">News and Updates</li>
              <li className="py-2 hover:text-white transition duration-200">Careers</li>
              <li className="py-2 hover:text-white transition duration-200">Community Involvements</li>
              <li className="py-2 hover:text-white transition duration-200">Contact us</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
