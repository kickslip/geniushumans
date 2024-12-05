import React from 'react';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistance } from 'date-fns';

async function getContactFormMessages() {
  try {
    const messages = await db.contactForm.findMany({
      orderBy: {
        submittedAt: 'desc'
      }
    });
    return messages;
  } catch (error) {
    console.error('Failed to fetch contact form messages:', error);
    return [];
  }
}

export default async function ContactFormMessages() {
  const messages = await getContactFormMessages();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No contact form submissions yet.
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.fullName}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.mobile}</TableCell>
                    <TableCell>{message.country}</TableCell>
                    <TableCell>{message.package}</TableCell>
                    <TableCell>
                      {formatDistance(new Date(message.submittedAt), new Date(), {
                        addSuffix: true
                      })}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={message.message}>
                      {message.message}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}