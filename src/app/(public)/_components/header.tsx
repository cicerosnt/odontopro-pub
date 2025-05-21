"use client"

import { useState } from 'react'
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../../../components/ui/button";
import { LogIn, Menu, Settings } from "lucide-react";
import { useSession } from 'next-auth/react';
import { handleRegister } from '../_actions/login';

export function Header() {
  const {data: session, status} = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/sobre", label: "Sobre", target: "_self" },
    { href: "/contato", label: "Contato", target: "_self" },
    { href: "/faq", label: "FAQ", target: "_self" },
    { href: "/termos", label: "Termos de uso", target: "_self" },
  ]

  const NavLinks = () => (
      <nav className="flex flex-col gap-1 md:flex-row md:justify-start items-start md:items-center md:w-full">
      {navItems.map((item) => (
        <Button
          onClick={() => setIsOpen(false)}
          key={item.href}
          asChild
          className="bg-transparent hover:bg-transparent text-black shadow-none"
        >
          <Link 
            href={item.href} 
            title={item.label} 
            target={item.target} 
            className='text-base'
          >
            {item.label}
          </Link>
        </Button>
      ))}
        {status === 'loading' ? null : session ? (
          <Link
            href="/dashboard"
            className='flex items-center justify-center gap-2 w-full md:w-auto my-4 bg-zinc-900 text-white rounded-md py-2 px-4 hover:bg-zinc-800 cursor-pointer'
          >
            <Settings className="w-4 h-4" />
            Painel
          </Link>
        ) : (
          <Button className='flex items-center justify-center gap-2 w-full md:w-auto my-4 cursor-pointer' variant="default" onClick={handleLogin}>
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        )}
    </nav>
  )
  
  async function handleLogin() {
    await handleRegister("github");
  }

  return (
    <header
      className="fixed top-0 right-0 left-0 z-[999] px-6 py-4 my-auto md:py-0 bg-white shadow-md border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700 dark:shadow-sm h-17"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-3xl font-bold text-zinc-900"
        >
          Odonto<span className="text-emerald-500">PRO</span>
        </Link>

        <div className="hidden md:block">
          <NavLinks />
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              className="text-black hover:bg-transparent cursor-pointer shadow-lg"
              variant="ghost"
              size="icon"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[240px] sm:w-[300px] z-[9999] p-4">
            <SheetTitle>Menu</SheetTitle>
            <SheetHeader className='hidden'></SheetHeader>

            <SheetDescription className='hidden'>
              Veja nossos links
            </SheetDescription>

            <div>
              <NavLinks />
            </div>

          </SheetContent>

        </Sheet>
      </div>
    </header>
  )
}