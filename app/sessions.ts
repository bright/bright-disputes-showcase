import { createCookieSessionStorage } from "@remix-run/node";

export const accountSession = createCookieSessionStorage({
  cookie: {
    name: "__account_session",
    httpOnly: true,
    maxAge: 60,
    path: "/",
    sameSite: "lax",
    secrets: ["secrets"],
    secure: true,
  },
});

export const dataSession = createCookieSessionStorage({
  cookie: {
    name: "__data_session",
    httpOnly: true,
    maxAge: 60,
    path: "/",
    sameSite: "lax",
    secrets: ["secrets"],
    secure: true,
  },
});
