import { createContext, useState } from "react";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");

  return (
    <DoctorContext.Provider value={{ dToken, setDToken }}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
