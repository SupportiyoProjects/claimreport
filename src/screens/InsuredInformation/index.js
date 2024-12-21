import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../../screens/context/index';
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

const validationSchema = Yup.object({
  insuredFirstName: Yup.string()
    .required('First name is required'),
  insuredLastName: Yup.string()
    .required('Last name is required'),
  propertyType: Yup.string()
    .required('Property type is required'),
  primaryPhone: Yup.string()
    .matches(/^[0-9-+() ]*$/, 'Invalid phone number')
    .required('Primary phone is required'),
  secondaryPhone: Yup.string()
    .matches(/^[0-9-+() ]*$/, 'Invalid phone number'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
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
    .required('Country is required'),
  isInspectionAtAddress: Yup.string()
    .required('Please specify if inspection will be at this address'),
  addPOC: Yup.boolean()
});

export default function InsuredInformation() {
  const navigate = useNavigate();
  const { setInsuredData } = useFormData();

  const initialValues = {
    insuredFirstName: '',
    insuredLastName: '',
    propertyType: '',
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    isInspectionAtAddress: '',
    addPOC: false,
    progress: '' // Progress field
  };

  const propertyTypes = [
    'Residential',
    'Commercial',
    'Vehicle'
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    setInsuredData(values); // Store the data in context
    navigate('/claim-details');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Insured Information</h1>
            <p className="mt-2 text-gray-600">Please provide the insured party's details</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              insuredFirstName: Yup.string().required('First name is required'),
              insuredLastName: Yup.string().required('Last name is required'),
              propertyType: Yup.string().required('Property type is required'),
              primaryPhone: Yup.string().required('Primary phone is required'),
              secondaryPhone: Yup.string(),
              email: Yup.string().email('Invalid email address').required('Email is required'),
              street: Yup.string().required('Street address is required'),
              city: Yup.string().required('City is required'),
              state: Yup.string().required('State is required'),
              zipCode: Yup.string().required('ZIP code is required'),
              isInspectionAtAddress: Yup.string().required('Please specify if inspection will be at this address'),
              progress: Yup.number()
                .min(0, 'Progress must be at least 0')
                .max(100, 'Progress must be at most 100')
                .required('Progress is required')
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insured First Name</label>
                    <Field
                      type="text"
                      name="insuredFirstName"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.insuredFirstName && touched.insuredFirstName
                        ? 'ring-red-300 focus:ring-red-500'
                        : 'ring-gray-300 focus:ring-indigo-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    />
                    {errors.insuredFirstName && touched.insuredFirstName && (
                      <div className="mt-1 text-sm text-red-600">{errors.insuredFirstName}</div>
                    )}
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insured Last Name</label>
                    <Field
                      type="text"
                      name="insuredLastName"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.insuredLastName && touched.insuredLastName
                        ? 'ring-red-300 focus:ring-red-500'
                        : 'ring-gray-300 focus:ring-indigo-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    />
                    {errors.insuredLastName && touched.insuredLastName && (
                      <div className="mt-1 text-sm text-red-600">{errors.insuredLastName}</div>
                    )}
                  </div>
                </div>

                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <Field name="location" type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <ErrorMessage name="location" component="div" className="text-red-600 text-sm" />

                {/* Property Type Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <Field as="select" name="propertyType" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm">
                    <option value="">Select Property Type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="propertyType" component="div" className="text-red-600 text-sm" />
                </div>

                {/* Phone Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Phone Number
                    </label>
                    <Field
                      type="tel"
                      name="primaryPhone"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.primaryPhone && touched.primaryPhone
                        ? 'ring-red-300 focus:ring-red-500'
                        : 'ring-gray-300 focus:ring-indigo-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    />
                    {errors.primaryPhone && touched.primaryPhone && (
                      <div className="mt-1 text-sm text-red-600">{errors.primaryPhone}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progress
                    </label>
                    <Field
                      as="textarea"
                      name="progress"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                      
                        'ring-gray-300 focus:ring-indigo-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Phone Number
                    </label>
                    <Field
                      type="tel"
                      name="secondaryPhone"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.secondaryPhone && touched.secondaryPhone
                        ? 'ring-red-300 focus:ring-red-500'
                        : 'ring-gray-300 focus:ring-indigo-600'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    />
                    {errors.secondaryPhone && touched.secondaryPhone && (
                      <div className="mt-1 text-sm text-red-600">{errors.secondaryPhone}</div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.email && touched.email
                      ? 'ring-red-300 focus:ring-red-500'
                      : 'ring-gray-300 focus:ring-indigo-600'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  />
                  {errors.email && touched.email && (
                    <div className="mt-1 text-sm text-red-600">{errors.email}</div>
                  )}
                </div>

                {/* Address Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>  
                    <Field
                      as="textarea"
                      name="street"
                      rows="2"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.street && touched.street
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
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.city && touched.city
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
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.state && touched.state
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
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.zipCode && touched.zipCode
                          ? 'ring-red-300 focus:ring-red-500'
                          : 'ring-gray-300 focus:ring-indigo-600'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                      />
                      {errors.zipCode && touched.zipCode && (
                        <div className="mt-1 text-sm text-red-600">{errors.zipCode}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inspection Location Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Is the inspection going to take place at the address above?
                  </label>
                  <Field
                    as="select"
                    name="isInspectionAtAddress"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.isInspectionAtAddress && touched.isInspectionAtAddress
                      ? 'ring-red-300 focus:ring-red-500'
                      : 'ring-gray-300 focus:ring-indigo-600'
                      } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  >
                    <option value="">Choose one...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Field>
                  {errors.isInspectionAtAddress && touched.isInspectionAtAddress && (
                    <div className="mt-1 text-sm text-red-600">{errors.isInspectionAtAddress}</div>
                  )}
                </div>

                {/* Point of Contact Toggle */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <Field
                      type="checkbox"
                      name="addPOC"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700">Add point of contact (POC)?</span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                  >
                    {'Next'}
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