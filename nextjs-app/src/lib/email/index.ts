import { Resend } from 'resend';

// Lazy initialization to prevent crash if API key is missing
let resend: Resend | null = null;

function getResendClient(): Resend | null {
    const hasApiKey = !!process.env.RESEND_API_KEY;
    console.log('[Email Service] getResendClient called:', {
        hasApiKey,
        apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
        apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 6) || 'none'
    });

    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
        console.log('[Email Service] Resend client initialized');
    }
    return resend;
}

const FROM_EMAIL = 'Wattismoney <noreply@wattismoney.com>';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.wattismoney.com';

export interface EmailResult {
    success: boolean;
    error?: string;
}

// Helper function to generate the email header with real logo
function getEmailHeader(): string {
    const LOGO_URL = `${BASE_URL}/Wattismoney_Logo.svg`;
    return `
    <tr>
        <td style="background-color: #ffffff; border-bottom: 1px solid #f0f0f0; padding: 24px 32px; text-align: center;">
            <a href="${BASE_URL}" style="text-decoration: none;">
                <img src="${LOGO_URL}" alt="Wattismoney" width="180" height="36" style="display: block; margin: 0 auto; max-width: 180px; height: auto;" />
            </a>
        </td>
    </tr>`;
}

// Helper function to generate the email footer
function getEmailFooter(): string {
    const LOGO_URL = `${BASE_URL}/Wattismoney_Logo.svg`;
    return `
    <tr>
        <td style="background-color: #f9f9f9; border-top: 1px solid #eeeeee; padding: 32px; text-align: center;">
            <!-- Logo en footer -->
            <a href="${BASE_URL}" style="text-decoration: none; display: inline-block; margin-bottom: 16px;">
                <img src="${LOGO_URL}" alt="Wattismoney" width="120" height="24" style="display: block; margin: 0 auto; max-width: 120px; height: auto; opacity: 0.6;" />
            </a>
            
            <!-- Links -->
            <table align="center" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                    <td style="padding: 0 12px;">
                        <a href="${BASE_URL}/privacy" style="color: #888888; font-size: 12px; text-decoration: none;">Política de Privacidad</a>
                    </td>
                    <td style="padding: 0 12px;">
                        <a href="${BASE_URL}/terms" style="color: #888888; font-size: 12px; text-decoration: none;">Términos y Condiciones</a>
                    </td>
                    <td style="padding: 0 12px;">
                        <a href="${BASE_URL}/support" style="color: #888888; font-size: 12px; text-decoration: none;">Soporte</a>
                    </td>
                </tr>
            </table>
            
            <!-- Copyright -->
            <p style="color: #999999; font-size: 11px; margin: 0; font-family: 'Inter', Arial, sans-serif;">
                © ${new Date().getFullYear()} Wattismoney. Todos los derechos reservados.
            </p>
        </td>
    </tr>`;
}

// Helper function to generate primary CTA button
function getPrimaryButton(text: string, href: string): string {
    return `
    <table align="center" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
        <tr>
            <td style="background-color: #eeff00; border-radius: 8px; padding: 14px 32px;">
                <a href="${href}" style="color: #000000; font-family: 'Inter', Arial, sans-serif; font-size: 15px; font-weight: 700; text-decoration: none; display: inline-block;">
                    ${text}
                </a>
            </td>
        </tr>
    </table>`;
}

// Helper function to wrap email content
function wrapEmailContent(content: string): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Inter', 'Segoe UI', Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    ${content}
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// ============================================================================
// 1. CORREO DE BIENVENIDA (Mail_Welcome.html)
// ============================================================================
export async function sendWelcomeEmail(
    to: string,
    firstName: string
): Promise<EmailResult> {
    const content = `
        ${getEmailHeader()}
        <tr>
            <td style="padding: 48px 40px; text-align: center;">
                <!-- Success Icon -->
                <div style="width: 80px; height: 80px; background-color: rgba(238, 255, 0, 0.2); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                    <table align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width: 80px; height: 80px; background-color: rgba(238, 255, 0, 0.2); border-radius: 40px; text-align: center; vertical-align: middle;">
                                <span style="font-size: 40px;">✓</span>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <h1 style="color: #000000; font-family: 'Cairo', 'Inter', Arial, sans-serif; font-size: 32px; font-weight: 800; margin: 0 0 16px 0; line-height: 1.2;">
                    ¡Bienvenido a Wattismoney!
                </h1>
                
                <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 8px 0; max-width: 480px;">
                    Gracias por unirte a la revolución de la energía sostenible, <strong>${firstName}</strong>. Tu cuenta ha sido creada exitosamente.
                </p>
                
                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                    Para comenzar a invertir en proyectos renovables, necesitamos verificar tu identidad.
                </p>
                
                ${getPrimaryButton('Iniciar sesión', `${BASE_URL}/login`)}
                
                <a href="${BASE_URL}" style="color: #888888; font-size: 13px; text-decoration: underline;">
                    Ver más información
                </a>
            </td>
        </tr>
        
        <!-- Trust Indicators -->
        <tr>
            <td style="padding: 0 32px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="33%" style="padding: 16px 8px; text-align: center; vertical-align: top;">
                            <div style="background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 12px; padding: 20px 12px;">
                                <span style="font-size: 28px; display: block; margin-bottom: 8px;">🔒</span>
                                <h3 style="color: #000; font-size: 13px; font-weight: 700; margin: 0 0 4px 0;">100% Seguro</h3>
                                <p style="color: #888; font-size: 11px; margin: 0; line-height: 1.4;">Cifrado de grado bancario</p>
                            </div>
                        </td>
                        <td width="33%" style="padding: 16px 8px; text-align: center; vertical-align: top;">
                            <div style="background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 12px; padding: 20px 12px;">
                                <span style="font-size: 28px; display: block; margin-bottom: 8px;">⏱️</span>
                                <h3 style="color: #000; font-size: 13px; font-weight: 700; margin: 0 0 4px 0;">Solo 2 minutos</h3>
                                <p style="color: #888; font-size: 11px; margin: 0; line-height: 1.4;">Verificación automatizada</p>
                            </div>
                        </td>
                        <td width="33%" style="padding: 16px 8px; text-align: center; vertical-align: top;">
                            <div style="background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 12px; padding: 20px 12px;">
                                <span style="font-size: 28px; display: block; margin-bottom: 8px;">⚖️</span>
                                <h3 style="color: #000; font-size: 13px; font-weight: 700; margin: 0 0 4px 0;">Regulado</h3>
                                <p style="color: #888; font-size: 11px; margin: 0; line-height: 1.4;">Cumplimiento normativo</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        ${getEmailFooter()}
    `;

    try {
        const client = getResendClient();
        if (!client) {
            console.warn('Resend API key not configured, skipping email');
            return { success: false, error: 'Email service not configured' };
        }
        await client.emails.send({
            from: FROM_EMAIL,
            to,
            subject: '¡Bienvenido a Wattismoney! 🌱',
            html: wrapEmailContent(content),
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: 'Error al enviar email de bienvenida' };
    }
}

// ============================================================================
// 2. CORREO DE KYC EN VERIFICACIÓN (Mail_KYC_on_verification.html)
// ============================================================================
export async function sendKycSubmittedEmail(
    to: string,
    firstName: string
): Promise<EmailResult> {
    const content = `
        ${getEmailHeader()}
        <tr>
            <td style="padding: 48px 40px; text-align: center;">
                <!-- Status Icon with animation simulation -->
                <table align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="position: relative;">
                            <div style="width: 96px; height: 96px; background-color: rgba(238, 255, 0, 0.2); border-radius: 50%; margin: 0 auto;">
                                <table width="96" height="96" align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" valign="middle">
                                            <span style="font-size: 48px;">⏳</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </table>
                
                <h1 style="color: #000000; font-family: 'Inter', Arial, sans-serif; font-size: 28px; font-weight: 700; margin: 24px 0 16px 0;">
                    Verificación en curso
                </h1>
                
                <p style="color: #666666; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0; max-width: 480px;">
                    Hola <strong>${firstName}</strong>, hemos recibido tus documentos correctamente. Nuestro equipo está revisando tu información para garantizar la seguridad de tu inversión.
                </p>
                
                <!-- Info Box -->
                <div style="background-color: #f8f8f5; border-radius: 12px; padding: 24px; margin: 0 0 24px 0;">
                    <p style="color: #666; font-size: 13px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                        ⏱ Tiempo estimado de revisión
                    </p>
                    <p style="color: #000; font-size: 20px; font-weight: 700; margin: 0;">
                        24 a 48 horas hábiles
                    </p>
                </div>
                
                ${getPrimaryButton('Ir a Mi Perfil', `${BASE_URL}/dashboard`)}
                
                <p style="color: #999; font-size: 13px; margin: 16px 0 0 0;">
                    Gracias por tu paciencia y por confiar en Wattismoney.
                </p>
            </td>
        </tr>
        
        <!-- Support Panel -->
        <tr>
            <td style="padding: 0 32px 32px;">
                <div style="background-color: #ffffff; border: 1px solid #e6e7da; border-radius: 12px; padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding-right: 16px;">
                                <span style="font-size: 24px;">💬</span>
                            </td>
                            <td style="width: 100%;">
                                <p style="color: #000; font-size: 14px; font-weight: 700; margin: 0;">¿Necesitas ayuda?</p>
                                <p style="color: #888; font-size: 13px; margin: 4px 0 0 0;">Si ha pasado más tiempo del esperado, contáctanos.</p>
                            </td>
                            <td style="white-space: nowrap;">
                                <a href="${BASE_URL}/support" style="color: #000; font-size: 13px; font-weight: 600; text-decoration: none;">
                                    Contactar soporte →
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        
        ${getEmailFooter()}
    `;

    try {
        const client = getResendClient();
        if (!client) {
            console.warn('Resend API key not configured, skipping email');
            return { success: false, error: 'Email service not configured' };
        }
        await client.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Documentos recibidos - En revisión ⏳',
            html: wrapEmailContent(content),
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending KYC submitted email:', error);
        return { success: false, error: 'Error al enviar email de confirmación KYC' };
    }
}

// ============================================================================
// 3. CORREO DE KYC APROBADO (Mail_KYC_verification_success.html)
// ============================================================================
export async function sendKycApprovedEmail(
    to: string,
    firstName: string
): Promise<EmailResult> {
    const content = `
        ${getEmailHeader()}
        <tr>
            <td>
                <!-- Hero gradient area -->
                <div style="background: linear-gradient(135deg, rgba(238,255,0,0.15) 0%, transparent 100%); padding: 48px 40px; text-align: center;">
                    <!-- Success Icon -->
                    <div style="width: 96px; height: 96px; background-color: #ffffff; border-radius: 50%; margin: 0 auto; box-shadow: 0 4px 20px rgba(238,255,0,0.3);">
                        <table width="96" height="96" align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" valign="middle">
                                    <span style="font-size: 48px; color: #22c55e;">✓</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 32px 40px 48px; text-align: center;">
                <h1 style="color: #000000; font-family: 'Cairo', 'Inter', Arial, sans-serif; font-size: 30px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.2;">
                    ¡Identidad Verificada!
                </h1>
                
                <p style="color: #666666; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
                    Felicidades <strong>${firstName}</strong>, tu proceso de KYC ha sido exitoso. Ya eres parte de la comunidad <span style="color: #000; font-weight: 600;">Wattismoney</span>. Tienes acceso total para invertir en energía sostenible de forma segura.
                </p>
                
                ${getPrimaryButton('Completar Perfil de Inversor', `${BASE_URL}/investor-profile`)}
                
                <a href="${BASE_URL}/mercado-primario" style="color: #666; font-size: 14px; text-decoration: none;">
                    Explorar Oportunidades →
                </a>
                
                <!-- Security note -->
                <div style="background-color: #f9f9f9; border-radius: 8px; padding: 12px 20px; margin-top: 32px;">
                    <table cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding-right: 8px;">🔒</td>
                            <td style="color: #888; font-size: 13px;">Tu información está protegida y encriptada.</td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        
        ${getEmailFooter()}
    `;

    try {
        const client = getResendClient();
        if (!client) {
            console.warn('Resend API key not configured, skipping email');
            return { success: false, error: 'Email service not configured' };
        }
        await client.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Tu verificación ha sido completada - Wattismoney',
            html: wrapEmailContent(content),
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending KYC approved email:', error);
        return { success: false, error: 'Error al enviar email de aprobación KYC' };
    }
}

// ============================================================================
// 4. CORREO DE KYC RECHAZADO (Mail_KYC_verification_no_success.html)
// ============================================================================
export async function sendKycRejectedEmail(
    to: string,
    firstName: string,
    reason?: string
): Promise<EmailResult> {
    const content = `
        ${getEmailHeader()}
        <tr>
            <td style="padding: 48px 40px; text-align: center;">
                <!-- Error Icon -->
                <div style="width: 80px; height: 80px; background-color: #fef2f2; border-radius: 50%; margin: 0 auto 24px; position: relative;">
                    <table width="80" height="80" align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td align="center" valign="middle">
                                <span style="font-size: 40px;">❌</span>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <h1 style="color: #000000; font-family: 'Inter', Arial, sans-serif; font-size: 28px; font-weight: 700; margin: 0 0 16px 0;">
                    Verificación no exitosa
                </h1>
                
                <p style="color: #666666; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
                    Hola <strong>${firstName}</strong>, no pudimos validar tu identidad. Para cumplir con las regulaciones y mantener la plataforma segura, necesitamos que realices el proceso nuevamente.
                </p>
                
                ${reason ? `
                <div style="background-color: #fef2f2; border-radius: 8px; padding: 16px; margin: 0 0 24px 0;">
                    <p style="color: #991b1b; font-size: 14px; margin: 0;"><strong>Razón:</strong> ${reason}</p>
                </div>
                ` : ''}
            </td>
        </tr>
        
        <!-- Tips Section -->
        <tr>
            <td style="padding: 0 32px 24px;">
                <div style="background-color: #f8f8f5; border-radius: 12px; padding: 24px; border: 1px solid #e5e6db;">
                    <h3 style="color: #000; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 16px 0;">
                        Consejos para el éxito
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding: 8px 0;">
                                <table cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-right: 12px; vertical-align: top; color: #eeff00;">✓</td>
                                        <td style="color: #333; font-size: 14px;">Asegúrate de que la foto no esté borrosa</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;">
                                <table cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-right: 12px; vertical-align: top; color: #eeff00;">✓</td>
                                        <td style="color: #333; font-size: 14px;">Usa un documento de identidad vigente</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;">
                                <table cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-right: 12px; vertical-align: top; color: #eeff00;">✓</td>
                                        <td style="color: #333; font-size: 14px;">Evita reflejos de luz en el documento</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        
        <tr>
            <td style="padding: 0 32px 32px; text-align: center;">
                ${getPrimaryButton('🔄 Reintentar Verificación', `${BASE_URL}/kyc-upload`)}
                
                <a href="${BASE_URL}/support" style="color: #888; font-size: 13px; text-decoration: none;">
                    ¿Problemas persistentes? Contactar soporte →
                </a>
            </td>
        </tr>
        
        ${getEmailFooter()}
    `;

    try {
        const client = getResendClient();
        if (!client) {
            console.warn('Resend API key not configured, skipping email');
            return { success: false, error: 'Email service not configured' };
        }
        await client.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Verificación KYC no exitosa - Acción requerida',
            html: wrapEmailContent(content),
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending KYC rejected email:', error);
        return { success: false, error: 'Error al enviar email de rechazo KYC' };
    }
}

// ============================================================================
// 5. CORREO DE PERFIL DE RIESGO PENDIENTE (Mail_RISK_pending.html)
// Alias: sendProfileInvitationEmail
// ============================================================================
export async function sendProfileInvitationEmail(
    to: string,
    firstName: string
): Promise<EmailResult> {
    const content = `
        ${getEmailHeader()}
        <tr>
            <td style="padding: 48px 40px; text-align: center;">
                <!-- Icon with glow effect -->
                <div style="position: relative; margin-bottom: 24px;">
                    <div style="width: 96px; height: 96px; background-color: #f8f8f5; border: 2px solid rgba(238,255,0,0.3); border-radius: 50%; margin: 0 auto;">
                        <table width="96" height="96" align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" valign="middle">
                                    <span style="font-size: 48px;">📋</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <h1 style="color: #000000; font-family: 'Inter', Arial, sans-serif; font-size: 28px; font-weight: 800; margin: 0 0 16px 0; line-height: 1.2;">
                    Perfil de Inversionista Pendiente
                </h1>
                
                <p style="color: #666666; font-size: 16px; line-height: 1.7; margin: 0 0 16px 0;">
                    Hola <strong>${firstName}</strong>, tu KYC ha sido aprobado. Para asegurar el cumplimiento normativo y desbloquear todas las oportunidades de inversión en energía sostenible, necesitamos que completes tu análisis de perfil.
                </p>
                
                <p style="color: #888; font-size: 14px; margin: 0 0 24px 0;">
                    ⏱ Solo tomará unos <strong>3 minutos</strong> de tu tiempo.
                </p>
                
                ${getPrimaryButton('Completar Cuestionario →', `${BASE_URL}/investor-profile`)}
                
                <a href="${BASE_URL}/dashboard" style="color: #888; font-size: 13px; text-decoration: none;">
                    Volver al Inicio
                </a>
            </td>
        </tr>
        
        ${getEmailFooter()}
    `;

    try {
        const client = getResendClient();
        if (!client) {
            console.warn('Resend API key not configured, skipping email');
            return { success: false, error: 'Email service not configured' };
        }
        await client.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Tu verificación ha sido completada - Wattismoney',
            html: wrapEmailContent(content),
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending profile invitation email:', error);
        return { success: false, error: 'Error al enviar invitación de perfil' };
    }
}

// ============================================================================
// 6. CORREO DE PERFIL DE RIESGO EXITOSO (Mail_RICK_success.html)
// Alias: sendProfileCompleteEmail
// ============================================================================
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

    const content = `
        ${getEmailHeader()}
        <tr>
            <td style="padding: 48px 40px; text-align: center;">
                <!-- Success Icon with glow -->
                <div style="position: relative; margin-bottom: 24px;">
                    <div style="width: 96px; height: 96px; background-color: rgba(238,255,0,0.2); border-radius: 50%; margin: 0 auto;">
                        <table width="96" height="96" align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" valign="middle">
                                    <span style="font-size: 56px; color: #22c55e;">✓</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <h1 style="color: #000000; font-family: 'Cairo', 'Inter', Arial, sans-serif; font-size: 30px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.2;">
                    ¡Felicidades!
                </h1>
                <p style="color: #000; font-size: 22px; font-weight: 600; margin: 0 0 20px 0;">
                    Tu perfil de inversor está listo.
                </p>
                
                <p style="color: #666666; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
                    Hemos analizado exitosamente tu perfil de riesgo, <strong>${firstName}</strong>. Ya puedes acceder a proyectos de energía sostenible adaptados específicamente a tus objetivos financieros.
                </p>
                
                <!-- Profile Type Card -->
                <div style="background-color: #f8f8f5; border-radius: 16px; padding: 24px 32px; margin: 0 0 32px 0; border: 1px solid rgba(238,255,0,0.3);">
                    <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
                        Tu perfil de riesgo
                    </p>
                    <p style="color: #000; font-size: 24px; font-weight: 700; margin: 0;">
                        ${profileLabel}
                    </p>
                </div>
                
                ${getPrimaryButton('🚀 Ver Oportunidades Personalizadas', `${BASE_URL}/mercado-primario`)}
                
                <a href="${BASE_URL}/dashboard" style="color: #888; font-size: 13px; text-decoration: none;">
                    Volver al inicio
                </a>
            </td>
        </tr>
        
        ${getEmailFooter()}
    `;

    try {
        const client = getResendClient();
        if (!client) {
            console.warn('Resend API key not configured, skipping email');
            return { success: false, error: 'Email service not configured' };
        }
        await client.emails.send({
            from: FROM_EMAIL,
            to,
            subject: '🎉 ¡Felicidades! Tu perfil de inversor está listo',
            html: wrapEmailContent(content),
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending profile complete email:', error);
        return { success: false, error: 'Error al enviar email de felicitaciones' };
    }
}
