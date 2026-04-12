"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function EncuestaNeoBrutalism() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sections = [
    {
      title: "INICIO",
      content: (
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter">
            VoltaVape <br /> <span className="text-white">Recicla.</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_#000]">
            Transformando vapes agotados en powerbanks sostenibles para Ciudad Victoria. ⚡
            <br/><br/>
            Esta investigación de la UAT toma menos de 3 minutos y tu contribución es vital para nuestra metodología científica de economía circular.
          </p>
        </div>
      )
    },
    {
      title: "DEMOGRÁFICOS",
      questions: [
        { id: "DEM01", text: "1. ¿Cuál es su edad?", options: ["18-23", "24-29", "30-35", "Mayor de 35"] },
        { id: "DEM02", text: "2. Género", options: ["Masculino", "Femenino", "Otro"] },
        { id: "DEM03", text: "3. Ocupación", options: ["Estudiante", "Empleado", "Emprendedor / Independiente", "Otro"] },
      ]
    },
    {
      title: "HÁBITOS & FILTRO",
      questions: [
        { id: "FIL01", text: "4. ¿Consume o ha consumido vapes en los últimos 6 meses?", options: ["Sí", "No"] },
        { id: "FIL02", text: "5. ¿Con qué frecuencia desecha un vape agotado?", options: ["Semanal", "Quincenal", "Mensual", "Semestral", "Anual"] }
      ]
    },
    {
      title: "UTILIDAD PERCIBIDA (UP)",
      questions: [
        { id: "UP01", text: "6. El reciclaje de vapes mediante VoltaVape es una solución útil para reducir la basura electrónica.", type: "likert" },
        { id: "UP02", text: "7. Considero que transformar vapes en powerbanks previene la contaminación del agua por toxinas.", type: "likert" },
        { id: "UP03", text: "8. Participar en VoltaVape es provechoso para contribuir a la sostenibilidad local.", type: "likert" }
      ]
    },
    {
      title: "FACILIDAD DE USO (FU)",
      questions: [
        { id: "FU01", text: "9. Sería fácil ubicar los puntos de recolección de VoltaVape en mi universidad o ciudad.", type: "likert" },
        { id: "FU02", text: "10. El proceso de entregar mi vape a cambio de un descuento me parecería sencillo de realizar.", type: "likert" },
        { id: "FU03", text: "11. Guardar mis vapes para reciclarlos no representaría un esfuerzo extra en mi rutina diaria.", type: "likert" }
      ]
    },
    {
      title: "INFLUENCIA SOCIAL (IS)",
      questions: [
        { id: "IS01", text: "12. Mis amigos y compañeros universitarios piensan que debería reciclar mis vapes usados.", type: "likert" },
        { id: "IS02", text: "13. Las personas que son importantes para mí apoyarían que compre un powerbank ecológico.", type: "likert" },
        { id: "IS03", text: "14. Las campañas de concientización y la opinión pública me motivan a reciclar.", type: "likert" }
      ]
    },
    {
      title: "CONFIANZA (CO)",
      questions: [
        { id: "CO01", text: "15. Confío en que un powerbank ensamblado a partir de vapes tiene una calidad duradera.", type: "likert" },
        { id: "CO02", text: "16. Siento seguridad al usar una batería reciclada porque cuenta con sistemas de protección BMS.", type: "likert" },
        { id: "CO03", text: "17. Creo que VoltaVape manejará los residuos tóxicos restantes de manera transparente.", type: "likert" }
      ]
    },
    {
      title: "SOCIO-ECONÓMICAS (VA)",
      questions: [
        { id: "VA01", text: "18. Siento una obligación moral de reciclar mis aparatos electrónicos para cuidar el ambiente.", type: "likert" },
        { id: "VA02", text: "19. Estaría dispuesto/a a pagar $250 - $450 MXN por un powerbank reciclado VoltaVape.", type: "likert" },
        { id: "VA03", text: "20. Un incentivo económico o descuentos incrementaría mi interés en regresar vapes.", type: "likert" }
      ]
    },
    {
      title: "INTENCIÓN FINAL (IP)",
      questions: [
        { id: "IP01", text: "21. Tengo la intención de entregar mis próximos vapes agotados a los contenedores.", type: "likert" },
        { id: "IP02", text: "22. Planeo apoyar a la iniciativa o adquirir un powerbank de VoltaVape en los próximos 12 meses.", type: "likert" },
        { id: "IP03", text: "23. Recomendaría a otros usuarios de vapes que participen en este modelo.", type: "likert" }
      ]
    }
  ];

  const handleSelect = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const isStepComplete = () => {
    if (step === 0) return true;
    const currentQ = sections[step]?.questions || [];
    return currentQ.every(q => formData[q.id] !== undefined);
  };

  const nextStep = async () => {
    // End survey if Age > 35
    if (step === 1 && formData["DEM01"] === "Mayor de 35") {
      setSubmitted(true);
      return;
    }

    if (!isStepComplete()) {
      alert("Por favor, responda todas las preguntas de esta sección antes de avanzar. (¡El rigor metodológico es vital!)");
      return;
    }

    if (step === sections.length - 1) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) setSubmitted(true);
      } catch (error) {
        console.error("Error al enviar form", error);
      }
      setIsSubmitting(false);
    } else {
      setStep(prev => prev + 1);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#A3E635] flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-12 border-8 border-black shadow-[16px_16px_0px_0px_#000] max-w-2xl text-center">
          <CheckCircle className="w-24 h-24 mx-auto mb-6 text-[#A3E635] drop-shadow-[4px_4px_0_#000]" />
          <h2 className="text-5xl font-black uppercase mb-4">¡Impacto Logrado!</h2>
          <p className="text-2xl font-bold">
            {formData["DEM01"] === "Mayor de 35" 
              ? "Para este estudio analizamos residentes de 18-35 años, pero valoramos enormemente su interés. ¡Gracias por promover la sustentabilidad!"
              : "Tus respuestas han sido registradas para el análisis factorial. ¡Gracias por impulsar la economía circular en la UAT y Tamaulipas!"}
          </p>
        </div>
      </div>
    );
  }

  const currentSection = sections[step];

  return (
    <div className="min-h-screen bg-[#A3E635] text-black font-sans p-4 md:p-8 flex flex-col transition-colors duration-500 pb-32">
      
      {/* Header/Progress */}
      <div className="fixed top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-xl md:text-2xl font-black bg-white px-3 py-2 border-4 border-black shadow-[4px_4px_0_#000]">
          <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-400" />
          <span>VOLTAVAPE</span>
        </div>
        <div className="text-lg md:text-xl font-bold bg-white px-3 py-2 border-4 border-black shadow-[4px_4px_0_#000]">
          {step + 1} / {sections.length}
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto flex-grow flex flex-col justify-center mt-24">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="w-full"
          >
            {step === 0 ? (
              currentSection.content
            ) : (
              <div className="space-y-6 text-left">
                <h2 className="text-3xl md:text-4xl font-black uppercase bg-black text-white inline-block px-4 py-2 border-4 border-black">
                  {currentSection.title}
                </h2>
                
                {currentSection.questions?.map((q, idx) => (
                  <div key={idx} className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_#000] space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold">{q.text}</h3>
                    
                    {q.type === 'likert' ? (
                      <div>
                        {/* Desktop scale legend */}
                        <div className="hidden md:flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
                          <span>1 = Totalmente en desacuerdo</span>
                          <span>7 = Totalmente de acuerdo</span>
                        </div>
                        <div className="flex flex-wrap md:flex-nowrap gap-2 justify-between">
                          {[1,2,3,4,5,6,7].map(num => (
                            <button
                              key={num}
                              onClick={() => handleSelect(q.id, num.toString())}
                              className={`flex-1 min-w-[3rem] py-3 border-4 border-black text-xl font-black transition-all
                                ${formData[q.id] === num.toString() 
                                  ? 'bg-black text-[#A3E635] shadow-none translate-y-1 translate-x-1' 
                                  : 'bg-[#E5E7EB] hover:bg-white shadow-[4px_4px_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none'
                                }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options?.map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleSelect(q.id, opt)}
                            className={`text-left text-lg font-bold p-3 border-4 border-black transition-all
                              ${formData[q.id] === opt 
                                ? 'bg-black text-[#A3E635] shadow-none translate-y-1 translate-x-1' 
                                : 'bg-white shadow-[4px_4px_0_#000] hover:bg-gray-50 active:translate-y-1 active:translate-x-1 active:shadow-none'
                              }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer/Navigation */}
        <div className="mt-12 flex justify-end">
          <button
            onClick={nextStep}
            disabled={isSubmitting}
            className="group flex items-center gap-3 bg-white px-6 py-4 border-4 border-black shadow-[8px_8px_0_#000] text-2xl font-black uppercase transition-all hover:bg-gray-50 active:translate-y-2 active:translate-x-2 active:shadow-none disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : (step === sections.length - 1 ? 'Enviar Datos' : 'Siguiente')}
            <ArrowRight className="w-8 h-8 group-active:translate-x-2 transition-transform" strokeWidth={4} />
          </button>
        </div>

      </div>
    </div>
  );
}