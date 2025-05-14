import "./globals.css";
import PropTypes from "prop-types";
import favicon from "@/app/public/icons/favicon.svg";
import Navbar from "@/app/components/Navbar";
import Navigation from "@/app/components/Navigation";

export const metadata = {
  title: "Yolo:Home",
  description: "Smart Home Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={favicon.src} />
        <title>Yolo:Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="text-black min-h-screen bg-gray-50">
        <Navbar />
        <main className="fade-in pt-4 pb-24 px-4 max-w-7xl mx-auto">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
