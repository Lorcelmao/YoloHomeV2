"use client";

import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-poppins-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          className={`
            appearance-none block w-full px-3 py-2 border rounded-lg
            shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500
            transition duration-150 ease-in-out sm:text-sm sm:leading-5
            ${error ? 'border-red-300 text-red-900' : 'border-gray-300 text-gray-900'}
          `}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool
};

export default FormInput;
