"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../convex/_generated/api";

export default function LandingPage() {
  const organization = useOrganization();
  const user = useUser()

  let orgId: string | undefined = undefined;
  if(organization.isLoaded && user.isLoaded){
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? {orgId} : "skip");
  const createFile = useMutation(api.files.createFile)
  return (
    <div className=" flex min-h-screen flex-col items-center justify-between p-24">

      {files?.map((file) => {
        return <div key={file._id}>{file.name}</div>;
      })}

      <Button
        onClick={() => {
          if(!orgId) return;
          createFile({
            name: "Hello World",
            orgId,
          });
        }}
      >
        Click me
      </Button>
    </div>
  );
}