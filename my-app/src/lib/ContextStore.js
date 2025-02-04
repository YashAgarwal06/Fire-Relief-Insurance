import React, { createContext, useState, useContext } from 'react';

// Create the Context
const ContextStore = createContext();

// Create a Provider component
export const ContextStoreProvider = ({ children }) => {
	const [ins_task_id, setins_task_id] = useState("");
  
	return (
	  <ContextStore.Provider value={{ ins_task_id, setins_task_id }}>
		{children}
	  </ContextStore.Provider>
	);
  };
// Create a custom hook to use the context more easily
export const useContextStore = () => useContext(ContextStore);
