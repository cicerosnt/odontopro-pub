'use client'
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import clsx from "clsx";
import { Banknote, Calendar, ChevronLeft, ChevronRight, Folder, List, LogOut, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import logoOdontoPro from "../../../../../public/logo-odonto.png";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";

export default function SidebarDashboard({children}: {children: React.ReactNode}){

  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);


  return (
    <div className="flex min-h-screen w-full">
    
      <aside
        className={clsx("flex flex-col border-r bg-background transition-all p-4 h-full", {
          "w-20": isCollapsed,
          "w-64": !isCollapsed,
          "hidden md:flex md:fixed": true,
        })}
      >
      
        <div className={clsx("mb-6 mt-4", {"hidden": isCollapsed})}>
          <Image 
            src={logoOdontoPro}
            priority
            quality={100}
            style={{
              width: 'auto', height: 'auto',
            }}
            alt="Logo do OdontoPro"
          />
        </div>
        
        <Button 
          variant="outline" 
          className="self-end mb-3 cursor-pointer" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="w-12 h-12" />
          ):(
            <ChevronLeft className="w-12 h-12" />
          )}
        </Button>
        
        {/* vai mostrar apenas quando estiver colapsado */}
        {isCollapsed && (
          <nav className="flex flex-col gap-3 overflow-hidden mt-2 bg-violet-300">
            <SidebarLink 
              href="/dashboard" 
              label="Agendamentos" 
              pathname={pathname} 
              isCollapsed={isCollapsed}
              icon={<Calendar className="w-5 h-5" />} 
            />
            <SidebarLink
              href="/dashboard/profile"
              label="Perfil"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<User2 className="w-5 h-5" />}
            />
            <SidebarLink 
              href="/dashboard/plans" 
              label="Plans" 
              pathname={pathname} 
              isCollapsed={isCollapsed}
              icon={<Banknote className="w-5 h-5" />} 
            />
            
            <SidebarLink 
              href="/dashboard/services" 
              label="Serviços" 
              pathname={pathname} 
              isCollapsed={isCollapsed}
              icon={<Folder className="w-5 h-5" />} 
            />
          </nav>
        )}
        
        <Collapsible open={!isCollapsed} className="flex-1">
          <CollapsibleContent>
            <nav className="flex flex-col gap-1 overflow-hidden">
              <span className="text-sm text-gray-500 font-medium mt-1 mb-2 uppercase">
                Dashboard
              </span>
              <SidebarLink 
                href="/dashboard" 
                label="Agendamentos" 
                pathname={pathname} 
                isCollapsed={isCollapsed}
                icon={<Calendar className="w-5 h-5" />}
              />
              <SidebarLink
                href="/dashboard/services"
                label="Serviços"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Folder className="w-5 h-5" />}
              />

              <span className="text-sm text-gray-500 font-medium mt-1 mb-2 uppercase">
                Painel
              </span>
              
              <SidebarLink
                href="/dashboard/profile"
                label="Perfil"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<User2 className="w-5 h-5" />}
              />
              
              <SidebarLink
                href="/dashboard/plans"
                label="Planos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Banknote className="w-5 h-5" />}
              />
            </nav>
          </CollapsibleContent>
        </Collapsible>

      </aside>

      <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
        "md:ml-20": isCollapsed,
        "md:ml-64": !isCollapsed
      })}>
      
        <header 
          className="md:hidden flex items-center justify-between p-4 shadow-md z-10 sticky top-0 bg-white ">
          <Sheet>
            <div className="flex items-center gap-4">
              <SheetTrigger asChild>
                <Button variant={"outline"} className="md:hidden" size={"icon"}>
                  <List className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <h1 className="text-base md:text-lg font-semibold">
                Menu OdontoPRO
              </h1>
            </div>

            <SheetContent side="left" className="sm:max-w-xs text-black p-4">
              <div className="mt-3">
                <SheetTitle>OdontoPRO</SheetTitle>
              </div>
              <SheetDescription>MENU ADMINISTRATIVO</SheetDescription>

              <nav className="grid gap-2 text-base">
                <SidebarLink 
                  href="/dashboard" 
                  label="Agendamentos" 
                  pathname={pathname} 
                  isCollapsed={isCollapsed}
                  icon={<Calendar className="w-5 h-5" />} 
                />
                <SidebarLink
                  href="/dashboard/profile"
                  label="Perfil"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<User2 className="w-5 h-5" />}
                />
                <SidebarLink 
                  href="/dashboard/plans" 
                  label="Plans" 
                  pathname={pathname} 
                  isCollapsed={isCollapsed}
                  icon={<Banknote className="w-5 h-5" />} 
                />
                
                <SidebarLink 
                  href="/dashboard/services" 
                  label="Serviços" 
                  pathname={pathname} 
                  isCollapsed={isCollapsed}
                  icon={<Folder className="w-5 h-5" />} 
                />
                                
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 py-4 px-2 md:p-6">{children}</main>
      
      </div>
    
    </div>
  )
}

interface SidebarLinkProps {
  href: string; 
  label: string; 
  pathname: string; 
  isCollapsed: boolean
  icon: React.ReactNode; 
}

function SidebarLink({ href, label, pathname, isCollapsed, icon }: SidebarLinkProps){
  return (
    <Link
      href={href}
    >
      <div 
        className={clsx("flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-400", {
          "text-white bg-blue-500": pathname === href, "text-gray-900 ": pathname !== href,
        })}
      >
        {icon}
        <span className={clsx({"hidden": isCollapsed})}>{label}</span>
      </div>
      
    </Link>
  )
}
