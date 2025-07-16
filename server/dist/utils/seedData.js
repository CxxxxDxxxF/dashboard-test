import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';
const prisma = new PrismaClient();
export async function seedDemoData() {
    try {
        logger.info('Starting database seeding...');
        const demoUser = await prisma.user.upsert({
            where: { email: 'demo@rutgers.edu' },
            update: {},
            create: {
                email: 'demo@rutgers.edu',
                name: 'Demo User',
                role: 'USER',
            },
        });
        logger.info(`Demo user created/updated: ${demoUser.id}`);
        const events = await Promise.all([
            prisma.event.upsert({
                where: { id: 'demo-event-1' },
                update: {},
                create: {
                    id: 'demo-event-1',
                    title: 'Rutgers Homecoming Game',
                    description: 'Annual homecoming football game against rival team',
                    startDate: new Date('2024-10-15T18:00:00Z'),
                    endDate: new Date('2024-10-15T21:00:00Z'),
                    location: 'SHI Stadium',
                    color: '#DC2626',
                    userId: demoUser.id,
                },
            }),
            prisma.event.upsert({
                where: { id: 'demo-event-2' },
                update: {},
                create: {
                    id: 'demo-event-2',
                    title: 'Student Organization Fair',
                    description: 'Meet and join various student organizations',
                    startDate: new Date('2024-09-20T10:00:00Z'),
                    endDate: new Date('2024-09-20T16:00:00Z'),
                    location: 'College Avenue Campus',
                    color: '#2563EB',
                    userId: demoUser.id,
                },
            }),
            prisma.event.upsert({
                where: { id: 'demo-event-3' },
                update: {},
                create: {
                    id: 'demo-event-3',
                    title: 'Academic Advising Session',
                    description: 'Schedule your classes for next semester',
                    startDate: new Date('2024-11-05T14:00:00Z'),
                    endDate: new Date('2024-11-05T15:00:00Z'),
                    location: 'Academic Building',
                    color: '#059669',
                    userId: demoUser.id,
                },
            }),
        ]);
        logger.info(`Created ${events.length} demo events`);
        const mediaFiles = await Promise.all([
            prisma.mediaFile.upsert({
                where: { id: 'demo-media-1' },
                update: {},
                create: {
                    id: 'demo-media-1',
                    filename: 'rutgers-campus.jpg',
                    originalName: 'rutgers-campus.jpg',
                    mimeType: 'image/jpeg',
                    size: 2048576,
                    url: 'https://example.com/media/rutgers-campus.jpg',
                    thumbnail: 'https://example.com/media/thumbnails/rutgers-campus.jpg',
                    tags: ['campus', 'rutgers', 'photography'],
                    isPublic: true,
                    userId: demoUser.id,
                },
            }),
            prisma.mediaFile.upsert({
                where: { id: 'demo-media-2' },
                update: {},
                create: {
                    id: 'demo-media-2',
                    filename: 'student-life-video.mp4',
                    originalName: 'student-life-video.mp4',
                    mimeType: 'video/mp4',
                    size: 15728640,
                    url: 'https://example.com/media/student-life-video.mp4',
                    thumbnail: 'https://example.com/media/thumbnails/student-life-video.jpg',
                    tags: ['video', 'student-life', 'rutgers'],
                    isPublic: true,
                    userId: demoUser.id,
                },
            }),
            prisma.mediaFile.upsert({
                where: { id: 'demo-media-3' },
                update: {},
                create: {
                    id: 'demo-media-3',
                    filename: 'event-flyer.pdf',
                    originalName: 'event-flyer.pdf',
                    mimeType: 'application/pdf',
                    size: 512000,
                    url: 'https://example.com/media/event-flyer.pdf',
                    tags: ['pdf', 'flyer', 'event'],
                    isPublic: true,
                    userId: demoUser.id,
                },
            }),
        ]);
        logger.info(`Created ${mediaFiles.length} demo media files`);
        const userSettings = await prisma.userSettings.upsert({
            where: { userId: demoUser.id },
            update: {},
            create: {
                userId: demoUser.id,
                theme: 'light',
                notifications: true,
                emailNotifications: true,
                language: 'en',
                timezone: 'America/New_York',
                dateFormat: 'MM/DD/YYYY',
                timeFormat: '12h',
            },
        });
        logger.info(`Created demo user settings for user: ${demoUser.id}`);
        logger.info('Database seeding completed successfully!');
    }
    catch (error) {
        logger.error('Error seeding database:', error);
        throw error;
    }
}
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDemoData()
        .then(() => {
        logger.info('Seeding completed');
        process.exit(0);
    })
        .catch((error) => {
        logger.error('Seeding failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=seedData.js.map