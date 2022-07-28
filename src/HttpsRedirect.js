import { useEffect } from "react";

const UseRedirectToHttps = () => {
  let pathname = window.location.pathname;
  useEffect(() => {
    if (
      window.location.protocol !== "https:" &&
      process.env.NODE_ENV === "production"
    ) {
      window.location.replace(
        "https://nameless-wave-46063.herokuapp.com" + pathname
      );
    }
  }, []);
};

export default UseRedirectToHttps;
