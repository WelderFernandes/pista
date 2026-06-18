"use server";

import { prisma } from "./prisma";
import { User } from "@/generated";

interface CurrentUser {
    id: string;
  
}

export async function getCurrentUser({id}: CurrentUser): Promise<User|null> {
   return prisma.user.findUnique({
    where: {
        id: id
    }
   })
}