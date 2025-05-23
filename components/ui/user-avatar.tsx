import Image from "next/image";

type UserAvatarProps = {
  src: string | null;
  fullName: string | null;
  size?: number;
  className?: string;
};

export default function UserAvatar({
  src,
  fullName,
  size = 48,
  className,
}: UserAvatarProps) {
  const initial = fullName?.charAt(0).toUpperCase() || "?";
  const colors = [
    "bg-violet-500", // Violet
    "bg-emerald-500", // Émeraude
    "bg-blue-500", // Bleu
    "bg-amber-500", // Ambre
    "bg-rose-500", // Rose
    "bg-teal-500", // Bleu-vert
    "bg-indigo-500", // Indigo
    "bg-orange-500", // Orange
  ];
  const colorIndex = initial.charCodeAt(0) % colors.length;
  const colorClass = colors[colorIndex];

  if (src) {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src={src}
          alt={fullName || "Profile"}
          className={`rounded-full object-cover ${className}`}
          fill
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-semibold ${colorClass} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        userSelect: "none",
      }}
    >
      {initial}
    </div>
  );
}
