import { type ClassValue, clsx } from "clsx";
import type { NextFunction, Request, Response } from "express";
import { twMerge } from "tailwind-merge";
import process from "process";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getCwd(): string {

  let cwd = process.cwd();
  return cwd
}

export { cn, getCwd }