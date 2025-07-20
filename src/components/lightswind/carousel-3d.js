"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../lib/utils";
import { ChevronLeft, ChevronRight, Palette, Github, ExternalLink } from "lucide-react";
const Carousel3D = ({ cards = [],
  radius = 400,
  autoRotate = false,
  autoRotateInterval = 3000,
  pauseOnHover = true,
  enableGlitchEffect = true,
  enableGlowEffect = true,
  showControls = true,
  showThemeToggle = false,
  dragSensitivity = 0.2,
  transitionDuration = 0.5,
  className,
  cardClassName = "w-[275px] h-[400px] md:w-[400px] md:h-[400px]", // Valor por defecto
  onCardClick,
  onCardFlip,
  onRotate,
}) => {
    const carouselRef = useRef(null);
    const containerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [theta, setTheta] = useState(0);
    const [flippedCards, setFlippedCards] = useState(new Set());
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [initialTheta, setInitialTheta] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const didDragRef = useRef(false);
    const autoRotateRef = useRef();
    const totalCards = cards.length;
    const anglePerCard = totalCards > 0 ? 360 / totalCards : 0;
    const responsiveRadius = typeof window !== "undefined" && window.innerWidth <= 768
        ? Math.min(radius * 0.7, 250)
        : radius;
    // Arrange cards in 3D circle
    const arrangeCards = useCallback(() => {
        if (!carouselRef.current)
            return;
        const cardElements = carouselRef.current.querySelectorAll(".carousel-card");
        cardElements.forEach((card, index) => {
            const cardAngle = anglePerCard * index;
            const element = card;
            element.style.transform = `rotateY(${cardAngle}deg) translateZ(${responsiveRadius}px)`;
            element.dataset.index = index.toString();
        });
    }, [anglePerCard, responsiveRadius]);
    // Rotate carousel
    const rotateCarousel = useCallback((instant = false) => {
        if (!carouselRef.current)
            return;
        if (instant) {
            carouselRef.current.style.transition = "none";
        }
        else {
            carouselRef.current.style.transition = `transform ${transitionDuration}s ease`;
        }
        carouselRef.current.style.transform = `rotateY(${theta}deg)`;
        // Calculate current index based on rotation
        let normalizedTheta = ((theta % 360) + 360) % 360;
        let closestAngleDiff = Infinity;
        let newCurrentIndex = 0;
        for (let index = 0; index < totalCards; index++) {
            const cardInitialAngle = anglePerCard * index;
            let effectiveCardAngle = (cardInitialAngle - normalizedTheta + 360) % 360;
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
    }, [
        theta,
        anglePerCard,
        totalCards,
        currentIndex,
        transitionDuration,
        onRotate,
    ]);
    // Navigation
    const navigateCarousel = useCallback((direction) => {
        setTheta((prevTheta) => prevTheta + direction * anglePerCard);
    }, [anglePerCard]);
    // --- FLIP FIX: add pendingFlipIndex state ---
    const [pendingFlipIndex, setPendingFlipIndex] = useState(null);

    // Card flip handler
    const handleCardClick = useCallback((index) => {
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

        // If the clicked card is not in the center, rotate to it
        if (index !== currentIndex) {
            setPendingFlipIndex(index);
            setTheta(-index * anglePerCard);
        }
    }, [cards, currentIndex, anglePerCard, onCardClick, onCardFlip]);

    // --- FLIP FIX: helper to get index from theta ---
    function getIndexFromTheta(theta, totalCards) {
        const anglePerCard = totalCards > 0 ? 360 / totalCards : 0;
        let normalizedTheta = ((theta % 360) + 360) % 360;
        let closestAngleDiff = Infinity;
        let newCurrentIndex = 0;
        for (let index = 0; index < totalCards; index++) {
            const cardInitialAngle = anglePerCard * index;
            let effectiveCardAngle = (cardInitialAngle - normalizedTheta + 360) % 360;
            let diff = Math.abs(effectiveCardAngle - 0);
            if (diff > 180) diff = 360 - diff;
            if (diff < closestAngleDiff) {
                closestAngleDiff = diff;
                newCurrentIndex = index;
            }
        }
        return newCurrentIndex;
    }

    // Efecto para manejar el índice actual y desvoltear cartas cuando dejan de estar en el centro
    useEffect(() => {
        // Cuando el índice actual cambia, desvoltear todas las cartas excepto la nueva carta central
        if (currentIndex !== null && currentIndex !== undefined) {
            setFlippedCards(prev => {
                // Mantener solo la carta actual en el estado de volteo
                const newFlippedCards = new Set();
                if (prev.has(currentIndex)) {
                    newFlippedCards.add(currentIndex);
                }
                return newFlippedCards;
            });
        }
    }, [currentIndex]);

    // --- FLIP FIX: flip after rotation ends ---
    useEffect(() => {
        if (pendingFlipIndex === null) return;
        const carouselElement = carouselRef.current;
        if (!carouselElement) return;

        const onTransitionEnd = (event) => {
            if (event.propertyName !== "transform") return;
            
            // Calculate the new current index after rotation
            const newCurrentIndex = getIndexFromTheta(theta, cards.length);
            setCurrentIndex(newCurrentIndex);
            
            setPendingFlipIndex(null);
            carouselElement.removeEventListener("transitionend", onTransitionEnd);
        };

        carouselElement.addEventListener("transitionend", onTransitionEnd);
        return () => {
            carouselElement.removeEventListener("transitionend", onTransitionEnd);
        };
    }, [pendingFlipIndex, cards, theta]);
    // Drag handlers
    const handleDragStart = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
        didDragRef.current = false;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        setStartX(clientX);
        setInitialTheta(theta);
        if (carouselRef.current) {
            carouselRef.current.style.transition = "none";
        }
    }, [theta]);
    const handleDrag = useCallback((e) => {
        if (!isDragging)
            return;
        e.preventDefault();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const diffX = clientX - startX;
        if (Math.abs(diffX) > 20) {
            didDragRef.current = true;
        }
        const newTheta = initialTheta + diffX * dragSensitivity;
        setTheta(newTheta);
        if (carouselRef.current) {
            carouselRef.current.style.transform = `rotateY(${newTheta}deg)`;
        }
    }, [isDragging, startX, initialTheta, dragSensitivity]);
    const handleDragEnd = useCallback(() => {
        if (!isDragging)
            return;
        setIsDragging(false);
        if (carouselRef.current) {
            carouselRef.current.style.transition = `transform ${transitionDuration}s ease`;
        }
        const closestMultiple = Math.round(theta / anglePerCard);
        const snappedTheta = closestMultiple * anglePerCard;
        setTheta(snappedTheta);
    }, [isDragging, theta, anglePerCard, transitionDuration]);
    // Keyboard navigation
    const handleKeyDown = useCallback((e) => {
        if (e.key === "ArrowLeft") {
            navigateCarousel(-1);
        }
        else if (e.key === "ArrowRight") {
            navigateCarousel(1);
        }
        else if (e.key === "Enter" || e.key === " ") {
            handleCardClick(currentIndex);
        }
    }, [navigateCarousel, handleCardClick, currentIndex]);
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
        document.addEventListener("mousemove", handleDrag, { passive: true });
        document.addEventListener("touchmove", handleDrag, { passive: true });
        document.addEventListener("mouseup", handleDragEnd, { passive: true });
        document.addEventListener("touchend", handleDragEnd, { passive: true });
        document.addEventListener("keydown", handleKeyDown, { passive: true });
        return () => {
            document.removeEventListener("mousemove", handleDrag, { passive: true });
            document.removeEventListener("touchmove", handleDrag, { passive: true });
            document.removeEventListener("mouseup", handleDragEnd, { passive: true });
            document.removeEventListener("touchend", handleDragEnd, { passive: true });
            document.removeEventListener("keydown", handleKeyDown, { passive: true });
        };
    }, [handleDrag, handleDragEnd, handleKeyDown]);
    // Resize handler to re-arrange cards and adjust rotation
    useEffect(() => {
        const handleResize = () => {
            arrangeCards();
            const targetTheta = -currentIndex * anglePerCard;
            setTheta(targetTheta);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [arrangeCards, currentIndex, anglePerCard]);
    if (cards.length === 0) {
        return (_jsx("div", { className: "flex items-center justify-center h-96 text-muted-foreground", children: "No cards provided for the carousel" }));
    }
    return (_jsxs("div", { 
      className: cn("relative w-full", className), 
      style: {
        height: `${Math.max(500)}px`,
        touchAction: "none",
      }, 
      onMouseEnter: () => pauseOnHover && setIsHovered(true), 
      onMouseLeave: () => pauseOnHover && setIsHovered(false), 
      children: [
        _jsx("div", { 
          ref: containerRef, 
          className: "relative w-full h-full flex justify-center items-center", 
          style: {
            perspective: "1000px",
            transformStyle: "preserve-3d",
            touchAction: "none", // Aseguramos que no haya scroll en el contenedor
          }, 
          children: _jsx("div", { 
            ref: carouselRef, 
            className: "relative", 
            style: {
              width: `${responsiveRadius * 2}px`,
              height: `${responsiveRadius * 2}px`,
              transformStyle: "preserve-3d",
              transition: `transform ${transitionDuration}s ease`,
              cursor: isDragging ? "grabbing" : "grab",
              touchAction: "none", // Deshabilitamos gestos táctiles en el carrusel
            }, 
            onMouseDown: handleDragStart, 
            onTouchStart: handleDragStart,
            children: cards.map((card, index) => {
              const cardKey = card.id ?? index;
              return (
                <div 
                  key={cardKey}
                  className={cn("carousel-card absolute cursor-pointer", cardClassName)}
                  style={{
                    left: "50%",
                    top: "50%",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transform: `translate(-50%, -50%)`,
                    // Las dimensiones ahora vienen de cardClassName
                  }}
                  ref={(el) => {
                    if (el) {
                      // Centrar basado en el tamaño real del elemento
                      el.style.marginLeft = `-${el.offsetWidth / 2}px`;
                      el.style.marginTop = `-${el.offsetHeight / 2}px`;
                    }
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  <div 
                    className="relative w-full h-full" 
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      transform: flippedCards.has(index) ? "rotateY(180deg)" : "rotateY(0deg)",
                      width: "100%",
                      height: "100%"
                    }}
                  >
                    {/* Front Side */}
                    <div 
                      className="absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-500/30"
                      style={{
                        backfaceVisibility: "hidden",
                        background: "var(--card)",
                        border: "1px solid var(--border)"
                      }}
                    >
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
                            marginBottom: "5rem"
                          }}
                        >
                          {card.imageUrl ? (
                            <img 
                              src={card.imageUrl} 
                              alt={card.title} 
                              className="absolute inset-0 w-[calc(100%)] h-[calc(100%)] object-cover"
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
                                background: "linear-gradient(45deg, transparent 65%, hsl(var(--primary) / 0.1) 70%, transparent 75%)",
                                backgroundSize: "200% 200%",
                                animation: "glitch 3s linear infinite"
                              }} 
                            />
                          )}
                          {enableGlowEffect && (
                            <div 
                              className="absolute inset-0 rounded-lg pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 70%)"
                              }} 
                            />
                          )}
                        </div>
                        <p className="text-xs w-[calc(100%-2rem)] text-muted-foreground overflow-hidden text-ellipsis mt-2 absolute md:top-[17rem] top-[17rem]">
                          {card.preview}
                        </p>
                      </div>
                    </div>

                    {/* Back Side */}
                    <div 
                      className="absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "var(--card)",
                        border: "1px solid var(--border)"
                      }}
                    >
                      <div 
                        className="p-5 h-full flex flex-col bg-card text-card-foreground" 
                        style={{
                          background: "var(--card)",
                          height: "100%",
                          borderRadius: "inherit"
                        }}
                      >
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
                          <p className=" text-xs text-muted-foreground leading-relaxed mb-4 ">
                            {card.content}
                          </p>
                          
                          <div className="flex gap-3 pt-3 mt-auto border-t border-border">
                            {card.githubUrl && card.githubUrl !== "#" && (
                              <a 
                                key={`github-${card.id}`}
                                href={card.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                  <Github className="h-5 w-5"/>
                                </span>
                                Repo
                              </a>
                            )}
                            
                            {card.liveUrl && card.liveUrl !== "#" && (
                              <a 
                                key={`live-${card.id}`}
                                href={card.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
              );
            }) }) }), showControls && (_jsxs("div", { className: "absolute bottom-6 left-1/2 transform \r\n        -translate-x-1/2  flex items-center gap-4 z-10 top-[33rem]", children: [_jsx("button", { onClick: () => navigateCarousel(-1), className: "w-10 h-10 rounded-full bg-background/80 border border-border text-foreground hover:bg-background/90 hover:scale-110 transition-all duration-200 flex items-center justify-center \r\n            shadow-lg backdrop-blur-sm", "aria-label": "Previous card", children: _jsx(ChevronLeft, { className: "w-5 h-5" }) }), _jsx("button", { onClick: () => navigateCarousel(1), className: "w-10 h-10 rounded-full bg-background/80 border border-border text-foreground hover:bg-background/90 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg backdrop-blur-sm", "aria-label": "Next card", children: _jsx(ChevronRight, { className: "w-5 h-5" }) }), showThemeToggle && (_jsx("button", { onClick: () => {
                            const isDark = document.documentElement.classList.contains("dark");
                            document.documentElement.classList.toggle("dark", !isDark);
                        }, className: "w-10 h-10 rounded-full bg-background/80 border border-border text-foreground hover:bg-background/90 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg backdrop-blur-sm", "aria-label": "Toggle theme", children: _jsx(Palette, { className: "w-5 h-5" }) }))] })), _jsx("style", { children: `
        @keyframes glitch {
          0% {
            background-position: 0 0;
          }
          25% {
            background-position: 100% 0;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0 100%;
          }
          100% {
            background-position: 0 0;
          }
        }
      ` })] }));
};
export default Carousel3D;  