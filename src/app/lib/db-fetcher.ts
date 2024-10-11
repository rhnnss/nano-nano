const HEADERS = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const usePostDb = <T>(url: string, { arg }: { arg: T }) => {
  return fetch(`${url}`, {
    method: "POST",
    body: JSON.stringify(arg),
    ...HEADERS,
  }).then((res) => res.json());
};

export const useGetDb = (url: string) => {
  return fetch(`${url}`, {
    method: "GET",
    ...HEADERS,
  }).then((res) => res.json());
};

export const usePutDb = <T>(url: string, { arg }: { arg: T }) => {
  return fetch(`${url}`, {
    method: "PUT",
    body: JSON.stringify(arg),
    ...HEADERS,
  }).then((res) => res.json());
};

export const useDeleteDb = (url: string) => {
  return fetch(`${url}`, {
    method: "DELETE",
    ...HEADERS,
  }).then((res) => res.json());
};
