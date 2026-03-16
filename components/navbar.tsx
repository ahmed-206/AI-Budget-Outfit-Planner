"use client"
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import CartSheet from './CartSheet'
interface NavbarProps {
  cart: {
    id: string;
    items: {
      id: string;
      quantity: number;
      size?: string | null;
      color?: string | null;
      product: {
        name: string;
        price: number | string;
        images: string[]; 
      }
    }[]
  } | null;
}
function Navbar({ cart }: NavbarProps) {

  const { user, isLoaded } = useUser()
  return (
    <div className='border-b p-2 bg-white sticky top-0 z-50'>
      <div className='container mx-auto h-23 flex items-center justify-between px-4'>

        <Link href="/" className="text-xl font-bold text-emerald-700 flex items-center gap-2">
          <Image width={120} height={120} src="/mroutfit.png" alt='logo' />

        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-brand-primary hover:text-brand-secondary transition-colors">Home</Link>
          <Link href="/shop" className="text-brand-primary hover:text-brand-secondary transition-colors">Shop</Link>
          <Link href="/admin" className="text-brand-primary hover:text-brand-secondary transition-colors">Dashboard</Link>
        </nav>

        <div className='flex items-center gap-4'>

          {isLoaded && user ? (
            <>
              <UserButton afterSignOutUrl="/">
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Orders"
                    labelIcon={<Package size={15} />}
                    href="/orders"
                  />
                </UserButton.MenuItems>
              </UserButton>
              <CartSheet initialCart={cart || { id: "", items: [] }} />
            </>
          ) : isLoaded && (
            <>
              <SignInButton
                mode='modal'>
                <Button>
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button>
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar