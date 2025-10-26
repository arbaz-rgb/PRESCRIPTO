import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "$";
  const calculateAge = (dob) => {
    const today = new Date();
    const birtDate = new Date(dob);
    let age = today.getFullYear() - birtDate.getFullYear();
    return age;
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    // Ensure slotDate exists
    if (!slotDate) return "";

    // Split the date (expected format: YYYY-MM-DD)
    const dateArray = slotDate.split("_");

    const year = dateArray[0];
    const month = months[parseInt(dateArray[1], 10) - 1];
    const day = dateArray[2];
    return `${day} ${month} ${year}`;
  };

  const value = { calculateAge, slotDateFormat, currency };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
