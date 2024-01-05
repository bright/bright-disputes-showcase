import type { ButtonHTMLAttributes, Dispatch, ReactElement, SetStateAction } from 'react';
import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Float } from '@headlessui-float/react'

interface DropdownProps {
  onChange: (key: string) => void,
  collection: {
    key: string,
    label?: string,
  }[],
  value?: string,
  getElement?: (key?: string) => ReactElement
}

export const Dropdown = ({onChange, collection, value, getElement}: DropdownProps) => {
  const selected = collection.find(({key}) => key === value);

  return (<Listbox value={value} onChange={onChange}>
    {({open}) => (
      <Float placement="bottom" portal>
        <Listbox.Button className='min-h-[44px] relative w-full cursor-default border-b text-primary py-1.5 pl-3 pr-10 text-left border-b-primary focus:outline-none sm:text-sm sm:leading-6'>
          {selected
            ? getElement
              ? getElement(value)
              : selected.label
            : <div>&nbsp;</div>}

          <span className='pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2'>
            <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true'/>
          </span>
        </Listbox.Button>

        <Transition
          show={true}
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options
            className='mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
            {collection?.map(({key, label}) => (
              <Listbox.Option
                key={key}
                className={({active}) => `${active ? 'bg-indigo-600 text-white' : 'text-gray-900'} relative cursor-default select-none py-2 pl-3 pr-9`}
                value={key}
              >
                {({selected, active}) => (
                  <>
                    {getElement ? getElement(key) : label}
                    {selected ? (
                      <span
                        className={`${active ? 'text-white' : 'text-indigo-600'} absolute inset-y-0 right-0 flex items-center pr-4`}>
                          <CheckIcon className='h-5 w-5' aria-hidden='true'/>
                        </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Float>
    )}
  </Listbox>)
};
