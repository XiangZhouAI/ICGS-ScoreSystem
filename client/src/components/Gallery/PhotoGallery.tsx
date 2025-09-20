import React, { useState, useEffect } from 'react';
import { theme } from '../../theme';

interface Photo {
  id: string;
  src: string;
  alt: string;
  event?: string;
  description?: string;
}

interface PhotoGalleryProps {
  photos?: Photo[];
  autoPlay?: boolean;
  interval?: number;
}

// Auto-detect photos from the assets/photos folder
// This will automatically include any JPG or PNG files you add to /client/public/assets/photos/
const generatePhotoList = (): Photo[] => {
  // Your actual photo filenames (JPG only - HEIC files need to be converted)
  const photoFilenames = [
    'IMG_6963.JPG',
    'IMG_6964.JPG', 
    'IMG_6965.jpg',
    'IMG_6966.JPG',
    // Add more JPG files as you convert them
    // Note: HEIC files won't display in web browsers and need to be converted to JPG
  ];

  const photos: Photo[] = [];
  
  photoFilenames.forEach((filename, index) => {
    // Simple event naming for IMG files
    let event = 'ICGS Tournament';
    let description = 'Memories from ICGS golf tournament at Luttrellstown Castle Golf Club';
    
    photos.push({
      id: `photo-${index + 1}`,
      src: `/assets/photos/${filename}`,
      alt: `ICGS Tournament Photo ${index + 1}`,
      event,
      description,
    });
  });

  return photos;
};

const DEFAULT_PHOTOS = generatePhotoList();

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos = DEFAULT_PHOTOS,
  autoPlay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [availablePhotos, setAvailablePhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Check which photos actually exist
  useEffect(() => {
    const checkPhotos = async () => {
      const existingPhotos: Photo[] = [];
      
      for (const photo of photos) {
        try {
          const response = await fetch(photo.src, { method: 'HEAD' });
          if (response.ok) {
            existingPhotos.push(photo);
          }
        } catch (error) {
          // Photo doesn't exist, skip it
          console.log(`Photo not found: ${photo.src}`);
        }
      }
      
      setAvailablePhotos(existingPhotos);
      setLoading(false);
    };

    checkPhotos();
  }, [photos]);

  useEffect(() => {
    if (!isPlaying || availablePhotos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % availablePhotos.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, availablePhotos.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + availablePhotos.length) % availablePhotos.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % availablePhotos.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.colors.white,
        textAlign: 'center',
        padding: theme.spacing.xl,
      }}>
        <h1 style={{ fontSize: theme.typography.display4K.hero, marginBottom: theme.spacing.xl }}>
          ICGS Photo Gallery
        </h1>
        <p style={{ fontSize: theme.typography.display4K.medium }}>
          Loading photos...
        </p>
      </div>
    );
  }

  if (availablePhotos.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.colors.white,
        textAlign: 'center',
        padding: theme.spacing.xl,
      }}>
        <h1 style={{ fontSize: theme.typography.display4K.hero, marginBottom: theme.spacing.xl }}>
          ICGS Photo Gallery
        </h1>
        <p style={{ fontSize: theme.typography.display4K.medium, marginBottom: theme.spacing.lg }}>
          No photos found in the gallery.
        </p>
        <p style={{ fontSize: theme.typography.display4K.small }}>
          Add JPG or PNG files to /client/public/assets/photos/ to display them here.
        </p>
      </div>
    );
  }

  const currentPhoto = availablePhotos[currentIndex];

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
      color: theme.colors.white,
      padding: theme.spacing.xl,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
      }}>
        <h1 style={{ 
          fontSize: theme.typography.display4K.hero, 
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}>
          ICGS Photo Gallery
        </h1>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.lg,
        }}>
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            style={{
              backgroundColor: theme.colors.success,
              color: theme.colors.white,
              border: 'none',
              borderRadius: theme.components.button.borderRadius,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              fontSize: theme.typography.display4K.small,
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
            }}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>
      </div>

      {/* Main Slideshow */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: theme.spacing.xl,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        position: 'relative',
      }}>
        {/* Photo Display */}
        <div style={{
          position: 'relative',
          backgroundColor: theme.colors.darkGray,
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: theme.spacing.xl,
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Photo display */}
          <img 
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: theme.colors.darkGray,
            }}
            onError={(e) => {
              // If image fails to load, show a clean placeholder
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement!;
              parent.innerHTML = `
                <div style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: ${theme.colors.darkGray};
                  color: ${theme.colors.white};
                  font-size: ${theme.typography.display4K.medium};
                ">
                  📷
                </div>
              `;
            }}
          />

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            style={{
              position: 'absolute',
              left: theme.spacing.lg,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: theme.colors.white,
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ←
          </button>
          
          <button
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: theme.spacing.lg,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: theme.colors.white,
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            →
          </button>
        </div>

        {/* Photo Information */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: theme.spacing.xl,
          marginBottom: theme.spacing.xl,
        }}>
          <div>
            <h3 style={{
              color: theme.colors.primary,
              fontSize: theme.typography.display4K.large,
              fontWeight: 'bold',
              margin: `0 0 ${theme.spacing.sm} 0`,
            }}>
              {currentPhoto.event || 'ICGS Event'}
            </h3>
            <p style={{
              color: theme.colors.darkGray,
              fontSize: theme.typography.display4K.medium,
              margin: 0,
            }}>
              {currentPhoto.description}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              color: theme.colors.darkGray,
              fontSize: theme.typography.display4K.small,
            }}>
              {currentIndex + 1} of {availablePhotos.length}
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div style={{
          display: 'flex',
          gap: theme.spacing.sm,
          overflowX: 'auto',
          padding: theme.spacing.sm,
          borderRadius: '8px',
          backgroundColor: theme.colors.lightGray,
        }}>
          {availablePhotos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => goToSlide(index)}
              style={{
                minWidth: '80px',
                height: '60px',
                backgroundColor: index === currentIndex ? theme.colors.primary : theme.colors.white,
                border: `2px solid ${index === currentIndex ? theme.colors.primaryDark : theme.colors.lightGray}`,
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: index === currentIndex ? theme.colors.white : theme.colors.darkGray,
                textAlign: 'center',
                padding: theme.spacing.xs,
                overflow: 'hidden',
                fontWeight: '600',
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {isPlaying && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}>
          <div style={{
            height: '100%',
            backgroundColor: theme.colors.success,
            width: `${((currentIndex + 1) / availablePhotos.length) * 100}%`,
            transition: 'width 0.3s ease',
          }} />
        </div>
      )}
    </div>
  );
};