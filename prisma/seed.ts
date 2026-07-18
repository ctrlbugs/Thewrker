import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_USERS = [
  {
    email: "user@thewrker.com",
    password: "user123",
    firstName: "Demo",
    lastName: "User",
    role: UserRole.TALENT,
  },
  {
    email: "admin@thewrker.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "TheWrker",
    role: UserRole.ADMIN,
  },
] as const;

async function main() {
  for (const account of DEFAULT_USERS) {
    const hashedPassword = await bcrypt.hash(account.password, 10);

    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        password: hashedPassword,
        firstName: account.firstName,
        lastName: account.lastName,
        role: account.role,
        isActive: true,
        isVerified: true,
      },
      create: {
        email: account.email,
        password: hashedPassword,
        firstName: account.firstName,
        lastName: account.lastName,
        role: account.role,
        isActive: true,
        isVerified: true,
      },
    });

    console.log(`✓ ${user.role}: ${account.email} / ${account.password}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
