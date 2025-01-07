'use client';
import { api } from "/src/api/index.js";
import { useToast } from "/src/components/ui/use-toast";
import React, { useState } from "react";
import { setCookie } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';

export default function Page() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = async () => {
    try {
      const response = await api.post('/auth/login', { userName, password });
      setCookie("token", response.data, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      toast({
        description: "Connexion réussie",
        className: "bg-emerald-600 text-white",
        duration: 2000,
        title: "Succès",
      });
      window.location.href = "/";
    } catch (error) {
      toast({
        description: "Échec de connexion",
        variant: "destructive",
        duration: 2000,
        title: "Erreur",
      });
    }
  };

  const { mutate } = useMutation({ mutationFn: login });

  function handleSubmit(event) {
    event.preventDefault();
    mutate();
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative" 
      style={{ backgroundImage: 'url(/mounim4.jpg)' }}
    >
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 w-full max-w-sm text-[#6A4E23]"
      >
        <div className="text-center">
         
          <h2 className="text-lg font-bold mb-3">Opération Ramadan</h2>
          <p>Connectez-vous à votre compte</p>
        </div>

        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-medium mb-1 flex items-center"
          >
            <FaUser className="mr-2" />
            Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            autoComplete="off"
            className="w-full px-3 py-2 bg-transparent border-b border-[#6A4E23] focus:outline-none focus:border-[#8B7355] placeholder-[#6A4E23]"
            placeholder="Entrez votre email"
          />
        </div>

        <div className="relative">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium mb-1 flex items-center"
          >
            <FaLock className="mr-2" />
            Mot de passe
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
            className="w-full px-3 py-2 bg-transparent border-b border-[#6A4E23] focus:outline-none focus:border-[#8B7355] placeholder-[#6A4E23]"
            placeholder="Entrez votre mot de passe"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-8 text-[#6A4E23] hover:text-[#8B7355]"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#6A4E23] text-white py-2 rounded-lg font-semibold hover:bg-[#5A3F1D] transition duration-300"
        >
          Se Connecter
        </button>
      </form>

      <style jsx global>{`
        input::placeholder {
          color: rgba(106, 78, 35, 0.8);
        }
      `}</style>
    </div>
  );
}