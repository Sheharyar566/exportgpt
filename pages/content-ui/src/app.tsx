import { useState } from 'react';
import Header from './header';
import Messages from './messages';
import ModalWrapper from './wrapper';
import Footer from './footer';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="wrapper">
      <div className="absolute right-0 top-[20%]">
        <button
          className="rounded-l-lg bg-indigo-900 text-white w-[100px] h-[50px] grid place-items-center font-bold"
          onClick={() => setIsModalOpen(true)}>
          Export
        </button>
      </div>

      {isModalOpen && (
        <ModalWrapper>
          <Header onClose={() => setIsModalOpen(false)} />
          <Messages />
          <Footer />
        </ModalWrapper>
      )}
    </div>
  );
}
