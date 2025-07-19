/**
 * Mock Data Service
 * Provides realistic mock data for demo purposes
 */

import { logger } from '../utils/logger.js';

export class MockDataService {
  /**
   * Get mock posts data
   */
  static getMockPosts(filters: any = {}): any[] {
    const mockPosts = [
      {
        id: '1',
        title: 'Welcome to Rutgers Golf Course!',
        content: 'Experience the beauty of our championship golf course. Perfect for students, faculty, and community members. Book your tee time today! 🏌️‍♂️⛳',
        imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
        platforms: ['INSTAGRAM', 'FACEBOOK'],
        status: 'PUBLISHED',
        scheduledAt: null,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['golf', 'rutgers', 'campus', 'sports'],
        engagement: {
          likes: 2847,
          comments: 156,
          shares: 89,
          views: 12450
        },
        user: { id: '1', name: 'Cristian', email: 'cristian@rutgers.edu' },
        socialAccount: { id: '1', platform: 'INSTAGRAM', username: 'rutgersgolf' }
      },
      {
        id: '2',
        title: 'Student Spotlight: Meet Our Golf Team Captain',
        content: 'Proud to introduce Sarah Johnson, our amazing golf team captain! Her dedication and leadership inspire us all. #StudentSpotlight #RutgersGolf',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        platforms: ['INSTAGRAM'],
        status: 'PUBLISHED',
        scheduledAt: null,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ['student', 'golf', 'leadership', 'spotlight'],
        engagement: {
          likes: 2156,
          comments: 89,
          shares: 45,
          views: 8920
        },
        user: { id: '1', name: 'Cristian', email: 'cristian@rutgers.edu' },
        socialAccount: { id: '1', platform: 'INSTAGRAM', username: 'rutgersgolf' }
      },
      {
        id: '3',
        title: 'Upcoming Tournament: Spring Championship',
        content: 'Mark your calendars! Our annual Spring Championship is just around the corner. Open to all skill levels. Register now at rutgers.edu/golf 🏆',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        platforms: ['FACEBOOK', 'INSTAGRAM'],
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        publishedAt: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ['tournament', 'championship', 'spring', 'events'],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        user: { id: '1', name: 'Cristian', email: 'cristian@rutgers.edu' },
        socialAccount: { id: '1', platform: 'FACEBOOK', username: 'rutgersgolf' }
      },
      {
        id: '4',
        title: 'Golf Course Maintenance Update',
        content: 'Our greens are looking perfect after this week\'s maintenance! The course is in excellent condition for your next round. #CourseMaintenance #PerfectGreens',
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
        platforms: ['INSTAGRAM'],
        status: 'PUBLISHED',
        scheduledAt: null,
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        tags: ['maintenance', 'greens', 'course', 'quality'],
        engagement: {
          likes: 936,
          comments: 23,
          shares: 12,
          views: 3450
        },
        user: { id: '1', name: 'Cristian', email: 'cristian@rutgers.edu' },
        socialAccount: { id: '1', platform: 'INSTAGRAM', username: 'rutgersgolf' }
      },
      {
        id: '5',
        title: 'Golf Lessons Available',
        content: 'New to golf? Our certified instructors are here to help! Book a lesson and improve your game. Perfect for beginners and intermediate players. 📚⛳',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        platforms: ['FACEBOOK'],
        status: 'DRAFT',
        scheduledAt: null,
        publishedAt: null,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        tags: ['lessons', 'instruction', 'beginners', 'learning'],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        user: { id: '1', name: 'Cristian', email: 'cristian@rutgers.edu' },
        socialAccount: { id: '1', platform: 'FACEBOOK', username: 'rutgersgolf' }
      }
    ];

    // Apply filters
    let filteredPosts = mockPosts;

    if (filters.platform) {
      filteredPosts = filteredPosts.filter(post => 
        post.platforms.includes(filters.platform.toUpperCase())
      );
    }

    if (filters.status) {
      filteredPosts = filteredPosts.filter(post => 
        post.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return filteredPosts.slice(startIndex, endIndex);
  }

  /**
   * Get mock events data
   */
  static getMockEvents(): any[] {
    return [
      {
        id: '1',
        title: 'Spring Golf Championship',
        description: 'Annual golf tournament for students and faculty',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        location: 'Rutgers Golf Course',
        isAllDay: false,
        color: '#10B981',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Golf Team Practice',
        description: 'Weekly team practice session',
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        location: 'Rutgers Golf Course',
        isAllDay: false,
        color: '#3B82F6',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Course Maintenance Day',
        description: 'Regular course maintenance and improvements',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: 'Rutgers Golf Course',
        isAllDay: true,
        color: '#F59E0B',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  /**
   * Get mock media files
   */
  static getMockMediaFiles(): any[] {
    return [
      {
        id: '1',
        filename: 'golf-course-1.jpg',
        originalName: 'golf-course-1.jpg',
        mimeType: 'image/jpeg',
        size: 2048576, // 2MB
        url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
        thumbnail: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=200',
        tags: ['golf', 'course', 'landscape'],
        isPublic: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        filename: 'student-golfer.jpg',
        originalName: 'student-golfer.jpg',
        mimeType: 'image/jpeg',
        size: 1536000, // 1.5MB
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
        tags: ['student', 'golf', 'portrait'],
        isPublic: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        filename: 'tournament-trophy.jpg',
        originalName: 'tournament-trophy.jpg',
        mimeType: 'image/jpeg',
        size: 3072000, // 3MB
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200',
        tags: ['tournament', 'trophy', 'achievement'],
        isPublic: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  /**
   * Get mock user settings
   */
  static getMockUserSettings(): any {
    return {
      id: '1',
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      language: 'en',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Get mock social accounts
   */
  static getMockSocialAccounts(): any[] {
    return [
      {
        id: '1',
        platform: 'INSTAGRAM',
        accountId: 'rutgersgolf',
        username: 'rutgersgolf',
        accessToken: 'mock_token_123',
        refreshToken: 'mock_refresh_123',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        platform: 'FACEBOOK',
        accountId: 'rutgersgolfcourse',
        username: 'rutgersgolfcourse',
        accessToken: 'mock_token_456',
        refreshToken: 'mock_refresh_456',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
} 