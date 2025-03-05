// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import { AiOutlineUser, AiOutlineSearch } from 'react-icons/ai';
import slidimg from '../../assets/images/doc2.png';

const SearchBar = ({ doctorsList, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // فلترة الأسماء بتأخير زمني (Debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        const filtered = doctorsList.filter((doctor) =>
          doctor.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDoctors(filtered);
      } else {
        setFilteredDoctors([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, doctorsList]);

  // اختيار اسم من القائمة
  const selectDoctor = (name) => {
    setSearchTerm(name);
    setFilteredDoctors([]);  // إخفاء القائمة بعد الاختيار
    onSearch(name);          // إرسال قيمة البحث للمكون الأب
  };

  return (
    <div className='relative h-[350px] w-full overflow-hidden'>
      <img src={slidimg} alt='sliderimg' className='h-full w-full object-cover' />
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div className='absolute inset-0 flex flex-col justify-center items-center text-white'>
        <h3 className='text-2xl font-bold'>Search For the Doctor</h3>
        <p className='text-center max-w-md'>
          Select either searching with the name or a field, <br />
          or chat with chatbot to detect the best for you
        </p>
        
        <div className='relative w-full max-w-md mt-4'>
          <div className='flex items-center bg-white rounded-full shadow-md p-2 w-full'>
            <AiOutlineUser className='text-2xl text-gray-600 ml-2' />
            <input 
              type="text" 
              placeholder='Doctor’s Name' 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className='flex-1 outline-none text-gray-600'
              aria-label='Search for a doctor by name'
            />
            {/* <AiOutlineSearch className='text-white fs-1 bg-blue-800 rounded-full p-4 ' /> */}
            <div className='circle py-3 px-4 text-white rounded-full'>
            <i className="fa-solid fa-magnifying-glass" />

            </div>
          </div>

          {/* عرض القائمة إذا كان هناك نتائج */}
          {filteredDoctors.length > 0 && (
            <ul className='absolute w-full bg-white shadow-md rounded-lg mt-2 z-50 max-h-60 overflow-y-auto'>
              {filteredDoctors.map((doctor, index) => (
                <li 
                  key={index} 
                  className='p-2 hover:bg-gray-100 cursor-pointer text-black'
                  onClick={() => selectDoctor(doctor)}
                >
                  {doctor}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
