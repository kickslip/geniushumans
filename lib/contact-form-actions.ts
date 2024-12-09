"use server";

import { prisma } from '@/prisma/client';
import { format, parseISO } from 'date-fns';

export async function getContactFormSubmissions(selectedMonth: string) {
  try {
    // Calculate start and end of the month
    const startDate = new Date(`${selectedMonth}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Fetch submissions for the selected month
    const submissions = await prisma.contactForm.findMany({
      where: {
        submittedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    // Format data for client consumption
    return submissions.map((submission) => ({
      ...submission,
      submittedAt: format(submission.submittedAt, 'yyyy-MM-dd HH:mm:ss'),
    }));
  } catch (error) {
    console.error('Failed to fetch contact form submissions:', error);
    throw new Error('Failed to fetch contact form submissions.');
  }
}
