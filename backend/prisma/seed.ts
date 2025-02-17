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
    const user = await prisma.user.upsert({
        where: { email: "janedoe@gmail.com" },
        update: {},
        create: {
            name: "Jane Doe",
            email: "janedoe@gmail.com",
            password: hashedPassword,
        },
    });

    await Promise.all(
        roleRecords
            .filter((role) => role.name === "employee" || role.name === "admin")
            .map((role) =>
                prisma.userRole.create({
                    data: {
                        usersId: user.id,
                        rolesId: role.id,
                    },
                })
            )
    );

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
