import QrisDonationPopup from '@/components/QrisDonationPopup';
import { AdSlot } from '@/components/AdSlot';

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container mx-auto px-4 pt-20">
        <AdSlot placement="detail_top" />
      </div>
      {children}
      <QrisDonationPopup />
    </>
  );
}
