import Navbar from "@/app/components/navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
