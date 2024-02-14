/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import NewKidModal from "~/components/new-kid-modal";

export function NewUser() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function toggleModal() {
    setModalOpen((current) => !current);
  }

  return (
    <>
      <div
        onClick={toggleModal}
        className="flex w-full h-28 sm:h-40 p-4 justify-center items-center cursor-pointer rounded-sm border-slate-700/50 border shadow text-slate-700 hover:shadow-xl bg-slate-800/50 relative hover:bg-slate-800/80"
      >
        <div className="">
          <PlusIcon className="h-20 w-20" />
        </div>
      </div>
      <NewKidModal isOpen={modalOpen} setClose={() => setModalOpen(false)} />
    </>
  );
}
