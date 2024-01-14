import React, { createContext, useContext, useState } from 'react';

const ValueContext = createContext();

export function ValueContextProvider({ children }) {
  const [value, setValue] = useState(null);

  return (
    <ValueContext.Provider value={{ value, setValue }}>
      {children}
    </ValueContext.Provider>
  );
}

export function useValueContext() {
  return useContext(ValueContext);
}
