"use server";

import { headers } from "next/headers";

export const usePost = <T>(url: string, { arg }: { arg: T }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const URI = `${BASE_URL}/${url}`;
  const HEADERS = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "Content-Security-Policy": `${headers().get("Content-Security-Policy")}`,
      Authorization: `${headers().get("Authorization")}`,
    },
  };
  return fetch(`${URI}`, {
    method: "POST",
    body: JSON.stringify(arg),
    ...HEADERS,
  }).then((res) => {
    return res.json();
  });
};

export const usePostFile = (url: string, { arg }: { arg: FormData }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const URI = `${BASE_URL}/${url}`;
  const HEADERS = {
    headers: {
      accept: "application/json",
    },
  };
  return fetch(`${URI}`, {
    method: "POST",
    body: arg,
    ...HEADERS,
  }).then((res) => {
    return res.json();
  });
};

export const useGet = (url: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const URI = `${BASE_URL}/${url}`;
  const HEADERS = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "Content-Security-Policy": `${headers().get("Content-Security-Policy")}`,
      Authorization: `${headers().get("Authorization")}`,
    },
  };
  return fetch(`${URI}`, {
    method: "GET",
    ...HEADERS,
  }).then((res) => res.json());
};

export const usePut = <T>(url: string, { arg }: { arg: T }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const URI = `${BASE_URL}/${url}`;
  const HEADERS = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "Content-Security-Policy": `${headers().get("Content-Security-Policy")}`,
      Authorization: `${headers().get("Authorization")}`,
    },
  };
  return fetch(`${URI}`, {
    method: "PUT",
    body: JSON.stringify(arg),
    ...HEADERS,
  }).then((res) => res.json());
};

export const useDelete = (url: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const URI = `${BASE_URL}/${url}`;
  const HEADERS = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "Content-Security-Policy": `${headers().get("Content-Security-Policy")}`,
      Authorization: `${headers().get("Authorization")}`,
    },
  };
  return fetch(`${URI}`, {
    method: "DELETE",
    ...HEADERS,
  }).then((res) => res.json());
};
