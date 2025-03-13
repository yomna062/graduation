import { useEffect, useState } from 'react';
import axiosInstance from '../Axiosinstance';

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  
  // ✅ عوامل البحث
  const [searchSpecialization, setSearchSpecialization] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [searchRating, setSearchRating] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ✅ Fetch specializations
        const specializationsRes = await axiosInstance.get('/specializations/');
        setSpecializations(specializationsRes.data);

        // ✅ Fetch doctors
        const doctorsRes = await axiosInstance.get('/All_doctors/');
        setDoctors(doctorsRes.data.results);
        setFilteredDoctors(doctorsRes.data.results);
      } catch (err) {
        console.error('Error fetching data:', err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ فلترة البيانات بناءً على عوامل البحث
  useEffect(() => {
    let filtered = doctors;

    if (searchSpecialization) {
      filtered = filtered.filter(doctor => doctor.specialization === searchSpecialization);
    }

    if (searchPrice) {
      filtered = filtered.filter(doctor => doctor.consultation_price <= parseFloat(searchPrice));
    }

    if (searchRating) {
      filtered = filtered.filter(doctor => doctor.rating >= parseFloat(searchRating));
    }

    if (searchLocation) {
      filtered = filtered.filter(doctor =>
        doctor.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [searchSpecialization, searchPrice, searchRating, searchLocation, doctors]);

  // ✅ دالة لإعادة ضبط الفلاتر
  const resetFilters = () => {
    setSearchSpecialization('');
    setSearchPrice('');
    setSearchRating('');
    setSearchLocation('');
  };

  return (
    <div className="flex gap-4 p-4">
      {/* ✅ Specializations Slider */}
      <div className="w-1/4 overflow-y-auto h-screen border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4">Specializations</h2>
        {specializations.map((spec) => (
          <div
            key={spec.id}
            onClick={() => setSearchSpecialization(spec.name)}
            className={`cursor-pointer p-2 hover:bg-gray-100 rounded-md ${
              searchSpecialization === spec.name ? 'bg-blue-100' : ''
            }`}
          >
            {spec.name} ({spec.doctor_count})
          </div>
        ))}
      </div>

      {/* ✅ Search Filters */}
      <div className="w-3/4">
        <div className="mb-4 grid grid-cols-4 gap-4">
          {/* 🔎 Search by Price */}
          <input
            type="number"
            placeholder="Max Price"
            value={searchPrice}
            onChange={(e) => setSearchPrice(e.target.value)}
            className="border p-2 rounded-md w-full"
          />

          {/* 🔎 Search by Rating */}
          <input
            type="number"
            placeholder="Min Rating"
            value={searchRating}
            onChange={(e) => setSearchRating(e.target.value)}
            step="0.1"
            className="border p-2 rounded-md w-full"
          />

          {/* 🔎 Search by Location */}
          <input
            type="text"
            placeholder="Location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="border p-2 rounded-md w-full"
          />

          {/* 🔄 Reset Button */}
          <button
            onClick={resetFilters}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Reset
          </button>
        </div>

        {/* ✅ حالة التحميل */}
        {loading ? (
          <div className="text-center text-gray-500">Loading doctors...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="border p-4 rounded-lg shadow-md">
                  <img
                    src={doctor.profile_picture}
                    alt={doctor.username}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-bold mt-2">DR / {doctor.username}</h3>
                  <p className="text-gray-500">{doctor.specialization}</p>
                  <p className="text-green-500 font-semibold mt-1">
                    {doctor.consultation_price} EGP
                  </p>
                  <p className="text-yellow-500 mt-1">⭐ {doctor.rating} / 5</p>
                  <p className="text-gray-400">{doctor.location}</p>
                  <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Book Appointment
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 col-span-3">
                No doctors found with these filters.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
