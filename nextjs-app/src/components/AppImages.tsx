import React from 'react';

// NOTA: Para evitar errores de construcción si los archivos locales faltan,
// usamos URLs externas directas. Si deseas usar locales, asegúrate de que
// el archivo exista y la configuración del bundler soporte importación de imágenes.

interface ImageProps {
  className?: string;
  style?: React.CSSProperties;
}

export const HeroSolarParkImage: React.FC<ImageProps> = ({ className }) => {
  // Imagen de alta calidad de parque solar (Unsplash)
  const imageUrl = "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1200&auto=format&fit=crop";
  
  return (
    <img 
      src={imageUrl} 
      alt="Parque Solar con Planta Industrial de fondo"
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none'; // Ocultar si falla
      }}
    />
  );
};

export const ImpactoHeroImage: React.FC<ImageProps> = ({ className, style }) => {
  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBuQEFp-nmbpVpbyBbXybwfwq8WfqoG5mUzkTzF-yT5t8hODItDH_0ELlfsH5PTvv7BB7SUx5C0UQLFDJl51Ep9Cf3jr2-UHAh6Enhyh8Ds2tG71iuZIFQc-oZCnMPlSdHhRoIxoY0o3Puc4AtVDtj93EKEzqO2ciFbNOCioV_1bXWqGYM2Z9Y-N9Y0mzE7r0JV9Rgkey5xst-JQ7VOj6eJjH_t3ltNc8XkreBFiFnzfTBN4qw7Gn3UyfC_D4gwUpksuzveU7WJOH0";
  
  return (
    <div 
        className={className} 
        data-alt="Wind turbines and solar panels in a green field"
        style={{
            backgroundImage: `url("${imageUrl}")`,
            ...style
        }}
    >
    </div>
  );
};

export const ContratosHeroImage: React.FC<ImageProps> = ({ className, style }) => {
  // USANDO LA MISMA IMAGEN DEL LANDING (Parque Solar) para asegurar visibilidad
  const imageUrl = "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1200&auto=format&fit=crop";

  return (
    <img 
        src={imageUrl}
        alt="Ejecutivo sosteniendo contrato de energía"
        className={className}
        style={{...style, backgroundColor: '#e5e7eb'}} // Fondo gris pálido mientras carga
        loading="eager"
        onError={(e) => {
             // Fallback de extrema seguridad a una imagen de Google si Unsplash falla
             e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBuQEFp-nmbpVpbyBbXybwfwq8WfqoG5mUzkTzF-yT5t8hODItDH_0ELlfsH5PTvv7BB7SUx5C0UQLFDJl51Ep9Cf3jr2-UHAh6Enhyh8Ds2tG71iuZIFQc-oZCnMPlSdHhRoIxoY0o3Puc4AtVDtj93EKEzqO2ciFbNOCioV_1bXWqGYM2Z9Y-N9Y0mzE7r0JV9Rgkey5xst-JQ7VOj6eJjH_t3ltNc8XkreBFiFnzfTBN4qw7Gn3UyfC_D4gwUpksuzveU7WJOH0";
        }}
    />
  );
};

/* --- Imágenes para página Registro (Signup) --- */
export const SignupBgLayer1: React.FC<ImageProps> = ({ style }) => (
    <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60 mix-blend-overlay" 
        style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6iYjZQgRlhn4VfODe9yCJhNalL82A3URlmXk2xNgugd7FbXD2ECULa6B67vBuCH7bNTYVw1WJO8xdeNz8TGKgODXLwoeq7WGoNNQkkIDl6-BW4n_Vu1wjI2yOszkDHleanH8eJLn3wcSlmBXxZcXzGKkkjeDP5ilH9QIsPxQkBGvJ7RgM7Z2MVCcgVc_wufGJno98c6ZEZqR_hV2DVvlVWZtpj7GPQwjXWN5LcHMGiozuGEoNwQpzc-yy3uWm5Sg6iDfpeH6WTQ4")',
            ...style
        }}
    ></div>
);

export const SignupBgLayer2: React.FC<ImageProps> = ({ style }) => (
    <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40" 
        style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxo5H-HP3JgB03RCHIaefK4eCS2QLeT22qMzfUHwEwu-s3hC3JhNKqaeebSgSSq9kc1-h5du0NIfT2XCg60dJvDtm6CSsX5J4zDhxQpjksBk_TH9HY-bCj6Gpi6tqJLDTc3a8JOzzNhWcH9FMu5lwfnANGHyjFoVmlGU8OZA5cLFUmN7r5nHkIinwjW1l8BhinLw2IyIH09FmXPYYmA0OFarPov732jIcn3HGz62LGHVYVhQH6uHT1qk4blvth13f1Z_54g1gSRqc")',
            ...style
        }}
    ></div>
);


/* --- Imágenes para página Cómo Funciona --- */

export const ComoFuncionaImg1: React.FC<ImageProps> = ({ className }) => (
  <img 
    alt="Conexión de energía eléctrica" 
    className={className} 
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcJKVB55nzvUtj87I4ehkPnXwwFpmn1vFSTSI9YQwkT9Lwnj7Zw6WIGEn43-5RUgXvbiNqE96-TADjNR9SLEJKF6OLik7adTHb3vQsDal5PlikJf_lPgdDyT1mhCpRrfLA4Q7VSl2d60uvuJ6TfniInog8rOa2Ryk3kwTA95J77ABXlM0OQcoko0fZGN058vKwwdSOipupwqjAdayJycdOZ8orT-1NSabqf9et0qrBYFsT9tOy8aHJpyHgVTQSDd6eYCY80ev0xjA"
  />
);

export const ComoFuncionaImg2: React.FC<ImageProps> = ({ className }) => (
  <img 
    alt="Finanzas y energía limpia" 
    className={className} 
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyGW_b_ZEvd_4NoAksBgBwRbwWXQvKWjd-OsKtkN7_mw7M0tK0i0s6MpNx2qPZxkOHvcXAakBlATtmS4ucEvjzn9xagrV3monhUcQdkUP-gCSKltKeBX6rb7GA785yNoWN3G3Mh6tzz6DCGou9rRtHtpj35H9CRmg31WdxBVOoLUziudBmOCVXsDC59aUbyxbTE_ZRnuBUbYyDEFJmzkIrSuXYJJWofcQLbQurLXusYi20Dq4I5MCzeiOqhsK22bx_jrLGZ68SogE"
  />
);

export const ComoFuncionaImg3: React.FC<ImageProps> = ({ className }) => (
  <img 
    alt="Interacción en plataforma digital" 
    className={className} 
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCUUV1k398ySa5mVwsSs_qZnjVaZprwOF-nZNy6KsYcN-y5yz3m7Tw4KSm7e_Yqv575EZt6tYrlP3WfnyqbAunK95AJJxWypBkLPC5Orsjk42PlNoLaV968A4XSicnFy6fE4TvEyOSD4vQYy8A2hWGWnHh3Q8bdDnmD6lNIOs-r0z8qMVyc8PSl6yWtBuA6t5d6aQMic0M2BGESNmrOsqa6OhwF6v1YSjlTjBxbdtARg2-Ns-BP2rQUrFykKJh7HbZsa_HlWnTcHg"
  />
);

/* --- Imágenes para página Hoja de Ruta --- */

export const RoadmapSolarIcon: React.FC<ImageProps> = ({ className }) => (
  <img 
    alt="Solar Icon" 
    className={className} 
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA13VGBy5ICvuF6oW3QGHUXYh703Ib6TJmkCFowoqETjfB_TZ2OB8sGenuZs0OPtq1l8wY6Werv5n2iLGGg15MIz3hMTVtEfO1ygZWWgua8K4Bg37vzlz1p_2fJO2kh2wV5t3izDX7_Guf9WCjQZs0O4xkLCSdTUmzAwwERWmQo0uZalS-nLwqxdpEITZnaTMw0KjkrtJycMp0nOKkQkQMEsFgSklpCfoDo0sWQIEVOvxqR-ur94FGEGr2lxs_QCdBgc8hKOpO7hGo"
  />
);

export const RoadmapWindIcon: React.FC<ImageProps> = ({ className }) => (
  <img 
    alt="Wind Icon" 
    className={className} 
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq4136H6Yv-yvJ0PM4Cp7j31VyYiQCYkr3haHgbn1eGBv6Rx8rmzfVk6UEd8WJ_dzLieBSmADVarYAZkbhnkukkYDYiDNyQf096i0b8WBuwCT8r7Ejlvd7pU2gd5z3nyF2X0v6l-r64SZOQaXwoE13_cRVhjCsym-GzanAC1dj18uf1zA3u0Rdx3uiXTxqXxkvQh1tLEeUl_vo1tv3yFudUoDzqRSSJN0906op3EwGuejOrGe0omtDkhnITzpk7R2c6IJAA0KL8ck"
  />
);

export const RoadmapChargeIcon: React.FC<ImageProps> = ({ className }) => (
  <img 
    alt="Charge Icon" 
    className={className} 
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj6cjyYg3Mj1JeUE7_WS0HN3DCdCDIZuplAP69fHtD5wydWEr-iNOacTa4f_zQlbt8b1oQIxKvInzP8fZxmg6EHrA94oU-3NoA9zRixsgYTGaA6i--JMmGCNZt43Y-kzBznUp372nJKe9Xr_L-EdpxtGPcTlqu5C_3GX8obKCNppVquubC9hINfpQsSxXG5PyXRU8x17US1iiCa1UD7C3XBoXJ_GKqN2YgwWIHEJXPcqysWYxMxddlwYAaBUgcduoLaEmI9qsgWZU"
  />
);

export const RoadmapNetworkIcon: React.FC<ImageProps> = ({ className }) => (
  <img 
    alt="Network Icon" 
    className={className} 
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4HvNRCPQQnGw8bxbMrXaeHMOMUiBCOzOrg5Mnz5t5B3o6QPyF7CCIMCXeBuWx0jhrpdzvszRQwJ3LAooizTMcEp_I52evGnIJlXF5f68AoGWeCvEjoWxjJXKBebw2kjmYAPSEByUjEkZhjAz761Wm5g1kdxOANlfs7jbMSPOZirULxaQ7ID-2lluxQmIIhkFLajxnq6eAz95rkwnERloBgH7tImfuNjUdQFKy8jOq1KSbP-9ob8Nte1RWZCdfDmw4v-oGn54xVtw"
  />
);