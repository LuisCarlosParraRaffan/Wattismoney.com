/**
 * Interruptores de funcionalidad de la plataforma.
 *
 * Un riel de pago solo se enciende cuando existe una integración real y verificable
 * (cobro confirmado por un tercero: banco, pasarela o blockchain). Son constantes en
 * código —no variables de entorno— para que activarlos exija una revisión de código.
 */
export const PLATFORM_CURRENCY = 'COP' as const;

export const FEATURES: Record<
    | 'bankTransfer'
    | 'onlineGateway'
    | 'cryptoRail'
    | 'internalWallet'
    | 'walletDeposits'
    | 'withdrawals'
    | 'secondaryMarket'
    | 'yieldDistribution',
    boolean
> = {
    /** Transferencia bancaria en COP con validación manual de Tesorería. */
    bankTransfer: true,
    /** Stripe / Wompi: requiere SDK + webhook firmado. Aún no integrado. */
    onlineGateway: false,
    /** USDC on-chain: requiere verificación estricta de destinatario/monto y multisig. */
    cryptoRail: false,
    /** Invertir con saldo interno: no hay forma legítima de fondear el saldo todavía. */
    internalWallet: false,
    walletDeposits: false,
    withdrawals: false,
    secondaryMarket: false,
    /** Dispersión de rendimientos: requiere idempotencia y respaldo de fondos. */
    yieldDistribution: false,
};
