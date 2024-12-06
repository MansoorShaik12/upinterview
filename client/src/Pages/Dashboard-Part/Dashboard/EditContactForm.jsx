import React, { useState } from 'react';
import { IoArrowBack } from "react-icons/io5";
import axios from 'axios';
import { validateContactForm, getContactErrorMessage } from '../../../utils/ContactValidation.js';

const EditContactForm = ({ onClose, contact, onContactUpdated }) => {
    const [formData, setFormData] = useState(contact);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        const errorMessage = getContactErrorMessage(name, value);
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: errorMessage });
    };

    const handlePhoneInput = (e) => {
        const value = e.target.value;
        if (value.length <= 10) {
            handleChange(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { formIsValid, newErrors } = validateContactForm(formData);
        setErrors(newErrors);

        if (!formIsValid) {
            console.log("Form is not valid:", newErrors);
            return;
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/contact/${formData.id}`, formData);
            if (response.data) {
                onContactUpdated(response.data);
                onClose();
            }
        } catch (error) {
            console.error("Error updating contact:", error);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-15 z-50" >
                <div className="fixed inset-y-0 right-0 z-50 sm:w-full md:w-3/4 lg:w-1/2 xl:w-1/2 2xl:w-1/2 bg-white shadow-lg transition-transform duration-5000 transform">
                    <div className="fixed top-0 w-full bg-white border-b">
                        <div className="flex justify-between sm:justify-start items-center p-4">
                            <button onClick={onClose} className="focus:outline-none md:hidden lg:hidden xl:hidden 2xl:hidden sm:w-8">
                                <IoArrowBack className="text-2xl" />
                            </button>
                            <h2 className="text-lg font-bold">Edit Contact</h2>
                            <button type="button" onClick={onClose} className="focus:outline-none sm:hidden">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="fixed top-16 bottom-16 overflow-auto p-5 text-sm right-0 left-0">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3">
                                <div className="col-span-3 sm:mt-26">
                                    {/* Name */}
                                    <div className="flex gap-5 mb-5">
                                        <label htmlFor="Name" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex-grow">
                                            <input
                                                type="text"
                                                name="Name"
                                                id="Name"
                                                value={formData.Name}
                                                onChange={handleChange}
                                                className={`border-b focus:outline-none mb-5 w-full ${errors.Name ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                                            />
                                            {errors.Name && <p className="text-red-500 text-sm -mt-4">{errors.Name}</p>}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex gap-5 mb-5">
                                        <label htmlFor="Email" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex-grow">
                                            <input
                                                type="text"
                                                name="Email"
                                                id="Email"
                                                value={formData.Email}
                                                onChange={handleChange}
                                                className={`border-b focus:outline-none mb-5 w-full ${errors.Email ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                                            />
                                            {errors.Email && <p className="text-red-500 text-sm -mt-4">{errors.Email}</p>}
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex gap-5 mb-5">
                                        <label htmlFor="Phone" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                            Phone <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex-grow">
                                            <div className="flex">
                                                <select
                                                    name="CountryCode"
                                                    autoComplete="off"
                                                    id="CountryCode"
                                                    value={formData.CountryCode}
                                                    onChange={handleChange}
                                                    className="border-b focus:outline-none mb-5 w-1/4 mr-2"
                                                >
                                                    <option value="+91">+91</option>
                                                    <option value="+1">+1</option>
                                                    <option value="+44">+44</option>
                                                    <option value="+61">+61</option>
                                                    <option value="+971">+971</option>
                                                    <option value="+60">+60</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    name="Phone"
                                                    id="Phone"
                                                    value={formData.Phone}
                                                    onChange={handlePhoneInput}
                                                    autoComplete="off"
                                                    placeholder="xxx-xxx-xxxx"
                                                    className={`border-b focus:outline-none mb-5 w-full ${errors.Phone ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                                                />
                                            </div>
                                            {errors.Phone && <p className="text-red-500 text-sm -mt-4">{errors.Phone}</p>}
                                        </div>
                                    </div>

                                    {/* LinkedIn URL */}
                                    <div className="flex gap-5 mb-5">
                                        <label htmlFor="LinkedinUrl" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                            LinkedIn URL <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex-grow">
                                            <input
                                                type="text"
                                                name="LinkedinUrl"
                                                id="LinkedinUrl"
                                                value={formData.LinkedinUrl}
                                                onChange={handleChange}
                                                className={`border-b focus:outline-none mb-5 w-full ${errors.LinkedinUrl ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                                            />
                                            {errors.LinkedinUrl && <p className="text-red-500 text-sm -mt-4">{errors.LinkedinUrl}</p>}
                                        </div>
                                    </div>

                                    {/* Current Role */}
                                    <div className="flex gap-5 mb-5">
                                        <label htmlFor="CurrentRole" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                            Current Role <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex-grow">
                                            <input
                                                type="text"
                                                name="CurrentRole"
                                                id="CurrentRole"
                                                value={formData.CurrentRole}
                                                onChange={handleChange}
                                                className={`border-b focus:outline-none mb-5 w-full ${errors.CurrentRole ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                                            />
                                            {errors.CurrentRole && <p className="text-red-500 text-sm -mt-4">{errors.CurrentRole}</p>}
                                        </div>
                                    </div>

                                    {/* Industry */}
                                    <div className="flex gap-5 mb-5">
                                        <label htmlFor="industry" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                            Industry <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex-grow">
                                            <input
                                                type="text"
                                                name="industry"
                                                id="industry"
                                                value={formData.industry}
                                                onChange={handleChange}
                                                className={`border-b focus:outline-none mb-5 w-full ${errors.industry ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                                            />
                                            {errors.industry && <p className="text-red-500 text-sm -mt-4">{errors.industry}</p>}
                                        </div>
                                    </div>

                                    {/* Experience */}
                                    <div className="flex gap-5 mb-5">
                                        <label htmlFor="Experience" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                            Experience <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex-grow">
                                            <input
                                                type="text"
                                                name="Experience"
                                                id="Experience"
                                                value={formData.Experience}
                                                onChange={handleChange}
                                                className={`border-b focus:outline-none mb-5 w-full ${errors.Experience ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                                            />
                                            {errors.Experience && <p className="text-red-500 text-sm -mt-4">{errors.Experience}</p>}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="footer-buttons flex justify-end">
                                        <button type="submit" className="footer-button bg-custom-blue">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditContactForm; 