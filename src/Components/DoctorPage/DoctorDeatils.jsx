import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../Axiosinstance';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoverStar, setHoverStar] = useState(0);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [dummyState, setDummyState] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [AvailableAppoinments, setAvailableAppoinments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const username = localStorage.getItem('username');

  // Toggle dropdown visibility
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  async function handleDelete(id) {
    try {
      const response = await axiosInstance.delete(`review/${id}/`);
      setOpenDropdownIndex(null);
      setDummyState((dummyState) => !dummyState);
      toast.success('Review deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete review');
    }
  }
  
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setReviewLoading(true);
        const response = await axiosInstance.get(`All_doctors/${id}/`);
        setDoctor(response.data);
      } catch (err) {
        setError('Failed to fetch doctor details');
        console.error(err);
        toast.error('Failed to load doctor details');
      } finally {
        setLoading(false);
        setReviewLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id, dummyState]); 

  async function handleSubmit(value) {
    try {
      const response = await axiosInstance.post('review/', value);
      toast.success('Review submitted successfully');
      setDummyState((dummyState) => !dummyState);
      formik.resetForm();
    } catch (error) {
      console.log(error);
      toast.error('Failed to submit review');
    }
  }

  const fetchAvailableAppoinments = async ()=>{
    try {
      const response = await axiosInstance.get(`patient_panal_appointments/doctor_availability/?doctor_id=${id}`);
      console.log(response.data.doctor_availability);
      setAvailableAppoinments(response.data.doctor_availability);
    } catch (error) {
      console.log(error);
    }
  }

  async function submitAppointment() {
    try {
      setAppointmentLoading(true);
      const response = await axiosInstance.post(`patient_panal_appointments/doctor_availability/?doctor_id=${id}` , selectedAppointment);
      console.log(response.data);
      console.log(selectedAppointment);
      toast.success(`${response.data.message} ,Your Payment id is ${response.data.appointment_id}`);
      localStorage.setItem('appointment_date', selectedAppointment.appointment_date);
      localStorage.setItem('appointment_time', selectedAppointment.appointment_time);
      setIsModalOpen(false);
      setAppointmentLoading(false);
    } catch (error) {
      console.log(error);
      toast.error('Failed to book appointment');
      console.log(selectedAppointment);
    }
    finally {
      setAppointmentLoading(false);
    }
  }

  useEffect(() => {
    fetchAvailableAppoinments();
  }, [isModalOpen]);

  // Formik and Yup validation schema
  const validationSchema = Yup.object({
    comment: Yup.string()
      .required('This field is required')
      .min(3, 'Minimum length is 3 characters'),
    rating: Yup.number()
      .required('This field is required')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot be more than 5'),
  });

  const formik = useFormik({
    initialValues: {
      doctor: Number(id),
      rating: 0,
      comment: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });


  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  if (!doctor) return <div className="flex justify-center items-center h-screen">No doctor data found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      
      
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto" 
          aria-labelledby="modal-title" 
          role="dialog" 
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-black bg-opacity-50" 
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            {/* Modal panel */}
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-xl sm:p-6 sm:align-middle">
              <div className='flex justify-between items-center'>
                <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize" id="modal-title">
                  Book an Appointment
                </h3>
                <span className='cursor-pointer text-xl' onClick={()=>setIsModalOpen(false)}>x</span>
              </div>
              <p className="mt-2 text-md text-gray-500">
                Book an appointment with Dr. {doctor.username}.
              </p>

              <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="emails-list" className="text-md text-gray-700">
                  Select dates and times for the appointment:
                </label>

              {AvailableAppoinments.length > 0 ? <table className="min-w-full table-auto mt-2">
                  <thead>
                    <tr className="text-gray-700">
                      <th className="p-2 border border-gray-100 text-center">Day</th>
                      <th className="p-2 border border-gray-100 text-center">Date</th>
                      <th className="p-2 border border-gray-100 text-center">Slots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AvailableAppoinments.map((item) =>
                      item.dates.map((dateItem, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2 text-center">{item.day}</td>
                          <td className="p-2 min-w-[120px] text-center">{dateItem.date}</td>
                          <td className="p-2">
                  <div className="flex flex-col gap-2">
                    {/* Free Slots */}
                    <div>
                      <p className="text-green-600 font-semibold mb-1">Available :</p>
                      <div className="flex flex-wrap gap-2">
                        {dateItem.free_slots.map((slot, i) => (
                          <button
                              key={i}
                              className={`px-2 py-1 rounded text-sm transition duration-200
                                ${selectedAppointment?.appointment_date === dateItem.date && selectedAppointment?.appointment_time === slot
                                  ? 'bg-green-600 text-white'
                                  : 'bg-green-200 hover:bg-green-300'
                                }`}
                              onClick={() => setSelectedAppointment({ appointment_date: dateItem.date , appointment_time: slot })}
                            >
                              {slot}
                        </button>
                        ))}
                      </div>
                    </div>

                    {/* Booked Slots */}
                    <div>
                      <p className="text-gray-500 font-semibold mb-1">{dateItem.booked_slots.length > 0 ? 'Booked :': ''}</p>
                      <div className="flex flex-wrap gap-2">
                        {dateItem.booked_slots.map((slot, i) => (
                          <button
                            key={`b-${i}`}
                            className="px-2 py-1 bg-gray-300 rounded text-sm cursor-not-allowed"
                            disabled
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>


                        </tr>
                      ))
                    )}
                  </tbody>
                </table> : <p className='text-center text-gray-500'>{`No available Appointments for Dr/${doctor.username}`}</p>}


          {AvailableAppoinments.length > 0 ? <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                  >
                    Cancel
                  </button>

                  <button 
                    type="button"
                    className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                    onClick={() => submitAppointment()}
                  >
                    { appointmentLoading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div> : ''}
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8 border-b border-gray-200">
          {/* Doctor Details */}
          <div className="md:col-span-7 order-2 md:order-1">
            <div className="text-gray-600 mb-2 bg-[#133E87] w-fit py-2 px-3 rounded-md">
              <span className="font-semibold text-white poppins">{doctor.specialization}</span>
            </div>
            <h1 className="text-3xl font-bold poppins mb-2">DR : {doctor.username}</h1>
            <p className="text-base text-[#0000008F]">
              {doctor.bio || 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus dolores quo reiciendis aliquid autem neque repudiandae, perspiciatis ut est nisi, quis suscipit, veritatis possimus consectetur a atque molestiae dolorem tenetur?'}
            </p>
            <p className="poppins text-3xl mt-3">
              Appointment fee : <span className="font-bold">${doctor.consultation_price}</span>
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-white bg-[#0558E2] text-xl poppins p-3 rounded-md mt-4 hover:bg-[#1705e2] transition duration-200"
            >
              Book an Appointment
            </button>

            <div className="flex flex-col md:flex-row shadow-xl rounded-md mt-4 p-6 justify-between text-center items-center hover:scale-105 transition duration-200 gap-4">
              {/* Email Section */}
              <div className="text-gray-600 px-3 w-full md:w-auto">
                <div className="font-semibold flex flex-col items-center space-y-2">
                  <div className="bg-[#0558E2] rounded-full px-3 py-5 flex justify-center items-center">
                    <i className="fa-regular fa-envelope fa-lg" style={{ color: '#fff' }} aria-hidden="true"></i>
                  </div>
                  <div>Email</div>
                  <p className="text-sm poppins text-[#00000078] break-all">{doctor.email}</p>
                </div>
              </div>

              {/* Location Section */}
              <div className="text-gray-600 px-3 w-full md:w-auto">
                <div className="font-semibold flex flex-col items-center space-y-2">
                  <div className="bg-[#0558E2] rounded-full px-3 py-5 flex justify-center items-center">
                    <i className="fa-solid fa-location-dot fa-lg" style={{ color: '#fff' }} aria-hidden="true"></i>
                  </div>
                  <div>Location</div>
                  <p className="text-[#00000078] poppins">{doctor.location}</p>
                </div>
              </div>

              {/* Available Hours Section */}
              <div className="text-gray-600 px-3 w-full md:w-auto">
                <div className="font-semibold flex flex-col items-center space-y-2">
                  <div className="bg-[#0558E2] rounded-full px-3 py-5 flex justify-center items-center">
                    <i className="fa-regular fa-clock fa-lg" style={{ color: '#fff' }} aria-hidden="true"></i>
                  </div>
                  <div>Available Hours</div>
                  <p className="text-[#00000078] poppins">1pm - 7pm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Image */}
          <div className="md:col-span-5 order-1 md:order-2 flex justify-center items-center">
            <img
              src={doctor.profile_picture}
              alt="Profile"
              className="w-full h-auto max-h-96 object-cover rounded-md shadow-lg"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
            {doctor.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.reviews.map((review, index) => (
                  <div key={index} className="bg-[#E6F5FC] py-4 px-3 rounded-lg shadow-sm relative">
                    {username === review.patient_username && (
                      <div
                        className="absolute top-3 right-3 hover:text-gray-600 cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        <i className="fa-solid fa-ellipsis" style={{ color: "#000" }}></i>
                      </div>
                    )}
                    {openDropdownIndex === index && (
                      <div className="absolute top-10 right-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <ul className="py-2">
                          <li 
                            onClick={() => handleDelete(review.id)} 
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-lg font-semibold text-gray-800">{review.patient_username}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-gray-700">{review.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment || 'No comment provided.'}</p>
                    <p className="text-sm text-gray-500 mt-4">
                      Reviewed on: {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews available.</p>
            )}
          </div>

          {/* Review Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave a Review for Dr. {doctor.username}</h2>
            <form className="space-y-4" onSubmit={formik.handleSubmit}>
              <div className="flex justify-center items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <i
                    key={rating}
                    onClick={() => formik.setFieldValue('rating', rating)}
                    onMouseEnter={() => setHoverStar(rating)}
                    onMouseLeave={() => setHoverStar(0)}
                    className={`fa-regular fa-star fa-xl cursor-pointer ml-3 ${
                      (hoverStar !== 0 && rating <= hoverStar) || (hoverStar === 0 && rating <= formik.values.rating)
                        ? 'text-yellow-300'
                        : 'text-black'
                    }`}
                  ></i>
                ))}
              </div>
              {formik.touched.rating && formik.errors.rating ? (
                <div className="text-red-500">{formik.errors.rating}</div>
              ) : null}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Comment</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="4"
                  placeholder="Write your review..."
                  name="comment"
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.comment && formik.errors.comment ? (
                  <div className="text-red-500">{formik.errors.comment}</div>
                ) : null}
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md w-full hover:bg-blue-600"
              >
                {reviewLoading ? 'Loading...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;