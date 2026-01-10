"use client";
import { useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const authInfo = localStorage.getItem("authInfo");

    if (authInfo) {
      try {
        const parsedCustomer = JSON.parse(authInfo);
        setCustomer(parsedCustomer);
      } catch (error) {
        console.error("Error parsing authInfo:", error);
        localStorage.removeItem("authInfo");
      }
    }
  }, []);

  const saveAuthInfo = (data) => {
    const authInfo = { token: data.token, data: data.data };
    setCustomer(authInfo);
    localStorage.setItem("authInfo", JSON.stringify(authInfo));
  };

  const handleLogout = () => {
    setCustomer(null);
    localStorage.removeItem("authInfo");
  };

  const authInfo = {
    customer,
    saveAuthInfo,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
