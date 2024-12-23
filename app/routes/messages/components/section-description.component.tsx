export const SectionDescription = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-5">
      <div className="w-6 bg-ocean h-1 mb-4" />
      <h2 className="text-lg font-extrabold text-ocean mb-4">{title}</h2>
    </div>
  );
};
