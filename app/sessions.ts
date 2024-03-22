import {createCookie, createCookieSessionStorage, createMemorySessionStorage} from "@remix-run/node";

export const accountSession = createCookieSessionStorage({
  cookie: {
    name: "__account_session",
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secrets: ["not-so-secret"],
    secure: true,
  },
});

export const dataSession =
  createMemorySessionStorage({
    cookie: createCookie("__data_session", {
      secrets: ["not-so-secret"],
      sameSite: true,
    }),
  });
