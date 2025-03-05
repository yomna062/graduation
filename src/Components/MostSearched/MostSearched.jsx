// src/components/MostSearched/MostSearched.js
import React from 'react';
import docimg from '../../assets/images/doc3.png';

export default function MostSearched() {
    // بيانات الأطباء
    const doctors = [
        { name: "DR / Ahmed Hamdy", specialty: "Cardiologist", rating: "99%", image: docimg },
        { name: "DR / Sara Youssef", specialty: "Neurologist", rating: "95%", image: docimg },
        { name: "DR / Mohamed Ali", specialty: "Dentist", rating: "98%", image: docimg },
        { name: "DR / Aisha Khaled", specialty: "Pediatrician", rating: "97%", image: docimg }
    ];

    return (
        <>
            <div className='font-bold text-center text-2xl mb-6'>
                <h3>Most Searched Doctors</h3>
            </div>

            <div className='container mx-auto max-w-screen-xl px-5 py-10'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 justify-center'>
                    {doctors.map((doctor, index) => (
                        <div 
                            key={index} 
                            className="max-w-[300px] bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 mx-auto"
                        >
                            <div className='relative overflow-hidden rounded-t-lg'>
                                <a href="#">
                                    <img 
                                        className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
                                        src={doctor.image} 
                                        alt='Doctor' 
                                    />
                                </a>
                                <div className='absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg shadow-md'>
                                    {doctor.rating}
                                </div>
                            </div>
                            <div className="p-4">
                                <h5 className="text-xl font-semibold text-gray-900">{doctor.name}</h5>
                                <p className="text-gray-500">{doctor.specialty}</p>
                                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
