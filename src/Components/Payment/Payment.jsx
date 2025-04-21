import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axiosInstance from '../Axiosinstance';
import toast from 'react-hot-toast';

function Payment() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const doctor_id = localStorage.getItem('doctor_id');
    const ConfirmationObject = {
        appointment_date: localStorage.getItem('appointment_date'),
        appointment_time: localStorage.getItem('appointment_time'),
    };

    const formik = useFormik({
        initialValues: {
            cardNumber: '',
            id: ''
        },
        validationSchema: yup.object({
            cardNumber: yup
                .string()
                .required('Card number is required')
                .min(16, 'Card number must be 16 characters')
                .max(16, 'Card number must be 16 characters'),
            id: yup.string().required('ID is required')
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setErrorMessage(''); // clear old errors
                const response = await axiosInstance.post(`patient_panal_appointments/${values.id}/simulate_payment/`, { ConfirmationObject });
                console.log(response.data);
                toast.success('Successful Payment! Your appointment is confirmed');
                formik.resetForm();
            } catch (error) {
                console.log(error);
                if (error?.response?.data?.message) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    Payment Information
                </h2>

                {/* Show error message */}
                {errorMessage && (
                    <p className="text-red-600 text-center font-medium mb-4">{errorMessage}</p>
                )}

                <div className="mb-4">
                    <label htmlFor="cardNumber" className="block mb-1 text-gray-700 font-medium">
                        Card Number
                    </label>
                    <input
                        type="text"
                        name="cardNumber"
                        id="cardNumber"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.cardNumber}
                        placeholder="Enter Card Number, 16 digits"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.cardNumber && formik.errors.cardNumber
                            ? 'border-red-500 focus:ring-red-300'
                            : 'border-gray-300 focus:ring-blue-300'
                            }`}
                    />
                    {formik.touched.cardNumber && formik.errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.cardNumber}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="id" className="block mb-1 text-gray-700 font-medium">
                        ID
                    </label>
                    <input
                        type="text"
                        name="id"
                        id="id"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.id}
                        placeholder="Enter ID"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.id && formik.errors.id
                            ? 'border-red-500 focus:ring-red-300'
                            : 'border-gray-300 focus:ring-blue-300'
                            }`}
                    />
                    {formik.touched.id && formik.errors.id && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.id}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    {loading ? 'Loading...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
}

export default Payment;
