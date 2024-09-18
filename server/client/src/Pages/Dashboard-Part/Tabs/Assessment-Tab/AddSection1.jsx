import React, { useState } from 'react';

const AddQuestion2 = React.forwardRef(({ isOpen, onClose, onOutsideClick, position, onSectionAdded, skills}, ref) => {

    const [isIntegrateClicked, setIsIntegrateClicked] = useState(false);
    const [isCustomizeClicked, setIsCustomizeClicked] = useState(false);
    const [sectionName, setSectionName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(null);

    const onIntegrateClick = (event) => {
        event.stopPropagation();
        setIsIntegrateClicked(true);
        setIsCustomizeClicked(false);
        setSectionName('');
    };
    
    const onCustomizeClick = (event) => {
        event.stopPropagation();
        setIsCustomizeClicked(true);
        setIsIntegrateClicked(false);
    };

    const handleAdd = () => {
        const category = isCustomizeClicked ? 'customize' : 'integrate';
        const data = {
            SectionName: isCustomizeClicked ? sectionName : selectedIcon,
            Category: category,
            Position: position,
        };
        onSectionAdded(data);
        onClose();
        // Reset form to default
        setIsIntegrateClicked(false);
        setIsCustomizeClicked(false);
        setSectionName('');
        setSelectedIcon(null);
    };

    const handleIconSelect = (name) => {
        setSelectedIcon(name);
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-15 z-50 ${isOpen ? 'visible' : 'invisible'}`}>
            <div onClick={onOutsideClick} className={`fixed inset-y-0 right-0 z-50 w-full bg-white shadow-lg transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="fixed top-0 w-full bg-white border-b z-50">
                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-lg font-bold">New Section</h2>
                        <button onClick={onClose} className="focus:outline-none">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="p-3 mt-10 overflow-auto">
                    <div className="flex justify-center">
                        <div className='text-center'>
                            <p className='text-center'>
                                <button onClick={onIntegrateClick} className="mt-6 text-white bg-gray-700 hover:bg-gray-800 focus:outline-none font-medium rounded text-sm py-2.5 me-2 mb-2" style={{ width: "300px" }}>
                                    Integrate
                                </button>
                                <p className='mb-2'>The system provides sections and questions</p>
                            </p>
                            <p>
                                <button onClick={onCustomizeClick} className="text-white bg-gray-700 hover:bg-gray-800 focus:outline-none font-medium rounded text-sm py-2.5 me-2 mb-2" style={{ width: "300px" }}>
                                    Customize
                                </button>
                                <p>You can create your own sections and questions</p>
                            </p>
                        </div>
                    </div>

                    <div className="mt-5">
                        {isIntegrateClicked && (
                            <div className="grid grid-cols-3 gap-4">
                                  {skills.map((skill, index) => (
                                <button
                                    key={index}
                                    onClick={() => {handleIconSelect(skill);}}
                                    className={`flex flex-col items-center justify-center p-1 border rounded shadow hover:bg-gray-100`} // Highlight selected section

                               >
                                    <span>{skill}</span>
                                </button>
                            ))}
                            </div>
                        )}
                        {isCustomizeClicked && (
                            <div className="mt-10 mx-10">
                                <div className="border p-3">
                                    <label htmlFor="section_name" className="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                        Section Name <span className="text-red-500 text-xl">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="section_name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                        value={sectionName}
                                        onChange={(e) => setSectionName(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="SaveAndScheduleButtons">
                        <div className="SaveAndScheduleButtons">
                            <button onClick={handleAdd} className="footer-button">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AddQuestion2;