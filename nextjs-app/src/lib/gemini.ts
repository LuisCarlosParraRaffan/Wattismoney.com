import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY no está configurada. El quiz usará preguntas estáticas.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const geminiModel = genAI?.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.7,
  }
});

// Prompt para generar preguntas del quiz
export const QUESTIONS_PROMPT = `Eres un asesor de inversiones experto en energía renovable.

Tu tarea es generar exactamente 10 preguntas para determinar el perfil de riesgo de un inversor interesado en el sector energético.

CONTEXTO IMPORTANTE:
- La inversión en energía es uno de los negocios más seguros del mundo
- La electricidad es un commodity esencial que toda industria necesita
- La demanda de energía limpia crece exponencialmente

PERFILES A IDENTIFICAR:
1. VISIONARIO (Alto riesgo): Interesado en tecnologías emergentes (smart grids, almacenamiento), horizonte +5 años
2. ACELERADOR (Riesgo medio): Interesado en tecnologías en crecimiento (EVs, infraestructura de carga), horizonte 2-5 años  
3. ESTABILIZADOR (Bajo riesgo): Interesado en contratos de energía con demanda estable, horizonte <2 años

REGLAS PARA LAS PREGUNTAS:
- Lenguaje sencillo, sin jerga financiera compleja
- Opciones de respuesta claras (4 opciones por pregunta)
- Preguntas que sutilmente comuniquen la seguridad de invertir en energía
- Mezcla de preguntas sobre: horizonte temporal, tolerancia al cambio, objetivos financieros, interés en innovación

FORMATO DE RESPUESTA (JSON):
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": [
        {"id": "a", "text": "...", "profile_weight": {"visionario": 0, "acelerador": 0, "estabilizador": 3}},
        {"id": "b", "text": "...", "profile_weight": {"visionario": 1, "acelerador": 2, "estabilizador": 0}},
        {"id": "c", "text": "...", "profile_weight": {"visionario": 2, "acelerador": 1, "estabilizador": 0}},
        {"id": "d", "text": "...", "profile_weight": {"visionario": 3, "acelerador": 0, "estabilizador": 0}}
      ]
    }
  ]
}`;

// Prompt para evaluar respuestas
export const EVALUATE_PROMPT = `Eres un asesor de inversiones experto en energía renovable.

Analiza las siguientes respuestas de un inversor y determina su perfil.

RESPUESTAS DEL USUARIO:
{user_responses}

PERFILES POSIBLES:
- VISIONARIO: Busca alto crecimiento a largo plazo, cómodo con volatilidad, interesado en innovación
- ACELERADOR: Balance entre crecimiento y estabilidad, horizonte medio, sigue tendencias probadas
- ESTABILIZADOR: Prioriza seguridad y flujo constante, horizonte corto, prefiere lo probado

Responde ÚNICAMENTE en JSON:
{
  "profile": "VISIONARIO|ACELERADOR|ESTABILIZADOR",
  "confidence": 0.85,
  "reasons": [
    "Tu preferencia por horizontes de inversión largos indica...",
    "Tus respuestas muestran interés en tecnologías emergentes...",
    "Valoras la estabilidad pero también el potencial de crecimiento..."
  ],
  "investment_recommendations": [
    "Smart Grids y almacenamiento de energía",
    "Proyectos de energía solar a gran escala"
  ],
  "personalized_message": "¡Felicidades! Como Visionario, estás preparado para..."
}`;

// Preguntas estáticas de respaldo (si no hay API key)
export const STATIC_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál es tu horizonte ideal de inversión?",
    options: [
      { id: "a", text: "Menos de 2 años - Quiero resultados pronto", profile_weight: { visionario: 0, acelerador: 1, estabilizador: 3 } },
      { id: "b", text: "2 a 5 años - Un balance entre resultados y crecimiento", profile_weight: { visionario: 1, acelerador: 3, estabilizador: 1 } },
      { id: "c", text: "5 a 10 años - Busco crecimiento sostenido", profile_weight: { visionario: 2, acelerador: 2, estabilizador: 0 } },
      { id: "d", text: "Más de 10 años - Pienso en el largo plazo", profile_weight: { visionario: 3, acelerador: 1, estabilizador: 0 } }
    ]
  },
  {
    id: 2,
    question: "Si tu inversión bajara un 15% temporalmente, ¿qué harías?",
    options: [
      { id: "a", text: "Vendería inmediatamente para evitar más pérdidas", profile_weight: { visionario: 0, acelerador: 0, estabilizador: 3 } },
      { id: "b", text: "Esperaría un poco, pero me preocuparía", profile_weight: { visionario: 0, acelerador: 2, estabilizador: 2 } },
      { id: "c", text: "Mantendría la calma y esperaría la recuperación", profile_weight: { visionario: 2, acelerador: 3, estabilizador: 0 } },
      { id: "d", text: "Aprovecharía para invertir más a mejor precio", profile_weight: { visionario: 3, acelerador: 1, estabilizador: 0 } }
    ]
  },
  {
    id: 3,
    question: "¿Qué tipo de tecnología energética te atrae más?",
    options: [
      { id: "a", text: "Plantas solares y eólicas establecidas - Lo probado funciona", profile_weight: { visionario: 0, acelerador: 1, estabilizador: 3 } },
      { id: "b", text: "Infraestructura de carga para vehículos eléctricos", profile_weight: { visionario: 1, acelerador: 3, estabilizador: 1 } },
      { id: "c", text: "Almacenamiento de energía con baterías avanzadas", profile_weight: { visionario: 2, acelerador: 2, estabilizador: 0 } },
      { id: "d", text: "Hidrógeno verde y smart grids - El futuro de la energía", profile_weight: { visionario: 3, acelerador: 1, estabilizador: 0 } }
    ]
  },
  {
    id: 4,
    question: "¿Cuál es tu principal objetivo al invertir?",
    options: [
      { id: "a", text: "Obtener ingresos estables y predecibles", profile_weight: { visionario: 0, acelerador: 1, estabilizador: 3 } },
      { id: "b", text: "Combinar ingresos regulares con algo de crecimiento", profile_weight: { visionario: 1, acelerador: 3, estabilizador: 1 } },
      { id: "c", text: "Hacer crecer mi capital significativamente", profile_weight: { visionario: 2, acelerador: 2, estabilizador: 0 } },
      { id: "d", text: "Maximizar el crecimiento aunque implique más riesgo", profile_weight: { visionario: 3, acelerador: 1, estabilizador: 0 } }
    ]
  },
  {
    id: 5,
    question: "¿Qué porcentaje de tus ahorros destinarías a inversiones?",
    options: [
      { id: "a", text: "Menos del 10% - Quiero mantener mucha liquidez", profile_weight: { visionario: 0, acelerador: 1, estabilizador: 3 } },
      { id: "b", text: "10-25% - Un porcentaje conservador", profile_weight: { visionario: 1, acelerador: 2, estabilizador: 2 } },
      { id: "c", text: "25-50% - Creo en diversificar", profile_weight: { visionario: 2, acelerador: 3, estabilizador: 0 } },
      { id: "d", text: "Más del 50% - Confío en el potencial de crecimiento", profile_weight: { visionario: 3, acelerador: 1, estabilizador: 0 } }
    ]
  },
  {
    id: 6,
    question: "¿Cómo describirías tu experiencia con inversiones?",
    options: [
      { id: "a", text: "Soy nuevo, prefiero opciones simples y seguras", profile_weight: { visionario: 0, acelerador: 1, estabilizador: 3 } },
      { id: "b", text: "Tengo algo de experiencia con fondos o acciones", profile_weight: { visionario: 1, acelerador: 3, estabilizador: 1 } },
      { id: "c", text: "Invierto regularmente y entiendo el mercado", profile_weight: { visionario: 2, acelerador: 2, estabilizador: 0 } },
      { id: "d", text: "Soy experimentado y busco oportunidades únicas", profile_weight: { visionario: 3, acelerador: 1, estabilizador: 0 } }
    ]
  },
  {
    id: 7,
    question: "¿Qué tan importante es para ti el impacto ambiental de tus inversiones?",
    options: [
      { id: "a", text: "Es un plus, pero priorizo la rentabilidad segura", profile_weight: { visionario: 1, acelerador: 1, estabilizador: 3 } },
      { id: "b", text: "Busco un balance entre rentabilidad e impacto", profile_weight: { visionario: 1, acelerador: 3, estabilizador: 1 } },
      { id: "c", text: "Es muy importante, quiero contribuir al cambio", profile_weight: { visionario: 2, acelerador: 2, estabilizador: 0 } },
      { id: "d", text: "Es fundamental, estoy dispuesto a asumir más riesgo por ello", profile_weight: { visionario: 3, acelerador: 1, estabilizador: 0 } }
    ]
  },
  {
    id: 8,
    question: "¿Cada cuánto te gustaría revisar tus inversiones?",
    options: [
      { id: "a", text: "Semanalmente - Me gusta estar al tanto", profile_weight: { visionario: 1, acelerador: 2, estabilizador: 3 } },
      { id: "b", text: "Mensualmente - Un seguimiento regular", profile_weight: { visionario: 1, acelerador: 3, estabilizador: 1 } },
      { id: "c", text: "Trimestralmente - Confío en mi estrategia", profile_weight: { visionario: 2, acelerador: 2, estabilizador: 0 } },
      { id: "d", text: "Anualmente - Pienso en el largo plazo", profile_weight: { visionario: 3, acelerador: 1, estabilizador: 0 } }
    ]
  },
  {
    id: 9,
    question: "Si pudieras elegir, ¿qué preferirías?",
    options: [
      { id: "a", text: "Retorno garantizado del 5% anual", profile_weight: { visionario: 0, acelerador: 0, estabilizador: 3 } },
      { id: "b", text: "Posibilidad de 8% con algo de variabilidad", profile_weight: { visionario: 1, acelerador: 3, estabilizador: 1 } },
      { id: "c", text: "Potencial de 12% con riesgo moderado", profile_weight: { visionario: 2, acelerador: 2, estabilizador: 0 } },
      { id: "d", text: "Oportunidad de 20%+ aunque sea más arriesgado", profile_weight: { visionario: 3, acelerador: 1, estabilizador: 0 } }
    ]
  },
  {
    id: 10,
    question: "¿Cómo te sientes respecto a las nuevas tecnologías?",
    options: [
      { id: "a", text: "Prefiero esperar a que estén probadas", profile_weight: { visionario: 0, acelerador: 1, estabilizador: 3 } },
      { id: "b", text: "Las adopto cuando ya tienen tracción en el mercado", profile_weight: { visionario: 1, acelerador: 3, estabilizador: 1 } },
      { id: "c", text: "Me gusta ser de los primeros en adoptarlas", profile_weight: { visionario: 2, acelerador: 2, estabilizador: 0 } },
      { id: "d", text: "Busco activamente las tecnologías más innovadoras", profile_weight: { visionario: 3, acelerador: 1, estabilizador: 0 } }
    ]
  }
];

export type QuizQuestion = typeof STATIC_QUESTIONS[0];
export type ProfileType = 'VISIONARIO' | 'ACELERADOR' | 'ESTABILIZADOR';

export interface ProfileResult {
  profile: ProfileType;
  confidence: number;
  reasons: string[];
  investment_recommendations: string[];
  personalized_message: string;
}
