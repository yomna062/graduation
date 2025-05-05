import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../Axiosinstance';
import Doctor_Appointments from './Doctor_Appointments';
import UpdateAppointments from './UpdateAppointments';

function Doctor_Panel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(true);
  const [showAppointments, setShowAppointments] = useState(false);
  const [dummyState, setDummyState] = useState(false);

  // Days of week for display
  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", 
    "Thursday", "Friday", "Saturday"
  ];

  // Initial values for the form
  const initialValues = {
    available_from: "10:00",
    available_to: "18:00",
    days_of_week: ''
  };

  // Validation schema
  const validationSchema = Yup.object({
    available_from: Yup.string().required('Start time is required'),
    available_to: Yup.string().required('End time is required'),
    days_of_week: Yup.array()
      .min(1, 'Select at least one day')
      .required('Working days are required')
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Convert days_of_week array to comma-separated string
      const formattedValues = {
        ...values,
        days_of_week: values.days_of_week.join(', ')
      };
      
      console.log("Sending data:", formattedValues);
      const response = await axiosInstance.post('doctor_panal_availabilities/', formattedValues);
      console.log("Success:", response.data);
      
      setMessage({ 
        text: 'Availability set successfully!', 
        type: 'success' 
      });
    } catch (error) {
      console.error("Error:", error);
      setMessage({ 
        text: `Failed to set availability: ${error.response?.data?.message || error.message}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Toggle a day in the days_of_week array
  const toggleDay = (setFieldValue, values, day) => {
    const currentDays = [...values.days_of_week];
    
    if (currentDays.includes(day)) {
      setFieldValue('days_of_week', currentDays.filter(d => d !== day));
    } else {
      setFieldValue('days_of_week', [...currentDays, day]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Doctor Panel</h1>
      
      {/* Toggle buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setShowAvailabilityForm(true);
            setShowAppointments(false);
          }}
          className={`px-4 py-2 rounded ${
            showAvailabilityForm 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Set Availability
        </button>
        <button
          onClick={() => {
            setShowAvailabilityForm(false);
            setShowAppointments(true);
          }}
          className={`px-4 py-2 rounded ${
            showAppointments 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          View Appointments
        </button>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      {showAvailabilityForm && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3 text-gray-700">Working Hours</h2>
                <div className="flex flex-wrap gap-4">
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                    <Field
                      type="time"
                      name="available_from"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <ErrorMessage name="available_from" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available To</label>
                    <Field
                      type="time"
                      name="available_to"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <ErrorMessage name="available_to" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3 text-gray-700">Working Days</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(setFieldValue, values, day)}
                      className={`p-2 rounded text-sm font-medium ${
                        values.days_of_week.includes(day)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                {errors.days_of_week && touched.days_of_week && (
                  <div className="text-red-500 text-xs mt-2">{errors.days_of_week}</div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  onClick={() => setDummyState(!dummyState)}
                  disabled={isSubmitting || loading}
                  className={`px-6 py-2 rounded text-white ${
                    isSubmitting || loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting || loading ? 'Saving...' : 'Save Availability'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      {showAppointments && <Doctor_Appointments />}
      <UpdateAppointments dummyState={dummyState} setDummyState = {setDummyState}/>
    </div>
  );
}

export default Doctor_Panel;