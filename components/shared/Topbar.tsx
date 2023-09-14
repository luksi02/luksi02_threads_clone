"use client"

import Link from "next/link";
import Image from "next/image";
import {OrganizationSwitcher, SignedIn, SignOutButton} from "@clerk/nextjs";
import {router} from "next/client";
import {usePathname, useRouter} from "next/navigation";
import { dark } from "@clerk/themes"

function Topbar() {
    const router = useRouter();
    const pathname = usePathname();


    return (
        <nav className="topbar">
            <Link href='/' className="flex itmes-center gap-4">
                <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
                <p className="text-heading3-bold text-light-1 max-xs:hidden">Luksi02's Threads Clone</p>
            </Link>

            <div className="flex items-center gap-1">
                <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                            <div className="flex cursor-pointer">
                                <Image
                                    src="/assets/logout.svg"
                                    alt="logout"
                                    width={24}
                                    height={24}
                                    />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>
            </div>

            <OrganizationSwitcher
                appearance={{
                    baseTheme: dark,
                    elements: {
                        organizationSwitcherTrigger: "py-2 px-4"
                    }
                }}
                />
        </nav>

        // <h1>Topbar</h1>
    )
}

export default Topbar;