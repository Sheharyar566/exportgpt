import { ReactNode } from 'react';

const ModalWrapper = ({ children }: { children: ReactNode }) => (
  <div className="absolute inset-0 backdrop-blur-md grid place-items-center">
    <div className="bg-[#212121] rounded-lg w-full max-w-[584px] overflow-y-scroll h-[80vh]">{children}</div>
  </div>
);

export default ModalWrapper;
