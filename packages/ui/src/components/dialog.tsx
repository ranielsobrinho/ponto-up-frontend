import { cn } from "@ponto-up-frontend/ui/lib/utils";
import type * as React from "react";
import { createPortal } from "react-dom";

function Dialog({
	open,
	onOpenChange,
	children,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
}) {
	if (!open) return null;
	return createPortal(
		<>
			<button
				type="button"
				className="fixed inset-0 z-40 h-full w-full cursor-default border-none bg-transparent"
				aria-label="Close dialog"
				onClick={() => onOpenChange?.(false)}
			/>
			<div
				className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
				role="dialog"
				aria-modal="true"
			>
				<div className="pointer-events-auto">{children}</div>
			</div>
		</>,
		document.body,
	);
}

function DialogTrigger({
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return <button {...props}>{children}</button>;
}

function DialogContent({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative z-10 w-full max-w-md rounded-lg p-6 shadow-lg",
				className,
			)}
			style={{
				backgroundColor: "#222b40",
				border: "1px solid rgba(255, 255, 255, 0.2)",
			}}
		>
			{children}
		</div>
	);
}

function DialogHeader({
	className,
	children,
}: {
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>{children}</div>
	);
}

function DialogTitle({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<h2
			className={cn(
				"font-semibold text-lg leading-none tracking-tight",
				className,
			)}
			style={{ color: "#f0f0f0" }}
		>
			{children}
		</h2>
	);
}

function DialogDescription({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<p className={cn("text-sm", className)} style={{ color: "#9ca3af" }}>
			{children}
		</p>
	);
}

function DialogFooter({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
		>
			{children}
		</div>
	);
}

function DialogClose({
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button type="button" {...props}>
			{children}
		</button>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
};
