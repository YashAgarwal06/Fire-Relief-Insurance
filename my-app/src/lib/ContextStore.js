import React, { createContext, useState, useContext } from 'react';

// Create the Context
const ContextStore = createContext();

// Create a Provider component
export const ContextStoreProvider = ({ children }) => {
	const [taskIds, setTaskIds] = useState({
		Home_Declaration: "",
		Health_Insurance_Private: "",
		Medicare: "",
		Car_Insurance: "",
	})

	return (
		<ContextStore.Provider value={{ taskIds, setTaskIds }}>
			{children}
		</ContextStore.Provider>
	);
};

// Create a custom hook to use the context more easily
export const useContextStore = () => useContext(ContextStore);
