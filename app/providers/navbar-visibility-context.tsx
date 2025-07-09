import React, { createContext, useContext, useState } from "react";

interface NavbarVisibilityContextType {
  isNavbarVisible: boolean;
  setIsNavbarVisible: (visible: boolean) => void;
}

const NavbarVisibilityContext = createContext<
  NavbarVisibilityContextType | undefined
>(undefined);

export const NavbarVisibilityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  return (
    <NavbarVisibilityContext.Provider
      value={{ isNavbarVisible, setIsNavbarVisible }}
    >
      {children}
    </NavbarVisibilityContext.Provider>
  );
};

export const useNavbarVisibility = () => {
  const context = useContext(NavbarVisibilityContext);
  if (!context) {
    throw new Error(
      "useNavbarVisibility must be used within a NavbarVisibilityProvider"
    );
  }
  return context;
};
