'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Types
interface CustomerPhoto {
  id: string;
  image_url: string;
  bairro: string;
  cidade: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

interface VizinhosAprovramProps {
  productId?: string;
  productName?: string;
}

// Ícone de localização
const MapPinIcon = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="flex-shrink-0"
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

// Ícone Instagram
const InstagramIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

// Card individual de foto
const PhotoCard = ({ photo }: { photo: CustomerPhoto }) => {
  return (
    <div className="vizinhos__card">
      <div className="vizinhos__image-wrapper">
        <Image
          src={photo.image_url}
          alt={`${photo.product.name} na casa de cliente em ${photo.bairro}, ${photo.cidade}`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="vizinhos__image"
          loading="lazy"
        />
      </div>
      
      {/* Badge de localização */}
      <div className="vizinhos__badge">
        <MapPinIcon />
        <span className="vizinhos__badge-text">
          {photo.bairro}, {photo.cidade}
        </span>
      </div>
    </div>
  );
};

// Componente principal
export default function VizinhosAprovaram({ 
  productId, 
  productName 
}: VizinhosAprovramProps) {
  const [photos, setPhotos] = useState<CustomerPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const params = new URLSearchParams();
        if (productId) params.set('productId', productId);
        params.set('limit', '4');
        
        const res = await fetch(`/api/customer-photos?${params}`);
        const data = await res.json();
        setPhotos(data.photos || []);
      } catch (error) {
        console.error('Erro ao carregar fotos de clientes:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPhotos();
  }, [productId]);

  // Não renderiza se menos de 3 fotos
  if (!loading && photos.length < 3) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <section className="vizinhos" aria-busy="true">
        <div className="vizinhos__container">
          <div className="vizinhos__grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="vizinhos__skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Verifica se tem foto do produto atual
  const hasOwnPhoto = photos.some(p => p.product.id === productId);
  
  // Título dinâmico
  const titulo = hasOwnPhoto && productName
    ? `Veja como o ${productName} ficou na casa de quem já comprou`
    : 'Veja como ficou na casa de quem já comprou';

  return (
    <section 
      className="vizinhos"
      aria-labelledby="vizinhos-titulo"
    >
      <div className="vizinhos__container">
        {/* Header */}
        <div className="vizinhos__header">
          <h2 id="vizinhos-titulo" className="vizinhos__titulo">
            {titulo}
          </h2>
          <p className="vizinhos__subtitulo">
            Fotos reais de clientes em Curitiba e região
          </p>
        </div>
        
        {/* Grid de fotos */}
        <div className="vizinhos__grid">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
        
        {/* CTA de engajamento */}
        <div className="vizinhos__cta">
          <p className="vizinhos__cta-text">
            <span className="vizinhos__cta-bold">Comprou e quer aparecer aqui?</span>
          </p>
          <p className="vizinhos__cta-hashtag">
            Posta com <span className="vizinhos__hashtag">#MinhaCasaMoveirama</span>
          </p>
        </div>
        
        {/* Link discreto para Instagram */}
        <div className="vizinhos__social">
          <a 
            href="https://instagram.com/moveirama"
            target="_blank"
            rel="noopener noreferrer"
            className="vizinhos__social-link"
            aria-label="Instagram da Moveirama (abre em nova aba)"
          >
            <InstagramIcon />
            <span>@moveirama</span>
          </a>
        </div>
      </div>
    </section>
  );
}
