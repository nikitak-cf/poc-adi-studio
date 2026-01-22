import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const user = await prisma.user.upsert({
    where: { email: 'test@adi-specification.com' },
    update: {},
    create: {
      linearId: 'mock-linear-user-1',
      linearToken: 'mock_token_encrypted',
      email: 'test@adi-specification.com',
      name: 'Test User',
      avatarUrl: 'https://avatar.vercel.sh/test',
      teamId: 'mock-team-adi-spec',
    },
  });

  console.log('Created test user:', user.email);

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      title: 'Welcome to ADI Studio',
      lastActivity: new Date(),
    },
  });

  console.log('Created sample conversation:', conversation.title);

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        role: 'system',
        content: 'You are ADI Studio, an AI assistant for creating Linear tasks.',
        tokenCount: 15,
      },
      {
        conversationId: conversation.id,
        role: 'user',
        content: 'Hello! Can you help me create a task for OAuth authentication?',
        tokenCount: 15,
      },
      {
        conversationId: conversation.id,
        role: 'assistant',
        content: 'I\'d be happy to help! Let me ask a few questions to create a comprehensive task.',
        tokenCount: 20,
      },
    ],
  });

  console.log('Created sample messages');

  await prisma.linearTask.create({
    data: {
      userId: user.id,
      linearIssueId: 'ADI-123',
      conversationId: conversation.id,
      title: '[FEATURE] Implement OAuth Authentication',
      description: 'Add OAuth 2.0 authentication flow for Linear integration',
      status: 'TODO',
      priority: 'HIGH',
    },
  });

  console.log('Created sample Linear task');

  await prisma.tokenUsage.create({
    data: {
      userId: user.id,
      conversationId: conversation.id,
      inputTokens: 30,
      outputTokens: 20,
      estimatedCost: 0.00025,
      model: 'gpt-4o',
    },
  });

  console.log('Created sample token usage');
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });