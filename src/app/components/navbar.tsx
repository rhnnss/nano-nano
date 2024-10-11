"use client";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { FaUser } from "react-icons/fa6";
import SignOutForm from "./sign-out-form";

const Navbar = () => {
  return (
    <div className="flex w-full flex-row items-center justify-end border-b-2 border-b-gray-200 bg-white p-3">
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            className="cursor-pointer"
            showFallback
            src="https://images.unsplash.com/broken"
            fallback={<FaUser className="text-xl" />}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User options">
          <DropdownItem key="signout">
            <SignOutForm />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default Navbar;
