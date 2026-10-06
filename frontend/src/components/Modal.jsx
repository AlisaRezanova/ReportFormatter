import { useEffect, useRef } from 'react'

export default function Modal({ open, onClose, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="modal"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) ref.current.close()
      }}
    >
      {open ? children : null}
    </dialog>
  )
}
