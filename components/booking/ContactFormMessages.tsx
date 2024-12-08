"use client"
import { useState, useEffect } from 'react';
import { prisma } from '@/prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';

async function getAllContactFormMessages() {
  try {
    return await prisma.contactForm.findMany({
      orderBy: { submittedAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to fetch contact form messages:', error);
    return [];
  }
}

export default function ContactFormMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(5);

  useEffect(() => {
    const fetchMessages = async () => {
      const allMessages = await getAllContactFormMessages();
      setMessages(allMessages);
    };

    fetchMessages();
  }, []);

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                {['Name', 'Email', 'Mobile', 'Country', 'Package', 'Submitted'].map(header => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No contact form submissions yet.
                  </TableCell>
                </TableRow>
              ) : (
                currentMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.fullName}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.mobile}</TableCell>
                    <TableCell>{message.country}</TableCell>
                    <TableCell>{message.package}</TableCell>
                    <TableCell>
                      {formatDistance(new Date(message.submittedAt), new Date(), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(messages.length / messagesPerPage) }, (_, i) => i + 1).map(pageNumber => (
            <Button
              key={pageNumber}
              className={`mx-1 ${currentPage === pageNumber ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary-hover'}`}
              onClick={() => paginate(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}