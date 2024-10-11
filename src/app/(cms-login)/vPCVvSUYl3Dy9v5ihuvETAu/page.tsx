"use client";
import { signin } from "@/app/actions/auth";
import { FormState } from "@/app/lib/definitions";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { memo, useEffect } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

const CmsLoginPage = () => {
  const [state, action] = useFormState<FormState, FormData>(signin, {
    errors: {
      username: "",
      password: "",
    },
    message: "",
  });
  console.log("state", state);

  useEffect(() => {
    if (state?.message) {
      toast.error(state?.message, { duration: 3000 });
    }
  }, [state?.message]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="min-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex w-full flex-col items-center justify-center">
            <p className="text-2xl font-bold">Sign in with Username</p>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-3">
          <form
            className="flex w-full flex-col items-center gap-3"
            action={action}
          >
            <Input
              name="username"
              color="default"
              label="Username"
              errorMessage={state?.errors?.username ?? ""}
              isInvalid={state?.errors?.username ? true : false}
            />
            <Input
              name="password"
              color="default"
              label="Password"
              type="password"
              errorMessage={state?.errors?.password ?? ""}
              isInvalid={state?.errors?.password ? true : false}
            />
            <Button type="submit">Sign In</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default memo(CmsLoginPage);
