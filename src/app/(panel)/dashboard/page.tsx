
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

export default async function Dashboard() {

  const session = await getSession();
  if(!session) {
    redirect("/");
  }
  return (
    <div>
      <h1>Página Dashboard</h1>
      <div className="w-full h-[600px] bg-green-300 pb-48 mt-2">teste</div>
      <div className="w-full h-[600px] bg-green-300 pb-48 mt-2">teste</div>
      <div className="w-full h-[600px] bg-green-300 pb-48 mt-2">teste</div>
      <div className="w-full h-[600px] bg-green-300 pb-48 mt-2">teste</div>
    </div>
  )
}