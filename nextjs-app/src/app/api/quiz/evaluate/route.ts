import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { geminiModel, EVALUATE_PROMPT, STATIC_QUESTIONS, ProfileResult, ProfileType } from '@/lib/gemini';

interface Answer {
    questionId: number;
    optionId: string;
}

function calculateProfileFromAnswers(answers: Answer[]): ProfileResult {
    // Calcular puntajes basados en las respuestas
    const scores = {
        visionario: 0,
        acelerador: 0,
        estabilizador: 0
    };

    for (const answer of answers) {
        const question = STATIC_QUESTIONS.find(q => q.id === answer.questionId);
        if (question) {
            const option = question.options.find(o => o.id === answer.optionId);
            if (option) {
                scores.visionario += option.profile_weight.visionario;
                scores.acelerador += option.profile_weight.acelerador;
                scores.estabilizador += option.profile_weight.estabilizador;
            }
        }
    }

    // Determinar perfil dominante
    const maxScore = Math.max(scores.visionario, scores.acelerador, scores.estabilizador);
    const totalScore = scores.visionario + scores.acelerador + scores.estabilizador;

    let profile: ProfileType;
    let reasons: string[];
    let recommendations: string[];
    let message: string;

    if (scores.visionario === maxScore) {
        profile = 'VISIONARIO';
        reasons = [
            'Tu visión a largo plazo demuestra que entiendes el potencial del sector energético',
            'Tienes tolerancia al riesgo y buscas oportunidades de alto crecimiento',
            'Te interesan las tecnologías emergentes que definirán el futuro'
        ];
        recommendations = [
            'Smart Grids y redes inteligentes',
            'Almacenamiento de energía con baterías',
            'Proyectos de hidrógeno verde',
            'Infraestructura de carga para EVs'
        ];
        message = '¡Eres un Visionario! 🚀 Tu mentalidad de largo plazo te posiciona perfectamente para capturar el crecimiento exponencial del sector de energía limpia.';
    } else if (scores.acelerador === maxScore) {
        profile = 'ACELERADOR';
        reasons = [
            'Buscas un balance inteligente entre crecimiento y seguridad',
            'Prefieres tecnologías probadas pero con alto potencial',
            'Tu horizonte de inversión te permite capturar tendencias de crecimiento'
        ];
        recommendations = [
            'Parques solares en operación',
            'Proyectos eólicos con contratos establecidos',
            'Infraestructura de transmisión',
            'Proyectos de eficiencia energética'
        ];
        message = '¡Eres un Acelerador! 🌱 Tu enfoque equilibrado te permite aprovechar el crecimiento del sector mientras mantienes una base sólida de inversión.';
    } else {
        profile = 'ESTABILIZADOR';
        reasons = [
            'Valoras la seguridad y los retornos predecibles',
            'Prefieres inversiones con flujos de caja estables',
            'Tu enfoque conservador protege tu capital mientras genera rendimientos'
        ];
        recommendations = [
            'Contratos de compra de energía (PPAs) a largo plazo',
            'Proyectos con subsidios gubernamentales',
            'Plantas de generación con contratos regulados',
            'Bonos verdes de proyectos establecidos'
        ];
        message = '¡Eres un Estabilizador! ⚓ Tu enfoque en la seguridad te permite invertir en energía renovable con la tranquilidad de retornos estables y predecibles.';
    }

    return {
        profile,
        confidence: maxScore / totalScore,
        reasons,
        investment_recommendations: recommendations,
        personalized_message: message
    };
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { answers } = body as { answers: Answer[] };

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return NextResponse.json(
                { error: 'Respuestas inválidas' },
                { status: 400 }
            );
        }

        let result: ProfileResult;

        // Intentar evaluar con Gemini si está disponible
        if (geminiModel) {
            try {
                const userResponses = answers.map(a => {
                    const question = STATIC_QUESTIONS.find(q => q.id === a.questionId);
                    const option = question?.options.find(o => o.id === a.optionId);
                    return `Pregunta: ${question?.question}\nRespuesta: ${option?.text}`;
                }).join('\n\n');

                const prompt = EVALUATE_PROMPT.replace('{user_responses}', userResponses);
                const aiResult = await geminiModel.generateContent(prompt);
                const responseText = aiResult.response.text();
                result = JSON.parse(responseText) as ProfileResult;
            } catch (aiError) {
                console.error('Error evaluando con AI:', aiError);
                // Fallback a cálculo estático
                result = calculateProfileFromAnswers(answers);
            }
        } else {
            // Usar cálculo estático
            result = calculateProfileFromAnswers(answers);
        }

        // Intentar guardar en base de datos (sin bloquear el flujo si falla)
        try {
            await prisma.investorProfile.upsert({
                where: { userId: session.user.id },
                update: {
                    aiRiskProfile: result.profile,
                    aiConfidence: result.confidence,
                    aiReasons: result.reasons,
                    aiRecommendations: result.investment_recommendations,
                    quizCompletedAt: new Date(),
                },
                create: {
                    userId: session.user.id,
                    aiRiskProfile: result.profile,
                    aiConfidence: result.confidence,
                    aiReasons: result.reasons,
                    aiRecommendations: result.investment_recommendations,
                    quizCompletedAt: new Date(),
                }
            });
        } catch (dbError) {
            // Log but don't fail - the user can still see their results
            console.error('Error guardando perfil en BD (continuando):', dbError);
        }

        return NextResponse.json({
            success: true,
            result
        });

    } catch (error) {
        console.error('Error en quiz/evaluate:', error);
        // Log más detallado
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
