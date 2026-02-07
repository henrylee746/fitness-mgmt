import React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dock, DockIcon } from "@/components/ui/dock"

import { HomeIcon } from "lucide-react"
import { FaUser } from "react-icons/fa";
import { IoMdFitness } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";
import { ToggleTheme } from "./ui/toggle-theme"

export type IconProps = React.HTMLAttributes<SVGElement>

const Icons = {
    member: (props: IconProps) => <FaUser {...props} />,
    trainer: (props: IconProps) => <IoMdFitness {...props} />,
    admin: (props: IconProps) => <RiAdminFill {...props} />,
}

const DATA = {
    pages: {
        home: { href: "/", icon: HomeIcon, label: "Home" },
        roles: {
            Member: {
                name: "Member Hub",
                url: "/member",
                icon: Icons.member,
            },
            Trainer: {
                name: "Trainer Hub",
                url: "/trainer",
                icon: Icons.trainer,
            },
            Admin: {
                name: "Admin Hub",
                url: "/admin",
                icon: Icons.admin,
            },
        },
    },
}

export function HeaderDock({ role }: { role: string }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <TooltipProvider>
                <Dock direction="middle" disableMagnification className="ml-4">
                    <ToggleTheme
                        duration={600}
                        animationType="swipe-up"
                        className="mx-auto cursor-pointer"
                    />
                    <DockIcon key={DATA.pages.home.label}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={DATA.pages.home.href}
                                    aria-label={DATA.pages.home.label}
                                    className={cn(
                                        buttonVariants({ variant: "ghost", size: "icon" }),
                                        "size-12 rounded-full"
                                    )}
                                >
                                    <DATA.pages.home.icon className="size-5" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{DATA.pages.home.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    </DockIcon>
                    <Separator orientation="vertical" className="h-full" />
                    {/* Member */}
                    <DockIcon key={DATA.pages.roles.Member.name}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={DATA.pages.roles.Member.url}
                                    aria-label={DATA.pages.roles.Member.name}
                                    className={cn(
                                        buttonVariants({ variant: "ghost", size: "icon" }),
                                        "size-12 rounded-full"
                                    )}
                                >
                                    <DATA.pages.roles.Member.icon className="size-5" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{DATA.pages.roles.Member.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </DockIcon>
                    {/* Loop through roles and render each role (if role matches) */}
                    {Object.entries(DATA.pages.roles).map(([name, roles]) => (
                        name.toLowerCase().includes(role.toLowerCase()) && (
                            <DockIcon key={name}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={roles.url}
                                            aria-label={roles.name}
                                            className={cn(
                                                buttonVariants({ variant: "ghost", size: "icon" }),
                                                "size-12 rounded-full"
                                            )}
                                        >
                                            <roles.icon className="size-5" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </DockIcon>
                        )
                    ))}
                </Dock>
            </TooltipProvider>
        </div>
    )
}
