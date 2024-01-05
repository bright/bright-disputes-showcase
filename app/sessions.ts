import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60,
    path: "/",
    sameSite: "lax",
    secrets: ["secrets"],
    secure: true,
  },
});

export { getSession, commitSession };
