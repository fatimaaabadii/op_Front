"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaChartLine, FaPlus, FaHome, FaUser, FaBoxOpen, FaSignOutAlt, FaSearch, FaClipboardList  } from "react-icons/fa";
import { getStockByDelegations, getCurrentUser } from "/src/api";
import { deleteCookie } from "cookies-next";

const Page = () => {
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });
 

  const role = userData?.roles || "";
  const { data: operations, refetch: refetchOperations } = useQuery({
    queryKey: ["operations", userData?.unite?.delegationId],
    queryFn: () => getStockByDelegations(userData?.unite?.delegationId),
    enabled: !!userData?.unite?.delegationId,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 11;

  const formatDate = (dateArray) => {
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
  };

  const filteredOperations = useMemo(() => {
    if (!operations) return [];
    return operations.filter((operation) => {
      return (
        operation.delegation.nomDelegation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        operation?.details?.some((detail) =>
          detail.produit.nomProduit.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  }, [operations, searchQuery]);

  const indexOfLastOperation = currentPage * itemsPerPage;
  const indexOfFirstOperation = indexOfLastOperation - itemsPerPage;
  const currentOperations = filteredOperations.slice(indexOfFirstOperation, indexOfLastOperation);
  console.log(currentOperations);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar original */}
      <div className="w-72 bg-white shadow-xl border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-brown-800 mb-2">Opération Ramadan</h1>
          <p className="text-sm text-gray-500">Plateforme de Solidarité</p>
        </div>

        <nav className="space-y-2 flex-grow">
          <div className="text-sm font-semibold text-gray-500 mb-4">NAVIGATION</div>
          <Link href="/" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <FaHome className="mr-2" />
            Accueil
          </Link>
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

      {/* Main Content avec nouveau tableau */}
      <div className="flex-grow p-6">
        <h2 className="text-2xl font-bold mb-4">Stock à atteindre</h2>

        {/* Barre de recherche améliorée 
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par produit ou délégation..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>*/}

        {/* Tableau amélioré */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="min-w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Délégation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produits 
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantités max 
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOperations.map((operation) => (
                    
                  <tr 
                    key={operation.operationId}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                   
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {operation?.delegation?.nomDelegation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {operation?.produit?.nomProduit}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {operation?.quantiteMax}
                    </td>
                    
                   {/* <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="space-y-1">
                        {operation.map((detail, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="font-medium">{detail.produit.nomProduit}</span>
                            <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded ml-4">
                              {detail.quantite}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>*/}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination améliorée */}
        <div className="mt-6 flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm text-gray-700">
              Affichage de{' '}
              <span className="font-medium">{indexOfFirstOperation + 1}</span>
              {' '}à{' '}
              <span className="font-medium">
                {Math.min(indexOfLastOperation, filteredOperations.length)}
              </span>
              {' '}sur{' '}
              <span className="font-medium">{filteredOperations.length}</span>
              {' '}résultats
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredOperations.length / itemsPerPage)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;