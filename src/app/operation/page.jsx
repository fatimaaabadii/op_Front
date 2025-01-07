"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaChartLine, FaPlus, FaHome, FaUser, FaBoxOpen, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import { api, getOperations, getProduits, getCurrentUser } from "/src/api";
import { MdCheckCircle , MdCategory} from "react-icons/md";
import { useToast } from "/src/components/ui/use-toast"
import { setCookie, getCookie, deleteCookie } from "cookies-next";
const Page = () => {
  const { data: operations, refetch } = useQuery({
    queryKey: ["operations"],
    queryFn: getOperations,
  });

const { data: produits } = useQuery({
    queryKey: ['produits'],
    queryFn: getProduits(),
  });
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });

  //console.log(userData);
  const { toast } = useToast()
  const token = getCookie('token'); 
  const headers = {
    Authorization: `Bearer ${token}`
  };
//  console.log(operations);
  const getTotalPartenariats = () => operations ? operations.length : 0;
  const getTotalvalide = () => produits ? produits.length : 0;
  //const getTotalencorevalide = () => operations ? operations.length : 0;

  const getTotalOperationsToday = () => {
    // Obtenez la date actuelle
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Les mois commencent à 0
    const currentDay = today.getDate();
  
    // Filtrez uniquement si operations est un tableau
    if (!Array.isArray(operations)) {
      console.warn("operations n'est pas encore chargé ou n'est pas un tableau");
      return 0; // Retournez 0 si les données ne sont pas disponibles
    }
  
    // Filtrez les opérations qui correspondent à la date actuelle
    const operationsToday = operations.filter(op => {
      const [year, month, day] = op.dateCreation;
      return year === currentYear && month === currentMonth && day === currentDay;
    });
  
    return operationsToday.length;
  };
  
  const [newOperation, setNewOperation] = useState({
    nombreSacRecyclable: "",
    nombreCartes: "",
    quantiteSucre: "",
    quantiteThe: "",
    quantiteFarine: "",
    quantiteHuile: "",
    quantiteTomate: "",
    quantiteLentille: "",
    quantitePate: "",
    quantiteLait: "",
    quantiteRiz: ""
  });

 const handleInputChange = (e) => {
  const { name, value } = e.target;

  // S'assurer que `name` existe et est une clé valide dans `newOperation`
  if (name) {
    setNewOperation((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  e.target.focus();
};
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Préparer les détails de l'opération
      const operationDetails = [
        { produit: { produitId: 2 }, quantite: parseFloat(newOperation.nombreCartes || 0) },
        { produit: { produitId: 1 }, quantite: parseFloat(newOperation.nombreSacRecyclable || 0) },
        { produit: { produitId: 5 }, quantite: parseFloat(newOperation.quantiteFarine || 0) },
        { produit: { produitId: 6 }, quantite: parseFloat(newOperation.quantiteHuile || 0) },
        { produit: { produitId: 10 }, quantite: parseFloat(newOperation.quantiteLait || 0) },
        { produit: { produitId: 8 }, quantite: parseFloat(newOperation.quantiteLentille || 0) },
        { produit: { produitId: 9 }, quantite: parseFloat(newOperation.quantitePate || 0) },
        { produit: { produitId: 11 }, quantite: parseFloat(newOperation.quantiteRiz || 0) },
        { produit: { produitId: 3 }, quantite: parseFloat(newOperation.quantiteSucre || 0) },
        { produit: { produitId: 4 }, quantite: parseFloat(newOperation.quantiteThe || 0) },
        { produit: { produitId: 7 }, quantite: parseFloat(newOperation.quantiteTomate || 0) }
      ];
  
      // Filtrer les produits avec des quantités non nulles
      const filteredDetails = operationDetails.filter(detail => detail.quantite > 0);
  
      // Préparer l'objet final pour l'API
      const payload = {
        delegation: {
          delegationId: userData?.unite?.delegationId // Remplacez par l'ID de la délégation appropriée
        },
        dateCreation: new Date().toISOString(), // Date actuelle en format ISO
        details: filteredDetails
      };
      console.log("données envoyés ", payload);
      // Envoyer les données à l'API
      const response = await api.post("/operations/create",payload, 
        {headers: {
          ...headers,
   
      }
              }
         
       )

       toast({
        description: "Opération créée avec succès",
        className: "bg-emerald-600 text-white",
        duration: 2000,
        title: "Success",
      })
      // refetch()
      
      
      // Réinitialiser le formulaire après succès
      setNewOperation({
        nombreSacRecyclable: "",
        nombreCartes: "",
        quantiteSucre: "",
        quantiteThe: "",
        quantiteFarine: "",
        quantiteHuile: "",
        quantiteTomate: "",
        quantiteLentille: "",
        quantitePate: "",
        quantiteLait: "",
        quantiteRiz: ""
      });
  
      
    } catch (error) {
      toast({
        description: "Erreur lors de la création d'un nouveau article",
        className: "bg-red-500 text-white",
        duration: 2000,
        title: "Error",
      })
    }
  };
  
  const getTotalOperations = () => (operations ? operations.length : 0);

  const StatCard = ({ icon: Icon, title, value, bgColor }) => (
    <div className={`flex items-center p-4 rounded-lg shadow-md mb-4 ${bgColor}`}>
      <Icon className="text-3xl mr-4" />
      <div>
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );

  const FormField = ({ label, name, unit }) => (
    <div className="mb-4">
      <label className="block text-gray-600 text-sm font-medium mb-1">
        {label} {unit ? `(${unit})` : ""}
      </label>
      <div className="relative">
        <input
          type="number"
          name={name}
          defaultValue={newOperation[name]}
        onBlur={(e) => handleInputChange(e)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
          placeholder="0"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <span className="text-gray-400 text-xs">{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
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
          <Link href="/operation" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <FaPlus className="mr-2" />
            Ajouter un Stock
          </Link>
          <Link href="/liste_stock" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <FaBoxOpen className="mr-2" />
            Mes Opérations
          </Link>
          <Link href="/stock_max" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <FaClipboardList  className="mr-2" />
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

          {/*<StatCard 
                      icon={FaBoxOpen} 
                      title="Total des opérations" 
                      value={getTotalPartenariats()} 
                      bgColor="bg-blue-50 text-blue-600"
                    />
                    
                    <StatCard 
                      icon={FaClipboardList} 
                      title="Nombre d'opérations du jour" 
                      value={getTotalOperationsToday()} 
                      bgColor="bg-yellow-50 text-yellow-600"
                    />
                    <StatCard 
                      icon={MdCategory} 
                      title="Catégories de produits" 
                      value={getTotalvalide()} 
                      bgColor="bg-green-50 text-green-600"
                    />*/}
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
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Opération Ramadan</h3>
              <p className="text-sm text-gray-500">Formulaire d&apos;ajout des produits</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {/* Première colonne */}
                <div>
                  <FormField label="Nombre de Sac recyclable" name="nombreSacRecyclable" />
                  <FormField label="Quantité du sucre" name="quantiteSucre" unit="Kg" />
                  <FormField label="Quantité de farine" name="quantiteFarine" unit="Kg" />
                  <FormField label="Tomate" name="quantiteTomate" unit="Boite" />
                  <FormField label="Pate" name="quantitePate" unit="Kg" />
                  <FormField label="Riz" name="quantiteRiz" unit="Kg" />
                </div>

                {/* Deuxième colonne */}
                <div>
                  <FormField label="Nombre de cartes" name="nombreCartes" />
                  <FormField label="Quantité du thé" name="quantiteThe" unit="Kg" />
                  <FormField label="Quantité d'huile" name="quantiteHuile" unit="L" />
                  <FormField label="Lentille" name="quantiteLentille" unit="Kg" />
                  <FormField label="Lait" name="quantiteLait" unit="L" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  
                 // className="w-full bg-[#6A4E23] text-white py-2 rounded-lg font-semibold hover:bg-[#5A3F1D] transition duration-300"
                  className="w-full bg-gray-700 text-white p-2 rounded-md hover:bg-gray-500 transition-colors duration-200 flex items-center justify-center text-sm"
                >
                  <FaPlus className="mr-2" />
                  Ajouter l&apos;opération
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;