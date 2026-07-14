'use client'

import { useEffect, useState } from 'react'

export function Preloader() {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Safety fallback to prevent the preloader from being stuck forever
    const safetyTimeout = setTimeout(() => {
      triggerFadeOut()
    }, 4500)

    const handleLoad = () => {
      // 400ms timeout to let the user see the transition animation
      setTimeout(() => {
        triggerFadeOut()
      }, 400)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    function triggerFadeOut() {
      setFadeOut(true)
      // Fully remove the preloader from DOM after transition completes (500ms)
      setTimeout(() => {
        setShow(false)
      }, 500)
      clearTimeout(safetyTimeout)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(safetyTimeout)
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-all duration-500 ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none invisible' : 'opacity-100'
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .book-container {
          perspective: 800px;
          width: 200px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .book {
          position: relative;
          width: 160px;
          height: 110px;
          transform-style: preserve-3d;
          transform: rotateX(25deg) rotateY(-20deg);
          animation: book-float 2.5s ease-in-out infinite;
        }

        @keyframes book-float {
          0%, 100% {
            transform: rotateX(25deg) rotateY(-20deg) translateY(0);
          }
          50% {
            transform: rotateX(25deg) rotateY(-20deg) translateY(-10px);
          }
        }

        .book-cover {
          position: absolute;
          top: 0;
          width: 80px;
          height: 110px;
          background: #2563eb; /* Hamro Learning primary blue */
          border-radius: 4px;
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.15);
        }

        .book-cover.left-cover {
          left: 0;
          transform-origin: right center;
          transform: rotateY(-180deg);
          border-radius: 6px 0 0 6px;
          border-right: 3px solid #1d4ed8;
          box-shadow: -4px 8px 16px rgba(0, 0, 0, 0.1);
        }

        .book-cover.right-cover {
          left: 80px;
          transform-origin: left center;
          transform: rotateY(0deg);
          border-radius: 0 6px 6px 0;
          border-left: 3px solid #1d4ed8;
          box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.1);
        }

        .book-page {
          position: absolute;
          top: 4px;
          left: 80px;
          width: 76px;
          height: 102px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: none;
          border-radius: 0 4px 4px 0;
          transform-origin: left center;
          transform-style: preserve-3d;
          box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.04);
          animation: page-turn 2.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }

        .dark .book-page {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
        }

        .book-page::before {
          content: '';
          position: absolute;
          top: 12px;
          left: 10px;
          right: 10px;
          bottom: 12px;
          background: linear-gradient(
            to bottom,
            #cbd5e1 1px, transparent 1px,
            transparent 8px
          );
          background-size: 100% 8px;
        }

        .dark .book-page::before {
          background: linear-gradient(
            to bottom,
            #475569 1px, transparent 1px,
            transparent 8px
          );
          background-size: 100% 8px;
        }

        @keyframes page-turn {
          0% {
            transform: rotateY(0deg);
            z-index: 10;
          }
          20% {
            background: #f1f5f9;
          }
          .dark 20% {
            background: #1e293b;
          }
          60%, 100% {
            transform: rotateY(-180deg);
            z-index: 1;
          }
        }

        /* Staggered Page Flipping */
        .book-page.page-1 {
          animation-delay: 0.2s;
        }
        .book-page.page-2 {
          animation-delay: 0.6s;
        }
        .book-page.page-3 {
          animation-delay: 1.0s;
        }
        .book-page.page-4 {
          animation-delay: 1.4s;
        }

        .pulse-text {
          animation: pulse 1.8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}} />

      <div className="flex flex-col items-center gap-6">
        {/* 3D Book Container */}
        <div className="book-container">
          <div className="book">
            {/* Left Cover */}
            <div className="book-cover left-cover"></div>

            {/* Inner Pages */}
            <div className="book-page page-1"></div>
            <div className="book-page page-2"></div>
            <div className="book-page page-3"></div>
            <div className="book-page page-4"></div>

            {/* Right Cover */}
            <div className="book-cover right-cover"></div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="pulse-text text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 select-none">
          Loading Hamro Learning...
        </p>
      </div>
    </div>
  )
}
