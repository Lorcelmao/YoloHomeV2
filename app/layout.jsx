import "./globals.css";
import PropTypes from "prop-types";
import favicon from "@/app/public/icons/favicon.svg";

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
      <body className={"text-black"}>
        {children}
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
