import {useState} from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      // Support two call styles:
      // 1) hook initialized with `options` and then call `fn()` -> cb(options)
      // 2) hook initialized without options and call `fn(payload)` -> cb(payload)
      const hasOptions = options && Object.keys(options).length > 0;
      const response = hasOptions ? await cb(options, ...args) : await cb(...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {data, loading, error, fn};
};

export default useFetch;