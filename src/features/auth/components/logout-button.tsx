'use client'

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "../hooks";

export function LogoutButton() {
    const { logout, loading } = useAuth();

    const handleLogout = async () => {
        await logout();
    }

    return (
        <Button onClick={handleLogout} disabled={loading} variant={"destructive"}>
            {loading ? <Spinner /> : "Logout"}
        </Button>
    )
}
