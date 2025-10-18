"use client"

import * as React from "react"
import { Link } from "@tanstack/react-router"
import { UserIcon, SearchIcon, ShoppingCartIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AuthDialog } from "@/components/AuthDialog"
import { UserAccount } from "@/components/UserAccount"

import Logo from "@/assets/logo_keyforge.png"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {useEffect, useState} from "react";
import {type Category, type Platform, type ProductType} from "@/api";
import {ProductTypeApi} from "@/api/productTypeApi.ts";
import {CategoriesApi} from "@/api/categoriesApi.ts";
import {PlatformsApi} from "@/api/platformsApi.ts";

interface NavigationBarProps {
    isLoggedIn: boolean
    username?: string
}

export function NavigationBar({ isLoggedIn, username }: NavigationBarProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [platforms, setPlatforms] = useState<Platform[]>([])
    const [productTypes, setProductTypes] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const [typesRes, categoriesRes, platformsRes] = await Promise.all([
                    ProductTypeApi.getAll(),
                    CategoriesApi.getAll(),
                    PlatformsApi.getAll(),
                ])

                setProductTypes(typesRes.content ?? typesRes)
                setCategories(categoriesRes.content ?? categoriesRes)
                setPlatforms(platformsRes.content ?? platformsRes)
            } catch (err) {
                console.error("Błąd pobierania danych do nawigacji:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchMenuData()
    }, [])

    const [searchOpen, setSearchOpen] = React.useState(false)
    const [authOpen, setAuthOpen] = React.useState(false)
    const [userAccountOpen, setUserAccountOpen] = React.useState(false)

    const handleUserIconClick = () => {
        if (isLoggedIn) setUserAccountOpen(true)
        else setAuthOpen(true)
    }

    return (
        <header className="w-full bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-white border-b border-[#3A3A3A] shadow-md">
            {/* Górna część: logo + wyszukiwarka + koszyk + profil */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#3A3A3A] bg-gradient-to-b from-[#2A2A2A] to-[#1F1F1F]">
                {/* Lewa strona */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={Logo} alt="KeyForge Logo" className="h-16 w-auto" />
                        <span className="hidden md:block ml-4 text-2xl font-bold text-[#D4A44A] tracking-wide">
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
                    <button className="md:hidden relative" onClick={() => setSearchOpen(true)}>
                        <SearchIcon className="h-5 w-5" />
                    </button>

                    {/* Overlay wyszukiwania na mobile */}
                    {searchOpen && (
                        <div
                            className="fixed inset-0 bg-[#3A3A3A]/80 z-50 flex flex-col items-center p-3 pt-24"
                            onClick={() => setSearchOpen(false)}
                        >
                            <div
                                className="w-full bg-[#3A3A3A]/80 max-w-md relative"
                                onClick={(e) => e.stopPropagation()}
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

                    {/* Koszyk */}
                    <Link to="/cart" className="flex items-center hover:text-primary transition">
                        <ShoppingCartIcon className="h-5 w-5" />
                    </Link>

                    {/* Sekcja użytkownika */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={handleUserIconClick}
                    >
                        <UserIcon className="h-5 w-5" />
                        {isLoggedIn ? (
                            <span className="font-medium text-sm">{username}</span>
                        ) : (
                            <span className="font-medium text-sm hidden md:inline">Zaloguj się</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Dolna część: nawigacja */}
            <div className="flex justify-center border-t border-border bg-inherit/20">
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-0 md:gap-6 py-2">

                        {/* Kategorie */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="!bg-inherit">
                                Kategorie
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[340px] gap-3 p-4">
                                    {loading && <li>Ładowanie...</li>}
                                    {!loading && categories.map((cat: { id: React.Key | null | undefined; name: string }) => (
                                        <ListItem
                                            key={cat.id}
                                            href={`/category/${cat.id}`}
                                            title={cat.name}
                                        />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Platformy */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="!bg-inherit">
                                Platformy
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[340px] gap-3 p-4">
                                    {loading && <li>Ładowanie...</li>}
                                    {!loading && platforms.map((p: { id: React.Key | null | undefined; name: string }) => (
                                        <ListItem key={p.id} href={`/platform/${p.id}`} title={p.name} />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Typy produktów */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="!bg-inherit">
                                Typy produktów
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[340px] gap-3 p-4">
                                    {loading && <li>Ładowanie...</li>}
                                    {!loading && productTypes.map((t: { id: React.Key | null | undefined; name: string }) => (
                                        <ListItem key={t.id} href={`/type/${t.id}`} title={t.name} />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Dialog logowania i konto */}
            <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
            <UserAccount
                open={userAccountOpen}
                onOpenChange={setUserAccountOpen}
                user={username ?? "Użytkownik"}
                email="user@example.com"
                onLogout={() => {
                    setUserAccountOpen(false)
                    console.log("Wylogowano")
                }}
            />
        </header>
    )
}

/* Komponent listy */
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
