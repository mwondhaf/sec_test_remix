import React from "react";

const Header = () => (
  <html>
    <head>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
          }
            .header-content: {
            margin-right: 2rem; width:100%; text-align:right; font-size:10px;}
        `}
      </style>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
      <div className="header-content">
        {/* <img
          src={`data:image/png;base64,${logoBase64}`}
          alt="Logo"
          style={{ height: "30px" }}
        /> */}
      </div>
    </body>
  </html>
);

export default Header;
