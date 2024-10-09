// import AuthModal from "components/AuthModal"
import logo from "/logo.png";
import { Button } from "~/primitives/Button";
//import { MinistriesNavItem, WatchReadListenNavItem } from "./DropDownItems";

export function Navbar({ bg = "white" }: { bg?: string }) {
  return (
    <div
      className="inline-flex h-[72px] w-full items-center 
      justify-between px-12 py-5 shadow lg:px-8 xl:px-12"
      style={{ backgroundColor: bg ? bg : "transparent" }}
    >
      <div className="flex items-center justify-center gap-10 xl:gap-16">
        <a
          href="/"
          className="relative flex items-center justify-center gap-2.5"
        >
          <img alt="cf logo" src={logo} width={144} height={50} />
        </a>
        <div className="hidden gap-[40px] font-semibold lg:flex">
          <a href="/about">About</a>
          <a href="/locations">Locations</a>
          <a href="/events">Events</a>
          {/* <MinistriesNavItem />
          <WatchReadListenNavItem /> */}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        {/* Authentication Modal */}
        {/* <AuthModal /> */}
        <Button size="sm" intent="primary" href="/give">
          Give now
        </Button>
        <div className="MenuText flex items-center justify-center gap-1 lg:hidden">
          <div className="CustomMenu flex size-5 items-center justify-center px-px py-1" />
        </div>
      </div>
    </div>
  );
}
