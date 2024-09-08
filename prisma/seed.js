const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Makeyourwebsite//HTTP/0101", 10);

  const user = await prisma.user.upsert({
    where: { username: "esquizociborgue" },
    update: {},
    create: {
      username: "esquizociborgue",
      password: hashedPassword,
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
