export const metadata = {
  title: "QRSECU Test",
  description: "Minimal deployment test",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}