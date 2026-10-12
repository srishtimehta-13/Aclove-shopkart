import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../axiosCalls/axios";
import { AuthContext } from "./contexts";

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/customers/me");
      setCustomer(response.data.authenticatedCustomer || null);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Failed to load the current customer:", error);
      }
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchCustomer);
  }, [fetchCustomer]);

  const logout = async () => {
    try {
      await axiosInstance.post("/customers/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setCustomer(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        setCustomer,
        loading,
        logout,
        refetchCustomer: fetchCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
