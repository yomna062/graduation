import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import axiosInstance from '../Axiosinstance';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [searchSpecialization, setSearchSpecialization] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [searchRating, setSearchRating] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const specializationsRes = await axiosInstance.get('/specializations/');
        setSpecializations(specializationsRes.data);
        console.log('specializations', specializationsRes.data);
        

        const doctorsRes = await axiosInstance.get('/All_doctors/');
        setDoctors(doctorsRes.data.results);
        console.log('doctors', doctorsRes.data);
        setFilteredDoctors(doctorsRes.data.results);
      } catch (err) {
        console.error('Error fetching data:', err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = doctors;

    if (searchSpecialization) {
      filtered = filtered.filter(doctor => doctor.specialization === searchSpecialization);
    }

    if (searchPrice) {
      filtered = filtered.filter(doctor => doctor.consultation_price <= parseFloat(searchPrice));
    }

    if (searchRating) {
      filtered = filtered.filter(doctor => {
        const averageRating = doctor.reviews?.length
          ? doctor.reviews.reduce((sum, review) => sum + review.rating, 0) / doctor.reviews.length
          : 0;
        return averageRating >= parseFloat(searchRating);
      });
    }

    if (searchLocation) {
      filtered = filtered.filter(doctor =>
        doctor.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [searchSpecialization, searchPrice, searchRating, searchLocation, doctors]);

  const resetFilters = () => {
    setSearchSpecialization('');
    setSearchPrice('');
    setSearchRating('');
    setSearchLocation('');
  };

  return (
    <>
      <Helmet>
        <title>
          {searchSpecialization
            ? `${searchSpecialization} Doctors - Find Your Doctor`
            : 'Specializations '}
        </title>
      </Helmet>

      <div className="flex flex-col md:flex-row gap-4 p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden bg-blue-500 text-white px-4 py-2 rounded-md mb-2 flex items-center gap-2"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          {sidebarOpen ? 'Close Specializations' : 'Open Specializations'}
        </button>

        <div
          className={`absolute md:relative top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-4 transition-transform duration-300 z-50 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:w-1/4 md:h-screen`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Specializations</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {specializations.map((spec) => (
            <div
              key={spec.id}
              onClick={() => {
                setSearchSpecialization(spec.name);
                setSidebarOpen(false);
              }}
              className={`cursor-pointer p-2 hover:bg-gray-100 rounded-md ${
                searchSpecialization === spec.name ? 'bg-blue-100' : ''
              }`}
            >
              {spec.name} ({spec.doctor_count})
            </div>
          ))}
        </div>

        <div className="w-full md:w-3/4">
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Max Price"
              value={searchPrice}
              onChange={(e) => setSearchPrice(e.target.value)}
              className="border p-2 rounded-md w-full"
            />

            <input
              type="number"
              placeholder="Min Rating"
              value={searchRating}
              onChange={(e) => setSearchRating(e.target.value)}
              step="1"
              className="border p-2 rounded-md w-full"
            />

            <input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="border p-2 rounded-md w-full"
            />

            <button
              onClick={resetFilters}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Reset
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading doctors...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <Link
                    to={`/Doctor-details/${doctor.id}`}
                    key={doctor.id}
                    className="border p-4 rounded-lg shadow-md"
                  >
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

                    <p className="text-yellow-500 mt-1">
                      ⭐{' '}
                      {doctor.reviews?.length
                        ? (
                            doctor.reviews.reduce((sum, review) => sum + review.rating, 0) /
                            doctor.reviews.length
                          ).toFixed(1)
                        : 'No reviews yet'}
                    </p>

                    <p className="text-gray-400">{doctor.location}</p>
                    <button className="mt-2 bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600">
                      Book Appointment
                    </button>
                  </Link>
                ))
              ) : (
                <div className="text-center text-gray-500 col-span-full">
                  No doctors found with these filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
