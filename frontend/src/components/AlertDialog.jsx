import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const AlertDialog = ({ onConfirm, onCancel }) => {
  return (
    <Dialog open={true} onClose={onCancel} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-900/50" />
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel className="max-w-lg w-full bg-gray-800 rounded-lg shadow-xl">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 sm:mx-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle className="text-base font-semibold text-white">
                  Confirm Delete
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-400">
                  Are you sure you want to delete this client? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="w-full sm:w-auto bg-red-500 px-3 py-2 rounded-md text-white hover:bg-red-400 sm:ml-3"
              onClick={onConfirm}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 w-full sm:mt-0 sm:w-auto bg-white/10 px-3 py-2 rounded-md text-white hover:bg-white/20"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default AlertDialog