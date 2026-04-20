import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
    return str
        .toString()
        .normalize('NFD')                   // split an accented letter in the base letter and the accent
        .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')       // remove all non-alphanumeric chars
        .replace(/\s+/g, '-')              // replace spaces with dashes
        .replace(/-+/g, '-');              // replace multiple dashes with a single dash
}
