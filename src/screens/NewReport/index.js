import React from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
// import Navbar from '../../components/layout/navbar';
import { useNavigate } from 'react-router-dom';

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Last name is required'),
  phone: Yup.string()
    .matches(/^[0-9-+() ]*$/, 'Invalid phone number')
    .required('Phone number is required'),
  companyName: Yup.string()
    .required('Company name is required'),
  street: Yup.string()
    .required('Street address is required'),
  city: Yup.string()
    .required('City is required'),
  state: Yup.string()
    .required('State is required'),
  zipCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
    .required('ZIP code is required'),
  country: Yup.string()
    .required('Country is required')
});

export default function NewReport() {
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    isIndependentAdjuster: false,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/insured-information');
    }, 1000);
  };

    return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">New Claim Report</h1>
            <p className="mt-2 text-gray-600">Please enter your information below to submit a new claim.</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Email Search Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Field
                        type="email"
                        name="email"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors.email && touched.email
                            ? 'ring-red-300 focus:ring-red-500'
                            : 'ring-gray-300 focus:ring-indigo-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                        placeholder="Enter your email"
                      />
                      {errors.email && touched.email && (
                        <div className="mt-1 text-sm text-red-600">{errors.email}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                        errors.firstName && touched.firstName
                          ? 'ring-red-300 focus:ring-red-500'
                          : 'ring-gray-300 focus:ring-indigo-600'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    />
                    {errors.firstName && touched.firstName && (
                      <div className="mt-1 text-sm text-red-600">{errors.firstName}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Field
                      type="text"
                      name="lastName"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                        errors.lastName && touched.lastName
                          ? 'ring-red-300 focus:ring-red-500'
                          : 'ring-gray-300 focus:ring-indigo-600'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    />
                    {errors.lastName && touched.lastName && (
                      <div className="mt-1 text-sm text-red-600">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Field
                      type="tel"
                      name="phone"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                        errors.phone && touched.phone
                          ? 'ring-red-300 focus:ring-red-500'
                          : 'ring-gray-300 focus:ring-indigo-600'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    />
                    {errors.phone && touched.phone && (
                      <div className="mt-1 text-sm text-red-600">{errors.phone}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <Field
                      type="text"
                      name="companyName"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                        errors.companyName && touched.companyName
                          ? 'ring-red-300 focus:ring-red-500'
                          : 'ring-gray-300 focus:ring-indigo-600'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    />
                    {errors.companyName && touched.companyName && (
                      <div className="mt-1 text-sm text-red-600">{errors.companyName}</div>
                    )}
                  </div>
                </div>

                {/* Independent Adjuster Toggle */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <Field
                      type="checkbox"
                      name="isIndependentAdjuster"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700">Independent Adjuster</span>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <Field
                      as="textarea"
                      name="street"
                      rows="2"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                        errors.street && touched.street
                          ? 'ring-red-300 focus:ring-red-500'
                          : 'ring-gray-300 focus:ring-indigo-600'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    />
                    {errors.street && touched.street && (
                      <div className="mt-1 text-sm text-red-600">{errors.street}</div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <Field
                        type="text"
                        name="city"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors.city && touched.city
                            ? 'ring-red-300 focus:ring-red-500'
                            : 'ring-gray-300 focus:ring-indigo-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                      />
                      {errors.city && touched.city && (
                        <div className="mt-1 text-sm text-red-600">{errors.city}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <Field
                        as="select"
                        name="state"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors.state && touched.state
                            ? 'ring-red-300 focus:ring-red-500'
                            : 'ring-gray-300 focus:ring-indigo-600'
                        } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                      >
                        <option value="">State</option>
                        {US_STATES.map(state => (
                          <option key={state.code} value={state.code} title={state.name}>
                            {state.code}
                          </option>
                        ))}
                      </Field>
                      {errors.state && touched.state && (
                        <div className="mt-1 text-sm text-red-600">{errors.state}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <Field
                        type="text"
                        name="zipCode"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors.zipCode && touched.zipCode
                            ? 'ring-red-300 focus:ring-red-500'
                            : 'ring-gray-300 focus:ring-indigo-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                      />
                      {errors.zipCode && touched.zipCode && (
                        <div className="mt-1 text-sm text-red-600">{errors.zipCode}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <Field
                        as="select"
                        name="country"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors.country && touched.country
                            ? 'ring-red-300 focus:ring-red-500'
                            : 'ring-gray-300 focus:ring-indigo-600'
                        } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="MX">Mexico</option>
                      </Field>
                      {errors.country && touched.country && (
                        <div className="mt-1 text-sm text-red-600">{errors.country}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="button"
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Continue'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
}
