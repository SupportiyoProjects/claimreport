import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [insuredData, setInsuredData] = useState(null);

  return (
    <FormContext.Provider value={{ insuredData, setInsuredData }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormData() {
  return useContext(FormContext);
}