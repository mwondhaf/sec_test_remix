import React from "react";

const Footer = () => (
  <html>
    <head>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            font-size: 8rem;
            max-width: 56rem; 
            margin-left: auto;
            margin-right: auto;
          }
        `}
      </style>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com" />
    </head>
    <body className="">
      <div className="max-w-4xl mx-auto">
        <span className="text-5xl">
          Page <span className="pageNumber"></span>
        </span>
      </div>
    </body>
  </html>
);

export default Footer;
