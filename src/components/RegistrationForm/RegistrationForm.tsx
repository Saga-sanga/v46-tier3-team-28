'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import OAuthButtons from '@/components/OAuthButtons/OAuthButtons';
import { toast } from 'sonner';
import { LuLoader2 } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { MainLogo } from '../icons';
import { Button } from '../ui/button';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrorView, setPasswordErrorView] = useState('hidden');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function registerUser(e: any) {
    e.preventDefault();
    setLoading(true);

    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      setPasswordErrorView('flex');
      setTimeout(() => {
        setPasswordErrorView('hidden');
      }, 5000);
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match!");
      setPasswordErrorView('flex');
      setTimeout(() => {
        setPasswordErrorView('hidden');
      }, 5000);
      return;
    }

    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
        email,
      }),
    });
    console.log(response);
    if (response.ok) {
      setLoading(false);
      toast.success('You are now registered!');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      router.push('/login');
    } else if (response.status === 409) {
      setLoading(false);
      toast.error('User already exists');
    } else {
      setLoading(false);
      toast.error('Invalid credentials!');
    }
  }

  return (
    <form onSubmit={registerUser} className="h-fit w-fit bg-transparent">
      <Link href="/" className="w-full h-fit flex flex-col justify-center items-center pb-10">
        <MainLogo className="w-12 h-12" />
      </Link>
      <fieldset className="flex flex-col gap-10 w-screen md:w-[476px] lg:w-[476px] xl:w-[476px] p-[5%] md:p-10 lg:p-10 xl:p-10 white rounded-lg bg-white">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#333333] text-3xl font-bold text-center md:text-left lg:text-left xl:text-left leading-[48px]">
            Create Account
          </h2>
          <p className="text-[#737373] text-center text-md:text-left lg:text-left xl:text-left">
            Let’s get you started saving your links!
          </p>
        </div>

        <fieldset className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-2">
            <label className="text-xs text-[#333333]">Email</label>
            <input
              className="text-[#03022D] w-full bg-white text-center p-2 outline-none border-[1px] border-[#D9D9D9] rounded-md"
              type="email"
              name="email"
              placeholder="sample@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity('Please type your active email address.')
              }
              onInput={(e) => {
                (e.target as HTMLInputElement).setCustomValidity('');
              }}
            />
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <label className="text-xs text-[#333333]">Full Name</label>
            <input
              className="text-[#03022D] w-full bg-white text-center p-2 outline-none border-[1px] border-[#D9D9D9] rounded-md"
              type="text"
              name="name"
              placeholder="Juan Dela Cruz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please type your complete name.')}
              onInput={(e) => {
                (e.target as HTMLInputElement).setCustomValidity('');
              }}
            />
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <label className="text-xs text-[#333333]">Create Password</label>
            <input
              className="text-[#03022D] w-full bg-white border-[1px] border-[#D9D9D9] text-center p-2 outline-none rounded-md"
              type="password"
              name="password"
              placeholder="create new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please create your new password.')}
              onInput={(e) => {
                (e.target as HTMLInputElement).setCustomValidity('');
              }}
            />
            <p className={`w-full text-red-500 text-xs ${passwordErrorView}`}>{errorMessage}</p>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <label className="text-xs text-[#333333]">Confirm Password</label>
            <input
              className="text-[#03022D] w-full bg-white border-[1px] border-[#D9D9D9] text-center p-2 outline-none rounded-md"
              type="password"
              name="confirmPassword"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please re-enter your new password.')}
              onInput={(e) => {
                (e.target as HTMLInputElement).setCustomValidity('');
              }}
            />
            <p className={`w-full text-red-500 text-xs ${passwordErrorView}`}>{errorMessage}</p>
          </fieldset>
          <p className="w-full text-left text-xs text-[#737373]">Password must contain at least 8 characters.</p>
          <Button
            className="bg-primary h-14 text-white text-base w-full flex flex-row justify-center items-center font-medium py-3 rounded-md hover:bg-opacity-80 cursor-pointer transition-all duration-300"
            type="submit"
            disabled={loading}
          >
            {loading && <LuLoader2 className="animate-spin mr-2" />}
            Create new account
          </Button>

          <fieldset className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 place-items-center">
            <div className="h-[1px] w-2/5 md:w-full lg:w-full xl:w-full bg-[#D9D9D9] flex self-center"></div>
            <h5 className="text-[#737373] w-full text-center col-span-2">OR CONTINUE WITH</h5>
            <div className="h-[1px] w-1/5 md:w-full lg:w-full xl:w-full bg-[#D9D9D9] flex self-center"></div>
          </fieldset>

          <OAuthButtons loading={loading} setLoading={setLoading} />
          <p className="text-[#737373] text-center">
            Already have an account?{' '}
            <Link className="text-primary" href="/login">
              Login
            </Link>
          </p>
        </fieldset>
      </fieldset>
    </form>
  );
};

export default RegistrationForm;
