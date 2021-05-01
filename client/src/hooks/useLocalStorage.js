import { useCallback, useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);

  const updateLocalStorage = useCallback(
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    },
    [key]
  );

  useEffect(() => {
    const ls = localStorage.getItem(key);
    if (ls) setValue(JSON.parse(ls));
    else localStorage.setItem(key, initialValue);
  }, [key]);

  return [value, updateLocalStorage];
}

export default useLocalStorage;
