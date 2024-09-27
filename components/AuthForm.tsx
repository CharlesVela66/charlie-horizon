'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import CustomFormField from './CustomFormField';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      address1: '',
      state: '',
      postalCode: '',
      dateOfBirth: '',
      ssn: '',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Sign up with Appwrite & create plaid token
      setIsLoading(true);
      if (type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        };
        const newUser = await signUp(userData);
        setUser(newUser);
      } else {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) {
          router.push('/');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center gap-1">
          <Image src="/icons/logo.svg" width={34} height={34} alt="logo" />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className="text-16 font-normal text-gray-600 ">
            {user
              ? 'Link your account to get started'
              : 'Please enter your details'}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === 'sign-up' && (
                <>
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      type="firstName"
                      placeholder="Enter your first name"
                      label="First Name"
                    />
                    <CustomFormField
                      control={form.control}
                      type="lastName"
                      placeholder="Enter your last name"
                      label="Last Name"
                    />
                  </div>
                  <CustomFormField
                    control={form.control}
                    type="address1"
                    placeholder="Enter your specific address"
                    label="Address"
                  />
                  <CustomFormField
                    control={form.control}
                    type="city"
                    placeholder="Enter your city"
                    label="City"
                  />
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      type="state"
                      placeholder="Example: NY"
                      label="State"
                    />
                    <CustomFormField
                      control={form.control}
                      type="postalCode"
                      placeholder="Example: 11101"
                      label="Postal Code"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      type="dateOfBirth"
                      placeholder="YYYY-MM-DD"
                      label="Date of Birth"
                    />
                    <CustomFormField
                      control={form.control}
                      type="ssn"
                      placeholder="1234"
                      label="SSN"
                    />
                  </div>
                </>
              )}
              <CustomFormField
                control={form.control}
                type="email"
                placeholder="Enter your email"
                label="Email"
              />
              <CustomFormField
                control={form.control}
                type="password"
                placeholder="Enter your password"
                label="Password"
              />

              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === 'sign-in' ? (
                    'Sign In'
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === 'sign-in'
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <Link
              href={type === 'sign-up' ? '/sign-in' : '/sign-up'}
              className="form-link"
            >
              {type === 'sign-in' ? 'Sign up' : 'Sign in'}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
