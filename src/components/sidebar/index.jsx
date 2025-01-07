import Link from "next/link";
import { useRouter } from 'next/router';
import { FaUser, FaUsers , FaHome} from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import { FaUserFriends } from 'react-icons/fa';
import { FaHandshake } from 'react-icons/fa';
import { FaMapMarker } from 'react-icons/fa';
import { BiMapPin } from 'react-icons/bi';
import { FaShareAlt } from 'react-icons/fa';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaSitemap } from 'react-icons/fa';
import { useQuery } from "@tanstack/react-query";
import { api, getDelegations, getUsers, getCurrentUser } from "/src/api/index.js";
import { FaAddressBook } from 'react-icons/fa';
import { FaFolderOpen } from 'react-icons/fa';
import { FaBookReader } from 'react-icons/fa';
import { FaUserGraduate, FaBuilding, FaBook, FaNewspaper, FaFileAlt, FaFeatherAlt, FaCheckCircle } from 'react-icons/fa';
import { FaChartBar } from 'react-icons/fa';
import { setCookie, deleteCookie } from "cookies-next";
import Image from 'next/image';

const Sidebar = () => {
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });

  const roles = [
    { value: "1", label: "Siège" },
    { value: "2", label: "Délégué" },
    { value: "3", label: "Coordinateur" },
    { value: "4", label: "Service technique" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="flex flex-col bg-blue-900 text-white w-64 h-screen p-4">
        <img src="en.png" alt="Logo" className="h-10 mb-6" />

        { (userData?.roles === "SIEGE_ROLES" || userData?.roles === "DELEGUE_ROLES") && (
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center p-2 text-white hover:bg-gray-700 rounded-md">
              <FaHome className="mr-2" />
              Accueil
            </Link>
            {/* Add other links like "Partenaire", "Delegation" etc. */}
          </div>
        )}

    

        { (userData?.roles === "SIEGE_ROLES" || userData?.roles === "ADMIN_ROLES") && (
          <div className="flex flex-col space-y-4 mt-4">
            <Link href="/validation" className="flex items-center p-2 text-white hover:bg-gray-700 rounded-md">
              <FaCheckCircle className="mr-2" />
              Correction et Validation d&apos;articles
            </Link>
          </div>
        )}

        { (userData?.roles === "ADMIN_ROLES") && (
          <div className="flex flex-col space-y-4 mt-4">
            <Link href="/statistiques" className="flex items-center p-2 text-white hover:bg-gray-700 rounded-md">
              <FaChartBar className="mr-2" />
              Statistiques
            </Link>
          </div>
        )}

        {/* Logout button */}
        <div className="mt-auto">
          <button
            onClick={() => {
              deleteCookie("token");
              window.location.href = "/login";
            }}
            className="w-full text-white bg-red-600 hover:bg-red-700 p-2 rounded-md"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* The main content of your page goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
