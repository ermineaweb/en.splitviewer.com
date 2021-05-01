import { useState, useEffect } from "react";

function useDebounce({ value, delay = 400 }) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeOut);
  }, [value]);

  return { debouncedValue };
}

export default useDebounce;
