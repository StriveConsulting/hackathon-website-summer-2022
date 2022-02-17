import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useContext, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  ArchiveIcon, ClipboardCopyIcon, ChevronUpIcon, UserIcon, ArrowCircleRightIcon, LogoutIcon, MoonIcon, SunIcon, QuestionMarkCircleIcon,
} from '@heroicons/react/solid';
import useDarkMode from './use-dark';
import { BonusContext } from './App';

interface RenderButtonProps {
  text: string,
  Icon: React.FunctionComponent<{ className: string }>
}
interface RenderButtonPropsWithOnClick extends RenderButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}
type MenuTuples = [string, React.FunctionComponent<{ className: string }>];

const defaultItems:MenuTuples[] = [
  ['Timers', ClipboardCopyIcon],
  ['Profile', ArchiveIcon],
  ['Settings', ArchiveIcon],
];

type Props = {
  items?: MenuTuples[]
};

export default function DropdownMenu({ items }: Props) {
  const initialText = 'Launcher';
  const [current, setCurrent] = useState(initialText);

  const { isAuthenticated, logout, loginWithRedirect, user, isLoading } = useAuth0();
  const list:MenuTuples[] = items || defaultItems;
  const { darkMode, toggle } = useDarkMode();
  function getClass(active:boolean) {
      const textStyle = active ? 'bg-brand-500 text-white' : 'text-gray-900';
      const baseStyle = 'group flex rounded-md items-center w-full px-2 py-2 text-sm disabled:text-gray-400 focus:text-black';
      return [textStyle, baseStyle].join(' ');
    }
  const RenderButton = React.memo(({ onClick, text, Icon, disabled = false }:RenderButtonPropsWithOnClick) => {

    return (
      <Menu.Item>
        {({ active }) => (
          <button type="button" onClick={onClick} disabled={disabled} className={getClass(active)}>
            <Icon className="w-5 h-5 mr-2  group-hover:text-white group-hover:disabled:text-gray-400" />
            {text}
          </button>
        )}
      </Menu.Item>
    );
  });


  function handleLoginLogout() {
    if (isLoading) return;
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      logout({ returnTo: window.location.origin });

    }
  }
  const { bonus, toggleBonus } = useContext(BonusContext);
  return (
    <Menu as="nav" className="relative inline-flex text-left text-gray-900">
      <Menu.Button className="flex ui">
        <div className="flex-1 text-left flex-nowrap">{user?.name ? user.name : 'Login'}</div>
        {isLoading ? (
          <ArrowCircleRightIcon
          className="w-5 h-5 ml-2 mr-1 text-violet-200 hover:text-violet-100 flex-0"
          aria-hidden="true" />
        ) : (
          <ChevronUpIcon
            className="w-5 h-5 ml-2 mr-1 text-violet-200 hover:text-violet-100 flex-0"
            aria-hidden="true"
          />
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="App-menu-items absolute right-0 bottom-10 origin-bottom-right">
          <div className="px-1 py-1 ">
            {list.map(([title, icon]) => (
              <RenderButton onClick={() => setCurrent(title)} text={title} Icon={icon} />
            ))}
            <RenderButton disabled={!isAuthenticated} onClick={() => toggleBonus(!bonus)} text='Easter Eggs' Icon={QuestionMarkCircleIcon} />
          </div>
          <div className="px-1 py-1">
              <RenderButton onClick={() => toggle(!darkMode)} text={darkMode ? 'Dark Theme' : 'Light Theme'} Icon={darkMode ? MoonIcon : SunIcon} />
            {isAuthenticated && (
              <RenderButton onClick={() => logout({ returnTo: window.location.origin })} text='Logout' Icon={LogoutIcon} />
            )}
            <RenderButton onClick={handleLoginLogout} text={user?.name ? user.name : 'Login'} Icon={UserIcon} />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
DropdownMenu.defaultProps = {
  items: defaultItems,
};
