import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Fav, PhoneBox } from "./ContactsGrid";
import {
  BookUser,
  Building,
  MapPin,
  Trash2,
  UserRoundPen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { apiRoutes } from "@/api/apiRoutes";
import myToast from "@/lib/custom/toast";
import { Spinner } from "@/components/ui/spinner";
import { useMemo } from "react";
import { useEffect } from "react";
import UpdateContact from "./UpdateContact";

export default function ContactDetails({ id, open, onOpenChange, onAction }) {
  const [contact, setContact] = useState(null);
  const { request, loading } = useApi();

  const getContact = async () => {
    if (!id) return;
    const response = await request({ url: apiRoutes.user.contacts.getOne(id) });
    if (response.success) {
      setContact(response?.data?.contact);
    } else {
      myToast("warning", "Failed to get details");
    }
  };

  useEffect(() => {
    getContact();
  }, [id]);

  const isDetAvailable = useMemo(() => {
    return contact?.company || contact?.location || contact?.address
      ? true
      : false;
  }, [contact]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="md:min-w-4xl min-w-[90vw] max-h-[85vh] overflow-y-auto gap-2 pb-8 pt-6 px-10"
        noCloseButton={!loading}
      >
        {loading ? (
          <div>
            <DialogTitle className={undefined}></DialogTitle>
            <DialogDescription className="" />
            <div className="h-40 flex items-center justify-center">
              <Spinner
                size="medium"
                show={undefined}
                children={undefined}
                className={undefined}
              />
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="gap-0">
              <DialogTitle className="text-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    {contact?.firstName} {contact?.lastName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Fav
                      id={contact?._id}
                      value={contact?.isFavorite}
                      onAction={onAction}
                    />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <UpdateContact
                          contactId={id}
                          onContactUpdated={onAction}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="">
                        <p>Edit Contact</p>
                      </TooltipContent>
                    </Tooltip>

                    <DeleteBtn
                      id={contact?._id}
                      mainDialogState={onOpenChange}
                      onAction={onAction}
                    />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-6 h-6 p-4"
                          onClick={() => onOpenChange(false)}
                        >
                          <X />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="">
                        <p>Close</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>{" "}
                </div>
              </DialogTitle>
              <DialogDescription className="" />
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <div
                  className={cn(
                    "grid grid-cols-3 gap-3",
                    isDetAvailable ? "py-4" : "py-1.5",
                  )}
                >
                  {contact?.company && (
                    <div className="text-xs flex flex-col border rounded-lg px-3 py-1">
                      <div className="flex gap-2 items-center border-b py-2">
                        <Building size={16} />
                        <div className="font-semibold text-sm translate-y-[2px]">
                          Company
                        </div>
                      </div>
                      <p className="text-sm py-2">{contact?.company}</p>
                    </div>
                  )}
                  {contact?.location && (
                    <div className="text-xs flex flex-col border rounded-lg px-3 py-1">
                      <div className="flex gap-2 items-center border-b py-2">
                        <MapPin size={16} />
                        <div className="font-semibold text-sm translate-y-[2px]">
                          Location
                        </div>
                      </div>
                      <p className="text-sm py-2">{contact?.location}</p>
                    </div>
                  )}
                  {contact?.address && (
                    <div className="text-xs flex flex-col border rounded-lg px-3 py-1">
                      <div className="flex gap-2 items-center border-b py-2">
                        <BookUser size={16} />
                        <div className="font-semibold text-sm translate-y-[2px]">
                          Address
                        </div>
                      </div>
                      <p className="text-sm py-2">{contact?.address}</p>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-2 flex items-center gap-3">
                  <div>Contacts</div>
                  <div className="text-xs border px-2 py-1 rounded-sm font-semibold flex items-center justify-center">
                    {contact?.phoneNumbers.length}
                  </div>
                </h3>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {contact?.phoneNumbers.map((phone, index) => (
                    <PhoneBox key={index} phone={phone} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DeleteBtn({
  id,
  mainDialogState: setMainDialogIsOpen,
  onAction = null,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="w-6 h-6 p-4"
            onClick={handleDeleteDialog}
          >
            <Trash2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="">
          <p>Delete Contact</p>
        </TooltipContent>
      </Tooltip>
      <DeleteDialog
        id={id}
        dialogState={[isDialogOpen, setIsDialogOpen]}
        mainDialogState={setMainDialogIsOpen}
        onAction={onAction}
      />
    </div>
  );
}

function DeleteDialog({
  id,
  dialogState: [isOpen, setIsOpen],
  mainDialogState: setMainDialogIsOpen,
  onAction = null,
}) {
  const { request, loading } = useApi();

  const handleDelete = async () => {
    try {
      const response = await request({
        method: "delete",
        url: apiRoutes.user.contacts.delete(id),
      });
      if (response.success) {
        myToast("success", response.message || "Contact deleted successfully");
        setIsOpen(false);
        setMainDialogIsOpen(false);
        if (onAction) {
          onAction();
        }
      } else {
        myToast("warning", response.message || "Something went wrong");
      }
    } catch (error) {
      myToast("error", "Failed to delete contact");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Delete Contact</DialogTitle>
          <DialogDescription className={undefined}>
            Are you sure you want to delete this contact? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-100 hover:text-foreground"
            size={undefined}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className={undefined}
            size={undefined}
            disabled={loading}
          >
            {loading ? (
              <span>
                <Spinner
                  size="xxs"
                  show={undefined}
                  children={undefined}
                  className="text-background"
                />
              </span>
            ) : (
              <span className="">Delete</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
