import { logout } from "@/app/actions/auth";
import { Button } from "@nextui-org/react";
import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <form action={logout}>
        <Button type="submit">Logout</Button>
      </form>
    </div>
  );
};

export default AdminDashboard;
