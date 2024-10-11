import { Button } from "@nextui-org/react";
import React from "react";
import { logout } from "../actions/auth";

const SignOutForm = () => {
  return (
    <form
      action={async () => {
        await logout();
      }}
    >
      <Button type="submit" variant="ghost" className="border-none">
        Sign Out
      </Button>
    </form>
  );
};

export default SignOutForm;
