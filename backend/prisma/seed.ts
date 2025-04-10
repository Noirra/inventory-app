import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const roles = ["employee", "admin", "owner"];
    const roleRecords = await Promise.all(
        roles.map(async (role) => {
            return prisma.role.upsert({
                where: { name: role },
                update: {},
                create: { name: role },
            });
        })
    );

    const hashedPassword = await hash("admin1234", 10);

    const user = await prisma.user.create({
        data: {
            name: "admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            roles: {
                create: [
                    { role: { connect: { name: "admin" } } }
                ],
            },
        },
    });

    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });