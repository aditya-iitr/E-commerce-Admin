"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
// 👇 1. Import usePathname
import { usePathname } from "next/navigation";
import { useSearch } from "@/context/SearchContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarHidden, setSidebarHidden] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [isSearchFormVisible, setSearchFormVisible] = useState(false);

  // 👇 2. Get the current URL path
  const pathname = usePathname();

  const { searchQuery, setSearchQuery } = useSearch();

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarHidden(true);
      } else {
        setSidebarHidden(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setSidebarHidden(!isSidebarHidden);
  const toggleDarkMode = () => setDarkMode(!isDarkMode);

  const handleSearchToggle = (e: React.MouseEvent) => {
    if (window.innerWidth < 576) {
      e.preventDefault();
      setSearchFormVisible(!isSearchFormVisible);
    }
  };
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    // 1. Call the API to delete the cookie
    await fetch("/api/auth/logout", { method: "POST" });

    // 2. Redirect to Login Page
    router.push("/login");
    router.refresh(); // Ensure the UI updates
  };

  return (
    <>
      <section id="sidebar" className={isSidebarHidden ? "hide" : ""}>
        <a href="#" className="brand">
          <i className="bx bx-cart bx-lg"></i>
          <span className="text">CartHub</span>
        </a>
        <ul className="side-menu top">
          {/* 👇 3. LOGIC CHANGE: Check if path is exactly "/" */}
          <li className={pathname === "/" ? "active" : ""}>
            <Link href="/">
              <i className="bx bxs-dashboard bx-sm"></i>
              <span className="text">Dashboard</span>
            </Link>
          </li>

          {/* 👇 4. LOGIC CHANGE: Check if path STARTS with "/products" */}
          {/* This keeps it active even if you go to /products/123 (Edit Page) */}
          <li className={pathname.startsWith("/products") ? "active" : ""}>
            <Link href="/products">
              <i className="bx bxs-shopping-bag-alt bx-sm"></i>
              <span className="text">My Store</span>
            </Link>
          </li>

          <li className={pathname.startsWith("/analytics") ? "active" : ""}>
            <Link href="/analytics">
              <i className="bx bxs-doughnut-chart bx-sm"></i>
              <span className="text">Analytics</span>
            </Link>
          </li>

          <li className={pathname.startsWith("/team") ? "active" : ""}>
            {/* 👇 This Link connects the button to your new page */}
            <Link href="/team">
              <i className="bx bxs-group bx-sm"></i>
              <span className="text">Team</span>
            </Link>
          </li>
        </ul>

        {/* ... (Bottom Menu stays the same) ... */}
        <ul className="side-menu bottom">
          <li>
            <a href="#">
              <i className="bx bxs-cog bx-sm bx-spin-hover"></i>
              <span className="text">Settings</span>
            </a>
          </li>

          <li>
            {/* 👇 The Logout Button */}
            <a href="#" onClick={handleLogout} className="logout">
              <i className="bx bx-power-off bx-sm bx-burst-hover"></i>
              <span className="text">Logout</span>
            </a>
          </li>
        </ul>
      </section>

      {/* CONTENT */}
      <section id="content">
        <nav>
          <i className="bx bx-menu bx-sm" onClick={toggleSidebar}></i>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginLeft: "auto",
            }}
          >
            <input
              type="checkbox"
              id="switch-mode"
              hidden
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <label className="swith-lm" htmlFor="switch-mode">
              <i className="bx bxs-moon"></i>
              <i className="bx bx-sun"></i>
              <div className="ball"></div>
            </label>

            <a href="#" className="notification">
              <i className="bx bxs-bell bx-tada-hover"></i>
              <span className="num">8</span>
            </a>

            <a href="#" className="profile">
              <img src="https://placehold.co/600x400/png" alt="Profile" />
            </a>
          </div>
        </nav>

        <main>{children}</main>
      </section>
    </>
  );
}
