import { useLocation } from "react-router-dom";


export default function Navbar() {
  // @ts-expect-error TS6133
  let location = useLocation();

  return (
    <div className='flex h-20 items-center px-5 bg-background justify-between  sm:px-10 shadow-xl fixed w-full'>
      <a href="/">
      <img src="../public/delp-nobg.png" alt="delp-logo" className="h-10 sm:h-24" />
      </a>
      <span className="pr-10">
      </span>
    </div>
  )
}
