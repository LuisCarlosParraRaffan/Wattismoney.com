import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Wattismoney <noreply@wattismoney.com>';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.wattismoney.com';

export interface EmailResult {
    success: boolean;
    error?: string;
}

// Email de bienvenida después del registro
export async function sendWelcomeEmail(
    to: string,
    firstName: string
): Promise<EmailResult> {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: '¡Bienvenido a Wattismoney! 🌱',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #000000; padding: 32px; text-align: center;">
            <h1 style="color: #EAFF04; margin: 0; font-size: 28px; font-weight: bold;">Watt is Money</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 32px;">
            <h2 style="color: #000000; margin: 0 0 16px 0; font-size: 24px;">¡Hola ${firstName}! 👋</h2>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Bienvenido a <strong>Wattismoney</strong>, tu plataforma de inversión en energía limpia. 
                Estamos emocionados de tenerte con nosotros.
            </p>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Para comenzar a invertir en proyectos de energía sostenible, necesitamos verificar 
                tu identidad. Es un proceso rápido y seguro.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="${BASE_URL}/login?redirect=/kyc-upload" 
                   style="display: inline-block; background-color: #EAFF04; color: #000000; 
                          text-decoration: none; padding: 16px 40px; border-radius: 50px; 
                          font-weight: bold; font-size: 16px;">
                    Completar verificación KYC
                </a>
            </div>
            
            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
                Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este email.
            </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 24px 32px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
                © 2025 Wattismoney. Inversión responsable en energía sostenible.
            </p>
        </div>
    </div>
</body>
</html>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: 'Error al enviar email de bienvenida' };
    }
}

// Email de confirmación de documentos KYC recibidos
export async function sendKycSubmittedEmail(
    to: string,
    firstName: string
): Promise<EmailResult> {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Documentos recibidos - En revisión ⏳',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #000000; padding: 32px; text-align: center;">
            <h1 style="color: #EAFF04; margin: 0; font-size: 28px; font-weight: bold;">Watt is Money</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; background-color: #EAFF04; border-radius: 50%; padding: 16px;">
                    <span style="font-size: 32px;">✓</span>
                </div>
            </div>
            
            <h2 style="color: #000000; margin: 0 0 16px 0; font-size: 24px; text-align: center;">
                ¡Documentos recibidos, ${firstName}!
            </h2>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                Hemos recibido tu documentación correctamente. Nuestro equipo de cumplimiento 
                está revisando tu información.
            </p>
            
            <!-- Info Box -->
            <div style="background-color: #f9f9f9; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0;">
                    <strong>⏱ Tiempo estimado de revisión:</strong>
                </p>
                <p style="color: #000000; font-size: 18px; font-weight: bold; margin: 0;">
                    24 a 48 horas hábiles
                </p>
            </div>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0;">
                Te notificaremos por email cuando tu verificación esté completa y puedas 
                continuar con el proceso de inversión.
            </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 24px 32px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
                © 2025 Wattismoney. Inversión responsable en energía sostenible.
            </p>
        </div>
    </div>
</body>
</html>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending KYC submitted email:', error);
        return { success: false, error: 'Error al enviar email de confirmación KYC' };
    }
}

// Email de invitación a completar perfil de inversor
export async function sendProfileInvitationEmail(
    to: string,
    firstName: string
): Promise<EmailResult> {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: '¡KYC Aprobado! Completa tu perfil de inversor 🎯',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #000000; padding: 32px; text-align: center;">
            <h1 style="color: #EAFF04; margin: 0; font-size: 28px; font-weight: bold;">Watt is Money</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; background-color: #22c55e; border-radius: 50%; padding: 16px;">
                    <span style="font-size: 32px; color: white;">✓</span>
                </div>
            </div>
            
            <h2 style="color: #000000; margin: 0 0 16px 0; font-size: 24px; text-align: center;">
                ¡Tu identidad ha sido verificada, ${firstName}!
            </h2>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                Excelentes noticias. Tu documentación KYC ha sido aprobada. Ya estás un paso 
                más cerca de invertir en energía sostenible.
            </p>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                El siguiente paso es completar tu <strong>perfil de inversor</strong>. 
                Esto nos ayudará a recomendarte las mejores oportunidades de inversión 
                según tu tolerancia al riesgo y objetivos financieros.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="${BASE_URL}/login?redirect=/investor-profile" 
                   style="display: inline-block; background-color: #EAFF04; color: #000000; 
                          text-decoration: none; padding: 16px 40px; border-radius: 50px; 
                          font-weight: bold; font-size: 16px;">
                    Completar perfil de inversor
                </a>
            </div>
            
            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; text-align: center;">
                Solo te tomará 2-3 minutos responder unas preguntas simples.
            </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 24px 32px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
                © 2025 Wattismoney. Inversión responsable en energía sostenible.
            </p>
        </div>
    </div>
</body>
</html>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending profile invitation email:', error);
        return { success: false, error: 'Error al enviar invitación de perfil' };
    }
}

// Email de felicitaciones - perfil completo
export async function sendProfileCompleteEmail(
    to: string,
    firstName: string,
    profileType: string
): Promise<EmailResult> {
    const profileLabels: Record<string, string> = {
        'VERY_CONSERVATIVE': 'Muy Conservador',
        'CONSERVATIVE': 'Conservador',
        'MODERATE': 'Moderado',
        'AGGRESSIVE': 'Agresivo',
    };

    const profileLabel = profileLabels[profileType] || 'Moderado';

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: '🎉 ¡Felicitaciones! Tu perfil de inversor está listo',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #000000; padding: 32px; text-align: center;">
            <h1 style="color: #EAFF04; margin: 0; font-size: 28px; font-weight: bold;">Watt is Money</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 64px;">🎉</span>
            </div>
            
            <h2 style="color: #000000; margin: 0 0 16px 0; font-size: 28px; text-align: center;">
                ¡Felicitaciones, ${firstName}!
            </h2>
            
            <p style="color: #666666; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                Tu perfil de inversor está completo. Ya puedes comenzar a invertir en 
                proyectos de energía sostenible.
            </p>
            
            <!-- Profile Card -->
            <div style="background-color: #f9f9f9; border-radius: 16px; padding: 24px; margin: 24px 0; text-align: center;">
                <p style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
                    Tu perfil de riesgo
                </p>
                <p style="color: #000000; font-size: 24px; font-weight: bold; margin: 0;">
                    ${profileLabel}
                </p>
            </div>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Hemos personalizado tu experiencia para mostrarte las oportunidades de 
                inversión que mejor se adaptan a tu perfil.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="${BASE_URL}/dashboard" 
                   style="display: inline-block; background-color: #EAFF04; color: #000000; 
                          text-decoration: none; padding: 16px 40px; border-radius: 50px; 
                          font-weight: bold; font-size: 16px;">
                    Ir a mi Dashboard
                </a>
            </div>
            
            <div style="text-align: center; margin-top: 16px;">
                <a href="${BASE_URL}/mercado-primario" 
                   style="color: #000000; text-decoration: underline; font-size: 14px;">
                    Ver oportunidades de inversión →
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 24px 32px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
                © 2025 Wattismoney. Inversión responsable en energía sostenible.
            </p>
        </div>
    </div>
</body>
</html>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending profile complete email:', error);
        return { success: false, error: 'Error al enviar email de felicitaciones' };
    }
}
