import Image from "next/image";
import localFont from "next/font/local";
import { SessionContext } from "@/contexts/session";
import React, { useEffect, useContext } from "react";

// Import default pages
import WelcomePage from "@/components/pages/welcome";
import LoginPage from "@/components/pages/login";
import MyBlogsPage from "@/components/pages/myblogs";
import BlogListPage from "@/components/pages/blogList";
import TemplatesPage from "@/components/pages/templates";
import RegisterPage from "@/components/pages/register";
import Custom404 from "@/components/pages/404";
import ProfilePage from "@/components/pages/profile";
import WorkInProgress from "@/components/pages/work-in-progress";
import MyTemplatesPage from "@/components/pages/mytemplates";

// Import the components
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

// Import the Image processing pages
import ImageUploadPage from "@/components/pages/imageUpload";
import ImageLinkGeneratorPage from "@/components/pages/imageLinkGenerator";
import ImageDescribePage from "@/components/pages/imageDescribe";
import ImageDescribeLegacyPage from "@/components/pages/imageDescribeLegacy";

// Import the router
import { useRouter } from "next/router";
import { useState } from "react";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const { session } = useContext(SessionContext);
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router.asPath]);

  if (!isClient) {
    return null;
  }


  const renderPage = () => {
    switch (router.asPath) { // Use asPath instead of pathname
      case "/":
        //return <WelcomePage />;
        return <ImageDescribePage />;

      case "/process-image":
        return <ImageUploadPage />;
      case "/generate-image-link":
        return <ImageLinkGeneratorPage />;
      case "/describe-image":
        return <ImageDescribePage />;
      case "/describe-image-legacy":
        return <ImageDescribeLegacyPage />;
      case "/login":
        return <LoginPage />;
      case "/register":
        return <RegisterPage />;
      case "/profile":
        return <ProfilePage />;
      case "/blogs":
        return <BlogListPage />;
      case "/my-blogs":
        return <MyBlogsPage />;
      case "/templates":
        return <TemplatesPage />;
      case "/work-in-progress":
        return <WorkInProgress />;
      case "/my-templates":
        return <MyTemplatesPage />;
      default:
        if (router.asPath.startsWith("/templates?")) {
          return <TemplatesPage />;
        }
        if (router.asPath.startsWith("/my-templates?")) {
          return <MyTemplatesPage />;
        }
        if (router.asPath.startsWith("/blogs?")) {
          return <BlogListPage />;
        }
        if (router.asPath.startsWith("/my-blogs?")) {
          return <MyBlogsPage />;
        }
        return <Custom404 />;
    }
  };

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans bg-background text-foreground`}>
      <main className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow">
          {renderPage()}
        </div>
        <Footer />
      </main>
    </div>
  );
}