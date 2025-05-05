import React, { useEffect, useState } from 'react';
import axiosInstance from '../Axiosinstance';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function PatientPanel() {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({ next: null, previous: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async (url = 'patient_panal_appointments/') => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(url);
      setAppointments(response.data.results);
      setPagination({
        next: response.data.next,
        previous: response.data.previous,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Not specified';
    const timeParts = timeStr.split(':');
    if (timeParts.length === 2) {
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    return timeStr;
  };

  const renderStatus = (status) => {
    if (!status) return <div className="flex items-center"><AlertCircle className="mr-1 text-gray-400" size={16} />Not Specified</div>;
    switch(status.toLowerCase()) {
      case 'completed':
        return <div className="flex items-center"><CheckCircle className="mr-1 text-green-500" size={16} />Completed</div>;
      case 'cancelled':
        return <div className="flex items-center"><XCircle className="mr-1 text-red-500" size={16} />Cancelled</div>;
      case 'pending':
        return <div className="flex items-center"><AlertCircle className="mr-1 text-yellow-500" size={16} />Pending</div>;
      default:
        return <div className="flex items-center"><AlertCircle className="mr-1 text-blue-500" size={16} />{status}</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">My Appointments</h2>
      
      {appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No appointments found
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-gray-600 text-left">
                  <th className="py-3 px-4 font-semibold">Doctor</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Time</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-800">{appointment.doctor}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Calendar className="mr-2 text-blue-500" size={16} />
                        {formatDate(appointment.appointment_date)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Clock className="mr-2 text-blue-500" size={16} />
                        {formatTime(appointment.appointment_time)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {renderStatus(appointment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => pagination.previous && fetchAppointments(pagination.previous)}
              disabled={!pagination.previous}
              className={`px-4 py-2 rounded ${
                pagination.previous
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => pagination.next && fetchAppointments(pagination.next)}
              disabled={!pagination.next}
              className={`px-4 py-2 rounded ${
                pagination.next
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PatientPanel;
