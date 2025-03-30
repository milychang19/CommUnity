"use client"

import React, { useState } from 'react';

const CitySuggestionForm = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // User Information
    gender: '',
    genderOther: '',
    ageRange: '',
    raceEthnicity: [],
    raceEthnicityOther: '',
    citizenshipStatus: '',
    disabilities: [],
    disabilitiesOther: '',
    
    // Issue Details
    issueType: '',
    issueTypeOther: '',
    province: '',
    city: '',
    issueDescription: '',
    
    // Impact
    impactLevel: '',
    improvementSuggestions: '',
    
    // Consent and Privacy
    privacyAgreement: false,
    anonymousSubmission: false
  });

  // Canadian provinces and territories
  const provinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon"
  ];

  // Cities by province (sample data - not comprehensive)
  const citiesByProvince = {
    "Alberta": ["Calgary", "Edmonton", "Lethbridge", "Red Deer", "Medicine Hat", "Fort McMurray"],
    "British Columbia": ["Vancouver", "Victoria", "Kelowna", "Nanaimo", "Kamloops", "Prince George"],
    "Manitoba": ["Winnipeg", "Brandon", "Thompson", "Steinbach", "Portage la Prairie"],
    "New Brunswick": ["Fredericton", "Moncton", "Saint John", "Miramichi", "Edmundston"],
    "Newfoundland and Labrador": ["St. John's", "Mount Pearl", "Corner Brook", "Grand Falls-Windsor"],
    "Northwest Territories": ["Yellowknife", "Hay River", "Inuvik", "Fort Smith"],
    "Nova Scotia": ["Halifax", "Dartmouth", "Sydney", "Truro", "New Glasgow"],
    "Nunavut": ["Iqaluit", "Arviat", "Rankin Inlet", "Baker Lake"],
    "Ontario": ["Toronto", "Ottawa", "Mississauga", "Hamilton", "London", "Windsor", "Kitchener"],
    "Prince Edward Island": ["Charlottetown", "Summerside", "Stratford", "Cornwall"],
    "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Sherbrooke", "Trois-Rivières"],
    "Saskatchewan": ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current"],
    "Yukon": ["Whitehorse", "Dawson", "Watson Lake", "Haines Junction"]
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    
    if (type === 'checkbox') {
      if (name === 'privacyAgreement' || name === 'anonymousSubmission') {
        setFormData({ ...formData, [name]: checked });
      } else {
        // Handle multiple checkboxes (disabilities, raceEthnicity)
        const updatedArray = [...formData[name]];
        if (checked) {
          updatedArray.push(value);
        } else {
          const index = updatedArray.indexOf(value);
          if (index > -1) {
            updatedArray.splice(index, 1);
          }
        }
        setFormData({ ...formData, [name]: updatedArray });
      }
    } else {
      // For province changes, reset city selection
      if (name === 'province') {
        setFormData({ ...formData, [name]: value, city: '' });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  // Validate current section before moving to the next
  const validateSection = (sectionIndex) => {
    const newErrors = {};
    
    if (sectionIndex === 0) {
      // Validate User Information section
      if (!formData.gender) newErrors.gender = 'Please select your gender';
      if (formData.gender === 'other' && !formData.genderOther) newErrors.genderOther = 'Please specify your gender';
      if (!formData.ageRange) newErrors.ageRange = 'Please select your age range';
      if (!formData.citizenshipStatus) newErrors.citizenshipStatus = 'Please select your citizenship status';
    } 
    else if (sectionIndex === 1) {
      // Validate Issue Details section
      if (!formData.issueType) newErrors.issueType = 'Please select an issue type';
      if (formData.issueType === 'other' && !formData.issueTypeOther) newErrors.issueTypeOther = 'Please specify the issue type';
      if (!formData.province) newErrors.province = 'Please select a province';
      if (!formData.city) newErrors.city = 'Please select a city';
      if (!formData.issueDescription || formData.issueDescription.trim() === '') {
        newErrors.issueDescription = 'Please provide a description of the issue';
      }
    } 
    else if (sectionIndex === 2) {
      // Validate Impact section
      if (!formData.impactLevel) newErrors.impactLevel = 'Please select the impact level';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection) && currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSectionChange = (index) => {
    // Only allow changing sections if current section is valid or going backward
    if (index < currentSection || validateSection(currentSection)) {
      setCurrentSection(index);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    console.log(formData);  // Log form data to check its structure before submission
    e.preventDefault();
  
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Ensure you're sending formData here
      });
  
      if (!response.ok) {
        console.error('Error response:', response);
        const errorText = await response.text();
        console.error('Error response text:', errorText);
      } else {
        const result = await response.json();
        console.log('Success:', result);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred: ' + error.message);
    }
  };
  
  

  const sections = [
    {
      title: "User Information",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${errors.gender ? 'border-red-500' : ''}`}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            
            {formData.gender === 'other' && (
              <div className="mt-2">
                <input
                  type="text"
                  name="genderOther"
                  value={formData.genderOther}
                  onChange={handleInputChange}
                  placeholder="Please specify"
                  className={`w-full p-2 border rounded-md ${errors.genderOther ? 'border-red-500' : ''}`}
                />
                {errors.genderOther && <p className="text-red-500 text-xs mt-1">{errors.genderOther}</p>}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Age Range <span className="text-red-500">*</span>
            </label>
            <select 
              name="ageRange" 
              value={formData.ageRange} 
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${errors.ageRange ? 'border-red-500' : ''}`}
            >
              <option value="">Select your age range</option>
              <option value="under-18">Under 18</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55-64">55-64</option>
              <option value="65-plus">65+</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {errors.ageRange && <p className="text-red-500 text-xs mt-1">{errors.ageRange}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Race/Ethnicity (select all that apply)</label>
            <div className="space-y-2">
              {['American Indian or Alaska Native', 'Asian', 'Black or African American', 
                'Hispanic or Latino', 'Native Hawaiian or Pacific Islander', 'White', 
                'Prefer not to say', 'Other'].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`race-${option}`}
                    name="raceEthnicity"
                    value={option}
                    checked={formData.raceEthnicity.includes(option)}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor={`race-${option}`}>{option}</label>
                </div>
              ))}
            </div>
            {formData.raceEthnicity.includes('Other') && (
              <input
                type="text"
                name="raceEthnicityOther"
                value={formData.raceEthnicityOther}
                onChange={handleInputChange}
                placeholder="Please specify"
                className="w-full mt-2 p-2 border rounded-md"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Citizenship Status <span className="text-red-500">*</span>
            </label>
            <select 
              name="citizenshipStatus" 
              value={formData.citizenshipStatus} 
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${errors.citizenshipStatus ? 'border-red-500' : ''}`}
            >
              <option value="">Select your citizenship status</option>
              <option value="citizen">Citizen</option>
              <option value="permanent-resident">Permanent Resident</option>
              <option value="immigrant">Immigrant</option>
              <option value="refugee">Refugee</option>
              <option value="visa-holder">Visa Holder</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="other">Other</option>
            </select>
            {errors.citizenshipStatus && <p className="text-red-500 text-xs mt-1">{errors.citizenshipStatus}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Disabilities (select all that apply)</label>
            <div className="space-y-2">
              {['Mobility', 'Vision', 'Hearing', 'Cognitive', 'Mental Health', 
                'None', 'Prefer not to say', 'Other'].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`disability-${option}`}
                    name="disabilities"
                    value={option}
                    checked={formData.disabilities.includes(option)}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor={`disability-${option}`}>{option}</label>
                </div>
              ))}
            </div>
            {formData.disabilities.includes('Other') && (
              <input
                type="text"
                name="disabilitiesOther"
                value={formData.disabilitiesOther}
                onChange={handleInputChange}
                placeholder="Please specify"
                className="w-full mt-2 p-2 border rounded-md"
              />
            )}
          </div>
        </div>
      )
    },
    {
      title: "Issue Details",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Issue Type <span className="text-red-500">*</span>
            </label>
            <select 
              name="issueType" 
              value={formData.issueType} 
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${errors.issueType ? 'border-red-500' : ''}`}
            >
              <option value="">Select issue type</option>
              <option value="affordable-housing">Affordable Housing</option>
              <option value="public-transportation">Public Transportation</option>
              <option value="community-safety">Community Safety</option>
              <option value="accessibility">Accessibility</option>
              <option value="healthcare">Healthcare</option>
              <option value="employment">Employment</option>
              <option value="education">Education</option>
              <option value="environment">Environment</option>
              <option value="other">Other</option>
            </select>
            {errors.issueType && <p className="text-red-500 text-xs mt-1">{errors.issueType}</p>}
            
            {formData.issueType === 'other' && (
              <div className="mt-2">
                <input
                  type="text"
                  name="issueTypeOther"
                  value={formData.issueTypeOther}
                  onChange={handleInputChange}
                  placeholder="Please specify"
                  className={`w-full p-2 border rounded-md ${errors.issueTypeOther ? 'border-red-500' : ''}`}
                />
                {errors.issueTypeOther && <p className="text-red-500 text-xs mt-1">{errors.issueTypeOther}</p>}
              </div>
            )}
          </div>

          {/* Location Selection - Province and City */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Province <span className="text-red-500">*</span>
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${errors.province ? 'border-red-500' : ''}`}
              >
                <option value="">Select a province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!formData.province}
                className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : ''} ${!formData.province ? 'bg-gray-100' : ''}`}
              >
                <option value="">
                  {formData.province ? "Select a city" : "Select a province first"}
                </option>
                {formData.province &&
                  citiesByProvince[formData.province].map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="issueDescription"
              value={formData.issueDescription}
              onChange={handleInputChange}
              rows="6"
              placeholder="Please describe the specific problem, concern, or suggestion in detail..."
              className={`w-full p-2 border rounded-md ${errors.issueDescription ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.issueDescription && <p className="text-red-500 text-xs mt-1">{errors.issueDescription}</p>}
          </div>
        </div>
      )
    },
    {
      title: "Impact",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Impact on Daily Life <span className="text-red-500">*</span>
            </label>
            <div className={`space-y-2 ${errors.impactLevel ? 'border border-red-500 p-2 rounded-md' : ''}`}>
              {['Mild Impact', 'Moderate Impact', 'Severe Impact'].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    id={`impact-${option}`}
                    name="impactLevel"
                    value={option}
                    checked={formData.impactLevel === option}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor={`impact-${option}`}>{option}</label>
                </div>
              ))}
            </div>
            {errors.impactLevel && <p className="text-red-500 text-xs mt-1">{errors.impactLevel}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Suggestions for Improvement</label>
            <textarea
              name="improvementSuggestions"
              value={formData.improvementSuggestions}
              onChange={handleInputChange}
              rows="6"
              placeholder="Please share your ideas on how this issue can be addressed or improved..."
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>
        </div>
      )
    },
    {
      title: "Consent and Privacy",
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm mb-4">
              We value your privacy and want to be transparent about how we use the information you provide. 
              Your feedback helps us make our city more inclusive and accessible for everyone.
            </p>
          </div>
          
          <div className={`flex items-start ${errors.privacyAgreement ? 'border border-red-500 p-2 rounded-md' : ''}`}>
            <input
              type="checkbox"
              id="privacy-agreement"
              name="privacyAgreement"
              checked={formData.privacyAgreement}
              onChange={handleInputChange}
              className="mt-1 mr-2"
            />
            <label htmlFor="privacy-agreement" className="text-sm">
              I understand and agree that the information I provide will be used by the city to address community concerns 
              and improve services. Personal information will be handled according to the city's privacy policy.
              <span className="text-red-500"> *</span>
            </label>
          </div>
          {errors.privacyAgreement && <p className="text-red-500 text-xs mt-1">{errors.privacyAgreement}</p>}

          <div className="flex items-start">
            <input
              type="checkbox"
              id="anonymous-submission"
              name="anonymousSubmission"
              checked={formData.anonymousSubmission}
              onChange={handleInputChange}
              className="mt-1 mr-2"
            />
            <label htmlFor="anonymous-submission" className="text-sm">
              I would like to submit this form anonymously. (If checked, your personal information will not be stored with your feedback.)
            </label>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-8">
      <div className="w-1/2 mx-auto p-6 bg-white rounded-xl shadow-2xl">

        <h1 className="text-2xl font-bold mb-6 text-center">City Improvement Suggestion Form</h1>
        
        {/* Required fields legend */}
        <div className="text-sm text-gray-600 mb-4 flex items-center">
          <span className="text-red-500 mr-1">*</span> Required fields
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {sections.map((section, index) => (
              <button 
                key={index}
                onClick={() => handleSectionChange(index)}
                className={`text-sm font-medium ${
                  currentSection === index 
                    ? 'text-blue-600' 
                    : index < currentSection 
                      ? 'text-gray-500 hover:text-blue-500' 
                      : 'text-gray-400'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{sections[currentSection].title}</h2>
            {sections[currentSection].content}
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className={`px-4 py-2 rounded-full transition duration-300 ${currentSection === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
            >
              Previous
            </button>
            
            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!formData.privacyAgreement}
                className={`px-4 py-2 rounded-full transition duration-300 ${!formData.privacyAgreement ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitySuggestionForm;