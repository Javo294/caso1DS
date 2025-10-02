/**
 * Time formatting utilities for 20minCoach
 * Provides consistent time formatting across the application
 */

import { DATE_FORMATS } from './constants';

/**
 * Format a date to a localized string
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided to formatDate');
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Format a time to a localized string
 */
export const formatTime = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided to formatTime');
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Format a date and time together
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(dateObj)} at ${formatTime(dateObj)}`;
};

/**
 * Format duration in minutes to human readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 0) {
    throw new Error('Duration cannot be negative');
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

/**
 * Format relative time (e.g., "2 hours ago", "in 5 minutes")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffDays) > 0) {
    return rtf.format(diffDays, 'day');
  } else if (Math.abs(diffHours) > 0) {
    return rtf.format(diffHours, 'hour');
  } else {
    return rtf.format(diffMinutes, 'minute');
  }
};

/**
 * Calculate remaining time for a session
 */
export const getRemainingTime = (endTime: Date | string): string => {
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Session ended';
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `Ends in ${formatDuration(diffMinutes)}`;
};

/**
 * Calculate session end time based on start time and duration
 */
export const calculateEndTime = (
  startTime: Date | string,
  durationMinutes: number = 20
): Date => {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  return new Date(start.getTime() + durationMinutes * 60 * 1000);
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getTime() > Date.now();
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getTime() < Date.now();
};

/**
 * Get the start of the day for a given date
 */
export const startOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const start = new Date(dateObj);
  start.setHours(0, 0, 0, 0);
  return start;
};

/**
 * Get the end of the day for a given date
 */
export const endOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const end = new Date(dateObj);
  end.setHours(23, 59, 59, 999);
  return end;
};

/**
 * Add minutes to a date
 */
export const addMinutes = (date: Date | string, minutes: number): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.getTime() + minutes * 60 * 1000);
};

/**
 * Subtract minutes from a date
 */
export const subtractMinutes = (date: Date | string, minutes: number): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.getTime() - minutes * 60 * 1000);
};

/**
 * Get the difference between two dates in minutes
 */
export const getDifferenceInMinutes = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return Math.round((d1.getTime() - d2.getTime()) / (1000 * 60));
};

/**
 * Format a date range (e.g., "Jan 1 - Jan 2, 2023")
 */
export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const startFormatted = formatDate(start, { month: 'short', day: 'numeric' });
  const endFormatted = formatDate(end, { month: 'short', day: 'numeric', year: 'numeric' });

  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${startFormatted} - ${end.getDate()}, ${end.getFullYear()}`;
  } else if (start.getFullYear() === end.getFullYear()) {
    return `${startFormatted} - ${endFormatted}`;
  } else {
    return `${formatDate(start)} - ${formatDate(end)}`;
  }
};

/**
 * Format a time range (e.g., "2:00 PM - 3:00 PM")
 */
export const formatTimeRange = (startTime: Date | string, endTime: Date | string): string => {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;

  return `${formatTime(start)} - ${formatTime(end)}`;
};

/**
 * Session-specific time formatting
 */
export const sessionTimeUtils = {
  /**
   * Get session end time based on start time
   */
  getSessionEndTime: (startTime: Date | string): Date => {
    return calculateEndTime(startTime, 20);
  },

  /**
   * Check if session is about to end (5 minutes warning)
   */
  isSessionAboutToEnd: (endTime: Date | string): boolean => {
    const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    return diffMs > 0 && diffMs <= 5 * 60 * 1000; // 5 minutes or less
  },

  /**
   * Check if session has exceeded time limit
   */
  hasSessionExceededTimeLimit: (endTime: Date | string): boolean => {
    const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
    return end.getTime() <= Date.now();
  },

  /**
   * Get session progress percentage (0-100)
   */
  getSessionProgress: (startTime: Date | string, endTime: Date | string): number => {
    const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
    const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
    const now = new Date();

    if (now < start) return 0;
    if (now >= end) return 100;

    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / totalDuration) * 100);
  },
};

/**
 * Example usage:
 * 
 * import { formatDate, formatTime, formatDuration, sessionTimeUtils } from '@/utils/formatTime';
 * 
 * const sessionStart = new Date();
 * const sessionEnd = sessionTimeUtils.getSessionEndTime(sessionStart);
 * 
 * console.log(formatDateTime(sessionStart)); // "Dec 15, 2023 at 2:30 PM"
 * console.log(formatDuration(90)); // "1 hr 30 min"
 * console.log(sessionTimeUtils.getSessionProgress(sessionStart, sessionEnd)); // 50
 */
