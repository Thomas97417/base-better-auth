import { useState } from "react";

interface UseImageUploadProps {
  initialPreview?: string | null;
}

interface UseImageUploadReturn {
  image: File | null;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetImage: () => void;
  setCustomPreview: (preview: string | null) => void;
}

export function useImageUpload({
  initialPreview = null,
}: UseImageUploadProps = {}): UseImageUploadReturn {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialPreview
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImage(null);
    setImagePreview(initialPreview);
  };

  const setCustomPreview = (preview: string | null) => {
    setImagePreview(preview);
  };

  return {
    image,
    imagePreview,
    handleImageChange,
    resetImage,
    setCustomPreview,
  };
}
