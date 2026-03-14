export function AnnouncementBar() {
    return (
      <div className="bg-[#D85C63] text-white py-3 px-6 overflow-hidden">
        <div className="relative flex">
          {/* Scrolling content - duplicated for seamless loop */}
          <div 
            className="flex whitespace-nowrap animate-scroll"
            style={{
              animation: 'scroll 30s linear infinite'
            }}
          >
            <span className="inline-flex items-center text-sm">
              Free Shipping Above ₹999
              <span className="mx-8">|</span>
              Limited Edition Art Drops
              <span className="mx-8">|</span>
              Custom Paintings Available
              <span className="mx-8">|</span>
            </span>
            <span className="inline-flex items-center text-sm">
              Free Shipping Above ₹999
              <span className="mx-8">|</span>
              Limited Edition Art Drops
              <span className="mx-8">|</span>
              Custom Paintings Available
              <span className="mx-8">|</span>
            </span>
            <span className="inline-flex items-center text-sm">
              Free Shipping Above ₹999
              <span className="mx-8">|</span>
              Limited Edition Art Drops
              <span className="mx-8">|</span>
              Custom Paintings Available
              <span className="mx-8">|</span>
            </span>
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }
          `
        }} />
      </div>
    );
  }