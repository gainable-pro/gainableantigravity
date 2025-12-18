"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface PhoneCallButtonProps {
    telephone: string | null;
}

export function PhoneCallButton({ telephone }: PhoneCallButtonProps) {
    const [showPhone, setShowPhone] = useState(false);

    const handleClick = () => {
        if (!telephone) {
            alert("Numéro non renseigné pour cet expert.");
            return;
        }
        setShowPhone(true);
        window.location.href = `tel:${telephone}`;
    };

    return (
        <Button
            variant={showPhone ? "default" : "outline"}
            className={`border-[#D59B2B] font-bold h-12 px-6 transition-all ${showPhone
                    ? 'bg-green-600 hover:bg-green-700 text-white border-transparent'
                    : 'text-[#D59B2B] hover:bg-[#FFF8ED]'
                }`}
            onClick={handleClick}
        >
            {showPhone ? (
                <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {telephone}
                </span>
            ) : (
                "Appeler"
            )}
        </Button>
    );
}
