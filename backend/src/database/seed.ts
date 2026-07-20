import 'dotenv/config';
import bcrypt from 'bcrypt';
import { createPrismaClient } from './prisma.client';

const prisma = createPrismaClient();

/** Default password for all seeded accounts (local dev only). */
export const SEED_PASSWORD = 'password';

export const SEED_USERS = [
  {
    email: 'admin@example.com',
    role: 'ADMIN',
  },
  {
    email: 'user@example.com',
    role: 'USER',
  },
] as const;

export const SEED_CONCERTS = [
  {
    name: 'คอนเสิร์ตรวมศิลปิน ป๊อปไทย',
    description:
      'คอนเสิร์ตป๊อปไทยรวมศิลปินชั้นนำ ณ อิมแพ็ค อารีน่า เมืองทองธานี',
    totalSeats: 500,
  },
  {
    name: 'เฟสติวัล ลูกทุ่งสายดนตรี',
    description:
      'งานดนตรีลูกทุ่งและหมอลำ สนุกสนานกับศิลปินจากทั่วประเทศ ที่ ราชมังคลากีฬาสถาน',
    totalSeats: 120,
  },
  {
    name: 'อินดี้ไทย ไนท์',
    description:
      'เวทีเปิดให้วงอินดี้ไทยรุ่นใหม่ ได้แสดงผลงานในกรุงเทพฯ ที่ Live Arena RCA',
    totalSeats: 80,
  },
] as const;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main(): Promise<void> {
  const passwordHash = await hashPassword(SEED_PASSWORD);

  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        passwordHash,
        role: user.role,
      },
      create: {
        email: user.email,
        passwordHash,
        role: user.role,
      },
    });
  }

  for (const concert of SEED_CONCERTS) {
    const existing = await prisma.concert.findFirst({
      where: { name: concert.name },
      select: { id: true },
    });

    if (existing) {
      await prisma.concert.update({
        where: { id: existing.id },
        data: {
          description: concert.description,
          totalSeats: concert.totalSeats,
        },
      });
    } else {
      await prisma.concert.create({ data: concert });
    }
  }

  console.log('Seed completed.');
  console.log(`Default password for seeded users: ${SEED_PASSWORD}`);
  console.log('Accounts:', SEED_USERS.map((user) => user.email).join(', '));
  console.log(
    'Concerts:',
    SEED_CONCERTS.map((concert) => concert.name).join(', '),
  );
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
