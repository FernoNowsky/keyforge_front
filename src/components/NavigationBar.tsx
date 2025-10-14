"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { UserIcon, SearchIcon, ShoppingCartIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import Logo from "@/assets/logo_keyforge.png"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

interface NavigationBarProps {
    isLoggedIn: boolean
    username?: string
}

export function NavigationBar({ isLoggedIn, username }: NavigationBarProps) {

    const [searchOpen, setSearchOpen] = React.useState(false)

    return (
        <header className="w-full bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-white border-b border-[#3A3A3A] shadow-md">
            {/* Górna część: logo + KeyForge + wyszukiwarka + koszyk + profil */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#3A3A3A] bg-gradient-to-b from-[#2A2A2A] to-[#1F1F1F]">
                {/* Lewa strona */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src={Logo}
                            alt="KeyForge Logo"
                            className="h-16 w-auto"
                        />
                        <span className="ml-4 text-2xl font-bold text-[#D4A44A] tracking-wide">
                            KEYFORGE
                        </span>
                    </Link>
                </div>

                {/* Środkowa wyszukiwarka (desktop) */}
                <div className="hidden md:flex relative w-[40%]">
                    <Input
                        type="text"
                        placeholder="Szukaj gier, DLC lub platform..."
                        className="pl-9 w-full"
                    />
                    <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>



                {/* Prawa strona */}
                <div className="flex items-center gap-5">
                    {/* Mobile: ikona wyszukiwania */}
                    <button
                        className="md:hidden relative"
                        onClick={() => setSearchOpen(true)}
                    >
                        <SearchIcon className="h-5 w-5" />
                    </button>

                    {/* Overlay wyszukiwania na mobile */}
                    {searchOpen && (
                        <div
                            className="fixed inset-0 bg-[#3A3A3A]/80 z-50 flex flex-col items-center p-3 pt-24"
                            onClick={() => setSearchOpen(false)} // kliknięcie poza modal zamyka
                        >
                            <div
                                className="w-full bg-[#3A3A3A]/80 max-w-md relative"
                                onClick={(e) => e.stopPropagation()} // kliknięcie wewnątrz nie zamyka
                            >
                                <Input
                                    type="text"
                                    placeholder="Szukaj gier, DLC lub platform..."
                                    className="pl-9 w-full text-[#D4A44A] font-medium"
                                    autoFocus
                                />
                                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-[#D4A44A]" />
                                <button
                                    className="absolute right-2 top-2 !bg-[#3A3A3A]/80"
                                    onClick={() => setSearchOpen(false)}
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    )}

                    <Link to="/cart" className="flex items-center hover:text-primary transition">
                        <ShoppingCartIcon className="h-5 w-5" />
                    </Link>

                    <div className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        {isLoggedIn ? (
                            <span className="font-medium text-sm">{username}</span>
                        ) : (
                            <div className="flex gap-2 text-sm">
                                <Link to="/login" className="hidden md:block font-medium hover:text-primary transition">Zaloguj się</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dolna część: nawigacja kategorii */}
            <div className="flex justify-center border-t border-border bg-inherit/20">
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-6 py-2">
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="!bg-inherit">Kategorie</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[340px] gap-3 p-4 md:w-[340px]">
                                    <ListItem href="/category/gry" title="Gry">Pełne wersje gier do pobrania.</ListItem>
                                    <ListItem href="/category/dlc" title="Dodatki (DLC)">Rozszerzenia i przepustki.</ListItem>
                                    <ListItem href="/category/waluty" title="Waluty">Karty i punkty do gier.</ListItem>
                                    <ListItem href="/category/subskrypcje" title="Subskrypcje">PS Plus, Game Pass itd.</ListItem>
                                </ul>

                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="!bg-inherit">Platformy</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[340px] gap-3 p-4">
                                    <ListItem href="/platform/steam" title="Steam" />
                                    <ListItem href="/platform/playstation" title="PlayStation" />
                                    <ListItem href="/platform/xbox" title="Xbox" />
                                    <ListItem href="/platform/nintendo" title="Nintendo" />
                                    <ListItem href="/platform/pc" title="PC" />
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="!bg-inherit">Gatunki</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[340px] gap-3 p-4 md:w-[340px] md:grid-cols-1">
                                    <ListItem href="/genre/rpg" title="RPG" />
                                    <ListItem href="/genre/fps" title="FPS" />
                                    <ListItem href="/genre/strategy" title="Strategie" />
                                    <ListItem href="/genre/sports" title="Sportowe" />
                                    <ListItem href="/genre/horror" title="Horror" />
                                    <ListItem href="/genre/indie" title="Indie" />
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    )
}

function ListItem({
                      title,
                      href,
                      children,
                      ...props
                  }: React.ComponentPropsWithoutRef<"li"> & { href: string; title: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link
                    to={href}
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition hover:bg-accent hover:text-accent-foreground"
                >
                    <div className="text-sm font-medium">{title}</div>
                    {children && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">{children}</p>
                    )}
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
