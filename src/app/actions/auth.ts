"use server";
import * as yup from "yup";
import { FormState, SigninFormSchema } from "../lib/definitions";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";

export async function signin(state: FormState, formData: FormData) {
  const user = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  // Lakukan validasi Yup dengan safeParse-like approach
  const validatedFields = await SigninFormSchema.validate(user, {
    abortEarly: false,
  })
    .then(() => true)
    .catch((err) => err);

  // Cek apakah validasi berhasil atau ada error
  if (validatedFields === true) {
    // Validasi berhasil, lanjutkan dengan pengecekan kredensial
    if (
      user.username === process.env.USER_USERNAME &&
      user.password === process.env.USER_PASSWORD
    ) {
      await createSession(user);
      redirect(`/${process.env.LOGIN_URL}/dashboard`);
    } else {
      return {
        message: "Invalid credentials!",
      };
    }
  } else {
    // Validasi gagal, kembalikan error validasi
    return {
      errors: validatedFields.inner.reduce(
        (acc: Record<string, string>, currentError: yup.ValidationError) => {
          acc[currentError.path as string] = currentError.message;
          return acc;
        },
        {},
      ),
    };
  }
}

export async function logout() {
  deleteSession();
  redirect(`/${process.env.LOGIN_URL}`);
}
