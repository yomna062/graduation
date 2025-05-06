import React, { useEffect, useState } from 'react';
import axiosInstance from '../Axiosinstance';

function UpdateAppointments({setDummyState , dummyState}) {
    const [appointment, setAppointment] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editData, setEditData] = useState({
        available_from: '',
        available_to: ''
    });

    useEffect(() => {
        fetchAppointments();
    }, [dummyState]);

    const fetchAppointments = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axiosInstance.get('doctor_panal_availabilities/');
            
            if (response.data.length === 0) {
                setAppointment(null);
                setError("No availability schedule found");
                return;
            }

            const data = response.data[0];
            
            const formatTimeForInput = (timeStr) => {
                if (!timeStr) return '';
                return timeStr.substring(0, 5); // Extract just HH:MM part
            };
            
            setAppointment(data);
            setEditData({
                available_from: formatTimeForInput(data.available_from),
                available_to: formatTimeForInput(data.available_to)
            });
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError("Failed to load availability data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!appointment) return;
        
        if (window.confirm("Are you sure you want to delete this availability?")) {
            try {
                setIsDeleting(true);
                await axiosInstance.delete(`doctor_panal_availabilities/${appointment.id}/`);
                setDummyState(prev => !prev);
                await fetchAppointments();
            } catch (error) {
                console.error('Error deleting appointment:', error);
                setError("Failed to delete availability");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!appointment) return;
        
        try {
            setIsSaving(true);
            setError(null);
            
            const formatTimeWithSeconds = (timeStr) => {
                return timeStr.includes(':00', 3) ? timeStr : `${timeStr}:00`;
            };
            
            await axiosInstance.patch(
                `doctor_panal_availabilities/${appointment.id}/`,
                {
                    available_from: formatTimeWithSeconds(editData.available_from),
                    available_to: formatTimeWithSeconds(editData.available_to),
                }
            );
            await fetchAppointments();
            setIsEditing(false);
            setDummyState(prev => !prev);
        } catch (error) {
            console.error('Error updating appointment:', error);
            if (error.response && error.response.data) {
                setError(`Failed to update: ${JSON.stringify(error.response.data)}`);
            } else {
                setError("Failed to update availability");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Not set';
        
        const [hours, minutes] = timeString.split(':');
        let hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !appointment) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Availability</h2>
                    <div className="text-red-500 mb-6">{error}</div>
                    {/* <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Create New Availability
                    </button> */}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Doctor Availability</h2>
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    {error}
                </div>
            )}
            
            {!isEditing ? (
                <>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-indigo-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Available From</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Available To</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Working Days</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {appointment?.doctor || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {appointment?.available_from ? formatTime(appointment.available_from) : 'Not set'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {appointment?.available_to ? formatTime(appointment.available_to) : 'Not set'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {appointment?.days_of_week?.length > 0 ? (
                                            <ul className="space-y-1">
                                                {appointment.days_of_week.map((day, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <span className="w-2 h-2 mr-2 bg-indigo-400 rounded-full"></span>
                                                        {day}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-gray-400">No days selected</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            {appointment ? 'Edit Working Hours' : 'Create Availability'}
                        </button>
                        {appointment && (
                            <button 
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className={`px-4 py-2 ${isDeleting ? 'bg-red-400' : 'bg-red-600'} text-white rounded-md hover:bg-red-700 transition-colors`}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">
                        {appointment ? 'Edit Working Hours' : 'Create New Availability'}
                    </h3>
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Available From
                                </label>
                                <input
                                    type="time"
                                    name="available_from"
                                    value={editData.available_from}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Available To
                                </label>
                                <input
                                    type="time"
                                    name="available_to"
                                    value={editData.available_to}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        {appointment?.days_of_week?.length > 0 && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fixed Working Days
                                </label>
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {appointment.days_of_week.map((day, index) => (
                                            <li key={index} className="flex items-center text-gray-700">
                                                <span className="w-2 h-2 mr-2 bg-indigo-400 rounded-full"></span>
                                                {day}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`px-4 py-2 ${isSaving ? 'bg-indigo-400' : 'bg-indigo-600'} text-white rounded-md hover:bg-indigo-700 transition-colors`}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default UpdateAppointments;