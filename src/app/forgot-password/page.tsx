'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('https://dashboardapi-4nnrh34aza-el.a.run.app/sendPasswordResetEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      setSubmittedEmail(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = () => {
    setSuccess(false);
    setError(null);
  };

  if (success) {
    return (
      <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
        {/* Left promo/branding panel */}
        <div className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-400/10 to-teal-400/10" />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-green-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative max-w-md w-full text-center">
            <div className="mx-auto flex items-center justify-center">
              <Image src="/logo.png" alt="SalesHQ" width={0} height={0} sizes="100vw" className="w-[50%] h-full" />
            </div>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Check Your Email!
            </h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
              We've sent you a password reset link.
            </p>

            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">Check your email inbox</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">Click the reset link in the email</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">Create your new password</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right success panel */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-6">
              <div className="mx-auto h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Check Your Email!</h2>
            </div>

            {/* Success Card */}
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-green-800 dark:text-green-200">Email Sent Successfully!</CardTitle>
                </div>
                <CardDescription className="text-green-700 dark:text-green-300">
                  We've sent a password reset link to your email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Email sent to:</strong>
                  </p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {submittedEmail}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <p><strong>Next steps:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the "Reset Password" link in the email</li>
                    <li>Create a new secure password</li>
                    <li>Sign in with your new password</li>
                  </ol>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleResendEmail}
                    variant="outline"
                    className="w-full border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Email
                  </Button>
                  
                  <Link href="/login">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* Left promo/branding panel */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-emerald-400/10" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center">
            <Image src="/logo.png" alt="SalesHQ" width={0} height={0} sizes="100vw" className="w-[30%] h-full" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Forgot Your Password?
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          <div className="mt-8 space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">We'll send a secure reset link to your email</p>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">The link will expire in 24 hours for security</p>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">Check your spam folder if you don't see it</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-6">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
          </div>

          {/* Forgot Password Form */}
          <Card className="border-subtle-border/60 shadow-xl shadow-black/5 dark:shadow-none hover:shadow-2xl transition-shadow">
            <CardHeader>
              <CardTitle>Reset Your Password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    {...register('email')}
                    type="email"
                    id="email"
                    placeholder="Enter your email address"
                    className={errors.email ? 'border-red-500' : ''}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link 
                    href="/login" 
                    className="text-sm text-primary hover:underline inline-flex items-center"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
          {/* End form card */}
        </div>
      </div>
    </div>
  );
}