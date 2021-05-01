import { useEffect, useState } from "react";

const API_PATH = process.env.REACT_APP_API_PATH || "https://en.splitviewer.com/api";

const cache = {};

function useQuery(url, useCache = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (useCache && cache[url]) {
      setData(cache[url]);
      setLoading(false);
    } else {
      setLoading(true);
      fetch(API_PATH + url, { method: "POST" })
        .then((res) => res.json())
        .then((res) => {
          cache[url] = res;
          setData(res);
        })
        .then(() => setLoading(false))
        .catch((err) => setError(err));
    }
  }, [url]);

  return { data, loading, error };
}

export default useQuery;
