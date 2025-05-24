import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import myToast from "@/lib/custom/toast";
import { cn } from "@/lib/utils";
import {
  BookUser,
  Building,
  Check,
  Copy,
  Heart,
  Layers,
  MapPin,
  Maximize,
  Phone,
} from "lucide-react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useCallback } from "react";
import ContactDetails from "./ContactDetails";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ContactsGrid({ contacts, loading }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleOpenDetails = useCallback((contact) => {
    setSelectedContact(contact);
    setDetailsOpen(true);
  }, []);

  if (loading) {
    return <ContactSkelton />;
  }

  if (!contacts?.length) {
    return <NoContacts />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-background/60 backdrop-blur-2xl dark:bg-zinc-900 border rounded-lg p-5 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-[1.3rem]">
              {contact.firstName} {contact.lastName}
            </div>
            <div className="flex gap-2">
              <Fav value={contact.isFavorite} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-6 h-6 p-4"
                    onClick={() => handleOpenDetails(contact)}
                  >
                    <Maximize />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="">
                  <p>Open</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          {contact.phoneNumbers?.length > 0 && (
            <div className="pb-2">
              <div className="pt-1 pb-2 flex items-center justify-between gap-2">
                <div className="font-semibold">Contacts</div>
                <div className="text-[10px] border px-2 py-0.5 rounded-sm font-semibold flex items-center justify-center">
                  {Math.min(contact.phoneNumbers.length || 0, 2)} {" / "}
                  {contact.phoneNumbers.length}
                </div>
              </div>
              <div className="space-y-2">
                {contact.phoneNumbers.slice(0, 2).map((phone, index) => (
                  <PhoneBox key={index} phone={phone} />
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2.5">
            {contact.company && (
              <div className="text-xs flex items-center gap-2">
                <Building size={14} />
                <span>
                  <div className="font-semibold">Company</div>
                  <div>{contact.company}</div>
                </span>
              </div>
            )}
            {contact.location && (
              <div className="text-xs flex items-center gap-2">
                <MapPin size={14} />
                <span>
                  <div className="font-semibold">Location</div>
                  <div>{contact.location}</div>
                </span>
              </div>
            )}
            {contact.address && (
              <div className="text-xs flex items-center gap-2">
                <BookUser size={14} />
                <span>
                  <div className="font-semibold">Address</div>
                  <p className="">{contact.address}</p>
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
      <ContactDetails
        contact={selectedContact}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}

function ContactSkelton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
          <div className="space-y-2 py-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PhoneBox({ phone }) {
  const [checked, setChecked] = useState(false);
  const timeOutRef = useRef(null);

  const copyCheck = () => {
    setChecked(true);
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
    const handler = () => {
      setChecked(false);
    };
    timeOutRef.current = setTimeout(handler, 5000);
  };

  const handleCopy = useCallback(() => {
    myToast("success", "Phone number copied to clipboard");
    navigator.clipboard.writeText(phone);
    copyCheck();
  }, []);

  useEffect(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
  }, []);

  return (
    <div className="text-sm flex gap-2 border rounded-sm overflow-hidden">
      <div className="border-0 border-r rounded-none min-h-8 min-w-8 flex items-center justify-center">
        <Phone size={15} />
      </div>
      <span className="flex items-center grow">{phone}</span>
      <div className="border-0 border-l mb rounded-none bg-transparent min-h-8 min-w-8 flex items-center justify-center">
        <button
          className="h-full w-full flex items-center justify-center"
          onClick={handleCopy}
        >
          {checked ? (
            <Check size={15} className="text-green-500" />
          ) : (
            <Copy size={15} />
          )}
        </button>
      </div>
    </div>
  );
}

export function Fav({ value }) {
  const [isFav, setIsFav] = useState(value || false);
  const [loading, setLoading] = useState(false);

  const handleFav = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setIsFav((val) => !val);
      setLoading(false);
    }, 5000);
    myToast("success", isFav ? "Removed from favorites" : "Added to favorites");
  }, [isFav]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={cn(
            "w-6 h-6 p-4 hover:bg-zinc-100 hover:text-foreground hover:ring-1",
            isFav &&
              "text-background bg-red-500 hover:text-background hover:bg-red-700 border-transparent",
          )}
          onClick={handleFav}
        >
          {loading ? (
            <Spinner
              size="xxs"
              className={cn(isFav && "text-background")}
              show={undefined}
              children={undefined}
            />
          ) : (
            <Heart />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="">
        <p>Mark as Favorite</p>
      </TooltipContent>
    </Tooltip>
  );
}

function NoContacts() {
  return (
    <div className="text-center text-muted-foreground py-20 border-2 rounded-lg border-dashed">
      <div className="flex flex-col items-center justify-center">
        <Layers />
        <div className="mt-2">No contacts found.</div>
        <div className="text-sm text-muted-foreground/50">
          Add a new contact to show here
        </div>
      </div>
    </div>
  );
}
