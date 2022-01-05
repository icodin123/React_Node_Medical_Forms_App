import Cookies from "js-cookie";

export const getAccessToken = () => Cookies.get("access_token");
export const getUsername = () => Cookies.get("username");

export const authenticate = async (username, password) => {
  let accessToken = getAccessToken();
  let isAuthenticated = accessToken != null;
  let error = "";

  console.log("authenticated: ", isAuthenticated);

  // If we did not find an access token, then attempt to login
  if (!isAuthenticated && username && password) {
    const res = await authenticateUser(username, password);

    if (res.status === 200 && res.access_token) {
      // If login is successful, we store an access token for some time duration
      const expires = (res.expires_in || 60 * 60) * 1000;
      const inOneHour = new Date(new Date().getTime() + expires);

      Cookies.set("access_token", res.access_token, { expires: inOneHour });
      Cookies.set("username", username, { expires: inOneHour });

      isAuthenticated = true;
    } else {
      isAuthenticated = false;
      console.log("Error", res);
    }
  }

  return {
    isAuthenticated: isAuthenticated,
    username: username,
    access_token: accessToken,
    error: error,
  };
};

// this function now returns a promise
const authenticateUser = async (username, password) => {
  const url = "http://localhost:8080/login";

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "post",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await fetch(request);

  console.log(res);

  if (res.status != 200) {
    alert("Unable to log in. Please check your username and password.");
    return { access_token: null, status: res.status, error: "cannot log in" };
  }

  const data = await res.json();
  return { access_token: data.token, status: res.status, error: data.message };
};

export default authenticate;
