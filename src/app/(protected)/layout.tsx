"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { login, logout } from "@/store/slices/authSlice";
import { Loader } from "@/components/ui/Loader";
import authService from "@/services/authService";
import { useAccount, useDisconnect } from "wagmi";
import { RootState } from "@/store";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const storeAddress = useSelector((state: RootState) => state.auth.address);

  // Logout handler
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {}

    dispatch(logout());
    disconnect();
    router.replace("/");
  };

  // check backend session on mount
  const verifySession = async () => {
    try {
      const user = await authService.fetchMe();

      if (!user) {
        handleLogout();
        return;
      }

      dispatch(login(user.address));
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // verify session on component mount
  useEffect(() => {
    verifySession();
  }, []);

  // Wallet guard: if user is connected but wallet address doesn't match the authenticated address, log them out
  useEffect(() => {
    if (loading) return;
    if (!storeAddress) return;

    const current = address?.toLowerCase();
    const authed = storeAddress.toLowerCase();

    if (!isConnected || current !== authed) {
      handleLogout();
    }
  }, [address, isConnected, storeAddress, loading]);

  // Show loader while verifying session or if there's a mismatch in wallet connection
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="size-10" />
      </div>
    );
    return (
      <Loader className="flex h-screen w-full items-center justify-center" />
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col lg:ml-65">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
