import React from "react";
import Image from 'next/image';
import MainHeader from "@/components/header/MainHeader";
import MainFooter from "@/components/footer/Footer";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="home-page">
      <MainHeader />
      
      <div className="content-wrapper">
        {children}
      </div>

      <MainFooter />
    </div>
  );
}
