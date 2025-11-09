"use client"

import * as React from "react"
import { Link } from "@tanstack/react-router"
import { UserIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserAccount } from "@/components/UserAccount"
import { CartHoverSection } from "@/components/CartHoverSection"
import { useNavigate } from "@tanstack/react-router"
import {useAuth} from "@/hooks/useAuthToken.ts";
import Logo from "@/assets/logo_keyforge.png"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useEffect, useState } from "react"
import { type Category, type Platform, type ProductType } from "@/api"
import { ProductTypeApi } from "@/api/productTypeApi.ts"
import { CategoriesApi } from "@/api/categoriesApi.ts"
import { PlatformsApi } from "@/api/platformsApi.ts"
import {getKeycloakInstance} from "@/KeycloakContext.tsx";

export function NavigationBar() {
    const [categories, setCategories] = useState<Category[]>([])
    const [platforms, setPlatforms] = useState<Platform[]>([])
    const [productTypes, setProductTypes] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()
    const {username, email, isAuthenticated} = useAuth()
    const isKeycloakDisabled = localStorage.getItem('keycloak_disabled') === 'true'
    const keycloak = getKeycloakInstance()
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        navigate({
            to: "/products",
            search: { name: searchTerm.trim() }
        })
        setSearchOpen(false)
    }

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
    const [userAccountOpen, setUserAccountOpen] = React.useState(false)

    const handleUserIconClick = () => {
        if (isKeycloakDisabled) {
            alert('System logowania jest obecnie niedostępny. Spróbuj ponownie później')
            return
        }

        if (isAuthenticated) {
            setUserAccountOpen(true)
        } else {
            const currentUrl = window.location.href;

            const redirectUri = currentUrl.includes("error")
                ? window.location.origin
                : window.location.href;

            keycloak?.login({ redirectUri });
        }
    }

    return (
        <header className="w-full bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-white border-b border-[#3A3A3A] shadow-md">
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#3A3A3A] bg-gradient-to-b from-[#2A2A2A] to-[#1F1F1F]">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={Logo} alt="KeyForge Logo" className="h-16 w-auto" />
                        <span className="hidden md:block ml-4 text-2xl font-bold text-[#D4A44A] tracking-wide">
                          KEYFORGE
                        </span>
                    </Link>
                </div>
                <div className="hidden md:flex relative w-[40%]">
                    <form onSubmit={handleSearch} className="w-full">
                        <Input
                            type="text"
                            placeholder="Szukaj gier, DLC lub platform..."
                            className="pl-9 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <SearchIcon
                            className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                            onClick={handleSearch}
                        />
                    </form>
                </div>
                <div className="flex items-center gap-5">
                    <button className="md:hidden relative" onClick={() => setSearchOpen(true)}>
                        <SearchIcon className="h-5 w-5" />
                    </button>
                    {searchOpen && (
                        <div
                            className="fixed inset-0 bg-[#3A3A3A]/80 z-50 flex flex-col items-center p-3 pt-24"
                            onClick={() => setSearchOpen(false)}
                        >
                            <div
                                className="w-full bg-[#3A3A3A]/80 max-w-md relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <form onSubmit={handleSearch} className="w-full">
                                    <Input
                                        type="text"
                                        placeholder="Szukaj gier, DLC lub platform..."
                                        className="pl-9 w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <SearchIcon
                                        className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                                        onClick={handleSearch}
                                    />
                                </form>
                                <button
                                    className="absolute right-2 top-2 !bg-[#3A3A3A]/80"
                                    onClick={() => setSearchOpen(false)}
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    )}
                    <CartHoverSection />
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={handleUserIconClick}
                    >
                        <UserIcon className="h-5 w-5" />
                        {isAuthenticated ? (
                            <span className="font-medium text-sm">{username}</span>
                        ) : (
                            <span className="font-medium text-sm hidden md:inline">
                                {'Zaloguj się'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-center border-t border-border bg-inherit/20">
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-0 md:gap-6 py-2">
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="!bg-inherit">
                                Kategorie
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[340px] gap-3 p-4">
                                    {loading && <li>Ładowanie...</li>}
                                    {!loading && categories.map((cat) => (
                                        <ListItem
                                            key={cat.id}
                                            href={`products/category/${cat.id}`}
                                            title={cat.name}
                                        />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="!bg-inherit">
                                Platformy
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[340px] gap-3 p-4">
                                    {loading && <li>Ładowanie...</li>}
                                    {!loading && platforms.map((p) => (
                                        <ListItem key={p.id} href={`products/platform/${p.id}`} title={p.name} />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="!bg-inherit">
                                Typy produktów
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[340px] gap-3 p-4">
                                    {loading && <li>Ładowanie...</li>}
                                    {!loading && productTypes.map((t) => (
                                        <ListItem key={t.id} href={`products/type/${t.id}`} title={t.name} />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            {/* TODO: calculate level here or in UserAccount component*/}
            {!isKeycloakDisabled && (
                <UserAccount
                    open={userAccountOpen}
                    onOpenChange={setUserAccountOpen}
                    user={username}
                    email={email}
                    level={"Mistrz Kowal"}
                    onLogout={() => {
                        setUserAccountOpen(false)
                        keycloak?.logout({
                            redirectUri: "http://localhost:5173"
                        })
                    }}
                />
            )}
        </header>
    )
}

function ListItem({
                      title,
                      href,
                      children,
                      ...props
                  }: React.ComponentPropsWithoutRef<"li"> & { href: string; title: string }) {
    const navigate = useNavigate()

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        navigate({ to: `/${href}` })
    }

    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <a
                    href={`/${href}`}
                    onClick={handleClick}
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition hover:bg-accent hover:text-accent-foreground"
                >
                    <div className="text-sm font-medium">{title}</div>
                    {children && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">{children}</p>
                    )}
                </a>
            </NavigationMenuLink>
        </li>
    )
}