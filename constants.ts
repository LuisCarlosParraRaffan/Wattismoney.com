// Configuración global
export const USE_LOCAL_IMAGES = true;

// Helper para imágenes (lo mantenemos porque es útil)
export const getImagePath = (imageName: string): string => {
  return `./images/${imageName}`;
};
