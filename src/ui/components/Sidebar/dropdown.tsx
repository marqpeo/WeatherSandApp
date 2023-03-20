import { memo, useState } from 'react';

interface DropdownTypes {
  label: string,
  prefixIconName: string,
  openByDefault?: boolean,
  children: JSX.Element
}

const DropdownSideBar = ({ label, prefixIconName, openByDefault = false, children }: DropdownTypes) => {
  const [open, setOpen] = useState(openByDefault);
  return (
    <div className='transition-all duration-200'>
      <div className='flex items-center h-14 justify-between w-full'>
        <span className='material-symbols-outlined'>{prefixIconName}</span>
        <label className='text-xl leading-6 text-center'>{label}</label>
        <button
          className={`material-symbols-outlined transition p-0 cursor-pointer ring-inset z-10 duration-300${open ? ' rotate-90' : ''}`}
          onClick={e => {
          setOpen(v => !v);
        }}
          >expand_more</button>
      </div>
      <div className={`transition-height duration-500 transform ease-in-out ${open ? ' opacity-100 scale-100 child:h-auto' : 'opacity-0 scale-95 child:h-0 -z-50'}`}>
        {open && children}
      </div>
    </div>
  );
};

export default memo(DropdownSideBar);