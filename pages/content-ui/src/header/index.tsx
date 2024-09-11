import { IoClose } from 'react-icons/io5';

interface Props {
  onClose: () => void;
}

const Header = ({ onClose }: Props) => (
  <div className="flex flex-row justify-between items-center sticky top-0 h-14 backdrop-blur-md p-4 bg-gray-700/50">
    <h2>Export</h2>

    <button onClick={onClose}>
      <IoClose />
    </button>
  </div>
);

export default Header;
