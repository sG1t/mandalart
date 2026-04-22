
// import Footer from "./footer";
import "./globals.css";
import Header from "./header";
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }) {
  return (
    <html
      lang="ja"
      // className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-dvh flex flex-col">
        <Header></Header>
        <div className="grow">
          {children}
          <Analytics/>
        </div>
        {/* <Footer></Footer> */}
      </body>
    </html>
  );
}
