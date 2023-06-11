import Link from "next/link";
import { Header } from "../components/others/Header";

export default function Page() {
  return (
    <>
      <Header />
      <div className="pt-[56px] w-screen h-screen bg-slate-50">
        <div className="p-8">
          <Link
            href="/questions"
            className="flex text-3xl w-[240px] p-4 h-[120px] bg-white border border-slate-200 rounded-lg"
          >
            Questions
          </Link>
        </div>
      </div>
    </>
  );
}
