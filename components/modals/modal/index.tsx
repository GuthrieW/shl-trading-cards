import React from 'react'
import { XIcon } from '@heroicons/react/solid'

type EditCardModalProps = {
  children: any
  setShowModal: Function
  title: string
}

const Modal = ({ children, setShowModal, title }: EditCardModalProps) => (
  <>
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative w-auto my-6 mx-auto max-w-3xl">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
            <h3 className="text-3xl font-semibold">{title}</h3>
            <button
              className="mx-1 w-8 h-8 hover:bg-gray-300 rounded-md cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              <XIcon fill="black" stroke="black" />
            </button>
          </div>
          <div className="relative p-6 flex-auto">{children}</div>
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </>
)

export default Modal
