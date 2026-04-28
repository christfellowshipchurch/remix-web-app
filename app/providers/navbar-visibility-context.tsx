import React, { createContext, useContext, useState } from 'react';

interface NavbarVisibilityContextType {
  isNavbarVisible: boolean;
  setIsNavbarVisible: (visible: boolean) => void;
  /** True when the global site banner (below nav) is visible — affects sticky `top` offsets. */
  isSiteBannerVisible: boolean;
  setIsSiteBannerVisible: (visible: boolean) => void;
}

const NavbarVisibilityContext = createContext<
  NavbarVisibilityContextType | undefined
>(undefined);

export const NavbarVisibilityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isSiteBannerVisible, setIsSiteBannerVisible] = useState(false);
  return (
    <NavbarVisibilityContext.Provider
      value={{
        isNavbarVisible,
        setIsNavbarVisible,
        isSiteBannerVisible,
        setIsSiteBannerVisible,
      }}
    >
      {children}
    </NavbarVisibilityContext.Provider>
  );
};

export const useNavbarVisibility = () => {
  const context = useContext(NavbarVisibilityContext);
  if (!context) {
    throw new Error(
      'useNavbarVisibility must be used within a NavbarVisibilityProvider',
    );
  }
  return context;
};
