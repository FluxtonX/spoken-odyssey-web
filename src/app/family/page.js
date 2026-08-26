"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { UserPlus, Heart, Lock, Check, TreePine, X, ShieldCheck, Clock, Mic, FileText, Image as ImageIcon, Film, Play, Link2, Unlink, FolderHeart, Plus, Square, Radio, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, fadeIn } from "@/lib/animations";
import InviteMemberModal from "./components/InviteMemberModal";
import LinkMemoryModal from "./components/LinkMemoryModal";
import CreateFamilyAlbumModal from "./components/CreateFamilyAlbumModal";
import FamilyTreeCanvas from "./components/FamilyTreeCanvas";
import FamilyMissionsWidget from "./components/FamilyMissionsWidget";
import VoicePlayer from "@/components/ui/VoicePlayer";
import CardMediaSlider from "@/components/ui/CardMediaSlider";
import { 
  getFamilyMembers, 
  getFamilyInvitations, 
  acceptFamilyInvitation, 
  declineFamilyInvitation,
  getFamilyCircleDetails,
  getFamilyCircleMembers,
  isFamilyAdmin,
  getPendingApprovals,
  approveInvitation,
  declineApproval,
  promoteToAdmin,
  demoteFromAdmin,
  removeFamilyMember,
  getFamilySharedMemories,
  getFamilySpaceTimeline,
  unlinkMemoryFromFamilyCircle,
  createFamilyPrompt,
  getFamilyPrompts,
  respondToFamilyPrompt,
  getGuardianControls,
  updateGuardianConsent,
  getLegacySettings,
  updateLegacySettings,
  getFamilyCircleAlbumsFromBackend
} from "@/services/backend";

const MOCK_MEMBERS = [
  {
    id: "m1",
    name: "Sarah Murphy",
    role: "Partner",
    isAdmin: true,
    sharedCount: 234,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "m2",
    name: "Ciarán Murphy",
    role: "Son",
    isAdmin: false,
    sharedCount: 56,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "m3",
    name: "Aoife Murphy",
    role: "Daughter",
    isAdmin: false,
    sharedCount: 43,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "m4",
    name: "Declan O'Brien",
    role: "Father",
    isAdmin: false,
    sharedCount: 18,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "m5",
    name: "Brigid O'Brien",
    role: "Sister",
    isAdmin: false,
    sharedCount: 67,
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80"
  }
];

const INITIAL_PERMISSIONS = [
  { id: "p1", label: "Members can view shared memories", enabled: true },
  { id: "p2", label: "Members can add comments", enabled: true },
  { id: "p3", label: "Members can download memories", enabled: false },
  { id: "p4", label: "Members can invite others", enabled: false }
];

const LEGACY_SETTINGS_DATA = [
  {
    id: "ls1",
    key: "administrator",
    title: "Legacy administrator",
    description: "Will manage your archive",
    defaultVal: "Sarah Murphy",
    options: ["Sarah Murphy", "Ciarán Murphy", "Aoife Murphy", "Declan O'Brien"]
  },
  {
    id: "ls2",
    key: "releaseCondition",
    title: "Release condition",
    description: "Requires confirmation from admin",
    defaultVal: "After verified passing",
    options: ["After verified passing", "1 Year Inactivity", "6 Months Inactivity", "Immediate Release"]
  },
  {
    id: "ls3",
    key: "familyCircleAccess",
    title: "Family Circle access",
    description: "All members can view",
    defaultVal: "Full archive",
    options: ["Full archive", "Selected albums only", "Audio recordings only", "Restricted access"]
  },
  {
    id: "ls4",
    key: "publicProfile",
    title: "Public profile",
    description: "Stories stay discoverable",
    defaultVal: "Remain public",
    options: ["Remain public", "Make private after release", "Restricted profile"]
  }
];

const FAMILY_TREE_DATA = {
  me: {
    name: "Seán",
    role: "You",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"
  },
  members: [
    { name: "Sarah", role: "Partner", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
    { name: "Ciarán", role: "Son", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" },
    { name: "Aoife", role: "Daughter", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
    { name: "Declan", role: "Father", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" }
  ]
};

function FamilyCircleContent() {
  const auth = useAuth() || {};
  const currentProfile = auth.profile;
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") || "Members";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const [membersList, setMembersList] = useState([]); // Start with empty array, no mock data
  const [invitationsList, setInvitationsList] = useState([]);
  const [sharedMemories, setSharedMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(false);

  const [selectedMemberFilter, setSelectedMemberFilter] = useState("ALL");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL");
  const [timelineSearch, setTimelineSearch] = useState("");
  const [timelineSort, setTimelineSort] = useState("newest");

  const [familyAlbums, setFamilyAlbums] = useState([]);
  const [loadingFamilyAlbums, setLoadingFamilyAlbums] = useState(false);
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [legacySettings, setLegacySettings] = useState({
    administrator: "Sarah Murphy",
    releaseCondition: "After verified passing",
    familyCircleAccess: "Full archive",
    publicProfile: "Remain public"
  });
  const [editingSetting, setEditingSetting] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);
  const [currentCircleId, setCurrentCircleId] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineCursor, setTimelineCursor] = useState(null);
  const [hasMoreTimeline, setHasMoreTimeline] = useState(false);
  const [promptsList, setPromptsList] = useState([]);
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [promptCategory, setPromptCategory] = useState("Heritage");
  const [activePromptResponseId, setActivePromptResponseId] = useState(null);
  const [replyInputText, setReplyInputText] = useState("");
  const [guardianMinorsList, setGuardianMinorsList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [userToken, setUserToken] = useState(null);

  // Voice Recording state for Question Composer & Reply Form
  const [isRecordingQuestion, setIsRecordingQuestion] = useState(false);
  const [questionRecordSecs, setQuestionRecordSecs] = useState(0);
  const [questionAudioBlob, setQuestionAudioBlob] = useState(null);
  const [questionAudioUrl, setQuestionAudioUrl] = useState(null);
  const qRecorderRef = useRef(null);
  const qTimerRef = useRef(null);

  const [isRecordingReply, setIsRecordingReply] = useState(false);
  const [replyRecordSecs, setReplyRecordSecs] = useState(0);
  const [replyAudioBlob, setReplyAudioBlob] = useState(null);
  const [replyAudioUrl, setReplyAudioUrl] = useState(null);
  const rRecorderRef = useRef(null);
  const rTimerRef = useRef(null);

  const startQuestionRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      qRecorderRef.current = recorder;
      const chunks = [];

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setQuestionAudioBlob(blob);
        setQuestionAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setIsRecordingQuestion(true);
      setQuestionRecordSecs(0);
      qTimerRef.current = setInterval(() => setQuestionRecordSecs(s => s + 1), 1000);
    } catch (err) {
      console.error("Mic access error:", err);
      alert("Could not access microphone.");
    }
  };

  const stopQuestionRecording = () => {
    if (qRecorderRef.current && isRecordingQuestion) {
      qRecorderRef.current.stop();
      setIsRecordingQuestion(false);
      if (qTimerRef.current) clearInterval(qTimerRef.current);
    }
  };

  const cancelQuestionRecording = () => {
    if (qRecorderRef.current && isRecordingQuestion) qRecorderRef.current.stop();
    setIsRecordingQuestion(false);
    setQuestionAudioBlob(null);
    setQuestionAudioUrl(null);
    setQuestionRecordSecs(0);
    if (qTimerRef.current) clearInterval(qTimerRef.current);
  };

  const startReplyRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      rRecorderRef.current = recorder;
      const chunks = [];

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setReplyAudioBlob(blob);
        setReplyAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setIsRecordingReply(true);
      setReplyRecordSecs(0);
      rTimerRef.current = setInterval(() => setReplyRecordSecs(s => s + 1), 1000);
    } catch (err) {
      console.error("Mic access error:", err);
      alert("Could not access microphone.");
    }
  };

  const stopReplyRecording = () => {
    if (rRecorderRef.current && isRecordingReply) {
      rRecorderRef.current.stop();
      setIsRecordingReply(false);
      if (rTimerRef.current) clearInterval(rTimerRef.current);
    }
  };

  const cancelReplyRecording = () => {
    if (rRecorderRef.current && isRecordingReply) rRecorderRef.current.stop();
    setIsRecordingReply(false);
    setReplyAudioBlob(null);
    setReplyAudioUrl(null);
    setReplyRecordSecs(0);
    if (rTimerRef.current) clearInterval(rTimerRef.current);
  };

  const formatSecs = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    async function loadGuardianData() {
      if (currentCircleId && (isAdmin || currentProfile?.role === "ADMIN")) {
        try {
          const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
          if (token) {
            const data = await getGuardianControls(token, currentCircleId).catch(() => []);
            if (Array.isArray(data)) setGuardianMinorsList(data);
          }
        } catch (err) {
          console.warn("Could not load guardian controls:", err);
        }
      }
    }
    loadGuardianData();
  }, [currentCircleId, isAdmin, currentProfile]);

  const handleToggleConsentPost = async (childUserId, currentVal) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        const updated = await updateGuardianConsent(token, childUserId, { canPostWithoutApproval: !currentVal });
        setGuardianMinorsList(prev => prev.map(m => {
          if (m.user?.id === childUserId) {
            return { ...m, consent: updated };
          }
          return m;
        }));
        setToastMessage("✓ Guardian consent setting updated!");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Toggle consent error:", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (t) setUserToken(t);
    }
  }, []);

  // Load connected family members & pending invitations from backend
  useEffect(() => {
    async function loadFamilyData() {
      try {
        let token = null;
        if (auth.getToken) {
          try { token = await auth.getToken(); } catch (_) {}
        }
        if (!token) token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");

        if (token) {
          // Load family circle details (ID)
          const circleDetails = await getFamilyCircleDetails(token).catch(() => null);
          if (circleDetails?.id) {
            setCurrentCircleId(circleDetails.id);
          }

          // Load family circle members (new API)
          const circleMembers = await getFamilyCircleMembers(token).catch(() => null);
          if (Array.isArray(circleMembers) && circleMembers.length > 0) {
            setMembersList(circleMembers);
          }

          // Load pending invitations (for current user)
          const backendInvites = await getFamilyInvitations(token).catch(() => null);
          if (Array.isArray(backendInvites)) {
            setInvitationsList(backendInvites);
          }

          // Load shared memories for family circle
          const shared = await getFamilySharedMemories(token).catch(() => []);
          if (Array.isArray(shared)) {
            const uniqueMap = new Map();
            shared.forEach(m => {
              if (!m) return;
              const idKey = m.id || m._id || `mem_${uniqueMap.size}`;
              if (!uniqueMap.has(idKey)) {
                uniqueMap.set(idKey, m);
              }
            });
            setSharedMemories(Array.from(uniqueMap.values()));
          }

          // Check if user is admin
          const adminStatus = await isFamilyAdmin(token).catch(() => ({ isAdmin: false }));
          const userIsAdmin = Boolean(adminStatus?.isAdmin || adminStatus === true);
          setIsAdmin(userIsAdmin);

          // Load pending approvals (if admin)
          if (userIsAdmin) {
            const approvals = await getPendingApprovals(token).catch(() => []);
            if (Array.isArray(approvals)) {
              setPendingApprovals(approvals);
            }
          }

          // Load legacy settings from backend
          const backendLegacy = await getLegacySettings(token).catch(() => null);
          if (backendLegacy) {
            setLegacySettings({
              administrator: backendLegacy.administratorName || "Sarah Murphy",
              administratorId: backendLegacy.administratorId || null,
              releaseCondition: backendLegacy.releaseCondition || "After verified passing",
              familyCircleAccess: backendLegacy.familyCircleAccess || "Full archive",
              publicProfile: backendLegacy.publicProfile || "Remain public"
            });
          }
        }
      } catch (err) {
        console.warn("Could not load backend family data, using defaults:", err);
      }
    }
    loadFamilyData();
  }, [auth.isAuthenticated, auth.firebaseUser]);

  // Load shared memories when Shared Memories tab is active
  useEffect(() => {
    async function loadSharedMemories() {
      if (activeTab === "Shared Memories") {
        setLoadingMemories(true);
        try {
          let token = null;
          if (auth.getToken) {
            try { token = await auth.getToken(); } catch (_) {}
          }
          if (!token) token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");

          if (token) {
            const memories = await getFamilySharedMemories(token, {
              userId: selectedMemberFilter,
              type: selectedTypeFilter,
              search: timelineSearch,
              sort: timelineSort,
            }).catch(() => []);
            if (Array.isArray(memories)) {
              const uniqueMap = new Map();
              memories.forEach(m => {
                if (!m) return;
                const idKey = m.id || m._id || `mem_${uniqueMap.size}`;
                if (!uniqueMap.has(idKey)) {
                  uniqueMap.set(idKey, m);
                }
              });
              setSharedMemories(Array.from(uniqueMap.values()));
            } else {
              setSharedMemories([]);
            }
          }
        } catch (err) {
          console.warn("Could not load shared memories:", err);
          setSharedMemories([]);
        } finally {
          setLoadingMemories(false);
        }
      }
    }
    loadSharedMemories();
  }, [activeTab, selectedMemberFilter, selectedTypeFilter, timelineSearch, timelineSort, auth.isAuthenticated, auth.firebaseUser]);

  // Load family albums when Family Albums tab is active
  useEffect(() => {
    async function loadFamilyAlbumsData() {
      if (activeTab === "Family Albums") {
        setLoadingFamilyAlbums(true);
        try {
          let token = null;
          if (auth.getToken) {
            try { token = await auth.getToken(); } catch (_) {}
          }
          if (!token) token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");

          let targetCircleId = currentCircleId;
          if (!targetCircleId && token) {
            const familyCircleData = await getFamilyCircleDetails(token).catch(() => null);
            if (familyCircleData?.id) {
              targetCircleId = familyCircleData.id;
              setCurrentCircleId(targetCircleId);
            }
          }

          if (token && targetCircleId) {
            const albums = await getFamilyCircleAlbumsFromBackend(token, targetCircleId).catch(() => []);
            if (Array.isArray(albums)) {
              setFamilyAlbums(albums);
            }
          }
        } catch (err) {
          console.warn("Could not load family albums:", err);
        } finally {
          setLoadingFamilyAlbums(false);
        }
      }
    }
    loadFamilyAlbumsData();
  }, [activeTab, currentCircleId, auth.isAuthenticated]);

  // Load family prompts when Ask Family tab is active
  useEffect(() => {
    async function loadPromptsData() {
      if (activeTab === "Ask Family") {
        setPromptsLoading(true);
        try {
          let token = null;
          if (auth.getToken) {
            try { token = await auth.getToken(); } catch (_) {}
          }
          if (!token) token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");

          let targetCircleId = currentCircleId;
          if (!targetCircleId && token) {
            const circleDetails = await getFamilyCircleDetails(token).catch(() => null);
            targetCircleId = circleDetails?.id || circleDetails?.data?.id || circleDetails?.familyCircleId;
            if (targetCircleId) setCurrentCircleId(targetCircleId);
          }

          if (token && targetCircleId) {
            const data = await getFamilyPrompts(token, targetCircleId).catch(() => []);
            if (Array.isArray(data)) setPromptsList(data);
          }
        } catch (err) {
          console.warn("Could not load family prompts:", err);
        } finally {
          setPromptsLoading(false);
        }
      }
    }
    loadPromptsData();
  }, [activeTab, currentCircleId, auth.isAuthenticated]);

  const handleCreatePrompt = async (e) => {
    e.preventDefault();
    if (!newQuestionText.trim() && !questionAudioBlob && !questionAudioUrl) return;

    try {
      let token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      let targetCircleId = currentCircleId;
      if (!targetCircleId && token) {
        const circleDetails = await getFamilyCircleDetails(token).catch(() => null);
        targetCircleId = circleDetails?.id || circleDetails?.data?.id || circleDetails?.familyCircleId;
        if (targetCircleId) setCurrentCircleId(targetCircleId);
      }

      if (!targetCircleId) {
        setToastMessage("Error: Could not retrieve Family Space ID.");
        setTimeout(() => setToastMessage(""), 3000);
        return;
      }

      let audioDataUrl = questionAudioUrl;
      if (questionAudioBlob) {
        audioDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(questionAudioBlob);
        });
      }

      if (token) {
        const qText = newQuestionText.trim() || "Voice Question";
        const created = await createFamilyPrompt(token, targetCircleId, qText, promptCategory, null, audioDataUrl);
        if (created) {
          const promptWithAudio = {
            ...created,
            audioUrl: created.audioUrl || audioDataUrl,
            audioKey: created.audioKey || audioDataUrl,
          };
          setPromptsList(prev => [promptWithAudio, ...prev]);
          setNewQuestionText("");
          cancelQuestionRecording();
          setToastMessage("✓ Family question posted!");
          setTimeout(() => setToastMessage(""), 3000);
        }
      }
    } catch (err) {
      console.error("Create prompt error:", err);
      setToastMessage(`Failed to post: ${err.message || "Server error"}`);
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  const handleRespondToPrompt = async (promptId) => {
    if (!replyInputText.trim() && !replyAudioBlob && !replyAudioUrl) return;
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      
      let audioDataUrl = replyAudioUrl;
      if (replyAudioBlob) {
        audioDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(replyAudioBlob);
        });
      }

      if (token) {
        const newResp = await respondToFamilyPrompt(token, promptId, { text: replyInputText.trim() || "Voice Answer", audioUrl: audioDataUrl });
        const respWithAudio = {
          ...newResp,
          audioUrl: newResp?.audioUrl || audioDataUrl,
          audioKey: newResp?.audioKey || audioDataUrl,
        };
        setPromptsList(prev => prev.map(p => {
          if (p.id === promptId) {
            return { ...p, responses: [...(p.responses || []), respWithAudio] };
          }
          return p;
        }));
        setReplyInputText("");
        cancelReplyRecording();
        setActivePromptResponseId(null);
        setToastMessage("✓ Response shared with family!");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Respond to prompt error:", err);
    }
  };

  const togglePermission = (id) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const handleOpenEdit = (setting) => {
    let currentOptions = [...(setting.options || [])];

    // For administrator, dynamically populate options from actual connected family circle members
    if (setting.key === "administrator" && Array.isArray(membersList) && membersList.length > 0) {
      const connectedNames = membersList.map(m => m.name || m.email?.split("@")[0]).filter(Boolean);
      if (connectedNames.length > 0) {
        currentOptions = connectedNames;
      }
    }

    setEditingSetting({ ...setting, options: currentOptions });
    const activeVal = legacySettings[setting.key] || currentOptions[0] || setting.defaultVal;
    setSelectedOption(activeVal);
  };

  const handleSaveSetting = async () => {
    if (!editingSetting) return;

    const newOption = selectedOption;
    setLegacySettings(prev => ({
      ...prev,
      [editingSetting.key]: newOption
    }));

    setEditingSetting(null);
    setToastMessage(`${editingSetting.title} updated successfully!`);
    setTimeout(() => setToastMessage(""), 3000);

    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await updateLegacySettings(token, {
          [editingSetting.key]: newOption
        });
      }
    } catch (err) {
      console.warn("Could not persist legacy setting to backend:", err);
    }
  };

  const handleInviteSuccess = (newMember) => {
    setToastMessage(`Invitation sent to ${newMember.name}! Connection invitation delivered.`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleApproveInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await approveInvitation(token, invitationId);
        setPendingApprovals(prev => prev.filter(i => i.id !== invitationId));
        // Re-fetch updated circle members so newly approved member shows up immediately
        const updatedMembers = await getFamilyCircleMembers(token).catch(() => null);
        if (Array.isArray(updatedMembers) && updatedMembers.length > 0) {
          setMembersList(updatedMembers);
        }
        setToastMessage("✓ Invitation approved! Member added to Family Circle.");
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch (err) {
      console.error("Approve invitation error:", err);
    }
  };

  const handleDeclineApproval = async (invitationId) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await declineApproval(token, invitationId);
        setPendingApprovals(prev => prev.filter(i => i.id !== invitationId));
        setToastMessage("Invitation declined.");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Decline approval error:", err);
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await promoteToAdmin(token, userId);
        setMembersList(prev => prev.map(m => 
          m.id === userId ? { ...m, isAdmin: true, role: "ADMIN" } : m
        ));
        setToastMessage("Member promoted to admin!");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Promote to admin error:", err);
    }
  };

  const handleDemoteFromAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await demoteFromAdmin(token, userId);
        setMembersList(prev => prev.map(m => 
          m.id === userId ? { ...m, isAdmin: false, role: "MEMBER" } : m
        ));
        setToastMessage("Admin demoted to member.");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Demote from admin error:", err);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm("Are you sure you want to remove this member from the family circle?")) return;
    
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        await removeFamilyMember(token, userId);
        setMembersList(prev => prev.filter(m => m.id !== userId));
        setToastMessage("Member removed from family circle.");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Remove member error:", err);
    }
  };

  const handleAcceptInvitation = async (invitation) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token && invitation.id && !invitation.id.startsWith("inv-mock")) {
        await acceptFamilyInvitation(token, invitation.id);
      }
    } catch (err) {
      console.warn("Accept invitation backend call error:", err);
    }
    setInvitationsList(prev => prev.filter(i => i.id !== invitation.id));
    if (invitation.sender) {
      setMembersList(prev => [
        {
          id: invitation.sender.id || `member-${Date.now()}`,
          name: invitation.sender.name || invitation.sender.displayName || "Family Member",
          role: invitation.relationship || "Family Member",
          isAdmin: false,
          sharedCount: 12,
          avatar: invitation.sender.avatar || invitation.sender.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
        },
        ...prev
      ]);
    }
    setToastMessage(`✓ Invitation accepted! ${invitation.sender?.name || "Member"} is now connected in your Family Circle.`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleDeclineInvitation = async (invitation) => {
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token && invitation.id && !invitation.id.startsWith("inv-mock")) {
        await declineFamilyInvitation(token, invitation.id);
      }
    } catch (err) {
      console.warn("Decline invitation backend call error:", err);
    }
    setInvitationsList(prev => prev.filter(i => i.id !== invitation.id));
    setToastMessage("Invitation declined.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <WavesBackground>
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full relative pb-24 min-h-screen"
      >
        <DashboardHeader />

        <div className="w-full mt-2 md:mt-6">
          
          {/* Header section */}
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-[32px] md:text-[36px] font-bold text-stone-900 dark:text-white tracking-tight leading-tight">Family Circle</h1>
              <p className="text-stone-500 dark:text-stone-400 font-medium text-[15px] mt-1">{membersList.length} members · Private space</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsLinkModalOpen(true)}
                className="bg-white hover:bg-stone-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#4A3AFF] dark:text-indigo-300 border border-[#4A3AFF]/30 dark:border-indigo-500/30 px-4 py-2.5 rounded-[12px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-[14px]"
              >
                <Link2 size={18} strokeWidth={2.5} />
                <span>Link Memory</span>
              </button>

              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-5 py-2.5 rounded-[12px] font-bold transition-all shadow-md flex items-center justify-center gap-2 max-w-max cursor-pointer active:scale-95 text-[14px]"
              >
                <UserPlus size={18} strokeWidth={2.5} />
                <span>Invite member</span>
              </button>
            </div>
          </motion.div>

          {/* Tab Bar - Exact Figma match with dynamic badge count */}
          <motion.div variants={fadeInUp} className="bg-white/80 dark:bg-slate-900/80 border border-[#C7D2FE]/70 dark:border-slate-800 p-1.5 rounded-[20px] inline-flex items-center gap-1.5 mb-8 overflow-x-auto max-w-full shadow-xs">
            {[
              { id: "Members", label: "Members" },
              { id: "Invitations", label: "Invitations", badge: invitationsList.length + pendingApprovals.length },
              { id: "Shared Memories", label: "Shared Memories" },
              { id: "Family Albums", label: "Family Albums" },
              { id: "Ask Family", label: "Ask Family" },
              { id: "Family Tree", label: "Family Tree" },
              { id: "Legacy Access", label: "Legacy Access" }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-[14px] text-[14px] font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id 
                  ? "bg-[#4A3AFF] text-white shadow-md" 
                  : "text-[#3F436E] dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#EEF2FF] dark:hover:bg-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center ${
                    activeTab === tab.id ? "bg-white text-[#4A3AFF]" : "bg-[#4A3AFF] text-white"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Active Tab Content: Members */}
          {activeTab === "Members" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                {membersList.map((member) => {
                  const isSelf = member.id === currentProfile?.id || (member.email && member.email === currentProfile?.email);
                  const realPhoto = isSelf ? (currentProfile?.photoURL || member.avatar || member.photoURL) : (member.avatar || member.photoURL);

                  const nameToDisplay = (member.name && member.name !== "Admin") 
                    ? member.name 
                    : (member.email?.split("@")[0] || "Family Member");

                  const relationshipToDisplay = (member.relationship === "Admin" || member.relationship === "ADMIN")
                    ? "Circle Creator"
                    : (member.relationship || member.role || "Family Member");

                  const initials = String(nameToDisplay || "Member").split(" ").map(n => n ? n[0] : "").join("").toUpperCase().slice(0, 2) || "M";
                  const hasRealPhoto = Boolean(realPhoto && typeof realPhoto === "string" && realPhoto.startsWith("http"));

                  return (
                    <motion.div 
                      variants={fadeInUp}
                      key={member.id} 
                      className={`figma-card p-6 flex items-center justify-between transition-all duration-300 ${
                        member.isAdmin ? "ring-2 ring-[#4A3AFF]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          {hasRealPhoto ? (
                            <img src={realPhoto} alt={nameToDisplay} className="w-14 h-14 rounded-full object-cover border border-[#C7D2FE]/50 shadow-xs" />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4A3AFF] to-[#6C5DD3] text-white font-black text-lg flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs">
                              {initials}
                            </div>
                          )}
                          {member.isAdmin && (
                            <div className="absolute -bottom-1 -right-1 bg-[#4A3AFF] text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#EAEBFF]">
                              <ShieldCheck size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[17px] text-stone-900 dark:text-white leading-tight">{nameToDisplay}</h3>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[13px] font-medium text-stone-600 dark:text-stone-400">{relationshipToDisplay}</span>
                            {member.role === "ADMIN" || member.isAdmin ? (
                              <span className="bg-[#4A3AFF] text-white text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Admin</span>
                            ) : member.role === "ADULT_MEMBER" ? (
                              <span className="bg-[#EEF2FF] text-[#4A3AFF] dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Adult Member</span>
                            ) : member.role === "CONTRIBUTOR" ? (
                              <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Contributor</span>
                            ) : member.role === "RESTRICTED_MINOR" ? (
                              <span className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Minor</span>
                            ) : member.role === "GUEST" ? (
                              <span className="bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-stone-300 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Guest</span>
                            ) : (
                              <span className="bg-[#EEF2FF] text-[#4A3AFF] text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]">Member</span>
                            )}
                          </div>
                          <p className="text-[12px] font-medium text-stone-500 dark:text-stone-400 mt-1">{member.sharedCount || 0} shared memories</p>
                        </div>
                      </div>
                      
                    </motion.div>
                  );
                })}

                {/* Invite Card */}
                <motion.button 
                  onClick={() => setIsInviteModalOpen(true)}
                  variants={fadeInUp} 
                  className="relative w-full rounded-[20px] p-6 bg-[#4A3AFF] hover:bg-[#3b2dd1] transition-all flex flex-col justify-center text-left shadow-md group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white text-[#4A3AFF] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <UserPlus size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[18px] text-white mb-0.5">Invite a family member</h3>
                      <span className="bg-[#EEF2FF] text-[#4A3AFF] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[6px]">Admin only</span>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Permissions & Security Section */}
              <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="p-6 pb-2">
                  <h2 className="font-bold text-[18px] text-stone-900 dark:text-white">Circle permissions</h2>
                </div>
                <div className="flex flex-col flex-1">
                  {permissions.map((perm, index) => (
                    <div key={perm.id} className={`flex items-center justify-between p-6 ${index !== permissions.length - 1 ? "border-b border-stone-100 dark:border-stone-800" : ""}`}>
                      <span className="text-[15px] font-medium text-stone-600 dark:text-stone-300">{perm.label}</span>
                      
                      {/* Custom Toggle Switch */}
                      <button 
                        onClick={() => togglePermission(perm.id)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${perm.enabled ? "bg-[#4A3AFF]" : "bg-stone-200 dark:bg-slate-700"}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${perm.enabled ? "translate-x-6 shadow-sm" : "translate-x-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Guardian & Minor Safety Controls Section */}
              {(isAdmin || currentProfile?.role === "ADMIN") && guardianMinorsList.length > 0 && (
                <motion.div variants={fadeInUp} className="mt-8 figma-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold text-[18px] text-stone-900 dark:text-white">Guardian & Minor Safety Controls</h2>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Manage posting privileges and consent for minor accounts.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {guardianMinorsList.map(({ user, consent }) => (
                      <div key={user?.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-stone-50 dark:bg-slate-800/60 rounded-2xl border border-stone-200/60 dark:border-slate-700/60 gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user?.photoURL || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"}
                            alt={user?.displayName || "Minor User"}
                            className="w-11 h-11 rounded-full object-cover border border-[#C7D2FE]"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-stone-900 dark:text-white">{user?.displayName || user?.name || "Minor Member"}</h4>
                            <p className="text-xs text-stone-500 dark:text-stone-400">{user?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                            Allow publishing without approval:
                          </span>
                          <button
                            onClick={() => handleToggleConsentPost(user?.id, consent?.canPostWithoutApproval)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                              consent?.canPostWithoutApproval ? "bg-emerald-500" : "bg-stone-300 dark:bg-slate-700"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                consent?.canPostWithoutApproval ? "translate-x-6 shadow-sm" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Active Tab Content: Invitations (Interactive Invitations Manager) */}
          {activeTab === "Invitations" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              {invitationsList.length === 0 && pendingApprovals.length === 0 ? (
                <motion.div variants={fadeInUp} className="figma-card p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-8">
                  <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center mb-4 shadow-xs">
                    <UserPlus size={28} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No Pending Invitations</h2>
                  <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-6">
                    You're all caught up! New family circle invitations and member join requests will appear here.
                  </p>
                  <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="px-6 py-3 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <UserPlus size={16} />
                    <span>Invite Family Member</span>
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6 max-w-4xl mx-auto my-4">
                  {/* Section 1: Join Requests Waiting for Admin Approval */}
                  {pendingApprovals.length > 0 && (
                    <div className="space-y-4">
                      <div className="p-2 mb-1 flex items-center justify-between">
                        <div>
                          <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-0.5 flex items-center gap-2">
                            <span>Member Join Requests</span>
                            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingApprovals.length}</span>
                          </h2>
                          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">People who accepted your invitation link and are waiting for your approval to join.</p>
                        </div>
                      </div>

                      {pendingApprovals.map((approval) => {
                        const displayName = approval.receiverName || approval.receiver?.displayName || approval.receiver?.name || approval.email || "Family Member";
                        const avatar = approval.receiverAvatar || approval.receiver?.photoURL || approval.receiver?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

                        return (
                          <motion.div 
                            key={approval.id} 
                            variants={fadeInUp} 
                            className="figma-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all hover:shadow-lg border-l-4 border-l-amber-500"
                          >
                            <div className="flex items-center gap-4">
                              <img 
                                src={avatar} 
                                alt={displayName} 
                                className="w-14 h-14 rounded-full object-cover border-2 border-[#C7D2FE]" 
                              />
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-bold text-[17px] text-stone-900 dark:text-white">{displayName}</h3>
                                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-200/80 dark:border-amber-800/50 flex items-center gap-1.5">
                                    <Clock size={13} className="text-amber-500" />
                                    <span>Wants to join as {approval.relationship || "Family Member"}</span>
                                  </span>
                                </div>
                                <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1">{approval.email || approval.receiver?.email || approval.phoneNumber}</p>
                                <p className="text-[11px] text-stone-400 mt-0.5">Method: {approval.method || "LINK"} • Pending Admin Approval</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <button
                                onClick={() => handleDeclineApproval(approval.id)}
                                className="px-4 py-2.5 border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleApproveInvitation(approval.id)}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                              >
                                <Check size={16} strokeWidth={2.5} />
                                <span>Approve</span>
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Section 2: Direct Incoming Invitations */}
                  {invitationsList.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <div className="p-2 mb-1">
                        <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-0.5">Incoming Invitations ({invitationsList.length})</h2>
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Review and accept invitations from family members wishing to connect.</p>
                      </div>

                      {invitationsList.map((inv) => (
                        <motion.div 
                          key={inv.id} 
                          variants={fadeInUp} 
                          className="figma-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all hover:shadow-lg"
                        >
                          <div className="flex items-center gap-4">
                            <img 
                              src={inv.sender?.avatar || inv.sender?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"} 
                              alt={inv.sender?.name || inv.sender?.displayName} 
                              className="w-14 h-14 rounded-full object-cover border-2 border-[#C7D2FE]" 
                            />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-[17px] text-stone-900 dark:text-white">{inv.sender?.displayName || inv.sender?.name || "Family Member"}</h3>
                                <span className="px-3 py-1 bg-[#EEF2FF] dark:bg-indigo-950 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-xs font-bold border border-[#D1D9FF] dark:border-indigo-800/40">
                                  Wants to connect as {inv.relationship || "Family"}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1">{inv.sender?.email}</p>
                              <p className="text-[11px] text-stone-400 mt-0.5">Received {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "recently"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              onClick={() => handleDeclineInvitation(inv)}
                              className="px-4 py-2.5 border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptInvitation(inv)}
                              className="px-5 py-2.5 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                            >
                              <Check size={16} strokeWidth={2.5} />
                              <span>Accept & Connect</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Active Tab Content: Ask Family */}
          {activeTab === "Ask Family" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
              {/* Question Composer Card */}
              <motion.div id="ask-family-composer" variants={fadeInUp} className="figma-card p-6 md:p-8 transition-all duration-500">
                <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Ask a Family Question</h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-4">
                  Ask a question via text or record a voice question to start a family memory discussion.
                </p>

                <form onSubmit={handleCreatePrompt} className="space-y-4">
                  <div>
                    <textarea
                      rows={3}
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="e.g. What was grandpa's favorite memory growing up? Or record a voice question below!"
                      className="w-full p-4 rounded-2xl border border-[#C7D2FE]/70 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#4A3AFF] focus:outline-none transition resize-none"
                    />
                  </div>

                  {/* Voice Question Recording Panel */}
                  <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-[#C7D2FE]/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {isRecordingQuestion ? (
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                          <span className="text-xs font-bold text-red-600 dark:text-red-400">
                            Recording ({formatSecs(questionRecordSecs)})
                          </span>
                          <button
                            type="button"
                            onClick={stopQuestionRecording}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Square size={12} /> Stop
                          </button>
                        </div>
                      ) : questionAudioUrl ? (
                        <div className="flex items-center gap-3">
                          <audio src={questionAudioUrl} controls className="h-8 max-w-[200px]" />
                          <button
                            type="button"
                            onClick={cancelQuestionRecording}
                            className="p-1.5 text-stone-400 hover:text-red-500 transition cursor-pointer"
                            title="Discard recording"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startQuestionRecording}
                          className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-stone-100 text-[#4A3AFF] dark:text-indigo-300 border border-[#C7D2FE] rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition"
                        >
                          <Mic size={15} className="text-[#4A3AFF]" />
                          <span>Record Voice Question</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Category:</span>
                      {["Heritage", "Childhood", "Traditions", "Fun"].map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setPromptCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                            promptCategory === cat
                              ? "bg-[#4A3AFF] text-white shadow-xs"
                              : "bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={!newQuestionText.trim() && !questionAudioBlob && !questionAudioUrl}
                      className="px-6 py-2.5 bg-[#4A3AFF] hover:bg-[#3b2dd1] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer active:scale-95 ml-auto"
                    >
                      Post Question
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Prompts Stream */}
              <div className="space-y-6">
                {promptsLoading ? (
                  <div className="text-center py-12 text-stone-400 text-sm font-medium">Loading family questions...</div>
                ) : promptsList.length === 0 ? (
                  <div className="figma-card p-12 text-center flex flex-col items-center justify-center">
                    <TreePine size={32} className="text-[#4A3AFF] mb-3" />
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">No family questions yet</h3>
                    <p className="text-xs text-stone-400 max-w-sm mt-1">
                      Be the first to post a question above to ignite family conversations!
                    </p>
                  </div>
                ) : (
                  promptsList.map((prompt) => (
                    <motion.div key={prompt.id} variants={fadeInUp} className="figma-card p-6 md:p-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={prompt.createdBy?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"}
                            alt={prompt.createdBy?.displayName || "Member"}
                            className="w-10 h-10 rounded-full object-cover border border-[#C7D2FE]"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-stone-900 dark:text-white leading-tight">
                              {prompt.createdBy?.displayName || prompt.createdBy?.name || "Family Member"}
                            </h4>
                            <p className="text-[11px] text-stone-400">
                              Asked {new Date(prompt.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <span className="px-3 py-1 bg-[#EEF2FF] text-[#4A3AFF] dark:bg-indigo-950 dark:text-indigo-300 rounded-full text-xs font-bold border border-[#D1D9FF] dark:border-indigo-800/40">
                          {prompt.category || "Heritage"}
                        </span>
                      </div>

                      {prompt.question && prompt.question !== "Voice Question" && (
                        <h3 className="text-lg font-bold text-stone-900 dark:text-white leading-snug">
                          "{prompt.question}"
                        </h3>
                      )}

                      {prompt.question === "Voice Question" && !(prompt.audioUrl || prompt.audioKey) && (
                        <h3 className="text-lg font-bold text-stone-900 dark:text-white leading-snug">
                          "Voice Question"
                        </h3>
                      )}

                      {(prompt.audioUrl || prompt.audioKey) && (
                        <div className="pt-1 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A3AFF]">
                            <Mic size={13} />
                            <span>Spoken Voice Question</span>
                          </div>
                          <VoicePlayer memory={{ mediaUrl: prompt.audioUrl || prompt.audioKey, title: prompt.question !== "Voice Question" ? prompt.question : "Spoken Voice Question" }} />
                        </div>
                      )}

                      {/* Responses List */}
                      {prompt.responses && prompt.responses.length > 0 && (
                        <div className="pl-4 border-l-2 border-[#4A3AFF]/30 space-y-3 pt-2">
                          {prompt.responses.map((resp) => {
                            const authorAvatar = resp.author?.photoURL || resp.author?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(resp.author?.displayName || resp.author?.name || "Member")}&background=4A3AFF&color=fff`;
                            const authorName = resp.author?.displayName || resp.author?.name || "Family Member";
                            const hasAudio = resp.audioUrl || resp.audioKey;

                            return (
                              <div key={resp.id} className="bg-stone-50/80 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <img src={authorAvatar} alt={authorName} className="w-5 h-5 rounded-full object-cover border border-white" />
                                    <span className="font-bold text-xs text-stone-900 dark:text-white">
                                      {authorName}
                                    </span>
                                    <span className="text-[10px] text-stone-400">
                                      {new Date(resp.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {hasAudio && (
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold flex items-center gap-1 border border-amber-200">
                                      <Mic size={10} /> Voice Answer
                                    </span>
                                  )}
                                </div>

                                {resp.text && resp.text !== "Voice Answer" && (
                                  <p className="text-xs text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                                    {resp.text}
                                  </p>
                                )}

                                {hasAudio && (
                                  <div className="pt-1">
                                    <VoicePlayer memory={{ mediaUrl: resp.audioUrl || resp.audioKey, title: `${authorName}'s Voice Response` }} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Reply Action */}
                      {activePromptResponseId === prompt.id ? (
                        <div className="pt-2 flex flex-col gap-2 bg-stone-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-stone-200 dark:border-slate-700">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={replyInputText}
                              onChange={(e) => setReplyInputText(e.target.value)}
                              placeholder="Write or record your response..."
                              className="flex-1 px-4 py-2 rounded-xl border border-stone-300 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#4A3AFF] focus:outline-none"
                            />

                            {isRecordingReply ? (
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-200">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                <span>{formatSecs(replyRecordSecs)}</span>
                                <button
                                  type="button"
                                  onClick={stopReplyRecording}
                                  className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold"
                                >
                                  Stop
                                </button>
                              </div>
                            ) : replyAudioUrl ? (
                              <div className="flex items-center gap-1">
                                <audio src={replyAudioUrl} controls className="h-7 max-w-[140px]" />
                                <button
                                  type="button"
                                  onClick={cancelReplyRecording}
                                  className="p-1 text-stone-400 hover:text-red-500"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={startReplyRecording}
                                className="px-3 py-2 bg-indigo-50 text-[#4A3AFF] hover:bg-indigo-100 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer border border-[#C7D2FE]"
                                title="Record Voice Answer"
                              >
                                <Mic size={14} />
                                <span>Voice</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleRespondToPrompt(prompt.id)}
                              disabled={!replyInputText.trim() && !replyAudioBlob && !replyAudioUrl}
                              className="px-4 py-2 bg-[#4A3AFF] hover:bg-[#3b2ee0] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                            >
                              Send
                            </button>
                            <button
                              onClick={() => {
                                setActivePromptResponseId(null);
                                cancelReplyRecording();
                              }}
                              className="px-2 py-2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActivePromptResponseId(prompt.id);
                            setReplyInputText("");
                            cancelReplyRecording();
                          }}
                          className="text-xs font-bold text-[#4A3AFF] hover:underline cursor-pointer pt-1 flex items-center gap-1"
                        >
                          <Plus size={13} /> Add your response
                        </button>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Active Tab Content: Legacy Access (Exact Figma match - 3D Card with Inset Shadow) */}
          {activeTab === "Legacy Access" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              {/* Single Large 3D Card */}
              <motion.div variants={fadeInUp} className="legacy-3d-card p-8 md:p-10 mb-8 relative overflow-hidden">
                
                {/* Card Header */}
                <div className="mb-8">
                  <h2 className="font-bold text-[24px] md:text-[26px] text-stone-900 dark:text-white tracking-tight mb-2">
                    Legacy Release Settings
                  </h2>
                  <p className="text-[14px] md:text-[15px] font-medium text-[#73789E] dark:text-stone-400 leading-relaxed max-w-3xl">
                    Configure who receives access to your archive, and when. These settings are private and can be updated at any time.
                  </p>
                </div>

                {/* Settings Rows with Thin Dividers */}
                <div className="space-y-0 divide-y divide-[#D9E0FF] dark:divide-stone-700/60">
                  {LEGACY_SETTINGS_DATA.map((setting) => {
                    const currentVal = legacySettings[setting.key] || setting.defaultVal;
                    return (
                      <div key={setting.id} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div>
                          <h3 className="font-bold text-[16px] text-stone-900 dark:text-white mb-0.5">{setting.title}</h3>
                          <p className="text-[13px] font-medium text-stone-400 dark:text-stone-500">{setting.description}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                          <span className="px-4 py-2 bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-[13px] font-bold border border-[#D1D9FF] dark:border-indigo-800/40 shadow-xs">
                            {currentVal}
                          </span>
                          <button 
                            onClick={() => handleOpenEdit(setting)}
                            className="px-5 py-2 border border-[#4A3AFF] text-[#4A3AFF] dark:text-indigo-300 dark:border-indigo-400 rounded-[10px] text-[13px] font-bold hover:bg-[#4A3AFF] hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
              </motion.div>
            </motion.div>
          )}

          {/* Active Tab Content: Family Tree */}
          {activeTab === "Family Tree" && (
            <div className="animate-fade-in">
              <div className="figma-card mb-12 p-10 min-h-[500px] flex flex-col items-center justify-center">
                
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="mx-auto text-[#4A3AFF] mb-3 flex justify-center">
                    <TreePine size={40} strokeWidth={2.5} />
                  </div>
                  <h2 className="font-bold text-[24px] text-stone-900 dark:text-white mb-1">Family Tree</h2>
                  <p className="text-[15px] font-medium text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
                    Explore generational layers and connect family memories.
                  </p>
                </div>

                {/* Interactive Multi-Generational Family Tree Canvas */}
                <FamilyTreeCanvas
                  circleId={currentCircleId}
                  userToken={userToken}
                  currentUserId={currentProfile?.id}
                  membersList={membersList}
                />

              </div>
            </div>
          )}

          {/* Family Albums Tab */}
          {activeTab === "Family Albums" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full">
              {loadingFamilyAlbums ? (
                <motion.div variants={fadeInUp} className="figma-card py-20 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-[#4A3AFF] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-stone-500 dark:text-stone-400 font-bold text-sm">Loading family albums...</p>
                </motion.div>
              ) : familyAlbums.length === 0 ? (
                <motion.div variants={fadeInUp} className="figma-card p-12 flex flex-col items-center justify-center text-center my-6">
                  <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center mb-4 shadow-sm">
                    <FolderHeart size={32} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No Family Albums Created Yet</h2>
                  <p className="text-stone-500 dark:text-stone-400 max-w-md text-sm leading-relaxed mb-6">
                    Create a shared Family Album to start curating memories, photo stories, and voice notes together across generations.
                  </p>
                  <button 
                    onClick={() => setIsCreateAlbumModalOpen(true)} 
                    className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Plus size={16} />
                    <span>Create Family Album</span>
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6 w-full my-4">
                  <div className="flex items-center justify-between p-2 mb-2">
                    <div>
                      <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-0.5 flex items-center gap-2">
                        <span>Family Space Albums</span>
                        <span className="bg-[#4A3AFF] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{familyAlbums.length}</span>
                      </h2>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Collaborative memory collections curated by your connected family members.</p>
                    </div>
                    <button 
                      onClick={() => setIsCreateAlbumModalOpen(true)} 
                      className="bg-[#4A3AFF] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-[#3b2dd1] transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Plus size={14} />
                      <span>New Album</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {familyAlbums.map((album) => (
                      <Link key={album.id} href={`/family/albums/${album.id}`} className="group cursor-pointer block h-full">
                        <div className="relative w-full overflow-hidden figma-card flex flex-col h-full cursor-pointer">
                          <div className="relative w-full aspect-[4/2.4] overflow-hidden bg-stone-200 dark:bg-slate-700 shrink-0">
                            <img src={album.coverImageUrl || "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd"} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-95" />
                            <div className="absolute bottom-3 left-4 right-4 text-white z-10">
                              <h3 className="font-bold text-[16px] truncate">{album.title}</h3>
                            </div>
                          </div>
                          <div className="p-4 flex flex-col justify-between flex-1 bg-[#E8E9FF]/90 dark:bg-slate-800/90">
                            <p className="text-stone-700 dark:text-stone-300 text-xs font-medium line-clamp-2 mb-3">
                              {album.subtitle || "No description provided."}
                            </p>
                            {album.contributors && album.contributors.length > 0 && (
                              <div className="flex items-center justify-between border-t pt-2 border-indigo-100/60 dark:border-slate-700/60">
                                <div className="flex items-center gap-2">
                                  <div className="flex -space-x-2 overflow-hidden">
                                    {album.contributors.slice(0, 4).map((c, i) => (
                                      c.avatar ? (
                                        <img key={i} src={c.avatar} alt={c.name || "Contributor"} title={`${c.name || "Family Member"} (${c.role || "Contributor"})`} className="h-6 w-6 rounded-full border-2 border-white dark:border-slate-800 object-cover shadow-xs" />
                                      ) : (
                                        <div key={i} title={`${c.name || "Family Member"} (${c.role || "Contributor"})`} className="h-6 w-6 rounded-full bg-[#4A3AFF] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs">
                                          {c.name ? c.name[0].toUpperCase() : "M"}
                                        </div>
                                      )
                                    ))}
                                  </div>
                                  <span className="text-[11px] font-semibold text-stone-500">
                                    {album.contributors.length} {album.contributors.length === 1 ? "contributor" : "contributors"}
                                  </span>
                                </div>

                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-slate-700 text-[#4A3AFF] dark:text-indigo-300">
                                  {album.memoryCount ?? album.entries ?? 0} {(album.memoryCount ?? album.entries ?? 0) === 1 ? "memory" : "memories"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Shared Memories Tab */}
          {activeTab === "Shared Memories" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full">
              {loadingMemories ? (
                <motion.div variants={fadeInUp} className="figma-card py-20 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-[#4A3AFF] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-stone-500 dark:text-stone-400">Loading shared memories...</p>
                </motion.div>
              ) : sharedMemories.length === 0 ? (
                <motion.div variants={fadeInUp} className="figma-card p-12 flex flex-col items-center justify-center text-center my-6">
                  <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center mb-4 shadow-sm">
                    <Heart size={32} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No Shared Family Memories Yet</h2>
                  <p className="text-stone-500 dark:text-stone-400 max-w-md text-sm leading-relaxed">
                    When connected family members publish memories with family or public privacy, they will automatically appear here.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6 w-full my-4">
                  <div className="flex items-center justify-between p-2 mb-2">
                    <div>
                      <h2 className="font-bold text-xl text-stone-900 dark:text-white mb-0.5 flex items-center gap-2">
                        <span>Shared Family Memories</span>
                        <span className="bg-[#4A3AFF] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{sharedMemories.length}</span>
                      </h2>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Stories, voices, and photos shared across your connected family circle.</p>
                    </div>
                  </div>

                  {/* Interactive Timeline Controls Bar */}
                  <div className="figma-card p-4 mb-6 space-y-4 bg-white/90 dark:bg-slate-900/90 border border-[#C7D2FE]/70">
                    {/* Row 1: Member Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full [&::-webkit-scrollbar]:hidden">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">Member:</span>
                      <button
                        onClick={() => setSelectedMemberFilter("ALL")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          selectedMemberFilter === "ALL"
                            ? "bg-[#4A3AFF] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        All Members
                      </button>

                      {membersList.map((m) => {
                        const isSelected = selectedMemberFilter === m.userId || selectedMemberFilter === m.id;
                        const initial = m.name ? m.name[0].toUpperCase() : "M";
                        return (
                          <button
                            key={m.id || m.userId}
                            onClick={() => setSelectedMemberFilter(m.userId || m.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-[#4A3AFF] text-white shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                            }`}
                          >
                            {m.avatar ? (
                              <img src={m.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                            ) : (
                              <span className="w-4 h-4 rounded-full bg-white/30 font-extrabold text-[9px] flex items-center justify-center">
                                {initial}
                              </span>
                            )}
                            <span>{m.name || m.displayName}</span>
                            <span className="text-[10px] opacity-75 font-semibold">({m.relationship || m.role})</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Row 2: Media Type Chips & Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                      {/* Media Type Chips */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                        {[
                          { id: "ALL", label: "All Formats" },
                          { id: "Voice", label: "🎙️ Voice Stories" },
                          { id: "Photo", label: "📷 Photos" },
                          { id: "Written", label: "📝 Written" },
                          { id: "Milestone", label: "🏆 Milestones" }
                        ].map((typeChip) => (
                          <button
                            key={typeChip.id}
                            onClick={() => setSelectedTypeFilter(typeChip.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                              selectedTypeFilter === typeChip.id
                                ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                            }`}
                          >
                            {typeChip.label}
                          </button>
                        ))}
                      </div>

                      {/* Search & Sort Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="relative flex-1 sm:w-48">
                          <input
                            type="text"
                            placeholder="Search stories..."
                            value={timelineSearch}
                            onChange={(e) => setTimelineSearch(e.target.value)}
                            className="w-full pl-3 pr-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#4A3AFF]"
                          />
                        </div>
                        <select
                          value={timelineSort}
                          onChange={(e) => setTimelineSort(e.target.value)}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 w-full block">
                    {sharedMemories.map((memory) => {
                      const normType = (memory.type || "").toLowerCase();
                      const isVoice = normType === "voice" || normType === "audio" || !!memory.audioUrl || !!memory.audio;
                      
                      const mediaItems = [];
                      if (!isVoice) {
                        const addMedia = (url, type = "image") => {
                          if (!url || typeof url !== "string") return;
                          const cleanUrl = url.split("?")[0].toLowerCase();
                          if (/\.(mp3|wav|m4a|aac|ogg)$/i.test(cleanUrl) || type === "voice" || type === "audio") return;
                          const isVid = (type === "video") || /\.(mp4|mov|avi|m4v)$/i.test(cleanUrl);
                          if (!mediaItems.some(i => i.url === url)) {
                            mediaItems.push({ url, type: isVid ? "video" : "image" });
                          }
                        };

                        if (Array.isArray(memory.mediaList)) {
                          memory.mediaList.forEach(m => addMedia(m?.mediaUrl || m?.url, m?.type));
                        }
                        if (Array.isArray(memory.media)) {
                          memory.media.forEach(m => typeof m === "string" ? addMedia(m) : addMedia(m?.url || m?.mediaUrl, m?.type));
                        }
                        addMedia(memory.videoUrl, "video");
                        addMedia(memory.imageUrl);
                        addMedia(memory.image);
                      }

                      const hasMedia = !isVoice && mediaItems.length > 0;
                      const isVideo = !isVoice && (normType === "video" || mediaItems.some(m => m.type === "video"));
                      
                      const dateVal = memory.date || memory.createdAt || memory.occurredAt;
                      const dateStr = dateVal ? new Date(dateVal).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent";

                      const ownerName = memory.ownerDisplayName || memory.owner?.name || memory.ownerEmail?.split("@")[0] || "Family Member";
                      const ownerAvatar = memory.ownerAvatarUrl || memory.owner?.avatar || memory.owner?.photoURL;
                      const ownerInitials = String(ownerName).split(" ").map(n => n ? n[0] : "").join("").toUpperCase().slice(0, 2) || "M";
                      const ownerRel = memory.ownerRelationship || "Family Member";

                      const openView = () => {
                        window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { ...memory, date: dateStr } }));
                      };

                      return (
                        <motion.div
                          key={memory.id || memory._id}
                          variants={fadeInUp}
                          onClick={openView}
                          className="figma-card overflow-hidden group break-inside-avoid cursor-pointer flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full mb-6"
                        >
                          {/* Author Info Header */}
                          <div className="p-4 pb-2 flex items-center justify-between gap-3 border-b border-stone-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                              {ownerAvatar && typeof ownerAvatar === "string" && ownerAvatar.startsWith("http") ? (
                                <img src={ownerAvatar} alt={ownerName} className="w-10 h-10 rounded-full object-cover border border-[#C7D2FE]/60" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A3AFF] to-[#6C5DD3] text-white font-bold text-xs flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs">
                                  {ownerInitials}
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-[14px] text-stone-900 dark:text-white leading-tight">{ownerName}</h4>
                                <span className="text-[11px] font-semibold text-[#4A3AFF] dark:text-indigo-400">{ownerRel}</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-medium text-stone-400">{dateStr}</span>
                          </div>

                          {/* Card Content by Type */}
                          <div className="p-4 pt-3 flex flex-col flex-1">
                            {hasMedia && (
                              <div className="mb-4">
                                <CardMediaSlider mediaItems={mediaItems} title={memory.title} />
                              </div>
                            )}

                            <div className="flex items-center gap-2 mb-2">
                              {isVoice ? (
                                <>
                                  <Mic size={14} strokeWidth={2.5} className="text-[#f59e0b]" />
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#f59e0b]">VOICE MEMORY</span>
                                </>
                              ) : isVideo ? (
                                <>
                                  <Film size={14} strokeWidth={2.5} className="text-[#ec4899]" />
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ec4899]">VIDEO</span>
                                </>
                              ) : (
                                <>
                                  <FileText size={14} strokeWidth={2.5} className="text-[#10b981]" />
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#10b981]">{hasMedia ? "PHOTO MEMORY" : "WRITTEN STORY"}</span>
                                </>
                              )}
                            </div>

                            <h3 className="text-[18px] font-bold mb-2 text-stone-900 dark:text-white group-hover:text-[#4A3AFF] transition-colors leading-snug">{memory.title}</h3>
                            {memory.description && <p className="text-stone-500 dark:text-stone-400 text-xs line-clamp-3 leading-relaxed mb-4">{memory.description}</p>}

                            {isVoice && (
                              <div className="my-2 w-full" onClick={(e) => e.stopPropagation()}>
                                <VoicePlayer memory={memory} />
                              </div>
                            )}
                          </div>

                          {/* Tags footer */}
                          <div className="p-4 pt-0 mt-auto flex flex-wrap gap-1.5">
                            {(memory.tags && memory.tags.length > 0 ? memory.tags : ['family']).map((tag) => (
                              <span key={tag} className="px-2.5 py-0.5 bg-[#EEF2FF] dark:bg-slate-800 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-[10px] font-bold">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </motion.div>

      {/* Edit Setting Modal */}
      {editingSetting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-[28px] w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setEditingSetting(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] dark:bg-indigo-950 text-[#4A3AFF] dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">{editingSetting.title}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">{editingSetting.description}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6 mt-4">
              {editingSetting.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                    selectedOption === opt
                      ? "border-[#4A3AFF] bg-[#EEF2FF] text-[#4A3AFF] dark:bg-indigo-950/80 dark:text-indigo-300 shadow-xs"
                      : "border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{opt}</span>
                  {selectedOption === opt && <Check size={16} className="text-[#4A3AFF] dark:text-indigo-400" />}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditingSetting(null)}
                className="flex-1 py-3 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 font-extrabold text-xs hover:bg-stone-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSetting}
                className="flex-1 py-3 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                Save Setting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Memory Modal */}
      <LinkMemoryModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        familyCircleId={currentCircleId}
        onLinkSuccess={() => {
          setToastMessage("✓ Memory linked to Family Space!");
          setTimeout(() => setToastMessage(""), 3500);
        }}
      />

      {/* Invite Member Modal */}
      <InviteMemberModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={handleInviteSuccess}
      />

      {/* Create Family Album Modal */}
      <CreateFamilyAlbumModal
        isOpen={isCreateAlbumModalOpen}
        onClose={() => setIsCreateAlbumModalOpen(false)}
        familyCircleId={currentCircleId}
        onSuccess={async () => {
          setToastMessage("✓ Family Album created successfully!");
          setTimeout(() => setToastMessage(""), 3500);
          setActiveTab("Family Albums");
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("tab", "Family Albums");
            window.history.pushState({}, "", url.toString());
          }
          let token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
          if (token && currentCircleId) {
            const albums = await getFamilyCircleAlbumsFromBackend(token, currentCircleId).catch(() => []);
            if (Array.isArray(albums)) setFamilyAlbums(albums);
          }
        }}
      />
    </WavesBackground>
  );
}

export default function FamilyCirclePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F6FF] dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#4A3AFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <FamilyCircleContent />
    </Suspense>
  );
}
