"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaChartLine, FaPlus, FaUser, FaSignOutAlt, FaHourglassHalf , FaClipboardList, FaBoxOpen,FaTags, FaThList} from "react-icons/fa";
import { MdCheckCircle , MdCategory} from "react-icons/md";
import Footer from '/src/components/Footer';
import { getOperations , getProduits, getCurrentUser} from '/src/api';
import { deleteCookie } from 'cookies-next';

const Page = () => {


  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });

  const role = userData?.roles || "";
  console.log("mon role", role);
  const { data: operations } = useQuery({
    queryKey: ['operations'],
    queryFn: getOperations(),
  });

  const { data: produits } = useQuery({
    queryKey: ['produits'],
    queryFn: getProduits(),
  });
  
  console.log(produits);
  const getTotalPartenariats = () => operations ? operations.length : 0;
  const getTotalvalide = () => produits ? produits.length : 0;
  //const getTotalencorevalide = () => operations ? operations.length : 0;

  const getTotalOperationsToday = () => {
    // Obtenez la date actuelle
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Les mois commencent à 0
    const currentDay = today.getDate();
  
    // Filtrez les opérations qui correspondent à la date actuelle
    const operationsToday = operations?.filter(op => {
      const [year, month, day] = op.dateCreation;
      return year === currentYear && month === currentMonth && day === currentDay;
    });
  
    // Retournez le nombre total
    return operationsToday?.length || 0;
  };
  const StatCard = ({ icon: Icon, title, value, bgColor }) => (
    <div className={`flex items-center p-4 rounded-lg shadow-md mb-4 ${bgColor}`}>
      <Icon className="text-3xl mr-4" />
      <div>
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Professional Sidebar */}
      <div className="w-72 bg-white shadow-xl border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10 text-center">
          
          <h1 className="text-2xl font-bold text-brown-800 mb-2">Opération Ramadan </h1>
          <p className="text-sm text-gray-500">Plateforme de Solidarité</p>
        </div>

        <nav className="space-y-2 flex-grow">
          <div className="text-sm font-semibold text-gray-500 mb-4">NAVIGATION</div>
          
          {role === "USER_ROLES" && (
        <>
          <Link href="/operation" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <FaPlus className="mr-2" />
            Ajouter un Stock
          </Link>
          <Link href="/liste_stock" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <FaBoxOpen className="mr-2" />
            Mes Opérations
          </Link>
          <Link href="/stock_max" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <FaClipboardList className="mr-2" />
            Stock à atteindre
          </Link>
        </>
      )}
      {role === "ADMIN_ROLES" && (
        <Link href="/statistiques" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <FaChartLine className="mr-2" />
          Tableau de bord
        </Link>
      )}
          
          <Link href="/user" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <FaUser className="mr-2" />
            Mon Profil
          </Link>

          <div className="border-t border-gray-200 my-4"></div>

          <div className="text-sm font-semibold text-gray-500 mb-4">STATISTIQUES</div>
          
          <StatCard 
            icon={FaBoxOpen} 
            title="Total des opérations" 
            value={getTotalPartenariats()} 
            bgColor="bg-blue-50 text-blue-600"
          />
          
          <StatCard 
            icon={FaClipboardList} 
            title="Opérations du jour" 
            value={getTotalOperationsToday()} 
            bgColor="bg-yellow-50 text-yellow-600"
          />
          <StatCard 
            icon={MdCategory} 
            title="Catégories de produits" 
            value={getTotalvalide()} 
            bgColor="bg-green-50 text-green-600"
          />
          
          
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              deleteCookie("token");
              window.location.href = "/login";
            }}
            className="w-full text-white bg-red-600 hover:bg-red-700 p-2 rounded-md flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-nude-100 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-m font-bold mb-4 text-brown-800"> Ensemble, nous veillons à ce que chacun puisse vivre ce mois béni dans la dignité et la sérénité.</h3>
            

            

            <div className="mt-12">
             
              {/*<p className="text-gray-600">Découvrez les moments marquants de notre action à travers ces images.</p>
              <div className="mt-4">
    <video
      src="/vedeo.mp4"
      controls
      className="rounded-lg shadow-md w-full h-auto"
    >
      Votre navigateur ne prend pas en charge la balise vidéo. Veuillez utiliser un navigateur moderne.
    </video>
  </div>*/}


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
  <img src="/FB_IMG_1.jpg" alt="Photo 1" className="rounded-lg shadow-md w-40 h-40 object-cover" />
  <img src="/FB_IMG_2.jpg" alt="Photo 2" className="rounded-lg shadow-md w-40 h-40 object-cover" />
  
  <img src="/FB_IMG_4.jpg" alt="Photo 4" className="rounded-lg shadow-md w-40 h-40 object-cover" />
  <img src="/FB_IMG_5.jpg" alt="Photo 5" className="rounded-lg shadow-md w-40 h-40 object-cover" />
  <img src="/FB_IMG_6.jpg" alt="Photo 6" className="rounded-lg shadow-md w-40 h-40 object-cover" />
  <img src="/FB_IMG_7.jpg" alt="Photo 7" className="rounded-lg shadow-md w-40 h-40 object-cover" />
  <img src="/FB_IMG_8.jpg" alt="Photo 8" className="rounded-lg shadow-md w-40 h-40 object-cover" />
  <img src="/FB_IMG_9.jpg" alt="Photo 9" className="rounded-lg shadow-md w-40 h-40 object-cover" />
</div>



  

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;