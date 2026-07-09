import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

interface KeyboardDoneBarContextValue {
  claim: (id: string) => void;
  release: (id: string) => void;
  activeId: string | null;
  isManaged: boolean;
}

/**
 * Fail-open default: anything rendered outside the provider keeps the old
 * "always show while keyboard is visible" behavior instead of being hidden.
 */
const defaultValue: KeyboardDoneBarContextValue = {
  claim: () => {},
  release: () => {},
  activeId: null,
  isManaged: false,
};

const KeyboardDoneBarContext = createContext<KeyboardDoneBarContextValue>(defaultValue);

export const KeyboardDoneBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stackRef = useRef<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const claim = useCallback((id: string) => {
    stackRef.current = stackRef.current.filter((existing) => existing !== id);
    stackRef.current.push(id);
    setActiveId(id);
  }, []);

  const release = useCallback((id: string) => {
    stackRef.current = stackRef.current.filter((existing) => existing !== id);
    setActiveId(stackRef.current[stackRef.current.length - 1] ?? null);
  }, []);

  return (
    <KeyboardDoneBarContext.Provider value={{ claim, release, activeId, isManaged: true }}>
      {children}
    </KeyboardDoneBarContext.Provider>
  );
};

export const useKeyboardDoneBarClaim = (): KeyboardDoneBarContextValue =>
  useContext(KeyboardDoneBarContext);
