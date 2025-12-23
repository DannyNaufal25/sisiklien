import React, { useState, useEffect } from "react";
import Card from "../Components/atoms/Card";
import Accordion from "../Components/organisms/Accordion";
import TanyaDosenModal from "../Components/organisms/TanyaDosenModal";
import { modulList } from "../data/modulData";

const Kelas = () => {
  const [modul, setModul] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModulJudul, setSelectedModulJudul] = useState("");

  useEffect(() => {
    // Load progress dari localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const savedProgress = user.progress || [];
    
    // Merge dengan data modul
    const updatedModul = modulList.map(m => ({
      ...m,
      selesai: savedProgress.includes(m.id)
    }));
    
    setModul(updatedModul);
  }, []);

  const handleToggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const handleSelesai = (modulId) => {
    const updatedModul = modul.map(m => {
      if (m.id === modulId) {
        return { ...m, selesai: !m.selesai };
      }
      return m;
    });

    setModul(updatedModul);

    // Update progress di localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const completedModul = updatedModul.filter(m => m.selesai).map(m => m.id);
    user.progress = completedModul;
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleTanyaDosen = (modulJudul) => {
    setSelectedModulJudul(modulJudul);
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">📚 Modul Pembelajaran</h1>
        
        <Card>
          <h2 className="text-lg font-semibold mb-4">Daftar Kelas & Materi</h2>
          
          <div className="space-y-3">
            {modul.map((m) => (
              <Accordion
                key={m.id}
                modul={m}
                activeId={activeAccordion}
                onToggle={handleToggleAccordion}
                onSelesai={handleSelesai}
                onTanyaDosen={handleTanyaDosen}
              />
            ))}
          </div>
        </Card>
      </div>

      <TanyaDosenModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        modulJudul={selectedModulJudul}
      />
    </>
  );
};

export default Kelas;
