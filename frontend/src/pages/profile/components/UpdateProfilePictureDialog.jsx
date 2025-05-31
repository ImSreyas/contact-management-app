import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImagePlus, Pen } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { apiRoutes } from "@/api/apiRoutes";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import myToast from "@/lib/custom/toast";

export function UpdateProfilePictureDialog({ onAction = null }) {
  const [open, onOpenChange] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { request, loading } = useApi();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);
    const response = await request({
      method: "put",
      url: apiRoutes.user.profile.profilePicture.update,
      data: formData,
    });
    if (response.success) {
      myToast("success", "Profile Picture updated successfully");
      onOpenChange(false);
      onAction?.();
    } else {
      myToast("warning", "Something went wrong please try again!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="absolute bottom-4 right-2 p-1.5 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
          <Pen size={12} className="text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="p-12 bg-card min-w-xl max-w-[90vw] max-h-[85vh] overflow-scroll gap-0">
        <DialogTitle className={undefined} />
        <DialogDescription className={undefined} />
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleUpload}
        >
          {previewUrl && (
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center border border-gray-300">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={cn(
              "w-full flex flex-col gap-1.5 justify-center items-center px-4 py-2 bg-background border-2 border-dashed border-gray-300 text-primary rounded-lg",
              previewUrl ? "h-fit" : "h-50",
            )}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {!previewUrl && (
              <div>
                <ImagePlus size={26} />
              </div>
            )}
            <div className="text-sm">
              {previewUrl
                ? "Choose another image"
                : "Click to browse or drag and drop image"}
            </div>
          </button>
          {selectedFile && (
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              variant={undefined}
              size={undefined}
            >
              {loading ? (
                <Spinner
                  size="xxs"
                  show={undefined}
                  children={undefined}
                  className="text-background"
                />
              ) : (
                <span>Upload</span>
              )}
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
