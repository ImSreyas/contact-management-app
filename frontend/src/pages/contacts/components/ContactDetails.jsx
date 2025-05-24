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
  Edit,
  MapPin,
  Maximize,
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

export default function ContactDetails({ contact, open, onOpenChange }) {
  if (!contact) return null;

  const isDetAvailable =
    contact.company || contact.location || contact.address ? true : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-4xl max-w-[90vw] max-h-[85vh] overflow-y-auto gap-2 pb-8 pt-6 px-10"
        noCloseButton
      >
        <DialogHeader className="gap-0">
          <DialogTitle className="text-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                {contact.firstName} {contact.lastName}
              </div>
              <div className="flex items-center gap-2">
                <Fav value={contact.isFavorite} />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-6 h-6 p-4"
                      // onClick={() => handleOpenDetails(contact)}
                    >
                      <UserRoundPen />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="">
                    <p>Edit Contact</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-6 h-6 p-4"
                      // onClick={() => handleOpenDetails(contact)}
                    >
                      <Trash2 />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="">
                    <p>Delete Contact</p>
                  </TooltipContent>
                </Tooltip>

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
              {contact.company && (
                <div className="text-xs flex flex-col border rounded-lg px-3 py-1">
                  <div className="flex gap-2 items-center border-b py-2">
                    <Building size={16} />
                    <div className="font-semibold text-sm translate-y-[2px]">
                      Company
                    </div>
                  </div>
                  <p className="text-sm py-2">{contact.company}</p>
                </div>
              )}
              {contact.location && (
                <div className="text-xs flex flex-col border rounded-lg px-3 py-1">
                  <div className="flex gap-2 items-center border-b py-2">
                    <MapPin size={16} />
                    <div className="font-semibold text-sm translate-y-[2px]">
                      Location
                    </div>
                  </div>
                  <p className="text-sm py-2">{contact.location}</p>
                </div>
              )}
              {contact.address && (
                <div className="text-xs flex flex-col border rounded-lg px-3 py-1">
                  <div className="flex gap-2 items-center border-b py-2">
                    <BookUser size={16} />
                    <div className="font-semibold text-sm translate-y-[2px]">
                      Address
                    </div>
                  </div>
                  <p className="text-sm py-2">{contact.address}</p>
                </div>
              )}
            </div>

            <h3 className="font-semibold mb-2 flex items-center gap-3">
              <div>Contacts</div>
              <div className="text-xs border px-2 py-1 rounded-sm font-semibold flex items-center justify-center">
                {contact.phoneNumbers.length}
              </div>
            </h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {contact.phoneNumbers.map((phone, index) => (
                <PhoneBox key={index} phone={phone} />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
