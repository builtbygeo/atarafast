"use client"

export function Logo({ className }: { className?: string }) {
    return (
        <div className={className}>
            <svg
                viewBox="0 0 160 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <path
                    d="M 22 30 L 12 10 L 2 30 M 52 10 L 52 30 M 42 10 L 62 10 M 92 30 L 82 10 L 72 30 M 112 30 L 112 10 C 130 10 130 20 112 20 M 112 20 L 125 30 M 158 30 L 148 10 L 138 30"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    )
}
