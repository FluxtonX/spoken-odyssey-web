"use client";

import { useState, useEffect, useRef } from "react";
import { 
  X, 
  Mail, 
  Phone, 
  Link2, 
  QrCode, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Loader2
} from "lucide-react";
import { connectFamilyMember, getSuggestedPeople, sendSMSInvitation, createLinkInvitation, createQRInvitation } from "@/services/backend";
import { COUNTRIES, searchCountries } from "@/data/countryCodes";

export const CATEGORIZED_RELATIONSHIPS = [
  {
    category: "Primary Relations",
    options: [
      "Spouse/Partner",
      "Child",
      "Parent",
      "Sibling",
      "Grandparent",
      "Grandchild",
      "Aunt/Uncle",
      "Niece/Nephew",
      "Cousin",
      "Friend",
      "Other"
    ]
  },
  {
    category: "Immediate Family",
    options: ["Mother", "Father", "Sister", "Brother", "Daughter", "Son", "Wife", "Husband", "Partner"]
  },
  {
    category: "Uncles & Aunts",
    options: [
      "Maternal Uncle (Mamoo / Maternal Uncle)",
      "Paternal Uncle (Chacha / Paternal Uncle)",
      "Maternal Aunt (Khala / Maternal Aunt)",
      "Paternal Aunt (Phuppho / Paternal Aunt)",
      "Uncle",
      "Aunty"
    ]
  },
  {
    category: "Grandparents & Relatives",
    options: [
      "Grandmother (Dadi / Nani)",
      "Grandfather (Dada / Nana)",
      "Grandson",
      "Granddaughter",
      "Cousin",
      "Nephew",
      "Niece"
    ]
  },
  {
    category: "In-Laws & Step Relations",
    options: [
      "Stepfather",
      "Stepmother",
      "Stepbrother",
      "Stepsister",
      "Mother-in-law",
      "Father-in-law",
      "Brother-in-law",
      "Sister-in-law",
      "Guardian / Relative"
    ]
  }
];

export const ALL_RELATIONSHIPS = Array.from(new Set(CATEGORIZED_RELATIONSHIPS.flatMap(c => c.options)));

export default function InviteMemberModal({ isOpen, onClose, onSuccess, userToken }) {
  const [step, setStep] = useState(1); // 1: Main Options, 2: Email Form, 3: QR Code, 4: SMS Link, 5: Success Sent Modal
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [relationship, setRelationship] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [localToken, setLocalToken] = useState("");

  // SMS form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.dialCode === "+1") || COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef(null);

  // Custom Glassy Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [relationshipSearch, setRelationshipSearch] = useState("");
  const dropdownRef = useRef(null);

  // Sync token from localStorage when modal opens
  useEffect(() => {
    const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
    setLocalToken(token);
  }, [isOpen]);

  // Fetch suggested / registered users on mount to allow instant autocomplete
  useEffect(() => {
    if (!isOpen) return;
    async function loadRegistered() {
      try {
        const token = userToken || localStorage.getItem("token");
        if (token) {
          const suggestions = await getSuggestedPeople(token);
          if (Array.isArray(suggestions)) {
            setRegisteredUsers(suggestions);
          }
        }
      } catch (err) {
        console.warn("Could not pre-fetch registered users:", err);
      }
    }
    loadRegistered();
  }, [isOpen, userToken]);

  // Click outside listener for custom dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Click outside listener for country dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live filter registered users as typing in email or name field
  useEffect(() => {
    if (!emailInput.trim() && !name.trim()) {
      setFilteredMatches([]);
      return;
    }

    const query = (emailInput || name).toLowerCase().trim();
    const matches = registeredUsers.filter(u => 
      u.email?.toLowerCase().includes(query) ||
      u.name?.toLowerCase().includes(query) ||
      u.displayName?.toLowerCase().includes(query)
    );
    setFilteredMatches(matches);

    // If an exact email match is found, auto-select
    const exactMatch = registeredUsers.find(u => u.email?.toLowerCase() === emailInput.trim().toLowerCase());
    if (exactMatch && !selectedUser) {
      setSelectedUser(exactMatch);
      if (!name) setName(exactMatch.name || exactMatch.displayName || "");
    }
  }, [emailInput, name, registeredUsers]);

  // Dispatch modal open/close events for sidebar dimming
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event('modal-open'));
    } else {
      window.dispatchEvent(new Event('modal-close'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setEmailInput(user.email || "");
    setName(user.name || user.displayName || "");
    setFilteredMatches([]);
  };

  const handleCopyLink = async () => {
    try {
      setIsSubmitting(true);
      const tokenFromProp = userToken;
      const tokenFromState = localToken;
      const tokenFromStorage = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      const token = tokenFromProp || tokenFromState || tokenFromStorage;
      
      console.log("Debug - Token check:", {
        tokenFromProp,
        tokenFromState,
        tokenFromStorage,
        finalToken: token,
        hasToken: !!token
      });
      
      if (!token) {
        alert("Please log in to generate an invitation link.");
        setIsSubmitting(false);
        return;
      }

      console.log("Calling createLinkInvitation with token:", token.substring(0, 20) + "...");
      const result = await createLinkInvitation(token, { relationship: relationship || "Family Member" });
      
      console.log("Debug - Full API response:", JSON.stringify(result, null, 2));
      
      const rawJoinLink = result?.data?.joinLink || result?.joinLink || result?.invitation?.joinLink;
      const invToken = result?.invitationToken || result?.data?.invitationToken || result?.invitation?.invitationToken;

      let finalJoinLink = rawJoinLink;
      if (typeof window !== "undefined") {
        const currentOrigin = window.location.origin;
        if (invToken) {
          finalJoinLink = `${currentOrigin}/invite/${invToken}`;
        } else if (rawJoinLink && (rawJoinLink.includes("localhost:3000") || rawJoinLink.includes("localhost"))) {
          finalJoinLink = rawJoinLink.replace(/^https?:\/\/[^\/]+/i, currentOrigin);
        }
      }

      if (finalJoinLink) {
        navigator.clipboard.writeText(finalJoinLink);
        setCopiedLink(finalJoinLink);
        setQrCodeData(finalJoinLink);
        setTimeout(() => setCopiedLink(""), 5000);
      } else {
        console.error("No joinLink in response. Response structure:", result);
        alert(`Failed to generate invitation link. Server response: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      console.error("Create link invitation error:", err);
      alert(`Failed to generate invitation link. Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEmailInvite = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsSubmitting(true);
    try {
      const token = userToken || localStorage.getItem("token");
      if (token) {
        await connectFamilyMember(token, {
          targetUid: selectedUser?.id || selectedUser?.firebaseUid || null,
          email: emailInput.trim(),
          relationship: relationship || "Family Member"
        });
      }
      setStep(5); // Switch to "Invitation Sent!" Success State Modal exactly matching screenshot
    } catch (err) {
      console.error("Invite member error:", err);
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishSuccess = () => {
    onSuccess?.({
      id: selectedUser?.id || `new-${Date.now()}`,
      name: name.trim() || emailInput.split("@")[0],
      email: emailInput.trim(),
      role: relationship || "Family Member",
      avatar: selectedUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      sharedCount: 0,
      isAdmin: false
    });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setName("");
    setEmailInput("");
    setRelationship("");
    setSelectedUser(null);
    setFilteredMatches([]);
    setIsDropdownOpen(false);
    setPhoneNumber("");
    setCountrySearch("");
    setIsCountryDropdownOpen(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay - higher z-index to cover sidebar */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 pointer-events-none">
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-[28px] w-full max-w-lg p-6 shadow-2xl relative overflow-visible transition-all pointer-events-auto">
        
        {/* Header Title for Success Modal matching Screenshot */}
        {step === 5 ? (
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-stone-900 dark:text-white">Invitation Sent!</h3>
            <button 
              type="button"
              onClick={handleFinishSuccess}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          /* Close Button for other steps */
          <button 
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 z-10"
          >
            <X size={20} />
          </button>
        )}

        {/* STEP 1: Main Options Modal */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="font-bold text-xl text-stone-900 dark:text-white">Invite to Family Circle</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: Email Invitation */}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="p-5 rounded-2xl border border-stone-200/80 dark:border-slate-800 hover:border-[#4A3AFF] dark:hover:border-[#4A3AFF] bg-white dark:bg-slate-900/50 hover:bg-[#F8F9FF] dark:hover:bg-slate-800/80 transition-all text-left group cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] dark:bg-indigo-950/80 text-[#4A3AFF] dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-[15px] mb-0.5">Email Invitation</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Send a personal email invite</p>
                </div>
              </button>

              {/* Option 2: SMS / Phone Number */}
              <button
                type="button"
                onClick={() => setStep(4)}
                className="p-5 rounded-2xl border border-stone-200/80 dark:border-slate-800 hover:border-[#4A3AFF] dark:hover:border-[#4A3AFF] bg-white dark:bg-slate-900/50 hover:bg-[#F8F9FF] dark:hover:bg-slate-800/80 transition-all text-left group cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] dark:bg-indigo-950/80 text-[#4A3AFF] dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-[15px] mb-0.5">SMS / Phone Number</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Text them an invite link</p>
                </div>
              </button>

              {/* Option 3: Share a Link */}
              <button
                type="button"
                onClick={() => setStep(6)}
                className="p-5 rounded-2xl border border-stone-200/80 dark:border-slate-800 hover:border-[#4A3AFF] dark:hover:border-[#4A3AFF] bg-white dark:bg-slate-900/50 hover:bg-[#F8F9FF] dark:hover:bg-slate-800/80 transition-all text-left group cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] dark:bg-indigo-950/80 text-[#4A3AFF] dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Link2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-[15px] mb-0.5">Share a Link</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Copy and share anywhere</p>
                </div>
              </button>

              {/* Option 4: QR Code */}
              <button
                type="button"
                onClick={() => setStep(3)}
                className="p-5 rounded-2xl border border-stone-200/80 dark:border-slate-800 hover:border-[#4A3AFF] dark:hover:border-[#4A3AFF] bg-white dark:bg-slate-900/50 hover:bg-[#F8F9FF] dark:hover:bg-slate-800/80 transition-all text-left group cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] dark:bg-indigo-950/80 text-[#4A3AFF] dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <QrCode size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-[15px] mb-0.5">QR Code</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Show them a scannable code</p>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* STEP 2: Invite by Email */}
        {step === 2 && (
          <form onSubmit={handleSubmitEmailInvite}>
            <div className="flex items-center gap-2 mb-6">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-stone-500 hover:text-stone-900 dark:hover:text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            </div>

            <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-6">Invite by Email</h2>

            <div className="space-y-4">
              
              {/* Field 1: Their name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Their name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah O'Brien"
                  className="w-full p-3.5 rounded-2xl bg-stone-50/80 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white text-sm font-medium outline-none focus:border-[#4A3AFF] transition-colors"
                />
              </div>

              {/* Field 2: Email address with Autocomplete for registered users */}
              <div className="relative">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (selectedUser && selectedUser.email !== e.target.value) {
                        setSelectedUser(null);
                      }
                    }}
                    placeholder="their@email.com"
                    required
                    className={`w-full p-3.5 pr-10 rounded-2xl bg-stone-50/80 dark:bg-slate-800/80 border text-stone-900 dark:text-white text-sm font-medium outline-none transition-colors ${
                      selectedUser 
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20" 
                      : "border-stone-200 dark:border-slate-700 focus:border-[#4A3AFF]"
                    }`}
                  />
                  {selectedUser && (
                    <div className="absolute right-3.5 top-3.5 text-emerald-500">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </div>

                {/* Selected Registered User Indicator Badge */}
                {selectedUser && (
                  <div className="mt-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={selectedUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">{selectedUser.name || selectedUser.displayName}</span>
                          <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">REGISTERED</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Registered account found & ready to receive invite</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Autocomplete Dropdown List for Registered Users */}
                {filteredMatches.length > 0 && !selectedUser && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-2xl shadow-xl z-20 overflow-hidden max-h-48 overflow-y-auto">
                    <div className="p-2 bg-stone-50 dark:bg-slate-900/60 border-b border-stone-100 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Registered Users Found
                    </div>
                    {filteredMatches.map(user => (
                      <button
                        type="button"
                        key={user.id || user.email}
                        onClick={() => handleSelectUser(user)}
                        className="w-full p-3 hover:bg-[#EEF2FF] dark:hover:bg-slate-700 flex items-center justify-between transition text-left cursor-pointer border-b border-stone-100 dark:border-slate-700/50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-stone-900 dark:text-white">{user.name || user.displayName}</p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400">{user.email}</p>
                          </div>
                        </div>
                        <span className="bg-[#4A3AFF] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 3: Professional Custom Relationship Dropdown - Opens UPWARDS exactly matching Figma screenshot */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Relationship
                </label>
                
                {/* Trigger Button with Soft Border & Arrow Up/Down */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white text-sm font-medium outline-none transition-all flex items-center justify-between cursor-pointer shadow-xs hover:border-[#4A3AFF]"
                >
                  <span className={relationship ? "font-bold text-stone-900 dark:text-white" : "text-stone-400 font-medium"}>
                    {relationship || "Select Relationship"}
                  </span>
                  {isDropdownOpen ? (
                    <ChevronUp size={18} className="text-[#4A3AFF]" />
                  ) : (
                    <ChevronDown size={18} className="text-stone-400" />
                  )}
                </button>

                {/* Professional Overlay Menu Opening UPWARDS (bottom-full mb-2) to avoid dialogue box overflow & hiding */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 bottom-full mb-2 bg-white dark:bg-slate-900 border border-[#C7D2FE] dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-72 flex flex-col animate-fade-in text-left">
                    
                    {/* Top Header Bar matching user's Figma screenshot */}
                    <div className="bg-[#C7D2FE]/90 dark:bg-indigo-950/90 text-stone-900 dark:text-indigo-200 font-extrabold px-4 py-3 text-xs tracking-wide border-b border-[#B8C6FE] dark:border-indigo-900/60 flex items-center justify-between">
                      <span>Select Relationship</span>
                      <Search size={14} className="text-stone-600 dark:text-indigo-300" />
                    </div>

                    {/* Search inside Dropdown */}
                    <div className="p-2 border-b border-stone-100 dark:border-slate-800 bg-stone-50/60 dark:bg-slate-800/60 flex items-center gap-2">
                      <input
                        type="text"
                        value={relationshipSearch}
                        onChange={(e) => setRelationshipSearch(e.target.value)}
                        placeholder="Search relationship..."
                        className="w-full text-xs bg-transparent outline-none text-stone-800 dark:text-white font-medium px-2 py-1"
                      />
                    </div>

                    {/* Categorized Options List */}
                    <div className="overflow-y-auto p-2 space-y-3 custom-scrollbar flex-1">
                      {CATEGORIZED_RELATIONSHIPS.map((cat) => {
                        const matchingOptions = cat.options.filter(o => 
                          o.toLowerCase().includes(relationshipSearch.toLowerCase())
                        );
                        if (matchingOptions.length === 0) return null;

                        return (
                          <div key={cat.category}>
                            <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#4A3AFF] dark:text-indigo-400">
                              {cat.category}
                            </div>
                            <div className="space-y-0.5 mt-0.5">
                              {matchingOptions.map((opt) => (
                                <button
                                  type="button"
                                  key={opt}
                                  onClick={() => {
                                    setRelationship(opt);
                                    setIsDropdownOpen(false);
                                    setRelationshipSearch("");
                                  }}
                                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition cursor-pointer ${
                                    relationship === opt
                                      ? "bg-[#EEF2FF] dark:bg-indigo-950/80 text-[#4A3AFF] dark:text-indigo-300 font-bold"
                                      : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {relationship === opt && <Check size={14} className="text-[#4A3AFF] dark:text-indigo-400" />}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}
              </div>

            </div>

            {/* Send Invitation Button with Sleek Animated Loader Effect */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={!emailInput.trim() || isSubmitting}
                className="w-full py-3.5 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin text-white" size={18} />
                    <span>Sending Invitation...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 6: Share a Link */}
        {step === 6 && (
          <div className="text-center py-4">
            <div className="flex items-center gap-2 mb-4 text-left">
              <button type="button" onClick={() => setStep(1)} className="text-stone-500 hover:text-stone-900 text-xs font-bold flex items-center gap-1 transition cursor-pointer">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            </div>
            <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-2">Share a Link</h2>
            <p className="text-xs text-stone-500 mb-6">Generate a secure link to share with your family member.</p>

            {/* Name and Relationship Fields */}
            <div className="mb-6 text-left">
              <div className="mb-4">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Their Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#4A3AFF] focus:ring-1 focus:ring-[#4A3AFF] outline-none text-sm text-stone-900 dark:text-white placeholder-stone-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Their Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#4A3AFF] focus:ring-1 focus:ring-[#4A3AFF] outline-none text-sm text-stone-900 dark:text-white transition cursor-pointer"
                >
                  <option value="">Select relationship...</option>
                  {ALL_RELATIONSHIPS.map((rel) => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleCopyLink} 
              disabled={isSubmitting}
              className={`w-full px-6 py-3 rounded-xl text-sm font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                copiedLink 
                  ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                  : "bg-[#4A3AFF] text-white hover:bg-[#3b2dd1]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin inline mr-2" size={16} />
                  Generating Link...
                </>
              ) : copiedLink ? (
                <>
                  <Check className="inline mr-2" size={16} />
                  Link Copied!
                </>
              ) : "Generate & Copy Link"}
            </button>
            
            {copiedLink && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium break-all">
                  {copiedLink}
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: QR Code Preview */}
        {step === 3 && (
          <div className="text-center py-4">
            <div className="flex items-center gap-2 mb-4 text-left">
              <button type="button" onClick={() => setStep(1)} className="text-stone-500 hover:text-stone-900 text-xs font-bold flex items-center gap-1 transition cursor-pointer">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            </div>
            <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-2">Scan QR Code</h2>
            <p className="text-xs text-stone-500 mb-6">Select relationship and generate a QR code for your family member to scan.</p>

            <div className="mb-6 text-left">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Their Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#4A3AFF] focus:ring-1 focus:ring-[#4A3AFF] outline-none text-sm text-stone-900 dark:text-white transition cursor-pointer"
              >
                <option value="">Select relationship...</option>
                {ALL_RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>

            {qrCodeData && (
              <div className="w-56 h-56 mx-auto bg-white p-4 rounded-3xl shadow-lg border border-stone-200 flex flex-col items-center justify-center mb-6">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`} 
                  alt="QR Code" 
                  className="w-full h-full object-contain rounded-xl" 
                />
              </div>
            )}

            <button 
              type="button" 
              onClick={handleCopyLink} 
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl text-sm font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                copiedLink 
                  ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                  : "bg-[#4A3AFF] text-white hover:bg-[#3b2dd1]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin inline mr-2" size={16} />
                  Generating QR Code...
                </>
              ) : copiedLink ? (
                <>
                  <Check className="inline mr-2" size={16} />
                  QR Code & Link Generated!
                </>
              ) : "Generate QR Code"}
            </button>
          </div>
        )}

        {/* STEP 4: SMS Invitation */}
        {step === 4 && (
          <div className="py-2">
            <div className="flex items-center gap-2 mb-4">
              <button type="button" onClick={() => setStep(1)} className="text-stone-500 hover:text-stone-900 text-xs font-bold flex items-center gap-1 transition cursor-pointer">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            </div>
            <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-4">Invite via SMS</h2>
            
            <div className="space-y-4">
              {/* Country Code Dropdown */}
              <div className="relative" ref={countryDropdownRef}>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Country
                </label>
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white text-sm font-medium outline-none transition-all flex items-center justify-between cursor-pointer shadow-xs hover:border-[#4A3AFF]"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{selectedCountry.flag}</span>
                    <span className="font-bold">{selectedCountry.dialCode}</span>
                    <span className="text-stone-500 dark:text-stone-400">{selectedCountry.name}</span>
                  </span>
                  {isCountryDropdownOpen ? (
                    <ChevronUp size={18} className="text-[#4A3AFF]" />
                  ) : (
                    <ChevronDown size={18} className="text-stone-400" />
                  )}
                </button>

                {/* Country Dropdown */}
                {isCountryDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-[#C7D2FE] dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-72 flex flex-col animate-fade-in text-left">
                    
                    {/* Search inside Country Dropdown */}
                    <div className="p-2 border-b border-stone-100 dark:border-slate-800 bg-stone-50/60 dark:bg-slate-800/60 flex items-center gap-2">
                      <Search size={14} className="text-stone-400" />
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search country..."
                        className="w-full text-xs bg-transparent outline-none text-stone-800 dark:text-white font-medium px-2 py-1"
                      />
                    </div>

                    {/* Country List */}
                    <div className="overflow-y-auto p-2 custom-scrollbar flex-1">
                      {searchCountries(countrySearch).map((country) => (
                        <button
                          type="button"
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsCountryDropdownOpen(false);
                            setCountrySearch("");
                          }}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-left flex items-center gap-3 transition cursor-pointer ${
                            selectedCountry.code === country.code
                              ? "bg-[#EEF2FF] dark:bg-indigo-950/80 text-[#4A3AFF] dark:text-indigo-300 font-bold"
                              : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="font-bold">{country.dialCode}</span>
                          <span>{country.name}</span>
                          {selectedCountry.code === country.code && <Check size={14} className="text-[#4A3AFF] dark:text-indigo-400 ml-auto" />}
                        </button>
                      ))}
                    </div>

                  </div>
                )}
              </div>

              {/* Phone Number Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-slate-800 px-3 py-3.5 rounded-2xl border border-stone-200 dark:border-slate-700">
                    {selectedCountry.dialCode}
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="555 000 0000"
                    className="flex-1 p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white text-sm font-medium outline-none focus:border-[#4A3AFF] transition-colors"
                  />
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={async () => {
                setIsSubmitting(true);
                try {
                  const token = userToken || localStorage.getItem("token");
                  if (token) {
                    await sendSMSInvitation(token, {
                      phoneNumber,
                      countryCode: selectedCountry.dialCode,
                      relationship: relationship || "Family Member"
                    });
                    setStep(5);
                  }
                } catch (err) {
                  console.error("Send SMS invitation error:", err);
                  setStep(5);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={!phoneNumber || isSubmitting}
              className="w-full mt-6 py-3.5 bg-[#4A3AFF] text-white font-bold text-sm rounded-2xl shadow-md hover:bg-[#3b2dd1] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin text-white" size={18} />
                  <span>Sending...</span>
                </>
              ) : (
                "Send SMS Invite"
              )}
            </button>
          </div>
        )}

        {/* STEP 5: "Invitation Sent!" Success State Modal */}
        {step === 5 && (
          <div className="text-center py-2 animate-fade-in">
            {/* Green Checkmark Circle */}
            <div className="w-16 h-16 rounded-full bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Check size={32} strokeWidth={3} />
            </div>

            {/* Title */}
            <h2 className="font-bold text-2xl text-stone-900 dark:text-white mb-2">
              Invitation Sent!
            </h2>

            {/* Subtitle */}
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-6 leading-relaxed">
              {name || emailInput || "Recipient"} will receive an invitation at <span className="font-bold text-stone-800 dark:text-stone-200">{emailInput || "their email"}</span> and can join your Family Circle.
            </p>

            {/* Light Lavender Box: "What happens next?" */}
            <div className="bg-[#F4F5FF] dark:bg-slate-800/80 border border-[#E0E4FF] dark:border-slate-700 p-5 rounded-2xl text-left mb-8 space-y-3">
              <h4 className="text-xs font-bold text-[#4A3AFF] dark:text-indigo-400 mb-3">
                What happens next?
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#4A3AFF] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">1</span>
                  <span className="text-xs font-medium text-stone-700 dark:text-stone-300">They receive your invitation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#4A3AFF] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">2</span>
                  <span className="text-xs font-medium text-stone-700 dark:text-stone-300">They create or sign in to their account</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#4A3AFF] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">3</span>
                  <span className="text-xs font-medium text-stone-700 dark:text-stone-300">They confirm the relationship</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#4A3AFF] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">4</span>
                  <span className="text-xs font-medium text-stone-700 dark:text-stone-300">They join your Family Circle</span>
                </div>
              </div>
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={handleFinishSuccess}
              className="w-full py-3.5 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer text-sm"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
