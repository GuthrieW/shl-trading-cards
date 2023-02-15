import React from 'react'
import Modal from '../modal'

type ErrorModalProps = {
  title: string
  subtitle: string
}

const ErrorModal = ({ title, subtitle }: ErrorModalProps) => (
  <Modal setShowModal={null} title={title} subtitle={subtitle}>
    <p className="text-red-700">Could not find user</p>
  </Modal>
)

export default ErrorModal
