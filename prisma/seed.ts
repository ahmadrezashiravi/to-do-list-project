import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",  // یک ایمیل منحصر به فرد وارد کنید
      name: "Test User",
      googleId: "google-user-id-123",  // ID گوگل کاربر را وارد کنید
      roleId: 1,  // فرض کنید 1 برای نقش پیش‌فرض است
    },
  });
  console.log("User created:", user);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
