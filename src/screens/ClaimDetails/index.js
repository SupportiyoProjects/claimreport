import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import insertClientData from "../../utils/mongodb";
import { useFormData } from '../context/index';

const validationSchema = Yup.object({
  claimNumber: Yup.string().required('Claim number is required'),
  dateOfLoss: Yup.date().required('Date of loss is required'),
  typeOfLoss: Yup.string().required('Type of loss is required'),
  lossDescription: Yup.string().required('Loss description is required'),
  carrierEmail: Yup.string().email('Invalid email address'),
  clientInstructions: Yup.string(),
  addBillingContact: Yup.boolean(),
  specialInstructions: Yup.object().shape({
    insuredIsTaxExempt: Yup.boolean(),
    insuredIsSpanishSpeaking: Yup.boolean(),
    scheduleWithPA: Yup.boolean(),
    scheduleWithAttorney: Yup.boolean(),
    scheduleWithContractor: Yup.boolean(),
    meetAdjusterOnsite: Yup.boolean(),
    multipleProperties: Yup.boolean(),
    doNotContactInsured: Yup.boolean()
  })
});

export default function ClaimDetails() {
  const { insuredData } = useFormData();
  const initialValues = {
    claimNumber: '',
    dateOfLoss: '',
    typeOfLoss: '',
    lossDescription: '',
    carrierEmail: '',
    clientInstructions: '',
    addBillingContact: false,
    specialInstructions: {
      insuredIsTaxExempt: false,
      insuredIsSpanishSpeaking: false,
      scheduleWithPA: false,
      scheduleWithAttorney: false,
      scheduleWithContractor: false,
      meetAdjusterOnsite: false,
      multipleProperties: false,
      doNotContactInsured: false
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Combine both forms' data
      console.log(insuredData);
      console.log(values);
      const combinedData = {
        insured: insuredData,
        claim: values
      };

      await insertClientData(combinedData);
      console.log('Data submitted successfully');
      // You might want to navigate to a success page or show a success message
    } catch (error) {
      console.error('Error submitting data:', error);
      // Handle error (show error message to user)
    } finally {
      setSubmitting(false);
    }
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Claim Details</h1>
            <p className="mt-2 text-gray-600">Please provide the claim information</p>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="claimNumber" className="block text-sm font-medium text-gray-700">Claim Number</label>
                  <Field name="claimNumber" type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                  <ErrorMessage name="claimNumber" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label htmlFor="dateOfLoss" className="block text-sm font-medium text-gray-700">Date of Loss</label>
                  <Field name="dateOfLoss" type="date" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                  <ErrorMessage name="dateOfLoss" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label htmlFor="typeOfLoss" className="block text-sm font-medium text-gray-700">Type of Loss</label>
                  <Field name="typeOfLoss" type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                  <ErrorMessage name="typeOfLoss" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label htmlFor="lossDescription" className="block text-sm font-medium text-gray-700">Loss Description</label>
                  <Field name="lossDescription" as="textarea" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                  <ErrorMessage name="lossDescription" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label htmlFor="carrierEmail" className="block text-sm font-medium text-gray-700">Carrier Email</label>
                  <Field name="carrierEmail" type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                  <ErrorMessage name="carrierEmail" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label htmlFor="clientInstructions" className="block text-sm font-medium text-gray-700">Client Instructions</label>
                  <Field name="clientInstructions" as="textarea" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
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
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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