'use client';

import Link from 'next/link';

type SearchParams = { [key: string]: string | string[] | undefined };

interface PaginationLinkProps {
    page: number;
    children: React.ReactNode;
    isDisabled: boolean;
    searchParams: SearchParams;
}

export const PaginationLink = ({ page, children, isDisabled, searchParams }: PaginationLinkProps) => {
    // Converte searchParams corretamente para evitar erro com arrays
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            const stringValue = Array.isArray(value) ? value[0] : value;
            params.set(key, stringValue);
        }
    });
    
    params.set('page', page.toString());
    
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isDisabled) {
            e.preventDefault();
        }
    };
    
    return (
        <Link
            href={`/buscar?${params.toString()}`}
            className={`pagination-btn ${isDisabled ? 'disabled' : ''}`}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : undefined}
            onClick={handleClick}
        >
            {children}
        </Link>
    );
};