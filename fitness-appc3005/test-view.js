import { PrismaClient } from './generated/prisma/client.js';

async function testView() {
  const prisma = new PrismaClient();

  try {
    console.log('Testing MemberInfo view...');
    const result = await prisma.memberInfo.findMany();
    console.log('Success! Found', result.length, 'records');
    console.log('Sample record:', result[0]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testView();
