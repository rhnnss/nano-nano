import * as yup from "yup";

export const SigninFormSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export type FormState = {
  errors?: {
    username?: string;
    password?: string;
  };
  message?: string;
};

export type FormData = {
  username?: string | null;
  password?: string | null;
};
