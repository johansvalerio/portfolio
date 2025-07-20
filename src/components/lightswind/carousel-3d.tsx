"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../lib/utils";
import { ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";
import type { Carousel3DProps } from "@/components/lightswind/carousel-3d.d";

const Carousel3D: React.FC<Carousel3DProps> = ({
  cards = [],
  radius = 400,
  autoRotate = false,
  autoRotateInterval = 3000,
  pauseOnHover = true,
  enableGlitchEffect = true,
  enableGlowEffect = true,
  showControls = true,
  dragSensitivity = 0.2,
  transitionDuration = 0.5,
  className,
  cardClassName = "w-[275px] h-[400px] md:w-[400px] md:h-[400px]",
  onCardClick,
  onCardFlip,
  onRotate,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [theta, setTheta] = useState<number>(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [initialTheta, setInitialTheta] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [pendingFlipIndex, setPendingFlipIndex] = useState<number | null>(null);

  const didDragRef = useRef<boolean>(false);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  const totalCards = cards.length;
  const anglePerCard = totalCards > 0 ? 360 / totalCards : 0;
  const responsiveRadius =
    typeof window !== "undefined" && window.innerWidth <= 768
      ? Math.min(radius * 0.7, 250)
      : radius;

  // Arrange cards in 3D circle
  const arrangeCards = useCallback((): void => {
    if (!carouselRef.current) return;
    const cardElements =
      carouselRef.current.querySelectorAll<HTMLElement>(".carousel-card");
    cardElements.forEach((card, index) => {
      const cardAngle = anglePerCard * index;
      const element = card;
      element.style.transform = `rotateY(${cardAngle}deg) translateZ(${responsiveRadius}px)`;
      element.dataset.index = index.toString();
    });
  }, [anglePerCard, responsiveRadius]);

  // Rotate carousel
  const rotateCarousel = useCallback(
    (instant: boolean = false): void => {
      if (!carouselRef.current) return;

      if (instant) {
        carouselRef.current.style.transition = "none";
      } else {
        carouselRef.current.style.transition = `transform ${transitionDuration}s ease`;
      }

      carouselRef.current.style.transform = `rotateY(${theta}deg)`;

      // Calculate current index based on rotation
      const normalizedTheta = ((theta % 360) + 360) % 360;
      let closestAngleDiff = Infinity;
      let newCurrentIndex = 0;

      for (let index = 0; index < totalCards; index++) {
        const cardInitialAngle = anglePerCard * index;
        const effectiveCardAngle =
          (cardInitialAngle - normalizedTheta + 360) % 360;
        let diff = Math.abs(effectiveCardAngle - 0);
        if (diff > 180) {
          diff = 360 - diff;
        }
        if (diff < closestAngleDiff) {
          closestAngleDiff = diff;
          newCurrentIndex = index;
        }
      }

      if (newCurrentIndex !== currentIndex) {
        setCurrentIndex(newCurrentIndex);
        onRotate?.(newCurrentIndex);
      }

      if (instant) {
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = `transform ${transitionDuration}s ease`;
          }
        }, 10);
      }
    },
    [
      theta,
      anglePerCard,
      totalCards,
      currentIndex,
      transitionDuration,
      onRotate,
    ]
  );

  // Navigation
  const navigateCarousel = useCallback(
    (direction: number): void => {
      setTheta((prevTheta) => prevTheta + direction * anglePerCard);
    },
    [anglePerCard]
  );

  // Card flip handler
  const handleCardClick = useCallback(
    (index: number): void => {
      if (didDragRef.current) {
        didDragRef.current = false;
        return;
      }

      const card = cards[index];
      if (!card) return;

      onCardClick?.(card, index);

      // Toggle flip for the clicked card
      setFlippedCards((prev) => {
        const newSet = new Set(prev);
        const isFlipped = !prev.has(index);

        if (isFlipped) {
          newSet.add(index);
        } else {
          newSet.delete(index);
        }

        onCardFlip?.(card, index, isFlipped);
        return newSet;
      });

      // Rotate to card if not already in front
      const currentTheta = -index * anglePerCard;
      const currentNormalized = ((currentTheta % 360) + 360) % 360;
      const targetNormalized = ((theta % 360) + 360) % 360;

      if (Math.abs(currentNormalized - targetNormalized) > 5) {
        setTheta(currentTheta);
      }
    },
    [cards, theta, anglePerCard, onCardClick, onCardFlip]
  );

  // Helper to get index from theta
  const getIndexFromTheta = (theta: number, totalCards: number): number => {
    const anglePerCard = totalCards > 0 ? 360 / totalCards : 0;
    const normalizedTheta = ((theta % 360) + 360) % 360;
    let closestAngleDiff = Infinity;
    let newCurrentIndex = 0;

    for (let index = 0; index < totalCards; index++) {
      const cardInitialAngle = anglePerCard * index;
      const effectiveCardAngle =
        (cardInitialAngle - normalizedTheta + 360) % 360;
      let diff = Math.abs(effectiveCardAngle - 0);
      if (diff > 180) diff = 360 - diff;
      if (diff < closestAngleDiff) {
        closestAngleDiff = diff;
        newCurrentIndex = index;
      }
    }
    return newCurrentIndex;
  };

  // Effect to handle current index and unflip cards when they leave center
  useEffect(() => {
    if (currentIndex !== null && currentIndex !== undefined) {
      setFlippedCards((prev) => {
        const newFlippedCards = new Set<number>();
        if (prev.has(currentIndex)) {
          newFlippedCards.add(currentIndex);
        }
        return newFlippedCards;
      });
    }
  }, [currentIndex]);

  // Handle flip after rotation ends
  useEffect(() => {
    if (pendingFlipIndex === null) return;
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;

    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.propertyName !== "transform") return;

      const newCurrentIndex = getIndexFromTheta(theta, cards.length);
      setCurrentIndex(newCurrentIndex);
      setPendingFlipIndex(null);
      carouselElement.removeEventListener(
        "transitionend",
        onTransitionEnd as EventListener
      );
    };

    carouselElement.addEventListener(
      "transitionend",
      onTransitionEnd as EventListener
    );
    return () => {
      carouselElement.removeEventListener(
        "transitionend",
        onTransitionEnd as EventListener
      );
    };
  }, [pendingFlipIndex, cards.length, theta]);

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent): void => {
      e.preventDefault();
      setIsDragging(true);
      didDragRef.current = false;
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      setStartX(clientX);
      setInitialTheta(theta);
      if (carouselRef.current) {
        carouselRef.current.style.transition = "none";
      }
    },
    [theta]
  );

  const handleDrag = useCallback(
    (e: MouseEvent | TouchEvent): void => {
      if (!isDragging) return;
      e.preventDefault();

      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const diffX = clientX - startX;

      if (Math.abs(diffX) > 20) {
        didDragRef.current = true;
      }

      const newTheta = initialTheta + diffX * dragSensitivity;
      setTheta(newTheta);

      if (carouselRef.current) {
        carouselRef.current.style.transform = `rotateY(${newTheta}deg)`;
      }
    },
    [isDragging, startX, initialTheta, dragSensitivity]
  );

  const handleDragEnd = useCallback((): void => {
    if (!isDragging) return;
    setIsDragging(false);

    if (carouselRef.current) {
      carouselRef.current.style.transition = `transform ${transitionDuration}s ease`;
    }

    const closestMultiple = Math.round(theta / anglePerCard);
    const snappedTheta = closestMultiple * anglePerCard;
    setTheta(snappedTheta);
  }, [isDragging, theta, anglePerCard, transitionDuration]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === "ArrowLeft") {
        navigateCarousel(-1);
      } else if (e.key === "ArrowRight") {
        navigateCarousel(1);
      } else if (e.key === "Enter" || e.key === " ") {
        handleCardClick(currentIndex);
      }
    },
    [navigateCarousel, handleCardClick, currentIndex]
  );

  // Auto-rotation
  useEffect(() => {
    if (autoRotate && !isDragging && !isHovered) {
      autoRotateRef.current = setInterval(() => {
        navigateCarousel(1);
      }, autoRotateInterval);
      return () => {
        if (autoRotateRef.current) {
          clearInterval(autoRotateRef.current);
        }
      };
    }
  }, [autoRotate, isDragging, isHovered, autoRotateInterval, navigateCarousel]);

  // Setup effects for initial arrangement and rotation
  useEffect(() => {
    arrangeCards();
    rotateCarousel(true);
  }, [arrangeCards, rotateCarousel]);

  // Effect to apply rotation whenever 'theta' changes
  useEffect(() => {
    rotateCarousel();
  }, [theta, rotateCarousel]);

  // Global event listeners for drag and keyboard interactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleDrag(e);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleDrag(e);
      }
    };

    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();
    const handleKeyDownEvent = (e: KeyboardEvent) => handleKeyDown(e);

    // Agregar event listeners
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("keydown", handleKeyDownEvent);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [handleDrag, handleDragEnd, handleKeyDown, isDragging]);

  // Resize handler to re-arrange cards and adjust rotation
  useEffect(() => {
    const handleResize = (): void => {
      arrangeCards();
      const targetTheta = -currentIndex * anglePerCard;
      setTheta(targetTheta);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [arrangeCards, currentIndex, anglePerCard]);

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        No hay tarjetas disponibles para el carrusel
      </div>
    );
  }

  //desde aqui
  return (
    <div
      className={cn("relative w-full h-full mx-auto", className)}
      style={{
        height: `${Math.max(500)}px`,
        touchAction: "pan-y",
      }}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      {/* Contenedor principal del carrusel */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex justify-center items-center"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          touchAction: "pan-y", // Permitir scroll vertical
        }}
      >
        {/* Carrusel 3D */}
        <div
          ref={carouselRef}
          className="relative w-full h-full mx-auto"
          style={{
            width: `${responsiveRadius * 2}px`,
            height: `${responsiveRadius * 2}px`,
            transformStyle: "preserve-3d",
            transition: isDragging
              ? "none"
              : `transform ${transitionDuration}s ease`,
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "pan-y",
            userSelect: "none",
          }}
          onTouchStart={handleDragStart}
          onMouseDown={handleDragStart}
        >
          {cards.map((card, index) => (
            <div
              key={card.id ?? index}
              className={cn(
                "carousel-card absolute cursor-pointer",
                cardClassName
              )}
              style={{
                left: "50%",
                top: "50%",
                transformStyle: "preserve-3d",
                transition:
                  "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                transform: `translate(-50%, -50%)`,
              }}
              ref={(el) => {
                if (el) {
                  el.style.marginLeft = `-${el.offsetWidth / 2}px`;
                  el.style.marginTop = `-${el.offsetHeight / 2}px`;
                }
              }}
              onClick={() => handleCardClick(index)}
            >
              {/* Contenido de la tarjeta */}
              <div
                className="relative w-full h-full"
                style={{
                  transformStyle: "preserve-3d",
                  transition:
                    "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform: flippedCards.has(index)
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Frente de la tarjeta */}
                <div
                  className="absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-500/30"
                  style={{
                    backfaceVisibility: "hidden",
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {/* Contenido frontal de la tarjeta */}
                  <div className="p-5 h-full flex flex-col relative text-card-foreground">
                    <div className="text-xs uppercase flex items-center gap-2 tracking-wider mb-1 text-muted-foreground font-medium">
                      {card.category}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {card.title}
                    </h3>
                    <div
                      className="w-full relative rounded-lg overflow-hidden"
                      style={{
                        background: "var(--muted)",
                        paddingTop: "75%",
                        position: "relative",
                        marginBottom: "5rem",
                      }}
                    >
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center text-muted-foreground z-10 relative"
                          style={{ fontSize: "3rem" }}
                        >
                          {card.icon}
                        </div>
                      )}
                      {enableGlitchEffect && (
                        <div
                          className="absolute inset-0 opacity-70 animate-pulse"
                          style={{
                            background:
                              "linear-gradient(45deg, transparent 65%, hsl(var(--primary) / 0.1) 70%, transparent 75%)",
                            backgroundSize: "200% 200%",
                            animation: "glitch 3s linear infinite",
                          }}
                        />
                      )}
                      {enableGlowEffect && (
                        <div
                          className="absolute inset-0 rounded-lg pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 70%)",
                          }}
                        />
                      )}
                    </div>
                    <p className="text-xs w-[calc(100%-2rem)] text-muted-foreground overflow-hidden text-ellipsis mt-2 absolute md:top-[17rem] top-[16rem]">
                      {card.preview}
                    </p>
                  </div>
                </div>

                {/* Reverso de la tarjeta */}
                <div
                  className="absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="p-5 h-full flex flex-col bg-card text-card-foreground">
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      {card.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {card.technologies?.map((tech, i) => (
                        <span
                          key={`${card.id}-${tech}-${i}`}
                          className="text-xs px-1 py-0.5 bg-muted rounded-full text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex-grow overflow-auto">
                      <p className="text-xs m text-muted-foreground leading-relaxed mb-4">
                        {card.content}
                      </p>
                      <div className="flex gap-3 pt-3 mt-auto border-t border-border">
                        {card.githubUrl && card.githubUrl !== "#" && (
                          <a
                            href={card.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Github className="h-5 w-5" />
                            </span>
                            Repo
                          </a>
                        )}
                        {card.liveUrl && card.liveUrl !== "#" && (
                          <a
                            href={card.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <ExternalLink className="h-5 w-5" />
                            </span>
                            Ir al proyecto
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showControls && (
        <div className="relative flex justify-center w-full md:top-[-260px]">
          {/* Controles de navegación - Fuera del contenedor 3D pero dentro del contenedor principal */}

          <button
            onClick={() => navigateCarousel(-1)}
            className="absolute right-1/2 md:right-[95%] cursor-pointer w-10 h-10 rounded-full bg-background/80 border border-border text-foreground hover:bg-background/90 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg backdrop-blur-sm"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigateCarousel(1)}
            className="absolute left-1/2 md:left-[95%] cursor-pointer w-10 h-10 rounded-full bg-background/80 border border-border text-foreground hover:bg-background/90 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg backdrop-blur-sm"
            aria-label="Next card"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
      <style>{`
          @keyframes glitch {
            0% { background-position: 0 0; }
            25% { background-position: 100% 0; }
            50% { background-position: 100% 100%; }
            75% { background-position: 0 100%; }
            100% { background-position: 0 0; }
          }
        `}</style>
    </div>
  );
};

export default Carousel3D;
