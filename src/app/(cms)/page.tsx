"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { memo } from "react";

const CmsLoginPage = () => {
  return (
    <>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md">NextUI</p>
            <p className="text-small text-default-500">nextui.org</p>
          </div>
        </CardHeader>
        <CardBody>
          <p>Make beautiful websites regardless of your design experience.</p>
        </CardBody>
        <Divider />
        <CardFooter>
          <Button
            radius="sm"
            size="lg"
            className="w-full bg-gray-100 text-gray-300"
          >
            Batalkan Pembayaran
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default memo(CmsLoginPage);
