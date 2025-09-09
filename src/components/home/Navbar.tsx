"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Input } from "../ui/input";
import SearchDialog from "../ui/command-dialog";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "../ui/mode-toggle";
import type { BlogPost, Category } from "@/types/BlogPost";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocket } from "@/provider/SocketProvider";

interface NavbarProps {
  categories: Category[];
  blog_posts: BlogPost[];
}

const Navbar = ({ categories, blog_posts }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const [userProfile, setUserProfile] = useState(session?.user);
  const socket = useSocket();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setUserProfile(session.user);
    }
  }, [session]);

  useEffect(() => {
    if (!socket) return;

    socket.on("profile:update", (profile) => {
      setUserProfile((prev) => ({
        ...prev,
        ...profile,
        id: prev?.id || profile.id,
        email: profile.email || prev?.email,
        name: profile.name || prev?.name,
        image: profile.image || prev?.image,
      }));
    });
  }, [socket]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/site-logo.png"
              alt="Site Logo"
              width={100}
              height={100}
              quality={100}
              className="w-8 h-8 md:w-10 md:h-10 object-cover"
            />
            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold lowercase">
              MijuBlog
            </h1>
          </Link>
          <ul className="hidden lg:flex items-center space-x-6 font-semibold">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/category"
                className="hover:text-accent transition-colors"
              >
                Category
              </Link>
            </li>
            <li>
              <Link
                href="/about-us"
                className="hover:text-accent transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact-us"
                className="hover:text-accent transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex w-64 relative">
            <Input
              type="text"
              placeholder="Search blogs..."
              onClick={() => setOpen(!open)}
              className="pr-16"
            />
            <div className="absolute right-2 top-1.5 flex items-center space-x-1">
              <div className="border rounded-md px-1.5 py-0.5 text-xs">
                Ctrl
              </div>
              <div className="border rounded-md px-1.5 py-0.5 text-xs">K</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            <Icon icon="mynaui:search" width="20" height="20" />
          </Button>
          <SearchDialog
            open={open}
            setOpen={setOpen}
            categories={categories}
            blog_posts={blog_posts}
          />
          <Link href={"/new-blog"} className="hidden sm:block">
            <Button variant="ghost" size="sm">
              <Icon icon="mynaui:edit-one" width="20" height="20" />
            </Button>
          </Link>
          <ModeToggle />
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 w-8 h-8 rounded-full">
                  <Image
                    src={
                      userProfile?.image
                        ? (userProfile?.image as string)
                        : "/default-pf.jpg"
                    }
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-cover rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/@${session.user.name}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/setting">Settings</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => authClient.signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="bg-accent hover:bg-accent hover:opacity-70"
            >
              <Link href={"/login"}>Login</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon
              icon={mobileMenuOpen ? "mynaui:x" : "mynaui:menu"}
              width="20"
              height="20"
            />
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="px-4 py-3 space-y-3">
            <Link
              href="/"
              className="block py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/category"
              className="block py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Category
            </Link>
            <Link
              href="/about-us"
              className="block py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact-us"
              className="block py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/new-blog"
              className="sm:hidden block py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Blog
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
