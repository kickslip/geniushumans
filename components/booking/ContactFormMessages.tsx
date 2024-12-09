"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { getContactFormSubmissions } from '@/lib/contact-form-actions';

// Define the type for a single submission
type Submission = {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  country: string;
  package: string;
  message: string;
  submittedAt: string;
};

export default function ContactFormSubmissions() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]); // Explicitly define the type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedMonth) {
      setLoading(true);
      setError('');
      getContactFormSubmissions(selectedMonth)
        .then((data) => {
          setSubmissions(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to fetch submissions.');
          setLoading(false);
        });
    }
  }, [selectedMonth]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700">
            Select Month:
          </label>
          <input
            type="month"
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {loading && <div>Loading submissions...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {submissions.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Submitted At</TableHead>
              </tr>
            </thead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.fullName}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.mobile}</TableCell>
                  <TableCell>{submission.country}</TableCell>
                  <TableCell>{submission.package}</TableCell>
                  <TableCell>{submission.message}</TableCell>
                  <TableCell>{submission.submittedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          !loading && <div>No submissions found for the selected month.</div>
        )}
      </CardContent>
    </Card>
  );
}
