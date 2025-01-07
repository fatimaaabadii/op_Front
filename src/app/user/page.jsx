"use client"; 
import React, { useState } from 'react';
import { api, getCurrentUser } from "/src/api";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "/src/components/ui/use-toast";
import Image from 'next/image';
import Link from 'next/link';
import { FaHome, FaPlus, FaBoxOpen, FaChartLine, FaUser, FaSignOutAlt, FaEnvelope, FaMapMarkerAlt, FaUserTag, FaBuilding, FaKey, FaShieldAlt, FaClipboardList  } from 'react-icons/fa';

function ProfilePage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const { toast } = useToast();
  const token = getCookie('token');
  const headers = { Authorization: `Bearer ${token}` };
  
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });
 console.log(userData);
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (oldPassword && newPassword && confirmNewPassword && newPassword === confirmNewPassword) {
      try {
        const parsedValue = {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmNewPassword,
        };
        await api.put("/auth/changepsw/" + userData.id, parsedValue, { headers });
        toast({
          description: "Modification de mot de passe réussie",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "Success",
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordChangeMessage('Mot de passe modifié avec succès.');
      } catch (error) {
        toast({
          description: "Erreur lors de la modification de mot de passe",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "Error",
        });
        console.error(error);
      }
    } else {
      setPasswordChangeMessage('Veuillez remplir correctement tous les champs.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar - Kept unchanged */}
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
      {/* Main Content with Updated Div Sizes */}
      <div className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20"></div>
                <Image 
                  src="/pp.jpg" 
                  alt="Profile" 
                  width={120} 
                  height={120} 
                  className="rounded-full ring-4 ring-white shadow-xl relative z-10"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{userData?.name}</h1>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaEnvelope className="mr-2 text-[#6A4E23]" />
                      {userData?.email}
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaShieldAlt className="mr-3 text-[#6A4E23]" />
                  Informations personnelles
                </h2>
              </div>
              

              
              <div className="space-y-4">


              <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center text-gray-700">
                    <FaUser className="text-[#6A4E23] mr-3" />
                    <span className="font-medium w-32">Utilisateur:</span>
                    <span className="text-gray-600">{userData?.name}</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center text-gray-700">
                    <FaEnvelope className="text-[#6A4E23] mr-3" />
                    <span className="font-medium w-32">Email:</span>
                    <span className="text-gray-600">{userData?.email}</span>
                  </div>
                </div>

               

                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center text-gray-700">
                    <FaBuilding className="text-[#6A4E23] mr-3" />
                    <span className="font-medium w-32">Délégation:</span>
                    <span className="text-gray-600">{userData?.unite?.nomDelegation}</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center text-gray-700">
                    <FaUserTag className="text-[#6A4E23] mr-3" />
                    <span className="font-medium w-32">Rôle:</span>
                    <span className="text-gray-600">{userData?.roles}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaKey className="mr-3 text-[#6A4E23]" />
                  Modifier le mot de passe
                </h2>
              </div>

              <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ancien mot de passe
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6A4E23] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6A4E23] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6A4E23] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#6A4E23] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#6A4E23] focus:ring-2 focus:ring-[#6A4E23] focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200"
                >
                  Changer le mot de passe
                </button>
              </form>
              {passwordChangeMessage && (
                <div className="mt-6 p-3 bg-green-50 text-green-700 rounded-xl flex items-center">
                  <div className="mr-3">✓</div>
                  {passwordChangeMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
