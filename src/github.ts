import fetch from "node-fetch";

type GITHUB_CREDENTIALS = {
  client_id: string;
  client_secret: string;
  code: string;
};

const requestGithubToken = (credentials: GITHUB_CREDENTIALS) => {
  return fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(JSON.stringify(error));
    });
};

const requestGithubUserAccount = (token: string) => {
  return fetch(`https://api.github.com/user`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    console.log(res);
    return res.json();
  });
};

export const authorizeWithGithub = async (credentials: GITHUB_CREDENTIALS) => {
  const tokenResponse = await requestGithubToken(credentials);
  const { access_token } = tokenResponse;
  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
};
