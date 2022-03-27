import React from 'react'
import { XIcon } from '@heroicons/react/solid'

type EditCardModalProps = {
  children: any
  setShowModal: Function
  title?: string
  subtitle?: string
}

const Modal = ({
  children,
  setShowModal,
  title,
  subtitle,
}: EditCardModalProps) => (
  <>
    {title && subtitle ? (
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex flex-col items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <div className="flex justify-between w-full">
                <p className="text-3xl font-semibold">{title}</p>
                <button
                  className="mx-1 w-6 h-6 hover:bg-gray-300 rounded-md cursor-pointer"
                  onClick={() => setShowModal(false)}
                >
                  <XIcon fill="black" stroke="black" />
                </button>
              </div>
              <div className="mx-2">
                <p>{subtitle}</p>
              </div>
            </div>
            <div className="relative p-6 flex-auto">{children}</div>
          </div>
        </div>
      </div>
    ) : (
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={() => setShowModal(false)}
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">{children}</div>
      </div>
    )}
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </>
)

export default Modal
