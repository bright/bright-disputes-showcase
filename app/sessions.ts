import {createCookie, createCookieSessionStorage, createMemorySessionStorage} from "@remix-run/node";

export const accountSession = createCookieSessionStorage({
  cookie: {
    name: "__account_session",
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secrets: ["@s:!M#x:TvzpDR,u$BiI*@"],
    secure: true,
  },
});

export const dataSession =
  createMemorySessionStorage({
    cookie: createCookie("__data_session", {
      secrets: ["t8KFPJt1k?3klm-|Ra"],
      sameSite: true,
    }),
  });
