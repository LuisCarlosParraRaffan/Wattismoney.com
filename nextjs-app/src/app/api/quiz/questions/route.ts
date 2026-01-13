import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { geminiModel, QUESTIONS_PROMPT, STATIC_QUESTIONS } from '@/lib/gemini';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        // Si tenemos Gemini configurado, intentamos generar preguntas dinámicas
        if (geminiModel) {
            try {
                const result = await geminiModel.generateContent(QUESTIONS_PROMPT);
                const responseText = result.response.text();
                const questionsData = JSON.parse(responseText);

                return NextResponse.json({
                    questions: questionsData.questions,
                    source: 'ai'
                });
            } catch (aiError) {
                console.error('Error generando preguntas con AI:', aiError);
                // Fallback a preguntas estáticas
            }
        }

        // Usar preguntas estáticas como fallback
        return NextResponse.json({
            questions: STATIC_QUESTIONS,
            source: 'static'
        });

    } catch (error) {
        console.error('Error en quiz/questions:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
