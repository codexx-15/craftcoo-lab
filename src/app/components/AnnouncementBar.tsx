import { Link } from 'react-router';

export function AnnouncementBar() {
    const AnnouncementContent = () => (
      <div className="flex items-center flex-shrink-0 gap-12 px-6 py-3">
        <Link to="/store?minPrice=999" className="text-white hover:underline whitespace-nowrap text-sm font-medium transition-all relative z-50">
          Free Shipping Above ₹999
        </Link>
        <span className="opacity-30">|</span>
        <Link to="/store?isLimitedEdition=true" className="text-white hover:underline whitespace-nowrap text-sm font-medium transition-all relative z-50">
          Limited Edition Art Drops
        </Link>
        <span className="opacity-30">|</span>
        <Link to="/custom-paintings" className="text-white hover:underline whitespace-nowrap text-sm font-medium transition-all relative z-50">
          Custom Paintings Available
        </Link>
        <span className="opacity-30">|</span>
      </div>
    );

    return (
      <div className="bg-[#D85C63] overflow-hidden relative group h-11 flex items-center">
        <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
          <AnnouncementContent />
          <AnnouncementContent />
          <AnnouncementContent />
          <AnnouncementContent />
          <AnnouncementContent />
          <AnnouncementContent />
        </div>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
               display: flex;
               width: max-content;
               animation: marquee 60s linear infinite;
             }
          `
        }} />
      </div>
    );
}