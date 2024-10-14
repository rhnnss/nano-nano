"use client";

import { cn } from "@nextui-org/theme";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GrArticle } from "react-icons/gr";
import { LuLayoutTemplate, LuShoppingCart } from "react-icons/lu";
import { RiRectangleFill } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { motion } from "framer-motion"; // Import framer-motion

type MenuItem = {
  label: string;
  path: string;
  icon: JSX.Element;
};

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      path: `/${process.env.NEXT_PUBLIC_LOGIN_URL}/dashboard`,
      icon: <LuLayoutTemplate />,
    },
    {
      label: "Banners",
      path: `/${process.env.NEXT_PUBLIC_LOGIN_URL}/banners`,
      icon: <RiRectangleFill />,
    },
    {
      label: "Categories",
      path: `/${process.env.NEXT_PUBLIC_LOGIN_URL}/categories`,
      icon: <BiCategoryAlt />,
    },
    {
      label: "Articles",
      path: `/${process.env.NEXT_PUBLIC_LOGIN_URL}/articles`,
      icon: <GrArticle />,
    },
    {
      label: "Products",
      path: `/${process.env.NEXT_PUBLIC_LOGIN_URL}/products`,
      icon: <LuShoppingCart />,
    },
  ];

  return (
    // Wrapping the entire sidebar in a motion.div for entry animation
    <div className="flex w-[320px] flex-col items-center gap-3 bg-[#fafafa] md:w-[20%]">
      <div className="rela h-[66px] w-full overflow-hidden border-b-2 border-b-gray-200 bg-white">
        <div className="relative flex h-[42px] w-auto flex-col items-center justify-center">
          <Image
            src="https://www.konimex.com/0_repository/images/20170706133641nanonano.gif"
            alt="nanonano-konimex"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 p-3">
        {menuItems.map((item) => (
          // Wrapping each menu item in a motion.div for hover and entry animation
          <motion.div
            key={item?.label}
            initial={{ opacity: 0, x: -50 }} // Fade in and slide from left
            animate={{ opacity: 1, x: 0 }} // Become fully visible
            whileHover={{ scale: 1.05 }} // Slightly grow on hover
            transition={{ duration: 0.3 }}
          >
            <Link
              className={cn(
                "flex flex-row items-center gap-2 rounded-2xl p-2",
                item?.path === pathname
                  ? "bg-yellow-400 text-white"
                  : "text-gray-900 hover:bg-blue-200",
              )}
              href={item?.path}
            >
              <div className="rounded-lg bg-white p-2">
                <span className="text-yellow-400">{item?.icon}</span>
              </div>
              <span>{item?.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
