import React from 'react'

const AssessmentSubmit = () => {
    return (
        <div>
            <div className="relative bg-white">
                <div className="mx-auto">
                    <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 px-10">
                        <div className="flex items-center">
                            <p className="text-2xl font-bold">Logo</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='ml-28'>
                <div>
                    <p className='text-xl font-semibold mt-5'>Thank You!</p>
                    <p className='mt-5 text-xs'>Thank you for completing the [Name of the Assessment]! </p>
                    <p className='mt-1 text-xs'>Your responses have been successfully submitted. We appreciate the time and effort you took to participate.</p>
                    <p className='text-xl font-semibold mt-14 '>Contact Us:</p>
                    <p className='mt-5 text-xs'>If you have any questions or need further assistance, please don't hesitate to contact us at [support email/phone number].</p>
                </div>
            </div>
        </div>
    );
}

export default AssessmentSubmit