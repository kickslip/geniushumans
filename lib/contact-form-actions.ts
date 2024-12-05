"use server";

import { db } from "./db";
import { format, parseISO } from 'date-fns';

export async function getContactFormSubmissions(selectedMonth: string) {
  try {
    // Parse the selected month
    const startDate = parseISO(`${selectedMonth}-01`);
    const endDate = parseISO(`${selectedMonth}-01`);
    endDate.setMonth(endDate.getMonth() + 1);

    // Fetch contact form submissions for the selected month
    const submissions = await db.contactForm.findMany({
      where: {
        submittedAt: {
          gte: startDate,
          lt: endDate
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    // Convert Date objects for client-side rendering
    return submissions.map(submission => ({
      ...submission,
      submittedAt: submission.submittedAt
    }));
  } catch (error) {
    console.error('Failed to fetch contact form submissions:', error);
    throw new Error('Failed to fetch contact form submissions');
  }
}