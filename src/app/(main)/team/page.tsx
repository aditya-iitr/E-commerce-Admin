"use client";

import React, { useEffect, useState } from "react";
import { Mail, Loader2 } from "lucide-react";

// 🟢 DEFINE YOUR STANDARD CSS HERE
// This is pure CSS. It loads instantly with the HTML (Perfect SSR).
const customStyles = `
  /* Search Bar Styles */
  .search-wrapper {
    width: 100%;
    max-width: 600px;
    margin: 32px ;
    display: flex;
    justify-content: center;
  }
  .search-container {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    background: linear-gradient(to bottom, rgb(227, 213, 255), rgb(255, 231, 231));
    border-radius: 30px;
    padding: 0 5px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.075);
  }
  .search-input {
    width: 100%;
    height: 40px;
    border: none;
    outline: none;
    background: white;
    border-radius: 30px;
    padding-left: 20px;
    font-size: 14px;
    color: #333;
  }

  /* Card Styles */
  .team-card {
    background-color: #ffffff;
    border-radius: 30px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #f3f4f6;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  /* Hover Effect works perfectly here */
  .team-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: #e5e7eb;
  }
    /* This triggers when the 'dark' class is on the HTML tag */
  .dark .team-card {
    background-color: #0f172a; /* 👈 Deep Blue Color */
    border-color: #1e293b;     /* Slightly lighter border */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  }
    
`;

interface TeamMember {
  _id: string;
  name: string;
  email: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Gradient generator
  const getGradient = (name: string) => {
    const gradients = [
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-pink-400 to-rose-500",
      "from-emerald-400 to-teal-500",
      "from-orange-400 to-amber-500",
    ];
    return gradients[name.length % gradients.length];
  };

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch("/api/team");
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (error) {
        console.error("Failed to load team");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50/50 dark:bg-gray-900 font-sans">
     
      <style>{customStyles}</style>

      {/* HEADER SECTION */}
      <div className="flex flex-col items-center justify-center mb-20 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Team Directory
        </h1>
        <p className="text-gray-500 text-sm">
          View and manage your verified team members.
        </p>

        {/* SEARCH BAR */}
        <div className="search-wrapper">
          <div className="search-container">
            <input 
              placeholder="Search members..." 
              className="search-input" 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              
              /* 🟢 USING PURE CSS CLASS */
              <div key={member._id} className="team-card">
                
                

                {/* Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>

                {/* Email Chip */}
                <div className="flex items-center text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full mt-2 w-full justify-center">
                  <Mail size={12} className="shrink-0" />
                  <span className="break-all" style={{ marginLeft: "10px" }}>
                    {member.email}
                  </span>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-10">
              <p>No members found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}