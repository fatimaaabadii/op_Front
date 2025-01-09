"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaChartLine, FaPlus, FaHome, FaUser, FaBoxOpen, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import { deleteCookie } from "cookies-next";
import { getDashboard, getProduits, getDashboardTotal } from "/src/api";

const Page = () => {
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  const { data: dashboardtotal, isLoading: dashboardTotalLoading } = useQuery({
    queryKey: ["dashboardTotal"],
    queryFn: getDashboardTotal,
  });

  console.log("dashboardtotal ", dashboardtotal);
  const { data: produits, isLoading: produitsLoading } = useQuery({
    queryKey: ["produits"],
    queryFn: getProduits,
  });

  const [search, setSearch] = useState("");

  const getAllUniqueProducts = (dashboardData) => {
    const uniqueProducts = new Set();
    if (!dashboardData) return [];

    Object.values(dashboardData).forEach((delegation) => {
      Object.values(delegation).forEach((productArray) => {
        if (productArray[0]?.nomProduit) {
          uniqueProducts.add(productArray[0].nomProduit);
        }
      });
    });
    return Array.from(uniqueProducts);
  };

  const getProductDetails = (delegationData, productName) => {
    if (!delegationData) return { quantiteActuelle: 0, quantiteMax: 0, pourcentage: 0 };

    const productEntry = Object.values(delegationData).find(
      (productArray) => productArray[0]?.nomProduit === productName
    );

    return productEntry?.[0] || { quantiteActuelle: 0, quantiteMax: 0, pourcentage: 0 };
  };

  const getPercentageColor = (percentage) => {
    if (percentage === 0) return "bg-red-100";
    if (percentage === 100) return "bg-green-100";
    if (percentage <= 50) return "bg-yellow-100";
    if (percentage >= 50) return "bg-blue-100";
    return "bg-emerald-100";
  };

  const uniqueProducts = getAllUniqueProducts(dashboard);

  // Filtrer les délégations en fonction de la recherche
  const filteredDelegations = dashboard
    ? Object.keys(dashboard).filter((delegation) =>
        delegation.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-100 flex">
    {/* Sidebar remains the same */}
    <div className="w-72 bg-white shadow-xl border-r border-gray-200 p-6 flex flex-col">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-brown-800 mb-2">Opération Ramadan</h1>
        <p className="text-sm text-gray-500">Plateforme de Solidarité</p>
      </div>
      <nav className="space-y-2 flex-grow">
        <div className="text-sm font-semibold text-gray-500 mb-4">NAVIGATION</div>
        <Link href="/" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <FaHome className="mr-2" />
          Accueil
        </Link>
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
        <Link href="/statistiques" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <FaChartLine className="mr-2" />
          Tableau de bord
        </Link>
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
      {/* Main Content */}
      <div className="flex-1 p-8 bg-nude-100 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Tableau de Bord</h2>
        <div className="mb-8 flex items-center space-x-6">
          
          <div className="flex items-center">
            
            <div className="w-6 h-6 bg-red-100 rounded-full"></div>
            <span className="ml-2">0%</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-100 rounded-full"></div>
            <span className="ml-2">0% - 50%</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
            <span className="ml-2">50% - 100%</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-100 rounded-full"></div>
            <span className="ml-2">100%</span>
          </div>
        </div>
        {/* Champ de recherche */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher par délégation..."
            className="w-full p-2 border border-gray-300 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {dashboardLoading || produitsLoading ? (
          <p>Chargement...</p>
        ) : (
          <div>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2 text-left">Délégation</th>
                  {uniqueProducts.map((productName) => (
                    <th key={productName} className="border border-gray-200 px-4 py-2 text-left">
                      {productName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDelegations.map((delegation) => (
                  <tr key={delegation} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-medium">{delegation}</td>
                    {uniqueProducts.map((productName) => {
                      const details = getProductDetails(dashboard[delegation], productName);
                      return (
                        <td
                          key={productName}
                          className={`px-4 py-3 text-center border border-amber-200 ${getPercentageColor(
                            details.pourcentage
                          )}`}
                        >
                          <div className="flex flex-col text-xs">
                            <div className="flex items-center justify-center border-b border-gray-200 pb-1">
                              <span className="ml-1">{details.quantiteActuelle}</span>
                            </div>
                            <div className="flex items-center justify-center border-b border-gray-200 py-1">
                              <span className="ml-1">{details.quantiteMax}</span>
                            </div>
                            <div className="flex items-center justify-center pt-1">
                              <span className="ml-1">{details.pourcentage?.toFixed(2)}%</span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-16">
              <h3 className="text-xl font-semibold mb-8">Quantités Actuelles, Attribuées et Pourcentages des Produits</h3>
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">Produit</th>
                    <th className="border border-gray-200 px-4 py-2 text-center">Quantité Reçue</th>
                    <th className="border border-gray-200 px-4 py-2 text-center">Quantité Attribuée </th>
                    <th className="border border-gray-200 px-4 py-2 text-center">Pourcentage</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardtotal?.map((product) => (
                    <tr key={product.nomProduit} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">{product.nomProduit}</td>
                      <td className="border border-gray-200 px-4 py-2 text-center">{product.quantiteActuelle}</td>
                      <td className="border border-gray-200 px-4 py-2 text-center">{product.quantiteMax}</td>
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        {product.pourcentage ? `${(product.pourcentage ).toFixed(3)}%` : "0%"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
