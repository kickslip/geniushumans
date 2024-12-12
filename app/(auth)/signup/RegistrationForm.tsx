"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { signUp } from "./actions";
import { isRedirectError } from "next/dist/client/components/redirect";
import { RegistrationFormData, registrationSchema } from "@/lib/validations";

type SignUpResult = {
  error?: string;
  // Add other properties if needed
};

const RegistrationForm = () => {
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const result = await signUp(data);
      if (result && result.error) {
        // Handle the error, e.g., display it to the user
        console.error(result.error);
      }
      // If we get here, it means the redirect didn't happen (which shouldn't occur in normal operation)
    } catch (error) {
      if (isRedirectError(error)) {
        // The redirect happened, which is actually our success case
        // We don't need to do anything here as the redirect will be handled automatically
      } else {
        // Handle any other unexpected errors
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a unique username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center ">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
