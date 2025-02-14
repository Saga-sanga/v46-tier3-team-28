'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { BsFillMoonStarsFill } from 'react-icons/bs';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { MainLogo } from '../icons';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { status } = useSession();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center gap-2">
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="64" height="62" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.237 52.741c3.91 3.732 10.192 3.732 22.763 3.732 12.57 0 18.856 0 22.76-3.732 3.907-3.726 3.907-9.733 3.907-21.74 0-12.008 0-18.012-3.907-21.743-3.901-3.73-10.19-3.73-22.76-3.73-12.57 0-18.856 0-22.763 3.73C5.333 12.992 5.333 18.993 5.333 31c0 12.007 0 18.011 3.904 21.74Zm16.096-30.019c-1.714 0-3.39.486-4.815 1.395a8.373 8.373 0 0 0-3.192 3.716 7.935 7.935 0 0 0-.493 4.783 8.171 8.171 0 0 0 2.372 4.239 8.8 8.8 0 0 0 4.438 2.265 9.044 9.044 0 0 0 5.007-.47 8.593 8.593 0 0 0 3.89-3.05A8.017 8.017 0 0 0 34 31c0-.506.21-.992.586-1.35.375-.358.884-.56 1.414-.56.53 0 1.04.202 1.414.56.375.358.586.844.586 1.35 0 2.394-.743 4.733-2.135 6.723-1.392 1.99-3.37 3.54-5.684 4.456a13.22 13.22 0 0 1-7.319.689 12.86 12.86 0 0 1-6.485-3.312 11.941 11.941 0 0 1-3.467-6.195 11.596 11.596 0 0 1 .72-6.99c.96-2.211 2.583-4.101 4.666-5.43a13.093 13.093 0 0 1 7.037-2.04c.53 0 1.04.202 1.415.56.375.358.585.844.585 1.35 0 .508-.21.993-.585 1.352-.376.358-.884.56-1.415.56Zm22 8.279c0 2.195-.913 4.301-2.538 5.854-1.625 1.552-3.83 2.424-6.128 2.424-.53 0-1.04.202-1.415.56a1.868 1.868 0 0 0-.585 1.35c0 .507.21.993.585 1.352.376.358.884.56 1.415.56 2.505 0 4.954-.71 7.037-2.04s3.706-3.22 4.665-5.43c.959-2.21 1.21-4.644.721-6.99a11.942 11.942 0 0 0-3.467-6.196 12.862 12.862 0 0 0-6.485-3.311 13.22 13.22 0 0 0-7.319.688c-2.314.916-4.292 2.467-5.684 4.457A11.718 11.718 0 0 0 26 31c0 .506.21.992.586 1.35.375.359.884.56 1.414.56.53 0 1.04-.201 1.414-.56.375-.358.586-.843.586-1.35 0-2.196.913-4.302 2.538-5.854 1.626-1.552 3.83-2.425 6.129-2.425 2.298 0 4.503.872 6.128 2.425s2.538 3.658 2.538 5.854Z"
                fill="#633CFF"
              />
            </svg> */}
            <MainLogo />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">PagePocket</span>
          </a>
          <div className="flex items-center gap-5">
            {' '}
            {/* Container for icons */}
            <BsFillMoonStarsFill
              onClick={() => setDarkMode(!darkMode)}
              className="cursor-pointer text-2xl ml-3" // Add margin for spacing
            />
            {status === 'authenticated' ? (
              <Link className={buttonVariants({ variant: 'outline' })} href="/dashboard">
                Dashboard
              </Link>
            ) : (
              <Link
                className={cn(buttonVariants({ variant: 'outline' }), 'font-bold hover:text-primary')}
                href="/login"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
