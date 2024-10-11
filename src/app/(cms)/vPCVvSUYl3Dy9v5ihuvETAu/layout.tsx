import Sidebar from "@/app/components/sidebar";

interface CmsLayoutProps {
  children: React.ReactNode;
}

const CmsLayout = ({ children }: CmsLayoutProps) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-[100%] bg-[#fafafa] md:w-[80%]">{children}</div>
    </div>
  );
};

export default CmsLayout;
