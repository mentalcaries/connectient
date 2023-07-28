import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata = {
  title: 'Connectient',
  description: 'Appointment request system',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-sans-serif text-lg">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
