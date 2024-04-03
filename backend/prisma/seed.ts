import { PrismaClient, Prisma } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import dotenv from 'dotenv'

dotenv.config();

const prisma = new PrismaClient()

async function main() {
    await prisma.user.create({
        data: {
          email: 'example@example.com',
          name: 'John Doe',
          userid: 'john_doe123',
          sessionId: 'uniqueId',
          notes: {
            create: {
              title: 'Sample Note',
              text: 'This is a sample note.',
              createdAt: new Date(),
              archived: false,
              favorite: true,
              Tags: {
                create: [
                  { tagNames: ['important', 'school'] },
                  { tagNames: ['work'] }
                ]
              },
              Images: {
                create: [
                  { url: 'https://example.com/image1.jpg' },
                  { url: 'https://example.com/image2.jpg' }
                ]
              },
              updatedAt: new Date(),
            }
          }
        }
      });
  }
  
  main()
    .catch((error) => {
      console.error('Error seeding data:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });