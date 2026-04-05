import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <Header />
        <div className="flex-1 p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
