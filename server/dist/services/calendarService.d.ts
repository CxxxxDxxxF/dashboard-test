interface EventData {
    title: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    location?: string;
    isAllDay?: boolean;
    color?: string;
    userId: string;
}
export declare class CalendarService {
    getEvents(userId: string, startDate?: Date, endDate?: Date): Promise<any[]>;
    getEventById(id: string, userId: string): Promise<any>;
    createEvent(eventData: EventData): Promise<any>;
    updateEvent(id: string, userId: string, updateData: Partial<EventData>): Promise<any>;
    deleteEvent(id: string, userId: string): Promise<boolean>;
    getEventsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<any[]>;
}
export {};
//# sourceMappingURL=calendarService.d.ts.map