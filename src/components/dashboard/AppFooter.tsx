export const AppFooter = () => {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-center md:text-left">
            <span className="font-medium text-foreground">Novacred Insurance Broking Private Limited (NIBPL)</span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span>TommyandFurry Insurance — a Brand of NIBPL</span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span>NIBPL IRDAI License No: 1135 (Direct-Broker Life and General)</span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span>CIN – U66290PN2025PTC241215</span>
          </div>
          <p className="whitespace-nowrap text-gray-400">
            © 2026 Novacred Insurance Broking Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
