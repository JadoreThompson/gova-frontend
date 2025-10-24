import { useEffect, useRef, useState, type ChangeEvent } from "react";

interface DebouncedInputProps {
  callback: (event: ChangeEvent<HTMLInputElement>) => void;
  delay?: number;
}

export const useDebouncedInput = (params: DebouncedInputProps) => {
  const [value, setValue] = useState("");
  const timeoutRef = useRef<number | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      params.callback(event);
    }, params.delay ?? 400);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    value,
    handleChange,
  };
};
