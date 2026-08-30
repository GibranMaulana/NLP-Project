"use client";

import Script from "next/script";

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
            layout?: unknown;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslate() {
  return (
    <>
      {/* Hidden Mount Point */}
      <div
        id="google_translate_element"
        className="hidden"
        aria-hidden="true"
      />

      {/* Global CSS to completely hide Google Translate UI */}
      <style jsx global>{`
        /* Hide top banner and prevent body shift */
        .goog-te-banner-frame,
        .goog-te-banner-frame.skiptranslate,
        iframe.goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
        }

        body {
          top: 0px !important;
          position: static !important;
        }

        /* Hide gadget dropdown */
        .goog-te-gadget,
        .goog-te-gadget-simple,
        .goog-te-combo,
        .skiptranslate {
          display: none !important;
        }

        /* Hide tooltips and translation highlight overlays */
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover {
          display: none !important;
        }

        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* Initialize callback and set Dutch as default language */}
      <Script
        id="google-translate-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              /* 
               * MONKEY PATCH FIX FOR REACT + GOOGLE TRANSLATE
               * Prevents "Node.removeChild: The node to be removed is not a child of this node" crashes
               * by catching when React tries to remove or insert a node that Google Translate has altered.
               */
              if (typeof Node === 'function' && Node.prototype) {
                var originalRemoveChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function(child) {
                  if (child.parentNode !== this) {
                    if (console) console.warn('Cannot remove a child from a different parent', child, this);
                    return child;
                  }
                  return originalRemoveChild.apply(this, arguments);
                };

                var originalInsertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function(newNode, referenceNode) {
                  if (referenceNode && referenceNode.parentNode !== this) {
                    if (console) console.warn('Cannot insert before a reference node from a different parent', referenceNode, this);
                    return newNode;
                  }
                  return originalInsertBefore.apply(this, arguments);
                };
              }

              if (!document.cookie.includes('googtrans=')) {
                var hostname = window.location.hostname;
                document.cookie = 'googtrans=/auto/nl; path=/;';
                if (hostname && hostname !== 'localhost') {
                  document.cookie = 'googtrans=/auto/nl; path=/; domain=.' + hostname + ';';
                }
              }
            })();
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'auto',
                includedLanguages: 'nl,en',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `,
        }}
      />

      {/* Google Translate Script */}
      <Script
        id="google-translate-script"
        strategy="afterInteractive"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
    </>
  );
}
